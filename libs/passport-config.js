const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function initPassport(passport, getUserByName) {
  const authenticateUser = async (username, passport, done) => {
    const user = getUserByName(username);
    if (user == null) {
      return done(null, false, { message: "No user with thart email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((user, done) => {});
}

module.exports = initPassport;
