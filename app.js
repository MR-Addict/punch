const express = require("express");
const bodyParser = require("body-parser");

const punch_db = require("./libs/pool");
const punch_schema = require("./libs/schema");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const home_render = { current_year: new Date().getFullYear() };
const notes_render = {
  current_year: new Date().getFullYear(),
  records: [{ ERROR: "DATABASE ERROR!" }],
};

// Render records page
app.get("/records", (req, res) => {
  punch_db.pool_select.query("SELECT * FROM punch", function (err, result, fields) {
    if (err) {
      console.error(err);
      notes_render.records = [{ ERROR: err.sqlMessage }];
    } else {
      notes_render.records = result;
    }
    res.render("records/index", notes_render);
  });
});

app.post("/records", (req, res) => {
  const validate_result = punch_schema.sql_schema.validate(req.body);
  console.log(validate_result);

  if (validate_result.error) {
    console.error(validate_result.error);
    notes_render.records = [{ ERROR: validate_result.error.details[0].message }];
    res.render("records/index", notes_render);
  } else {
    punch_db.pool_select.query(req.body.command, function (err, result, fields) {
      if (err) {
        console.error(err);
        notes_render.records = [{ ERROR: err.sqlMessage }];
      } else {
        if (result.length) {
          notes_render.records = result;
        } else {
          notes_render.records = [{ ERROR: "There's no satisfied results!" }];
        }
      }
      res.render("records/index", notes_render);
    });
  }
});

// Render home pages
app.get("/", (req, res) => {
  res.render("index/index", home_render);
});

// Post requests
app.post("/", (req, res) => {
  const punch_record = req.body;
  const punch_sql = "INSERT INTO punch SET ?";
  const validate_result = punch_schema.form_schema.validate(punch_record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.status(502).render("fail/index", home_render);
  } else {
    punch_db.pool_insert.query(punch_sql, punch_record, (err, result) => {
      if (err) {
        console.error(err);
        res.status(502).render("fail/index", home_render);
      } else {
        console.log("New record inserted successfully!");
        res.render("success/index", home_render);
      }
    });
  }
});

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
