const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log(hashedPassword);

    const user = { username: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name));
  if (user == null) {
    return res.status(400).send("Can not find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Login success!");
    } else {
      res.send("Login failed!");
    }
  } catch {
    res.status(500).send();
  }
});
app.listen(3000);
