// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db'); // ✅ Ensure correct import

// dotenv.config();
// connectDB(); // ✅ Now this should work

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tailorRoutes = require("./routes/tailorRoutes");
const requestRoutes = require("./routes/requestRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tailors", tailorRoutes); // Added this
app.use("/api/requests", requestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/users", userRoutes);
// Connect Database and Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});


const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// File filter (allow only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only images allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

app.use("/uploads", express.static("uploads")); // Serve uploaded files







const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const axios = require('axios');

// Backend: Handling user queries
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message.toLowerCase(); // Ensure case-insensitive comparison

  try {
    // Check for website-specific queries first
    if (userMessage.includes("find tailor")) {
      return res.json({
        reply: "You can find tailors in these locations in India: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, and Surat.",
      });
    }

    if (userMessage.includes("sign up")) {
      return res.json({
        reply: "To sign up, visit our sign-up page at [http://localhost:3000/signup](http://localhost:3000/signup).",
      });
    }

    if (userMessage.includes("order status")) {
      return res.json({
        reply: "Please provide your order ID, and I will help you check the status.",
      });
    }

    if (userMessage.includes("tailoring services")) {
      return res.json({
        reply: "We offer tailoring services for both men and women, including custom stitching, alterations, and fashion tailoring. What service would you like to inquire about?",
      });
    }

    if (userMessage.includes("payment methods")) {
      return res.json({
        reply: "We accept various payment methods, including credit/debit cards, net banking, UPI, and cash on delivery.",
      });
    }

    if (userMessage.includes("custom design")) {
      return res.json({
        reply: "Yes! We offer custom design services where you can upload your reference or share your measurements. Visit the 'Custom Design' section on our homepage.",
      });
    }
    
    if (userMessage.includes("alteration charges")) {
      return res.json({
        reply: "Alteration charges vary depending on the garment. Typically, prices start at ₹100. Contact support for exact quotes.",
      });
    }

    if (userMessage.includes("delivery time")) {
      return res.json({
        reply: "Our standard delivery time is 5-7 business days, depending on your location.",
      });
    }
    
    if (userMessage.includes("cancel order")) {
      return res.json({
        reply: "You can cancel your order within 24 hours of placing it from the 'My Orders' section after login.",
      });
    }

    if (userMessage.includes("contact support")) {
      return res.json({
        reply: "You can reach our support team at help@sewsmart.in or call us on 1800-123-4567.",
      });
    }
    
    if (userMessage.includes("working hours")) {
      return res.json({
        reply: "Our customer support is available from 10:00 AM to 7:00 PM, Monday to Saturday.",
      });
    }
    

    // If no website-specific query, use Gemini API for a more general response
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }
    );

    const botReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I don't know that.";

    res.json({ reply: botReply });

  } catch (error) {
    // Log the error for debugging
    console.error("Gemini error:", error?.response?.data || error.message);
    
    // Send back a generic error response
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});






// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// app.post("/chat", async (req, res) => {
//   const userMessage = req.body.message;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         contents: [{ role: "user", parts: [{ text: userMessage }] }],
//       }
//     );

//     const botReply =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I don't know that.";

//     res.json({ reply: botReply });
//   } catch (error) {
//     console.error("Gemini error:", error?.response?.data || error.message);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });


// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// app.post("/chat", async (req, res) => {
//   const userMessage = req.body.message;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: userMessage }] }],
//       }
//     );

//     const botReply =
//       response.data.candidates[0].content.parts[0].text || "Sorry, I don't know that.";
//     res.json({ reply: botReply });
//   } catch (error) {
//     console.error("Gemini error:", error.message);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });