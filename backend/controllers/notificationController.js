const Notification = require("../models/Notification");

// Get my notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({
      recipient: userId,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount =
      await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get unread count error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const notification =
      await Notification.findOne({
        _id: notificationId,
        recipient: userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark all notifications as read",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};