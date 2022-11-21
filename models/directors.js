const mongoose = require("mongoose");

let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birthday: { type: Date, required: true },
  Deathday: Date
});

let Director = mongoose.model("Director", directorSchema);

module.exports.Director = Director;