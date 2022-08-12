const express = require("express");
const bodyParser = require("body-parser");

const db = require("./libs/pool");
const notes_schema = require("./libs/schema");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port ${port}...`));
