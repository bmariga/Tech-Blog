// Import the required mongoose module and extract Schema and model from it
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define a schema for the Post model using the Schema constructor
const PostSchema = new Schema(
  {
    // Define fields for the Post model: title, summary, content, cover, and author
    title: { type: String },
    summary: { type: String },
    content: { type: String },
    cover: { type: String },
    // Establish a reference to the User model for the author field
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    // Enable timestamps to automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create a model for the Post using the defined schema
const PostModel = model("Post", PostSchema);

// Export the Post model for use in other parts of the application
module.exports = PostModel;
