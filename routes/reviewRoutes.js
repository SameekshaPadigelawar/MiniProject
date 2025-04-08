// const express = require("express");
// const Review = require("../models/Review");
// const Product = require("../models/Product");
// const router = express.Router();

// // ✅ 1. Add a review (POST /api/reviews)
// router.post("/", async (req, res) => {
//   try {
//     const { product, customer, rating, comment } = req.body;

//     // Validate if product exists
//     const productExists = await Product.findById(product);
//     if (!productExists) return res.status(404).json({ message: "Product not found" });

//     // Create a new review
//     const newReview = new Review({ product, customer, rating, comment });
//     await newReview.save();

//     res.status(201).json({ message: "Review added successfully", review: newReview });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ 2. Get all reviews for a product (GET /api/reviews/:productId)
// router.get("/:productId", async (req, res) => {
//   try {
//     const reviews = await Review.find({ product: req.params.productId }).populate("customer", "name");
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;





const express = require("express");
const Review = require("../models/Review");
const User = require("../models/User");
const router = express.Router();

// Submit a review
router.post("/", async (req, res) => {
  try {
    const { tailor, customer, rating, comment } = req.body;

    const tailorExists = await User.findById(tailor);
    if (!tailorExists || tailorExists.role !== "tailor") {
      return res.status(404).json({ message: "Tailor not found" });
    }

    const newReview = new Review({ tailor, customer, rating, comment });
    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews for a tailor
router.get("/:tailorId", async (req, res) => {
  try {
    const reviews = await Review.find({ tailor: req.params.tailorId }).populate("customer", "fullName");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

