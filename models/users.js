const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { type: Date, required: true },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Put Salt and Hasing the password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10)
}

// Check if the password is valid
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password)
}

let User = mongoose.model("User", userSchema);

module.exports.User = User;
