const cors = require("cors"); // CORS providing a Connect/Express middleware
const express = require("express");
const mysql2 = require("mysql2");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json()); // Automatically parsing every json-object, which is send from the front-end
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
); // Enables cors (cross-origin resource sharing), which makes the server accessible to any domain that requests a resource from your server via a browser
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql2.createConnection({
  user: "root",
  host: "localhost",
  password: "123456789",
  database: "login_schema",
});

// Add the user's registration input to the database
app.post("/register", (req, res) => {
  const username = req.body.user.registerUsername;
  const password = req.body.user.registerPassword;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (!username || !password) {
          res.send({ message: "No username/password enterd!" });
        } else if (err) {
          res.send({ err: err });
        } else {
          res.send({ message: "You have succesfully registerd an account!" });
        }
      }
    );
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// Compare the user's login input to the database
app.post("/login", (req, res) => {
  const username = req.body.user.loginUsername;
  const password = req.body.user.loginPassword;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist." });
      }
    }
  );
});

app.listen(3002, () => {
  console.log("running server");
});
