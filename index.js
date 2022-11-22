const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
// const uuid = require("uuid");

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

// Movies AREA
// Create a movie in movies - This is not in the exercise
app.post("/movies", (req, res) => {
  Movie.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + " already exists");
      } else {
        Movie.create({
          Title: req.body.Title,
          Description: req.body.Description,
          Genre: req.body.Genre,
          Director: req.body.Director,
          Actors: req.body.Actors,
          ImagePath: req.body.ImagePath,
          Featured: req.body.Featured,
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
  Movie.find()
    .populate("Genre")
    .populate("Director") // Find all movies
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
  Movie.findOne({ Title: req.params.Title })
    .populate("Genre")
    .populate("Director")
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send(req.params.Title + " was not found!");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return data about a genre
// Needs to be done - Need helps here
app.get("/movies/genres/:_Id", (req, res) => {
  Movie.find({ "Genre._Id": req.params._Id })
    .populate("Genre")
    .populate("Director")
    .then((movies) => {
      if (movies) {
        res.status(200).json(movies);
      } else {
        res.status(400).send(req.params.Name + " was not found!");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return movie with the director name
// Needs to be done - Need helps here
app.get("/movies/directors/:Name", (req, res) => {
  Movie.findMany({ "Director.Name": req.params.Name })
    .populate("Genre")
    .populate("Director")
    .then((movies) => {
      if (movies) {
        res.status(200).json(movies);
      } else {
        res.status(400).send(req.params.Name + " was not found!");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Allow admin to update the movie info - This is not in the exercise
app.put("/movies/:Title", (req, res) => {
  Movie.findOneAndUpdate(
    { Title: req.params.Title },
    {
      $set: {
        Title: req.body.Title,
        Description: req.body.Description,
        Genre: req.body.Genre,
        Director: req.body.Director,
        Actors: req.body.Actors,
        ImagePath: req.body.ImagePath,
        Featured: req.body.Featured,
      },
    },
    { new: true },
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(400).send("Error: " + err);
      } else {
        res.status(200).send(updatedMovie);
      }
    }
  );
}); // 637be159a7f612ad6135486a

// Delete movie from movies list - This is not in the exercise
app.delete("/movies/:Title", (req, res) => {
  Movie.findOneAndRemove({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + " was not found!");
      } else {
        res.status(200).send(req.params.Title + " was deleted!");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Users AREA
// Allow new users to register
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
          FavoriteMovies: req.body.FavoriteMovies,
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

// Get all users - This is not in the exercise
app.get("/users", (req, res) => {
  User.find()
    .populate("FavoriteMovies", "Title")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Get user by Username in Users list - This is not in the exercise
app.get("/users/:Username", (req, res) => {
  User.findOne({ Username: req.params.Username })
    .populate("FavoriteMovies", "Title")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:Username", (req, res) => {
  User.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
        FavoriteMovies: req.body.FavoriteMovies,
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

// Allow users to add a movie to their list of favorites
// Needs to be done
app.post("/users/:Username/movies/:Title", (req, res) => {
  User.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: {
        FavoriteMovies: req.params.Title,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(400).send("Error: " + err);
      } else {
        res.status(200).json(updatedUser);
      }
    }
  );
});

// Allow users to remove a movie from their list of favorites
// Needs to be done
app.delete("/users/:Username/movies/:Title", (req, res) => {
  User.findOneAndDelete({ "FavouriteMovies.Title": req.params.Title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + " was not found!");
      } else {
        res.status(200).send(req.params.Title + " was deleted!");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Allow existing users to deregister
app.delete("/users/:Username", (req, res) => {
  User.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found!");
      } else {
        res.status(200).send(req.params.Username + " was deleted!");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Genres AREA
// Creating a new genre in the Genres List - This is not in the exercise
app.post("/genres", (req, res) => {
  Genre.findOne({ Name: req.body.Name })
    .then((genre) => {
      if (genre) {
        return res.status(400).send(req.body.Name + " already exists");
      } else {
        Genre.create({
          Name: req.body.Name,
          Description: req.body.Description,
        })
          .then((genre) => {
            res.status(200).json(genre);
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

// Get ALL genres - This is not in the exercise
app.get("/genres", (req, res) => {
  Genre.find()
    .then((genres) => {
      res.status(200).json(genres);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Return data about a genre (descriotion) by name/title
app.get("/genres/:Name", (req, res) => {
  Genre.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Allow users to update the genre info - This is not in the exercise
app.put("/genres/:Name", (req, res) => {
  Genre.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $set: {
        Name: req.body.Name,
        Description: req.body.Description,
      },
    },
    { new: true },
    (err, updatedGenre) => {
      if (err) {
        console.error(err);
        res.status(400).send("Error: " + err);
      } else {
        res.status(200).send(updatedGenre);
      }
    }
  );
});

// Delete the genre - This is not in the exercise
app.delete("/genres/:Name", (req, res) => {
  Genre.findOneAndRemove({ Name: req.params.Name })
    .then((genre) => {
      if (!genre) {
        res.status(400).send(req.params.Name + " was not found!");
      } else {
        res.status(200).send(req.params.Name + " was deleted!");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Directors AREA
// Creating a new directors in the Directors List - This is not in the exercise
app.post("/directors", (req, res) => {
  Director.findOne({ Name: req.body.Name })
    .then((director) => {
      if (director) {
        return res.status(400).send(req.body.Name + " already exists");
      } else {
        Director.create({
          Name: req.body.Name,
          Bio: req.body.Bio,
          Birthday: req.body.Birthday,
          Deathday: req.body.Deathday,
        })
          .then((director) => {
            res.status(200).json(director);
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

// Get ALL directors - This is not in the exercise
app.get("/directors", (req, res) => {
  Director.find()
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get("/directors/:Name", (req, res) => {
  Director.findOne({ Name: req.params.Name })
    .then((director) => {
      res.status(200).json(director);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("Error: " + error);
    });
});

// Allow users to update the director info - This is not in the exercise
app.put("/directors/:Name", (req, res) => {
  Director.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $set: {
        Name: req.body.Name,
        Bio: req.body.Bio,
        Birthday: req.body.Birthday,
        Deathday: req.body.Deathday,
      },
    },
    { new: true },
    (err, updatedDirector) => {
      if (err) {
        console.error(err);
        res.status(400).send("Error: " + err);
      } else {
        res.status(200).send(updatedDirector);
      }
    }
  );
});

// Delete director - This is not in the exercise
app.delete("/directors/:Name", (req, res) => {
  Director.findOneAndRemove({ Name: req.params.Name })
    .then((director) => {
      if (!director) {
        res.status(400).send(req.params.Name + " was not found!");
      } else {
        res.status(200).send(req.params.Name + " was deleted!");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
