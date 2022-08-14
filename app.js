const express = require("express");
const bodyParser = require("body-parser");

const punch_db = require("./libs/pool");
const punch_schema = require("./libs/schema");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const current_year = { current_year: new Date().getFullYear() };

// Render home pages
app.get("/", (req, res) => {
  res.render("index/index", current_year);
});

// Post requests
app.post("/", (req, res) => {
  const punch_record = req.body;
  const punch_sql = "INSERT INTO punch SET ?";
  const validate_result = punch_schema.validate(punch_record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.status(502).render("fail/index", current_year);
  } else {
    punch_db.query(punch_sql, punch_record, (err, result) => {
      if (err) {
        console.error(err);
        res.status(502).render("fail/index", current_year);
      } else {
        console.log("New record inserted successfully!");
        res.render("success/index", current_year);
      }
    });
  }
});

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
