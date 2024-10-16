const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const users = [];

const JWT_SECRET = "USER_APP";

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello from the Homepage");
});
app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username,
    password,
  });

  res.send({
    message: "You've signed up successfully",
  });
});
app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET
    );

    // user.token = token;

    res.send({
      token,
    });
    console.log(users);
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  const decodedInfo = jwt.verify(token, JWT_SECRET);

  if (decodedInfo.username) {
    req.username = decodedInfo.username;
    next();
  } else {
    res.status(403).send({
      message: "You're not logged in",
    });
    return;
  }
}

app.get("/me", auth, function (req, res) {
  const user = users.find((user) => user.username === req.username);
  if (user) {
    res.send({
      username: req.username,
      password: user.password,
    });
  } else {
    res.status(403).send({
      message: "user not found",
    });
  }
});

app.listen(3000, function () {
  console.log("Server is running on PORT 3000");
});
