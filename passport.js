const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const passportJWT = require("passport-jwt");
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// Get User from UserSchema
const UsersSchema = require("./models/users.js");
let Users = UsersSchema.User;

// Check for existing Username and Password
// Check for valid Username and Password
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      Users.findOne({ Username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }

        // Check if the username can be found
        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "Incorrect Username or Password!",
          });
        }

        // Check if the password is correct
        if (!user.validatePassword(password)) {
          console.log("Incorrect password");
          return callback(null, false, { message: "Incorrect Password!" });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

// JWT is extracted from the header of the http request.
// JWT is a bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
