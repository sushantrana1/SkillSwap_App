require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const Request = require("./models/Request");
const Profile = require("./models/Profile");
const Notification = require("./models/Notification");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRouter = require("./routes/skillRoutes");
const exploreRouter = require("./routes/exploreRoutes");
const matchingRouter = require("./routes/matchingRoutes");
const requestRouter = require("./routes/requestRoutes");
const chatRouter = require("./routes/chatRoutes");
const notificationRouter = require("./routes/notificationRoutes");

const app = express();

const server = http.createServer(app);

// ================================
// SOCKET.IO SETUP
// ================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// ================================
// CONNECT MONGODB
// ================================

connectDB();

// ================================
// MIDDLEWARE
// ================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://skill-swap-project-mu.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(helmet());

app.use(
  express.json({
    limit: "10kb",
  }),
);

// ================================
// API ROUTES
// ================================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/skills", skillRouter);

app.use("/api/explore", exploreRouter);

app.use("/api/matches", matchingRouter);

app.use("/api/requests", requestRouter);

app.use("/api/chat", chatRouter);

app.use("/api/notifications", notificationRouter);

// ================================
// SOCKET.IO JWT AUTHENTICATION
// ================================

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication required"),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(
      "Socket authentication error:",
      error.message,
    );

    next(
      new Error("Invalid or expired token"),
    );
  }
});

// ================================
// SOCKET.IO CONNECTION
// ================================

io.on("connection", (socket) => {
  console.log(
    "Authenticated user connected:",
    socket.userId,
  );

  // ================================
  // JOIN CONVERSATION
  // ================================

  socket.on(
    "joinConversation",
    async (conversationId) => {
      try {
        const conversation =
          await Conversation.findById(
            conversationId,
          );

        if (!conversation) {
          return socket.emit("chatError", {
            message: "Conversation not found",
          });
        }

        const isParticipant =
          conversation.participants.some(
            (participant) =>
              participant.toString() ===
              socket.userId,
          );

        if (!isParticipant) {
          return socket.emit("chatError", {
            message:
              "You are not a participant in this conversation",
          });
        }

        const otherParticipant =
          conversation.participants.find(
            (participant) =>
              participant.toString() !==
              socket.userId,
          );

        const acceptedRequest =
          await Request.findOne({
            $or: [
              {
                sender: socket.userId,
                receiver: otherParticipant,
              },
              {
                sender: otherParticipant,
                receiver: socket.userId,
              },
            ],
            status: "accepted",
          });

        if (!acceptedRequest) {
          return socket.emit("chatError", {
            message:
              "You can only join conversations with accepted skill swap requests",
          });
        }

        socket.join(conversationId);

        console.log(
          `User ${socket.userId} joined conversation ${conversationId}`,
        );

        socket.emit("conversationJoined", {
          conversationId,
        });
      } catch (error) {
        console.error(
          "Join conversation error:",
          error,
        );

        socket.emit("chatError", {
          message: "Failed to join conversation",
        });
      }
    },
  );

  // ================================
  // SEND MESSAGE
  // ================================

  socket.on(
    "sendMessage",
    async ({ conversationId, text }) => {
      try {
        // ================================
        // VALIDATION
        // ================================

        if (!conversationId) {
          return socket.emit("chatError", {
            message: "Conversation ID is required",
          });
        }

        if (!text || !text.trim()) {
          return socket.emit("chatError", {
            message: "Message cannot be empty",
          });
        }

        const cleanText = text.trim();

        // ================================
        // FIND CONVERSATION
        // ================================

        const conversation =
          await Conversation.findById(
            conversationId,
          );

        if (!conversation) {
          return socket.emit("chatError", {
            message: "Conversation not found",
          });
        }

        // ================================
        // CHECK PARTICIPANT
        // ================================

        const isParticipant =
          conversation.participants.some(
            (participant) =>
              participant.toString() ===
              socket.userId,
          );

        if (!isParticipant) {
          return socket.emit("chatError", {
            message:
              "You are not a participant in this conversation",
          });
        }

        // ================================
        // FIND OTHER PARTICIPANT
        // ================================

        const otherParticipant =
          conversation.participants.find(
            (participant) =>
              participant.toString() !==
              socket.userId,
          );

        if (!otherParticipant) {
          return socket.emit("chatError", {
            message:
              "Conversation participant could not be found",
          });
        }

        // ================================
        // CHECK ACCEPTED REQUEST
        // ================================

        const acceptedRequest =
          await Request.findOne({
            $or: [
              {
                sender: socket.userId,
                receiver: otherParticipant,
              },
              {
                sender: otherParticipant,
                receiver: socket.userId,
              },
            ],
            status: "accepted",
          });

        if (!acceptedRequest) {
          return socket.emit("chatError", {
            message:
              "You can only message users with an accepted skill swap request",
          });
        }

        // ================================
        // CREATE MESSAGE
        // ================================

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          text: cleanText,
        });

        // ================================
        // UPDATE CONVERSATION
        // ================================

        conversation.lastMessage = message._id;

        /*
         * Do not wait for notification here.
         *
         * Conversation update and message population
         * can happen together.
         */

        const conversationSavePromise =
          conversation.save();

        // ================================
        // POPULATE MESSAGE + PROFILE
        // ================================

        const populatedMessagePromise =
          Message.findById(message._id).populate(
            "sender",
            "name email role",
          );

        const senderProfilePromise =
          Profile.findOne({
            user: socket.userId,
          }).select("profileImage");

        /*
         * Run these independent database operations
         * together instead of waiting one-by-one.
         */
        const [
          populatedMessage,
          senderProfile,
        ] = await Promise.all([
          populatedMessagePromise,
          senderProfilePromise,
          conversationSavePromise,
        ]);

        if (!populatedMessage) {
          return socket.emit("chatError", {
            message:
              "Failed to prepare the message",
          });
        }

        // ================================
        // ADD PROFILE IMAGE
        // ================================

        const messageObject =
          populatedMessage.toObject();

        if (messageObject.sender) {
          messageObject.sender.profileImage =
            senderProfile?.profileImage || "";
        }

        // ================================
        // SEND MESSAGE IMMEDIATELY
        // ================================

        /*
         * IMPORTANT:
         *
         * The message is emitted BEFORE creating
         * the notification.
         *
         * This makes the chat feel much faster.
         */
        io.to(conversationId).emit(
          "receiveMessage",
          messageObject,
        );

        // ================================
        // CREATE NOTIFICATION
        // ================================

        /*
         * Notification is intentionally handled AFTER
         * the message has already been sent to the chat.
         *
         * If notification creation is slow or fails,
         * it will NOT delay the chat message.
         */
        Notification.create({
          recipient: otherParticipant,
          sender: socket.userId,
          type: "new_message",
          message: "You received a new message",
          relatedId: conversationId,
        }).catch((notificationError) => {
          console.error(
            "Notification creation error:",
            notificationError,
          );
        });
      } catch (error) {
        console.error(
          "Socket send message error:",
          error,
        );

        socket.emit("chatError", {
          message:
            error.message ||
            "Failed to send message",
        });
      }
    },
  );

  // ================================
  // DISCONNECT
  // ================================

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.userId,
    );
  });
});

// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap API is running",
  });
});

// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use((error, req, res, next) => {
  console.error(
    "Global server error:",
    error,
  );

  if (error instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`,
  );
});