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

// CREATE
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User need name!");
  }
});

// READ
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
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
app.get("/movies/directors/:directorsName", (req, res) => {
  const { directorsName } = req.params;
  const directors = movies.find(
    (movie) => movie.directors.directorsName === directorsName
  ).directors;

  if (directors) {
    res.status(200).json(directors);
  } else {
    res.status(400).send("No such directors");
  }
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

// CREATE
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(user);
  } else {
    res.status(400).send("No such movie");
  }
});

// Previousl Exercise
let topBooks = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
  },
  {
    title: "Twilight",
    author: "Stephanie Meyer",
  },
];

// GET requests
// app.get("/", (req, res) => {
//   res.send("Welcome to my book club!");
// });

// app.get("/documentation", (req, res) => {
//   res.sendFile("public/documentation.html", { root: __dirname });
// });

// app.get("/books", (req, res) => {
//   res.json(topBooks);
// });

// let myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// };

// let requestTime = (req, res, next) => {
//   req.requestTime = Date.now();
//   next();
// };

// app.get("/", (req, res) => {
//   let responseText = "Welcome to my app!";
//   responseText += "<small>Requested at: " + req.requestTime + "</small>";
//   res.send(responseText);
// });

// app.get("/secreturl", (req, res) => {
//   let responseText = "This is a secret url with super top-secret content.";
//   responseText += "<small>Requested at: " + req.requestTime + "</small>";
//   res.send(responseText);
// });

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
