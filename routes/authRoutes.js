// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// require("dotenv").config();

// const router = express.Router();

// // User Registration
// router.post("/register", async (req, res) => {
//   try {
//     const { fullName, email, password, phone, role, locality, skills, availability, profilePicture } = req.body;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ msg: "Email already registered" });

//     // Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Save User
//     user = new User({ fullName, email, password: hashedPassword, phone, role, locality, skills, availability, profilePicture });
//     await user.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// // User Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid Email or Password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid Email or Password" });

//     // Generate Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token, user });
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// module.exports = router;







const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // ✅ For handling file uploads
const path = require("path");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");



// Set up storage for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// // User Registration with File Upload
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const { fullName, email, password, phone, role, locality, skills, availability } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get uploaded file path
    const profilePicture = req.file ? req.file.filename : null;

    user = new User({ fullName, email, password: hashedPassword, phone, role, locality, skills, availability, profilePicture });
    await user.save();


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ msg: "User registered successfully" , token, user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }




  const token = crypto.randomBytes(32).toString("hex");

  user = new User({ 
    fullName, email, password: hashedPassword, 
    phone, role, locality, skills, availability, 
    profilePicture,
    verificationToken: token ,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // expires in 1 day
  });
  
  await user.save();
  await sendVerificationEmail(email, token);


  

});


















// const router = require("express").Router();
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const upload = require("../middleware/upload"); // your multer config
// const User = require("../models/User");
// const sendVerificationEmail = require("../utils/sendVerificationEmail"); // make sure path is correct

// User Registration with Email Verification
// router.post("/register", upload.single("profilePicture"), async (req, res) => {
//   try {
//     const { fullName, email, password, phone, role, locality, skills, availability } = req.body;

//     let existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ msg: "Email already registered" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const profilePicture = req.file ? req.file.filename : null;

//     const verificationToken = crypto.randomBytes(32).toString("hex");

//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       phone,
//       role,
//       locality,
//       skills,
//       availability,
//       profilePicture,
//       verificationToken,
//       expiresAt: Date.now() + 24 * 60 * 60 * 1000 // token valid for 1 day
//     });

//     await newUser.save();
//     await sendVerificationEmail(email, verificationToken);

//     res.status(201).json({ msg: "Verification email sent. Please check your inbox." });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

// module.exports = router;














router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send("Invalid or expired token");

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("✅ Email verified successfully!");
  } catch (error) {
    res.status(500).send("Error verifying email");
  }
});







// User Login
// router.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid Email or Password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid Email or Password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token, user });
//   } catch (error) {
//     res.status(500).json({ msg: "Server Error" });
//   }
//   const user = await User.findOne({ email: "radha@gmail.com" });
// console.log(user);
// console.log("Stored Hashed Password:", user.password);

// });


 



router.post("/login", async (req, res) => {
  console.log("Login request received", req.body); // Check request data

  try {
      const user = await User.findOne({ email: req.body.email });
      console.log("User found:", user); // Check if user exists

      if (!user) {
          return res.status(400).json({ msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      console.log("Password match:", isMatch); // Check password validation

      if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });
      res.json({ token, user });
  } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ msg: "Server Error" });
  }
});


// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});


// Delete User by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});




// ✅ Add this new update profile route
router.put("/profile/:id", async (req, res) => {
  try {
    const { fullName, phone, locality, skills, availability } = req.body;
    
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update common fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (locality) user.locality = locality;

    // Tailor-specific fields
    if (user.role === "tailor") {
      if (skills) user.skills = skills;
      if (availability) user.availability = availability;
    }

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});



module.exports = router;



router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});


router.put("/profile/:id", async (req, res) => {
  try {
    const { fullName, phone, locality, skills, availability } = req.body;
    
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update only provided fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (locality) user.locality = locality;
    if (skills) user.skills = skills;
    if (availability) user.availability = availability;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});



router.put("/profile/upload/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ msg: "Profile picture updated", profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});
// module.exports = router;