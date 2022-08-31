// Offical packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const excel = require("exceljs");
const flash = require("connect-flash");

// Custom libs
const punch_schema = require("./libs/schema");
const initPassport = require("./libs/passport-config");
const { pool_insert, pool_select, users, department_options, analyze_command } = require("./libs/pool");
initPassport(passport);

// Offical middleware
const app = express();
app.set("view engine", "ejs");
app.use(flash());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "verygoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Custom variables
const admin_render = { records: [{ ERROR: "DATABASE ERROR!" }], login_user: "" };
const insight_render = {
  sum: { 今日提交: 0, 本周提交: 0, 所有提交: 0 },
  group: { 组别: 0 },
  days: [{ 日期: "2000/01/01", 提交次数: 0 }],
};

// Passport
app.use(passport.initialize());
app.use(passport.session());

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect("/admin");
}

app.get("/help", checkAuthenticated, (req, res) => {
  admin_render.login_user = department_options[req.user.username];
  res.render("admin/help", admin_render);
});

// Login pages
app.get("/login", checkNotAuthenticated, (req, res) => {
  const error_message = req.flash("error");
  res.render("admin/login", { error: error_message });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/admin");
  });
});

app.get("/insight", checkAuthenticated, (req, res) => {
  res.render("admin/insight");
});

app.post("/insight", checkAuthenticated, (req, res) => {
  // sum query
  pool_select.query(
    analyze_command.sum_cmd.replaceAll("punch", department_options[req.user.username]),
    (err, result, fields) => {
      if (err) {
        console.error(err);
        insight_render.sum = { 今日提交: 0, 本周提交: 0, 所有提交: 0 };
      } else {
        if (result.length) {
          insight_render.sum = JSON.parse(JSON.stringify(result[0]));
        } else {
          insight_render.sum = { 今日提交: 0, 本周提交: 0, 所有提交: 0 };
        }
      }
      // days query
      pool_select.query(
        analyze_command.days_cmd.replaceAll("punch", department_options[req.user.username]),
        (err, result, fields) => {
          if (err) {
            console.error(err);
            insight_render.days = [{ 日期: "2000/01/01", 提交次数: 0 }];
          } else {
            if (result.length) {
              insight_render.days = JSON.parse(JSON.stringify(result));
            } else {
              insight_render.days = [{ 日期: "2000/01/01", 提交次数: 0 }];
            }
          }
          // group query
          pool_select.query(analyze_command.group_cmd[department_options[req.user.username]], (err, result, fields) => {
            if (err) {
              console.error(err);
              insight_render.group = { 组别: 0 };
            } else {
              if (result.length) {
                insight_render.group = JSON.parse(JSON.stringify(result[0]));
              } else {
                insight_render.group = { 组别: 0 };
              }
            }
            res.send(insight_render);
          });
        }
      );
    }
  );
});

// Export mysql data
app.get("/export", checkAuthenticated, (req, res) => {
  const sql_command = req.user.command;
  pool_select.query(sql_command, (err, result, fields) => {
    if (err) {
      console.error(err);
    } else {
      if (result.length) {
        // Create sheets
        const punch_export = JSON.parse(JSON.stringify(result));
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet("值班笔记");
        const worksheet_columns = [];
        Object.keys(punch_export[0]).forEach(function (prop) {
          worksheet_columns.push({
            header: prop,
            key: prop,
          });
        });
        worksheet.columns = worksheet_columns;
        worksheet.addRows(punch_export);

        // Wrap text and alignment
        Object.keys(punch_export[0]).forEach((prop) => {
          worksheet.getColumn(prop).width = 15;
          worksheet.getColumn(prop).font = { size: 13 };
          worksheet.getColumn(prop).alignment = { vertical: "middle", horizontal: "center" };
          if (prop === "notes") {
            worksheet.getColumn(prop).width = 100;
            worksheet.getColumn(prop).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
          }
        });
        // Header style
        worksheet.getRow(1).font = {
          size: 16,
          bold: true,
          color: { argb: "00008B" },
        };

        // Export excel
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" +
            "%E5%80%BC%E7%8F%AD%E7%AC%94%E8%AE%B0-" +
            new Date().toISOString().split("T")[0] +
            ".xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      } else {
        console.error("The database is empty!");
      }
    }
  });
});

// Render admin page
app.get("/admin", checkAuthenticated, (req, res) => {
  pool_select.query(`SELECT * FROM ${department_options[req.user.username]}`, (err, result, fields) => {
    if (err) {
      console.error(err);
      admin_render.records = [{ ERROR: err.sqlMessage }];
    } else {
      if (result.length) {
        admin_render.records = result;
      } else {
        admin_render.records = [{ ERROR: "The database is empty!" }];
      }
    }
    admin_render.login_user = department_options[req.user.username];
    res.render("admin/index", admin_render);
  });
});

app.post("/admin", checkAuthenticated, (req, res) => {
  const validate_result = punch_schema.sql_schema.validate(req.body);

  if (validate_result.error) {
    console.error(validate_result.error);
    admin_render.records = [{ ERROR: validate_result.error.details[0].message }];
    res.render("admin/index", admin_render);
  } else {
    const sql_command = req.body.command.replaceAll("punch", department_options[req.user.username]);
    pool_select.query(sql_command, (err, result, fields) => {
      if (err) {
        console.error(err);
        admin_render.records = [{ ERROR: err.sqlMessage }];
        res.render("admin/index", admin_render);
      } else {
        if (result.length) {
          admin_render.records = result;
          req.user.command = sql_command;
        } else {
          admin_render.records = [{ ERROR: "There's no satisfied results!" }];
        }
        console.log(req.user);
        res.render("admin/index", admin_render);
      }
    });
  }
});

// Render home pages
app.get("/", (req, res) => {
  res.render("index/index");
});

// Post requests
app.post("/", (req, res) => {
  const punch_record = req.body;
  const validate_result = punch_schema.form_schema.validate(punch_record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.status(502).render("fail/index");
  } else {
    const punch_sql = `INSERT INTO ${department_options[punch_record.department]} SET ?`;
    delete punch_record.department;
    pool_insert.query(punch_sql, punch_record, (err, result) => {
      if (err) {
        console.error(err);
        res.status(502).render("fail/index");
      } else {
        console.log("New record inserted successfully!");
        res.render("success/index");
      }
    });
  }
});

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
