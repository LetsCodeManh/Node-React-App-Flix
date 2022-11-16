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
let user = [
  {
    id: 1,
    name: "test",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "test2",
    favoriteMovies: ["testMovie1", "testMovie2"]
  }
];

let movies = [
  {
    "title": "testMovieTitle",
    "description": "testMovieDescription",
    "genre": {
      "genreName": "testGenreName",
      "genreDescription": "testGenreDescription",
    },
    "directors": {
      "directorsName": "testDirectorsName",
      "directorsBio": "testDirectorsBio",
      "directorsBirth": "testDirectorsBirth",
    },
    "movieImagesURL": "https://www.testmovieImagesURL.com",
    "feature": false
  },
  {
    "title": "testMovieTitle2",
    "description": "testMovieDescription2",
    "genre": {
      "genreName": "testGenreName2",
      "genreDescription": "testGenreDescription2",
    },
    "directors": {
      "directorsName": "testDirectorsName2",
      "directorsBio": "testDirectorsBio2",
      "directorsBirth": "testDirectorsBirth2",
    },
    "movieImagesURL": "https://www.testmovieImagesURL2.com",
    "feature": false
  },
  {
    "title": "testMovieTitle3",
    "description": "testMovieDescription3",
    "genre": {
      "genreName": "testGenreName3",
      "genreDescription": "testGenreDescription3",
    },
    "directors": {
      "directorsName": "testDirectorsName3",
      "directorsBio": "testDirectorsBio3",
      "directorsBirth": "testDirectorsBirth3",
    },
    "movieImagesURL": "https://www.testmovieImagesURL3.com",
    "feature": false
  }
];

// READ
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
})

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
