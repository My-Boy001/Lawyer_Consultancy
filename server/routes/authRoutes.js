"use strict";

const express = require("express");
const router = express.Router();
const Client = require("../models/User.js");
require("dotenv").config();
//import controllers
const authControllers = require("../controllers/authControllers.js");
const verifyJWT = require("../middlewares/verifyJwt.js");
const User = require("../models/User.js");

router.get("/", authControllers.checkHealth);
router.get("/auth/google", authControllers.googleLoginRedirect);
router.get("/auth/google/callback", authControllers.googleLogin);
router.post("/consultation", authControllers.createCalendarEvent);
router.post("/testing", verifyJWT, (req, res) => res.send("NICEE!"));
router.get("/meetInfo", verifyJWT, authControllers.getUserMeetings);
router.get("/cancelMeeting", verifyJWT, authControllers.cancelMeeting);
router.get("/find-user", verifyJWT, async (req, res) => {
  const userId = req.user.userId; // Use userId instead of _id from the decoded token
  // console.log("User ID from decoded token:", userId);  // Logging for debugging

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing from token" });
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(400).send("User not found");
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Error finding user" });
  }
});
router.get("/users", verifyJWT, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.post("/logout", (req, res) => {
  // Clear the 'token' cookie
  res
    .clearCookie("token", { httpOnly: true, secure: true }) // Set secure to true if using https
    .status(200)
    .json({ message: "Logout successful" });
});

module.exports = router;
