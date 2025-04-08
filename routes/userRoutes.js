const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get total number of registered users
router.get("/total-users", async (req, res) => {
  try {
    const count = await User.countDocuments(); // gets total number of users
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count" });
  }
});

module.exports = router;
