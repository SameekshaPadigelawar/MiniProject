// const express = require("express");
// const router = express.Router();
// const { createRequest } = require("../controllers/requestController"); // ✅ Correct file

// router.post("/", createRequest); // Handles POST /api/requests

// module.exports = router;







const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// POST - Submit a request
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      tailor,
      name,
      email,
      contact,
      details,
      time,
      location,
      status
    } = req.body;

    if (!customer || !tailor || !name || !email || !contact || !details || !time || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRequest = new Request({
      customer,
      tailor,
      name,
      email,
      contact,
      details,
      time,
      location,
      status: status || "pending"
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Tailor updates request status (accept/reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// GET - Get all requests for a customer (to view response)
router.get("/customer/:customerId", async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.params.customerId }).populate("tailor", "fullName email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

module.exports = router;
