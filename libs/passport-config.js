const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const users = require("./pool").users;

function initPassport(passport) {
  const authenticateUser = async (username, password, done) => {
    console.log(users);
    const user = users.find((user) => user.username === username);
    console.log(user, username);
    if (!user) return done(null, false, { message: "No such user!" });
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password!" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));

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
