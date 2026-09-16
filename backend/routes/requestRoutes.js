const express = require("express");

const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");

const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.post("/", verifyUser, sendRequest);
router.get("/received", verifyUser, getReceivedRequests);
router.get("/sent", verifyUser, getSentRequests);
router.patch("/:id/accept", verifyUser, acceptRequest);
router.patch("/:id/reject", verifyUser, rejectRequest);

module.exports = router;
