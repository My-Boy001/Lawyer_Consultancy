"use strict";

const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // referring to your User model
      required: true,
    },
  ],
  meetLink: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "cancelled", "completed"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  eventId: {
    type: String,
    required: true,
},
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
