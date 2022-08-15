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
  notes: [{ Error: "Databse not connected!" }],
};

// Render notes page
app.get("/notes", (req, res) => {
  punch_db.query("SELECT * FROM punch", function (err, result, fields) {
    if (err) {
      console.error(err);
      res.render("notes/index", notes_render);
    } else {
      notes_render.notes = result;
      res.render("notes/index", notes_render);
    }
  });
});

app.post("/notes", (req, res) => {
  punch_db.query(req.body.command, function (err, result, fields) {
    if (err) {
      console.error(err);
      res.render("notes/index", notes_render);
    } else {
      notes_render.notes = result;
      res.render("notes/index", notes_render);
    }
  });
});

// Render home pages
app.get("/", (req, res) => {
  res.render("index/index", home_render);
});

// Post requests
app.post("/", (req, res) => {
  const punch_record = req.body;
  const punch_sql = "INSERT INTO punch SET ?";
  const validate_result = punch_schema.validate(punch_record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.status(502).render("fail/index", home_render);
  } else {
    punch_db.query(punch_sql, punch_record, (err, result) => {
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
