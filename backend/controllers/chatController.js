const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Request = require("../models/Request");
const User = require("../models/User");
const Profile = require("../models/Profile");

// Check whether two users have an accepted request
const checkAcceptedRequest = async (userA, userB) => {
  const request = await Request.findOne({
    $or: [
      {
        sender: userA,
        receiver: userB,
      },
      {
        sender: userB,
        receiver: userA,
      },
    ],
    status: "accepted",
  });

  return request;
};

// Attach profile image to a user
const attachProfileImage = async (user) => {
  if (!user) {
    return null;
  }

  const profile = await Profile.findOne({
    user: user._id,
  }).select("profileImage");

  const userObject = user.toObject();

  userObject.profileImage = profile?.profileImage || "";

  return userObject;
};

// Attach profile images to multiple users
const attachProfileImages = async (users) => {
  if (!users || users.length === 0) {
    return [];
  }

  return Promise.all(
    users.map((user) => attachProfileImage(user))
  );
};

// Create or get conversation
const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation with yourself",
      });
    }

    // Check whether the other user exists
    const otherUser = await User.findById(userId);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only accepted requests can start a conversation
    const acceptedRequest = await checkAcceptedRequest(
      currentUserId,
      userId
    );

    if (!acceptedRequest) {
      return res.status(403).json({
        success: false,
        message:
          "You can only chat with users whose skill swap request has been accepted",
      });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, userId],
      },
    })
      .populate("participants", "name email role")
      .populate("lastMessage");

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
      });

      conversation = await Conversation.findById(
        conversation._id
      )
        .populate("participants", "name email role")
        .populate("lastMessage");
    }

    // Add profile images
    const conversationObject = conversation.toObject();

    conversationObject.participants =
      await attachProfileImages(
        conversation.participants
      );

    return res.status(200).json({
      success: true,
      conversation: conversationObject,
    });
  } catch (error) {
    console.error(
      "Create/get conversation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create or get conversation",
    });
  }
};

// Get all conversations for current user
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "name email role")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const conversationsWithProfiles =
      await Promise.all(
        conversations.map(async (conversation) => {
          const conversationObject =
            conversation.toObject();

          conversationObject.participants =
            await attachProfileImages(
              conversation.participants
            );

          return conversationObject;
        })
      );

    return res.status(200).json({
      success: true,
      count: conversationsWithProfiles.length,
      conversations: conversationsWithProfiles,
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load conversations",
    });
  }
};

// Get messages from a conversation
const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Make sure current user belongs to conversation
    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === currentUserId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant in this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    const messagesWithProfiles =
      await Promise.all(
        messages.map(async (message) => {
          const messageObject = message.toObject();

          messageObject.sender =
            await attachProfileImage(
              message.sender
            );

          return messageObject;
        })
      );

    return res.status(200).json({
      success: true,
      count: messagesWithProfiles.length,
      messages: messagesWithProfiles,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load messages",
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check participant
    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === currentUserId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant in this conversation",
      });
    }

    // Find the other participant
    const otherParticipant =
      conversation.participants.find(
        (participant) =>
          participant.toString() !== currentUserId
      );

    // Make sure the skill swap request is still accepted
    const acceptedRequest =
      await checkAcceptedRequest(
        currentUserId,
        otherParticipant
      );

    if (!acceptedRequest) {
      return res.status(403).json({
        success: false,
        message:
          "You can only message users with an accepted skill swap request",
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: currentUserId,
      text: text.trim(),
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;

    await conversation.save();

    // Return populated message
    const populatedMessage =
      await Message.findById(message._id).populate(
        "sender",
        "name email role"
      );

    const messageObject =
      populatedMessage.toObject();

    messageObject.sender =
      await attachProfileImage(
        populatedMessage.sender
      );

    return res.status(201).json({
      success: true,
      message: messageObject,
    });
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

module.exports = {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
};
