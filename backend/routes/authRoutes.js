const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

module.exports = router;