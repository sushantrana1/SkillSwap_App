const express = require("express");

const {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

// Create or get a conversation
router.post(
  "/conversation",
  verifyUser,
  createOrGetConversation
);

// Get current user's conversations
router.get(
  "/conversations",
  verifyUser,
  getConversations
);

// Get messages
router.get(
  "/conversation/:conversationId/messages",
  verifyUser,
  getMessages
);

// Send message
router.post(
  "/conversation/:conversationId/messages",
  verifyUser,
  sendMessage
);

module.exports = router;