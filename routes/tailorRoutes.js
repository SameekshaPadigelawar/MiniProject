// const express = require("express");
// const User = require("../models/User");
// const Request = require("../models/Request");
// const router = express.Router();

// // Get all tailors
// router.get("/tailors", async (req, res) => {
//   try {
//     const tailors = await User.find({ role: "tailor" }).select("-password"); // Exclude password
//     res.json(tailors);
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

 


// router.post("/requests", async (req, res) => {
//     try {
//       const { customer, tailor, message } = req.body;
  
//       if (!customer || !tailor || !message) {
//         return res.status(400).json({ msg: "All fields are required" });
//       }
  
//       const newRequest = new Request({
//         customer,
//         tailor,
//         message,
//       });
  
//       await newRequest.save();
//       res.status(201).json({ msg: "Request sent successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: "Server Error" });
//     }
//   });



// // Add a request from the customer
// // router.post("/request", async (req, res) => {
// //     try {
// //       const { customerId, tailorId, message } = req.body;
  
// //       if (!customerId || !tailorId || !message) {
// //         return res.status(400).json({ msg: "Please provide all required fields" });
// //       }
  
// //       const request = new Request({
// //         customerId,
// //         tailorId,
// //         message,
// //       });
  
// //       await request.save();
// //       res.status(201).json({ msg: "Request sent successfully" });
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ msg: "Server Error" });
// //     }
// //   });
  

// // Tailor views assigned requests
// router.get("/requests/tailor/:tailorId", async (req, res) => {
//   try {
//     const { tailorId } = req.params;
//     const requests = await Request.find({ tailor: tailorId }).populate("customer", "fullName email");
    
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// module.exports = router;












const express = require("express");
const User = require("../models/User");
const Request = require("../models/Request");
const router = express.Router();

// ✅ Get all tailors
router.get("/tailors", async (req, res) => {
  try {
    const tailors = await User.find({ role: "tailor" }).select("-password");
    res.json(tailors);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ Submit a request to tailor
router.post("/requests", async (req, res) => {
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
      status,
    } = req.body;

    if (!customer || !tailor || !name || !email || !contact || !details || !time || !location) {
      return res.status(400).json({ msg: "All fields are required" });
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
      status: status || "pending",
    });

    await newRequest.save();
    res.status(201).json({ msg: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});


// ✅ Tailor gets all requests sent to them
router.get("/requests/tailor/:tailorId", async (req, res) => {
  try {
    const requests = await Request.find({ tailor: req.params.tailorId }).populate("customer", "fullName");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});


// ✅ Tailor updates status of request (accept or reject)
router.put("/requests/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Request not found" });

    res.json({ msg: "Status updated", request: updated });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ Customer gets all their requests with status
router.get("/requests/customer/:customerId", async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.params.customerId }).populate("tailor", "fullName");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
