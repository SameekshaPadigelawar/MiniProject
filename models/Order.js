// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   tailor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true }
//     }
//   ],
//   totalAmount: { type: Number, required: true },
//   status: { type: String, enum: ["pending", "accepted", "shipped", "completed", "canceled"], default: "pending" },
// }, { timestamps: true });

// module.exports = mongoose.model("Order", OrderSchema);



const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
