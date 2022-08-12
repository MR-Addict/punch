const Joi = require("joi");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect databse
const db = mysql.createConnection({
  host: "localhost",
  user: "punch",
  password: "@Punch_password_1234",
  database: "punch",
});
db.connect(function (err) {
  if (err) console.error(err);
  else console.log("MySQL Connected successfully!");
});

// Notes validation schema
const notes_schema = Joi.object().keys({
  group: Joi.string().min(2).max(10).required(),
  name: Joi.string().min(2).max(10).required(),
  notes: Joi.string().min(4).max(500).required(),
});

// Post requests
app.post("/post", (req, res) => {
  const record = req.body;
  const sql = "INSERT INTO punch SET ?";
  const validate_result = notes_schema.validate(record);

  if (validate_result.error) {
    console.error(validate_result.error);
    res.redirect("/fail");
  } else {
    db.query(sql, record, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("/fail");
      } else {
        console.log("New record inserted successfully!");
        res.redirect("/success");
      }
    });
  }
});

const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port ${port}...`));
