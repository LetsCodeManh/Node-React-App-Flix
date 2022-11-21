const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const uuid = require("uuid");

app.use(express.static("public"));
app.use(morgan("common"));
// app.use(myLogger);
// app.use(requestTime);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const mongoose = require("mongoose");
const MoviesSchema = require("./models/movies.js");
const Movie = MoviesSchema.Movie;

const UsersSchema = require("./models/users.js");
const User = UsersSchema.User;

const GenreSchema = require("./models/genres.js");
const Genre = GenreSchema.Genre;

const DirectorsSchema = require("./models/directors.js");
const Director = DirectorsSchema.Director;

mongoose.connect("mongodb://localhost:27017/dbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// New Exercise
let users = [
  {
    id: 1,
    name: "test",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "test2",
    favoriteMovies: ["testMovie1", "testMovie2"],
  },
];

let movies = [
  {
    title: "testMovieTitle",
    description: "testMovieDescription",
    genre: {
      genreName: "testGenreName",
      genreDescription: "testGenreDescription",
    },
    directors: {
      directorsName: "testDirectorsName",
      directorsBio: "testDirectorsBio",
      directorsBirth: "testDirectorsBirth",
    },
    movieImagesURL: "https://www.testmovieImagesURL.com",
    feature: false,
  },
  {
    title: "testMovieTitle2",
    description: "testMovieDescription2",
    genre: {
      genreName: "testGenreName2",
      genreDescription: "testGenreDescription2",
    },
    directors: {
      directorsName: "testDirectorsName2",
      directorsBio: "testDirectorsBio2",
      directorsBirth: "testDirectorsBirth2",
    },
    movieImagesURL: "https://www.testmovieImagesURL2.com",
    feature: false,
  },
  {
    title: "testMovieTitle3",
    description: "testMovieDescription3",
    genre: {
      genreName: "testGenreName3",
      genreDescription: "testGenreDescription3",
    },
    directors: {
      directorsName: "testDirectorsName3",
      directorsBio: "testDirectorsBio3",
      directorsBirth: "testDirectorsBirth3",
    },
    movieImagesURL: "https://www.testmovieImagesURL3.com",
    feature: false,
  },
];

// Create a movie in movies - This is not in the exercise
app.post("/movies", (req, res) => {
  Movie.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + " already exists");
      } else {
        User.create({
          Title: req.body.Title,
          Description: req.body.Description,
          Genre: req.body.Genre,
          Director: req.body.Director,
          Actors: req.body.Actors,
          ImagePath: req.body.ImagePath,
          Featured: req.body.Featured
        })
          .then((movie) => {
            res.status(200).json(movie);
          })
          .catch((error) => {
            console.error(error);
            res.status(400).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Return a list off ALL movies
app.get("/movies", (req, res) => {
  Movie.find() // Find all movies
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return data (description. genre, directors, image URL, whether it's featured or not) about a single movie by title to the user
app.get("/movies/:Title", (req, res) => {
  Movie.findOne({ Title: req.params.Title }) // Find one movie with this Title
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send(req.params.Title + " was not found!")
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Delete movie from movies list - This is not in the exercise
app.delete("/movies/:Title", (req, res) => {
  Movie.findOneAndRemove({ Title: req.params.Title})
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + " was not found!")
      } else {
        res.status(200).send(req.params.Title + " was deleted!")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err)
    })
});

// CREATE
app.post("/users", (req, res) => {
  User.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        User.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(200).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(400).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// CREATE
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  User.findOneAndUpdate({ Username: req.params.Username},
    {$push: {
      FavoriteMovies: req.params.MovieID
    }},
    { new: true},
    (err, updatedUser) => {
      if (err) {
        console.log(err)
        res.status(400).send("Error: " + err)
      } else {
        res.status(200).json(updatedUser)
      }
    })
});



// READ
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(
    (movie) => movie.genre.genreName === genreName
  ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});

// READ
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.directors.directorsName === directorName
  ).directors;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No such director");
  }
});

// READ - Get all users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// READ
app.get("/users/:Username", (req, res) => {
  User.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// UPDATE
app.put("/users/:Username", (req, res) => {
  User.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(400).send("Error: " + err);
      } else {
        res.status(200).send(updatedUser);
      }
    }
  );
});

// DELETE
app.delete("/users/:Username/movies/:Title", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been remove from user ${id}'s array`);
  } else {
    res.status(400).send("No such movie");
  }
});

// DELETE
app.delete("/users/:Username", (req, res) => {
  User.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found!")
      } else {
        res.status(200).send(req.params.Username + " was deleted!")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err)
    })
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
