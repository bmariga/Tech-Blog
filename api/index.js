const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "8jkf9sD&23l1@%sG9zH0Yp$w7cXqBhU87";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://marigabn:C7zLS6oxhvyZ8X61@cluster0.ywqrj62.mongodb.net/"
);

app.post("/register", async (req, res) => {
  try {
    const { firstname, secondname, username, password } = req.body;

    // Validate password length
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // Username already exists
      res.status(400).json({ error: "Username already exists" });
    } else {
      // Create new user
      const userDoc = await User.create({
        firstname,
        secondname,
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.json(userDoc);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  // Checks if password true or false
  const passTrue = bcrypt.compareSync(password, userDoc.password);

  if (passTrue) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Username and Pasword don't match");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json({ postDoc });
  });
});

app.get("/post", async (req, res) => {
  res.json(await Post.find());
});

app.listen(4000);
