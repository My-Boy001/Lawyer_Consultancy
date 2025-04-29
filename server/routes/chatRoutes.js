const express = require("express");
const Messages = require("../controllers/chatController");
const messageRouter = express.Router();

messageRouter.get("/:id", Messages.GetMessage);
messageRouter.post("/send/:id", Messages.sendMessage);

module.exports = messageRouter;
