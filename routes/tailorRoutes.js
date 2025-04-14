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
// router.put("/requests/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["accepted", "rejected"].includes(status)) {
//       return res.status(400).json({ msg: "Invalid status value" });
//     }

//     const updated = await Request.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ msg: "Request not found" });

//     res.json({ msg: "Status updated", request: updated });
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });








router.put("/requests/:id/status", async (req, res) => {
  try {
    const { status, cost } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value." });
    }

    let updateFields = { status };

    // Only add cost if status is accepted
    if (status === "accepted") {
      if (cost === undefined || isNaN(Number(cost))) {
        return res.status(400).json({ msg: "Cost is required when accepting a request." });
      }
      updateFields.cost = Number(cost);
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Request not found" });
    }

    res.json({ msg: "Status updated successfully", request: updated });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});






 

// router.put("/requests/:id/status", async (req, res) => {
//   try {
//     // Destructuring status and cost directly from the request body
//     // const { status, cost } = req.body;
//     const status = req.body.status?.trim().toLowerCase();
//     const cost = req.body.cost?.toString().trim();


//     // Validate status (only "accepted" or "rejected" are allowed)
//     if (!["accepted", "rejected"].includes(status)) {
//       return res.status(400).json({ msg: "Invalid status value. Allowed values are 'accepted' or 'rejected'." });
//     }

//     // If the status is "accepted", ensure cost is provided and is a valid number
//     let validatedCost = null;
//     if (status === "accepted") {
//       if (cost === undefined || Number.isNaN(Number(cost))) {
//         return res.status(400).json({ msg: "Cost is required and must be a valid number when accepting the request." });
//       }
//       validatedCost = Number(cost);
//     }

//     // Update the request in the database
//     const updated = await Request.findByIdAndUpdate(
//       req.params.id, // Get request by ID from the URL
//       { status, cost: validatedCost }, // Update status and cost (if valid)
//       { new: true } // Return the updated document
//     );

//     // Handle case where request is not found
//     if (!updated) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     // Return success response
//     res.json({ msg: "Status updated successfully", updatedCost: validatedCost, request: updated });
//     // res.json({ msg: "Status updated successfully", request: updated });

//   } catch (error) {
//     console.error(error);
//     // Return a 500 error if there's a server issue
//     res.status(500).json({ msg: "Server error, please try again later." });
//   }
// });






 




// ✅ Customer gets all their requests with status
router.get("/requests/customer/:customerId", async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.params.customerId }).populate("tailor", "fullName");
    console.log(requests); 
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// router.get('/requests/customer/:customerId', async (req, res) => {
//   const { customerId } = req.params; // Get customerId from URL params
//   console.log("Fetching requests for customer ID:", customerId);
//   try {
//     // Find requests where the customer field matches the logged-in customerId
//     const customerRequests = await Request.find({ customer: customerId })
//       .populate('tailor')  // optional: populate tailor details if needed
//       .populate('customer'); // optional: populate customer details if needed

//     if (customerRequests.length === 0) {
//       return res.status(404).json({ message: "No requests found for this customer" });
//     }

//     res.status(200).json(customerRequests);
//   } catch (err) {
//     console.error('Error fetching customer requests:', err);
//     res.status(500).json({ message: 'Server error fetching requests' });
//   }
// });



module.exports = router;