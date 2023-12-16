// Import required modules and set up the Express app
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

// Set up constants for password hashing and JWT secret
const salt = bcrypt.genSaltSync(10);
const secret = "8jkf9sD&23l1@%sG9zH0Yp$w7cXqBhU87";

// Configure CORS to allow requests from http://localhost:3000
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT"],
    origin: "http://localhost:3000",
  })
);

// Set up middleware for JSON parsing, cookie parsing, and serving static files
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://marigabn:C7zLS6oxhvyZ8X61@cluster0.ywqrj62.mongodb.net/"
);

// Define route to handle user registration
app.post("/register", async (req, res) => {
  try {
    // Extract user registration data from request body
    const { firstname, secondname, username, password } = req.body;

    // Validate password length
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if username already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // Respond with an error if username is already taken
      res.status(400).json({ error: "Username already exists" });
    } else {
      // Create a new user document in the database
      const userDoc = await User.create({
        firstname,
        secondname,
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.json(userDoc);
    }
  } catch (error) {
    // Handle errors and respond with appropriate status code and message
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
});

// Define route to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Find the user document in the database based on the provided username
  const userDoc = await User.findOne({ username });
  // Check if the provided password matches the hashed password in the database
  const passTrue = bcrypt.compareSync(password, userDoc.password);

  if (passTrue) {
    // If the password is correct, generate a JWT for user authentication
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      // Set the JWT as a cookie and respond with user information
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    // Respond with an error if the username and password don't match
    res.status(400).json("Username and Password don't match");
  }
});

// Define route to retrieve user profile information
app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    // Respond with an error if no token is provided
    return res.status(401).json({ error: "Token not provided" });
  }

  // Verify the JWT and respond with user information or an error
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Respond with an error if the token has expired
        return res.status(401).json({ error: "Token has expired" });
      }
      // Respond with an error for invalid tokens
      return res.status(401).json({ error: "Invalid token" });
    }

    // Respond with user information if the token is valid
    res.json(info);
  });
});

// Define route to handle user logout
app.post("/logout", (req, res) => {
  // Clear the token cookie and respond with "ok"
  res.cookie("token", "").json("ok");
});

// Define route to handle post creation with file upload
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  // Verify the JWT and create a new post document in the database
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
    res.json(postDoc);
  });
});

// Define route to handle post update with file upload
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let newPath = req.file ? req.file.path : null;

    const { token } = req.cookies;
    // Verify the JWT and update the existing post document in the database
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        // Respond with an error if the user is not the author of the post
        return res.status(400).json("You are not the author");
      }

      // Update the post document with the new data and save it
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath ? newPath : postDoc.cover;

      await postDoc.save();

      // Respond with the updated post document
      res.json(postDoc);
    });
  } catch (error) {
    // Handle errors and respond with an internal server error
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define route to retrieve a list of posts
app.get("/post", async (req, res) => {
  // Respond with a list of posts, sorted by creation date, and limited to 15
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(15)
  );
});

// Define route to retrieve a single post by ID
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  // Respond with the post document, including author information, based on ID
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

// Start the server on port 4000
app.listen(4000);
