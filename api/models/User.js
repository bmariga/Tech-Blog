// Import the required mongoose module and extract Schema and model from it
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define a schema for the User model using the Schema constructor
const UserSchema = new Schema({
  // Define fields for the User model: firstname, secondname, username, and password
  firstname: { type: String, required: true },
  secondname: { type: String, required: true },
  username: { type: String, required: true, minlength: 4, unique: true },
  password: { type: String, required: true },
});

// Create a model for the User using the defined schema
const UserModel = model("User", UserSchema);

// Export the User model for use in other parts of the application
module.exports = UserModel;
