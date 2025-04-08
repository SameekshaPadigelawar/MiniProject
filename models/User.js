const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["customer", "tailor"], default: "customer" },
  locality: { type: String },
  skills: { type: String },
  availability: { type: String },
  profilePicture: { type: String },

  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  }


});



module.exports = mongoose.model("User", userSchema);
