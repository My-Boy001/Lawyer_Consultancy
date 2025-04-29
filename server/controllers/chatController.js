const { Conversation } = require("../models/Conversation");
const { Message } = require("../models/Message");
const { userModel } = require("../models/User.js");
const { io } = require("../services/socketService.js");

class Messages {
  static sendMessage = async (req, res) => {
    try {
      const { message, senderId } = req.body;
      const { id: receiverId } = req.params;

      console.log(
        `sendMessage called: senderId = ${senderId}, receiverId = ${receiverId}, message = ${message}`,
      );

      // Find or create a conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        console.log("No conversation found, creating a new one");
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      } else {
        console.log("Found existing conversation:", conversation._id);
      }

      // Create a new message
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        status: "sent",
        conversationId: conversation._id,
      });

      console.log("New message created:", newMessage);

      // Save the message and update the conversation
      conversation.message.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);

      console.log("Message saved and conversation updated");

      // Emit the new message to the socket room (conversationId)
      const conversationId = conversation._id.toString();
      console.log(`Emitting message to socket room: ${conversationId}`);
      io.to(conversationId).emit("newMessage", newMessage);

      // Return the new message and conversation details
      res.status(200).json({
        newMessage,
        conversation: {
          id: conversation._id,
        },
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static GetMessage = async (req, res) => {
    try {
      const { senderId } = req.query;
      const { id: receiverId } = req.params;

      console.log(
        `GetMessage called: senderId = ${senderId}, receiverId = ${receiverId}`,
      );

      // Find the conversation between sender and receiver
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate("message");

      if (!conversation) {
        console.log("No conversation found");
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = conversation ? conversation.message : [];
      console.log(`Found ${messages.length} messages`);

      // Update the status of the messages to 'read'
      if (messages.length) {
        console.log(`Updating status of ${messages.length} messages to 'read'`);
        await Message.updateMany(
          { receiverId, status: "delivered" },
          { status: "read" },
        );
      }

      // Return the messages
      res.json(messages);
    } catch (error) {
      console.error("Error in GetMessage:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

module.exports = Messages;
