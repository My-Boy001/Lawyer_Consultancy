const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const { userModel } = require("../models/User.js");

const allowedOrigins = ["http://localhost:4500", "http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  const conversationId = socket.handshake.query.conversationId;
  console.log("Conversation ID:", conversationId);

  // Ensure userId exists before processing
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    await userModel
      .findByIdAndUpdate(userId, { IsOnline: true })
      .catch((err) => console.error("Error updating online status:", err));

    console.log(`User ${userId} Status: Online`);
  }

  socket.join(conversationId);

  // Notify other users about the online status
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      await userModel
        .findByIdAndUpdate(userId, { IsOnline: false })
        .catch((err) => console.error("Error updating offline status:", err));

      console.log(`User ${userId} Status: Offline`);
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    const { message, receiverId } = data;

    const messageData = {
      ...data,
      status: "sent",
      createdAt: new Date(),
    };
    const receiverSocketId = getReceiverSocketId(receiverId);

    // Emit message to the receiver if they are online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
      messageData.status = "delivered";
    }

    // Emit message status update to the conversation room
    io.to(conversationId).emit("updateMessageStatus", messageData);
  });

  // Handle marking a message as read
  socket.on("markAsRead", async (messageId, conversationId) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, {
        read: true,
      });

      socket.to(conversationId).emit("messageRead", messageId);
      console.log(`Message ${messageId} marked as read.`);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  });
});

// Export necessary objects to be used in other modules
module.exports = { app, io, server, getReceiverSocketId };
