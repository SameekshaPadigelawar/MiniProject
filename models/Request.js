// const mongoose = require("mongoose");
// mongoose.set("strictQuery", true);

// const RequestSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   tailor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assigned tailor
//   message: { type: String, required: true }, // What the customer needs
//   status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
// //   createdAt: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model("Request", RequestSchema);





const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  details: { type: String, required: true },
  time: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);





// const mongoose = require("mongoose");

// const RequestSchema = new mongoose.Schema({
//   customer: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },
//   tailor: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },
//   message: { 
//     type: String, 
//     required: true 
//   },
//   status: { 
//     type: String, 
//     enum: ["pending", "accepted", "completed"], 
//     default: "pending" 
//   }
// });

// module.exports = mongoose.model("Request", RequestSchema);
