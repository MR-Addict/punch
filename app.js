const express = require("express");
const bodyParser = require("body-parser");
const dateTime = require("node-datetime");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/post", (req, res) => {
  const dt = dateTime.create();
  req.body["date"] = dt.format("Y-m-d H:M:S");
  console.log(req.body);
  res.redirect("/success");
});

const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port ${port}...`));
