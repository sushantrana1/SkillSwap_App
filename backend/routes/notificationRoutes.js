const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

// Get all notifications
router.get("/", verifyUser, getNotifications);

// Get unread notification count
router.get("/unread-count", verifyUser, getUnreadCount);

// Mark one notification as read
router.patch("/:id/read", verifyUser, markAsRead);

// Mark all notifications as read
router.patch("/read-all", verifyUser, markAllAsRead);

module.exports = router;
