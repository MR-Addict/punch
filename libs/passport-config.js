const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const users = require("./pool").users;

function initPassport(passport) {
  const authenticateUser = async (req, username, password, done) => {
    const user = users.find((user) => user.username === username);
    if (!user) return done(null, false, req.flash("error", "用户不存在！"));
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, req.flash("error", "密码错误！"));
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "username", passReqToCallback: true }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(
      null,
      users.find((user) => user.id === id)
    );
  });
}

module.exports = initPassport;
