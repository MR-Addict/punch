// Offical packages
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const excel = require("exceljs");
const cors = require("cors");

// Custom libs
const punch_db = require("./libs/pool");
const punch_schema = require("./libs/schema");

// Offical middleware
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// authorization fun
const authorization = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(403).json({ status: false, message: "Error!" });
  }
  try {
    const data = jwt.verify(token, "LOGIN_SECRET_KEY");
    req.userId = data.id;
    return next();
  } catch {
    return res.status(403).json({ status: false, message: "Forbidden!" });
  }
};

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
      }
      res.render("success/index");
    });
  }
});

// login and set token
app.post("/login", (req, res) => {
  const login_user = JSON.parse(JSON.stringify(req.body));
  const punch_sql = "SELECT * FROM admin";
  const validate_result = punch_schema.login_schema.validate(login_user);
  if (validate_result.error) {
    console.error(validate_result.error);
    return res.status(403).json({ status: false, message: "Forbidden!" });
  } else {
    punch_db.pool_select.query(punch_sql, (err, result, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Error!" });
      } else {
        const user = result.find((user) => (user.username = login_user.username));
        if (user == null) {
          console.log("No such user!");
          return res.status(400).send({ status: false, message: "No such user!" });
        } else {
          try {
            if (bcrypt.compare(login_user.password, user.password)) {
              const token = jwt.sign({ id: user.id }, "LOGIN_SECRET_KEY", { expiresIn: "1h" });
              return res.cookie("accessToken", token).json({ status: true, message: token });
            } else {
              console.log("Password incorrect!");
              return res.status(502).send({ status: false, message: "Password incorrect!" });
            }
          } catch (err) {
            console.error(err);
            return res.status(500).send({ status: false, message: "Error!" });
          }
        }
      }
    });
  }
});

// logout
app.get("/logout", (req, res) => {
  return res.clearCookie("accessToken").status(200).json({ status: true, message: "Logout success!" });
});

// test cookie
app.all("/testcookie", authorization, (req, res) => {
  res.json({ status: true, message: "Success!" });
});

app.post("/table", authorization, (req, res) => {
  const punch_sql = "SELECT * FROM punch ORDER BY `date` DESC";
  punch_db.pool_select.query(punch_sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: false, message: "Error!" });
    } else {
      res.status(200).send({ status: true, message: JSON.stringify(result) });
    }
  });
});

// Export mysql data
app.get("/export", authorization, (req, res) => {
  const punch_sql = "SELECT * FROM punch ORDER BY `date` DESC";
  punch_db.pool_select.query(punch_sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: false, message: "Error!" });
    } else {
      const punch_export = JSON.parse(JSON.stringify(result));
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("值班笔记");
      worksheet.columns = Object.keys(punch_export[0]).map((prop) => ({ header: prop, key: prop }));
      worksheet.addRows(punch_export);
      Object.keys(punch_export[0]).forEach((prop) => {
        worksheet.getColumn(prop).width = 15;
        worksheet.getColumn(prop).font = { size: 13 };
        worksheet.getColumn(prop).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        if (prop === "notes") worksheet.getColumn(prop).width = 100;
      });
      worksheet.getRow(1).font = { size: 16, bold: true, color: { argb: "00008B" } };
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI("值班笔记") + ".xlsx");
      return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
      });
    }
  });
});

app.get("/cards", authorization, (req, res) => {
  punch_db.pool_select.query(punch_db.analyze_command.cards_sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: false, message: "Error!" });
    } else {
      res.status(200).send({ status: true, message: JSON.stringify(result) });
    }
  });
});

app.get("/days", authorization, (req, res) => {
  punch_db.pool_select.query(punch_db.analyze_command.days_sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: false, message: "Error!" });
    } else {
      res.status(200).send({ status: true, message: JSON.stringify(result) });
    }
  });
});

app.get("/weeks", authorization, (req, res) => {
  punch_db.pool_select.query(punch_db.analyze_command.weeks_sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: false, message: "Error!" });
    } else {
      res.status(200).send({ status: true, message: JSON.stringify(result) });
    }
  });
});

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
