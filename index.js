// Main NPM Package
const express = require("express");
const app = express();
app.use(express.static("public"));

const { check, validationResult } = require("express-validator");

// const morgan = require("morgan");
// app.use(morgan("common"));
// app.use(myLogger);
// app.use(requestTime);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
// bodyParser middle ware function
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// const methodOverride = require("method-override");
// app.use(methodOverride());

// const uuid = require("uuid");

// to import auth.js file... the (app) argument is to ensure Express is available in the auth.js file as well
let auth = require("./auth")(app);

// to require passport module and import passport.js file
const passport = require("passport");
require("./passport");

// Get All the Schema Types from Models Folder
const mongoose = require("mongoose");
const MoviesSchema = require("./models/movies.js");
const Movie = MoviesSchema.Movie;

const UsersSchema = require("./models/users.js");
const User = UsersSchema.User;

const GenreSchema = require("./models/genres.js");
const Genre = GenreSchema.Genre;

const DirectorsSchema = require("./models/directors.js");
const Director = DirectorsSchema.Director;

// Cors
const cors = require("cors");
app.use(cors());

let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        //If a specific origin isn't found on the list of allowd origins
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to this boring site! But not for long!");
});

// Movies AREA
// Create a movie in movies - This is not in the exercise
app.post(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Return a list off ALL movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Return data (description. genre, directors, image URL, whether it's featured or not) about a single movie by title to the user
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

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
app.put(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
); // 637be159a7f612ad6135486a

// Delete movie from movies list - This is not in the exercise
app.delete(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Users AREA
// Allow new users to register
app.post("/users", (req, res) => {
  // Validation logic here for request
  [
    // Check if the username length is min 6 charecters
    check("Username", "Username is required").isLength({ min: 6 }),
    // Check if the username has alphanumeric
    check(
      "Username",
      "Username contains non alphanumeric charecters - not allowed."
    ).isAlphanumeric(),
    // Check if the password is empty
    check("Password", "Password is required").not().isEmpty(),
    // Check if the email is valid
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
    (req, res) => {
      // check the validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
    };

  // Create New Hashed Password
  let hashedPassword = User.hashPassword(req.body.Password);

  // Search to see if a user with the Username already exists
  User.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        // If the user already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        User.create({
          Username: req.body.Username,
          Password: hashedPassword, //Adding Hashed Password
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
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .populate("FavoriteMovies", "Title")
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Get user by Username in Users list - This is not in the exercise
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ Username: req.params.Username })
      .populate("FavoriteMovies", "Title")
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Allow users to update their user info (username, password, email, date of birth)
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Allow users to add a movie to their list of favorites
// Needs to be done
app.post(
  "/users/:Username/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Allow users to remove a movie from their list of favorites
// Needs to be done
app.delete(
  "/users/:Username/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Allow existing users to deregister
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Genres AREA
// Creating a new genre in the Genres List - This is not in the exercise
app.post(
  "/genres",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Get ALL genres - This is not in the exercise
app.get(
  "/genres",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Genre.find()
      .then((genres) => {
        res.status(200).json(genres);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Return data about a genre (descriotion) by name/title
app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Genre.findOne({ Name: req.params.Name })
      .then((genre) => {
        res.status(200).json(genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Allow users to update the genre info - This is not in the exercise
app.put(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Delete the genre - This is not in the exercise
app.delete(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Directors AREA
// Creating a new directors in the Directors List - This is not in the exercise
app.post(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Get ALL directors - This is not in the exercise
app.get(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Director.find()
      .then((directors) => {
        res.status(200).json(directors);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Return data about a director (bio, birth year, death year) by name
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Director.findOne({ Name: req.params.Name })
      .then((director) => {
        res.status(200).json(director);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Allow users to update the director info - This is not in the exercise
app.put(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Delete director - This is not in the exercise
app.delete(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// CONNECTION_URI

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
