const io = require("socket.io-client");

// Connect to the socket server
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

// Test room ID
const testRoomId = "test-room-123";

// Connection event
socket.on("connect", () => {
  console.log("✅ Connected to server with socket ID:", socket.id);

  // Test joining a room
  socket.emit("join-room", testRoomId);
  console.log("✅ Joined test room:", testRoomId);

  // Test sending a message
  const testMessage = {
    roomId: testRoomId,
    message: "Hello from test client!",
    sender: "test-user",
  };

  socket.emit("send-message", testMessage);
  console.log("✅ Sent test message:", testMessage);
});

// Listen for messages
socket.on("receive-message", (data) => {
  console.log("✅ Received message:", data);
});

// Listen for typing status
socket.on("user-typing", (data) => {
  console.log("✅ Received typing status:", data);
});

// Test typing status
socket.emit("typing", {
  roomId: testRoomId,
  userId: "test-user",
  isTyping: true,
});
console.log("✅ Sent typing status");

// Handle disconnection
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

// Handle errors
socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error);
});

// Keep the script running for a while to see the events
setTimeout(() => {
  console.log("Test completed. Disconnecting...");
  socket.disconnect();
  process.exit(0);
}, 5000);
