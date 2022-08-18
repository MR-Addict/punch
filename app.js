// Offical packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

// Custom libs
const punch_db = require("./libs/pool");
const punch_schema = require("./libs/schema");
const initPassport = require("./libs/passport-config");
initPassport(passport);

// Offical middleware
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "verygoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Custom variables
const admin_render = { records: [{ ERROR: "DATABASE ERROR!" }] };

// Passport
app.use(passport.initialize());
app.use(passport.session());

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect("/admin");
}

app.get("/help", checkAuthenticated, (req, res) => {
  res.render("admin/help");
});

// Login pages
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("admin/login", { error: req.query.error });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login?error=true",
  })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/admin");
  });
});

// Render admin page
app.get("/admin", checkAuthenticated, (req, res) => {
  punch_db.pool_select.query("SELECT * FROM punch", function (err, result, fields) {
    if (err) {
      console.error(err);
      admin_render.records = [{ ERROR: err.sqlMessage }];
    } else {
      admin_render.records = result;
    }
    res.render("admin/index", admin_render);
  });
});

app.post("/admin", checkAuthenticated, (req, res) => {
  const validate_result = punch_schema.sql_schema.validate(req.body);

  if (validate_result.error) {
    console.error(validate_result.error);
    admin_render.records = [{ ERROR: validate_result.error.details[0].message }];
    res.render("admin/index", admin_render);
  } else {
    punch_db.pool_select.query(req.body.command, function (err, result, fields) {
      if (err) {
        console.error(err);
        admin_render.records = [{ ERROR: err.sqlMessage }];
      } else {
        if (result.length) {
          admin_render.records = result;
        } else {
          admin_render.records = [{ ERROR: "There's no satisfied results!" }];
        }
      }
      res.render("admin/index", admin_render);
    });
  }
});

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
        res.render("success/index");
      }
    });
  }
});

// Listen on port 8083
const port = process.env.PORT || 8083;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
