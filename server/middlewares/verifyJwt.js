// authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Token from cookie or header
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "Why!", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    // console.log("req.user",req.user);

    // console.log("decoded",decoded);
    // Attach decoded user info to the request object
    next();
  });
};

module.exports = verifyJWT;
