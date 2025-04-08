const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {
    const { customer, tailor, message } = req.body;

    if (!customer || !tailor || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const request = new Request({ customer, tailor, message });
    await request.save();

    res.status(201).json({ msg: "Request sent successfully", request });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

 