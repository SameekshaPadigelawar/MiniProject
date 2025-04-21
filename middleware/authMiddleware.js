// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// module.exports = { authenticateToken };


const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Auth Header:", authHeader); // Debug log

  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted Token:", token); // Debug log

  if (!token) {
    console.log("No token provided"); // Debug log
    return res.status(403).json({ msg: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ msg: "Invalid token" });
    }
    console.log("Decoded Token:", decoded); // Debug log
    req.user = decoded;
    next();
  });
}

module.exports = { authenticateToken };