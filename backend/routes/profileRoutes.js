const express = require("express");
const router = express.Router();

const {
  createOrUpdateProfile,
  getMyProfile,
  getPublicProfile,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Create / Update my profile
router.post("/", authMiddleware, upload.single("profileImage"), createOrUpdateProfile,);

// Get my profile
router.get("/me", authMiddleware, getMyProfile);

// Get another user's public profile
router.get("/:userId", authMiddleware, getPublicProfile);

module.exports = router;
