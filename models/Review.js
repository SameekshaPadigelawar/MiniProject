// const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, // Reference to Customer
//   rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
//   comment: { type: String, required: true }, // Review text
//   createdAt: { type: Date, default: Date.now } // Timestamp
// });

// module.exports = mongoose.model("Review", ReviewSchema);
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);

