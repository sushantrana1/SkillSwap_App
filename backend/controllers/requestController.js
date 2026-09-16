const Request = require("../models/Request");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Notification = require("../models/Notification");

// ---------------------------------------
// Helper: Add profile image to a user
// ---------------------------------------

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

// ---------------------------------------
// Helper: Populate request users + images
// ---------------------------------------

const populateRequestUsers = async (requests) => {
  const populatedRequests = [];

  for (const request of requests) {
    const requestObject = request.toObject();

    requestObject.sender = await attachProfileImage(
      request.sender,
    );

    requestObject.receiver = await attachProfileImage(
      request.receiver,
    );

    populatedRequests.push(requestObject);
  }

  return populatedRequests;
};

// ---------------------------------------
// Send Request
// ---------------------------------------

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiver, message } = req.body;

    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    if (senderId === receiver) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const existingRequest = await Request.findOne({
      $or: [
        {
          sender: senderId,
          receiver: receiver,
        },
        {
          sender: receiver,
          receiver: senderId,
        },
      ],
      status: {
        $in: ["pending", "accepted"],
      },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "An active request already exists between these users",
      });
    }

    const request = await Request.create({
      sender: senderId,
      receiver: receiver,
      message: message || "",
    });

    await Notification.create({
      recipient: receiver,
      sender: senderId,
      type: "request_received",
      message: "You received a new skill swap request",
      relatedId: request._id,
    });

    await request.populate([
      {
        path: "sender",
        select: "name email role",
      },
      {
        path: "receiver",
        select: "name email role",
      },
    ]);

    const requestObject = await populateRequestUsers([
      request,
    ]);

    return res.status(201).json({
      success: true,
      message: "Skill swap request sent successfully",
      request: requestObject[0],
    });
  } catch (error) {
    console.error("Send request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send request",
    });
  }
};

// ---------------------------------------
// Get Received Requests
// ---------------------------------------

const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await Request.find({
      receiver: userId,
    })
      .populate(
        "sender",
        "name email role",
      )
      .populate(
        "receiver",
        "name email role",
      )
      .sort({ createdAt: -1 });

    const populatedRequests =
      await populateRequestUsers(requests);

    return res.status(200).json({
      success: true,
      count: populatedRequests.length,
      requests: populatedRequests,
    });
  } catch (error) {
    console.error(
      "Get received requests error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load received requests",
    });
  }
};

// ---------------------------------------
// Get Sent Requests
// ---------------------------------------

const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await Request.find({
      sender: userId,
    })
      .populate(
        "sender",
        "name email role",
      )
      .populate(
        "receiver",
        "name email role",
      )
      .sort({ createdAt: -1 });

    const populatedRequests =
      await populateRequestUsers(requests);

    return res.status(200).json({
      success: true,
      count: populatedRequests.length,
      requests: populatedRequests,
    });
  } catch (error) {
    console.error(
      "Get sent requests error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load sent requests",
    });
  }
};

// ---------------------------------------
// Accept Request
// ---------------------------------------

const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to accept this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = "accepted";

    await request.save();

    await Notification.create({
      recipient: request.sender,
      sender: request.receiver,
      type: "request_accepted",
      message: "Your skill swap request was accepted",
      relatedId: request._id,
    });

    await request.populate([
      {
        path: "sender",
        select: "name email role",
      },
      {
        path: "receiver",
        select: "name email role",
      },
    ]);

    const requestObject = await populateRequestUsers([
      request,
    ]);

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request: requestObject[0],
    });
  } catch (error) {
    console.error(
      "Accept request error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to accept request",
    });
  }
};

// ---------------------------------------
// Reject Request
// ---------------------------------------

const rejectRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to reject this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = "rejected";

    await request.save();

    await Notification.create({
      recipient: request.sender,
      sender: request.receiver,
      type: "request_rejected",
      message: "Your skill swap request was rejected",
      relatedId: request._id,
    });

    await request.populate([
      {
        path: "sender",
        select: "name email role",
      },
      {
        path: "receiver",
        select: "name email role",
      },
    ]);

    const requestObject = await populateRequestUsers([
      request,
    ]);

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      request: requestObject[0],
    });
  } catch (error) {
    console.error(
      "Reject request error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject request",
    });
  }
};

module.exports = {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
};

