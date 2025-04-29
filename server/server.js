"use strict";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const { app, server } = require("./services/socketService.js");
const chatRoutes = require("./routes/chatRoutes.js");
const verifyJWT = require("./middlewares/verifyJwt.js");
require("dotenv").config();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:4500", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", authRoutes);
app.use("/chat", chatRoutes);

// DB Connection
const dbURI = process.env.dbURI;
const PORT = process.env.PORT || 3000;

async function dbConnection() {
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
server.listen(PORT, () => {
  dbConnection();
  console.log(`Server running on http://localhost:${PORT}`);
});
