const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  Director: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;
