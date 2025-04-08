const express = require("express");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Tailor = require("../models/Tailor");
const Product = require("../models/Product");

const router = express.Router();


// ✅ Create Order
router.post("/", async (req, res) => {
  try {
    const { customer, tailor, items, totalAmount } = req.body;
    const newOrder = new Order({ customer, tailor, items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// module.exports = router;

// ✅ Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("customer tailor items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get Single Order by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching order with ID:", req.params.id);
    const order = await Order.findById(req.params.id).populate("customer tailor items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update Order Status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
