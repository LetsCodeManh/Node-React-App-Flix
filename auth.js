const passport = require("passport");
const jwt = require("jsonwebtoken");

// The same key use in the JWTStrategy - secretOrKey
const jwtSecret = "your_jwt_secret";
// Your local passport file
require("./passport");

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // This is the Username you're encoding in the JWT
    subject: user.Username,

    // This specifies that the token will expire in 1 day
    expiresIn: "1d",

    // This is the algorithm used to "sign" or encode the values of the JWT
    algorithm: "HS256",
  });
};

// POST login
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
