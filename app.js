const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const dateTime = require("node-datetime");
const csvWriter = require("csv-write-stream");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/post", (req, res) => {
  // Add data record
  const dt = dateTime.create();
  req.body["date"] = dt.format("Y-m-d H:M:S");

  // Write date to CSV file
  const db_path = "./database/punch.csv";
  if (!fs.existsSync(db_path)) writer = csvWriter({ headers: ["组别", "姓名", "日期", "值班笔记"] });
  else writer = csvWriter({ sendHeaders: false });
  writer.pipe(fs.createWriteStream(db_path, { flags: "a" }));
  writer.write({
    组别: req.body["group"],
    姓名: req.body["name"],
    日期: req.body["date"],
    值班笔记: req.body["notes"],
  });
  writer.end();

  // Redirect to success page
  res.redirect("/success");
});

const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port ${port}...`));
