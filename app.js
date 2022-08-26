// Offical packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const excel = require("exceljs");
const flash = require("connect-flash");

// Custom libs
const punch_db = require("./libs/pool");
const punch_schema = require("./libs/schema");
const initPassport = require("./libs/passport-config");
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
const admin_render = { records: [{ ERROR: "DATABASE ERROR!" }], statistics: { today: 0, week: 0, all: 0 } };
const insight_render = {
  sum: { 今日: 0, 本周: 0, 所有: 0 },
  group: { 航模组: 0, 编程组: 0, 电子组: 0, 静模组: 0 },
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
  res.render("admin/help");
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

app.get("/insight", checkAuthenticated, (rea, res) => {
  res.render("admin/insight");
});

app.get("/insights", (req, res) => {
  punch_db.pool_select.query(punch_db.analyze_command.sum_cmd, (err, result, fields) => {
    if (err) {
      console.error(err);
      insight_render.sum = { 今日: 0, 本周: 0, 所有: 0 };
    } else {
      if (result.length) insight_render.sum = JSON.parse(JSON.stringify(result[0]));
      else insight_render.sum = { 今日: 0, 本周: 0, 所有: 0 };
    }
  });
  punch_db.pool_select.query(punch_db.analyze_command.group_cmd, (err, result, fields) => {
    if (err) {
      console.error(err);
      insight_render.group = { 航模组: 0, 编程组: 0, 电子组: 0, 静模组: 0 };
    } else {
      if (result.length) insight_render.group = JSON.parse(JSON.stringify(result[0]));
      else insight_render.group = { 航模组: 0, 编程组: 0, 电子组: 0, 静模组: 0 };
    }
  });
  punch_db.pool_select.query(punch_db.analyze_command.days_cmd, (err, result, fields) => {
    if (err) {
      console.error(err);
      insight_render.days = [{ 日期: "2000/01/01", 提交次数: 0 }];
    } else {
      if (result.length) insight_render.days = JSON.parse(JSON.stringify(result));
      else insight_render.days = [{ 日期: "2000/01/01", 提交次数: 0 }];
      res.send(insight_render);
    }
  });
});

// Export mysql data
app.get("/export", checkAuthenticated, (req, res) => {
  // Create sheets
  const punch_export = JSON.parse(JSON.stringify(admin_render.records));
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
    "attachment; filename=" + "%E5%80%BC%E7%8F%AD%E7%AC%94%E8%AE%B0-" + new Date().toISOString().split("T")[0] + ".xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
});

// Render admin page
app.get("/admin", checkAuthenticated, (req, res) => {
  punch_db.pool_select.query("SELECT * FROM punch", (err, result, fields) => {
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
  });
  punch_db.pool_select.query(punch_db.analyze_command.sum_cmd, (err, result, fields) => {
    if (err) {
      console.error(err);
      admin_render.statistics = { 今日: 0, 本周: 0, 所有: 0 };
    } else {
      if (result.length) {
        admin_render.statistics = JSON.parse(JSON.stringify(result[0]));
      } else {
        admin_render.statistics = { 今日: 0, 本周: 0, 所有: 0 };
      }
    }
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
    punch_db.pool_select.query(req.body.command, (err, result, fields) => {
      if (err) {
        console.error(err);
        admin_render.records = [{ ERROR: err.sqlMessage }];
      } else {
        if (result.length) {
          admin_render.records = result;
        } else {
          admin_render.records = [{ ERROR: "There's no satisfied results!" }];
        }
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
  const punch_sql = "INSERT INTO punch SET ?";
  const validate_result = punch_schema.form_schema.validate(punch_record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.status(502).render("fail/index");
  } else {
    punch_db.pool_insert.query(punch_sql, punch_record, (err, result) => {
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
