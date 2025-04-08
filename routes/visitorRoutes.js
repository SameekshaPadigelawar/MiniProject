const express = require("express");
const Visitor = require("../models/Visitor");

const router = express.Router();

// Increment visitor count
// router.post("/visit", async (req, res) => {
//   try {
//     let visitor = await Visitor.findOne();

//     if (!visitor) {
//       visitor = new Visitor({ count: 1 });
//     } else {
//       visitor.count += 1;
//     }

//     await visitor.save();
//     res.json({ count: visitor.count });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating visitor count" });
//   }
// });


 

router.post("/visit", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) visitor = new Visitor({ count: 1 });
    else visitor.count += 1;

    await visitor.save();
    res.json({ count: visitor.count });
  } catch (error) {
    res.status(500).json({ message: "Error updating visitor count" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    const count = visitor ? visitor.count : 0;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor count" });
  }
});

module.exports = router;




// Get visitor count
// router.get("/count", async (req, res) => {
//   try {
//     let visitor = await Visitor.findOne();
//     const count = visitor ? visitor.count : 0;
//     res.json({ count });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching visitor count" });
//   }
// });

module.exports = router;
