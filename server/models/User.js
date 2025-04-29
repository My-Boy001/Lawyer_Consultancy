"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["client", "lawyer"],
    required: true,
    lowercase: true,
    trim: true,
  },
  googleCalendarToken: {
    type: String,
    trim: true,
  },
  meetLink: {
    type: Array,
  },
  // Lawyer specific fields
  specialization: {
    type: String,
  },
  experience: {
    type: Number,
  }, // in years
  location: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validation: if role is 'lawyer', extra fields are required
userSchema.pre("validate", function (next) {
  if (this.role === "lawyer") {
    if (!this.specialization) {
      this.invalidate(
        "specialization",
        "Specialization is required for lawyers",
      );
    }
    if (this.experience == null) {
      this.invalidate("experience", "Experience is required for lawyers");
    }
    if (!this.location) {
      this.invalidate("location", "Location is required for lawyers");
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
