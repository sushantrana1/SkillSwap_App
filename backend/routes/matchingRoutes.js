const express = require("express");

const {
  getMatches,
} = require("../controllers/matchingController");

const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/", verifyUser, getMatches);

module.exports = router;