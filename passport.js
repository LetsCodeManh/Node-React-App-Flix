const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const { User } = require("./models/users");
const LocalStrategy = require("local-strategy").Strategy;

// const Models = require("./models.js"),
// const passportJWT = require("passport-jwt")
// let Users = Models.User
// const JWTStrategy = passportJWT.Strategy
// const ExtractJWT = passportJWT.ExtractJWT

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      User.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "In correct username or password.",
          });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
