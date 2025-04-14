const express = require("express");
const router = express.Router();
const { createRequest } = require("../controllers/requestController"); // ✅ Correct file

router.post("/", createRequest); // Handles POST /api/requests

module.exports = router;







