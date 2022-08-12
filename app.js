const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const db = mysql.createConnection({
  host: "localhost",
  user: "punch",
  password: "@Punch_password_1234",
  database: "punch",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/post", (req, res) => {
  const record = req.body;
  const sql = "INSERT INTO punch SET ?";
  db.query(sql, record, (err, result) => {
    if (err) throw err;
    console.log("Record insert success!");
  });
  res.redirect("/success");
});

const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port ${port}...`));
