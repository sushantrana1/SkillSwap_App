const express = require("express");

const { exploreProfiles } = require("../controllers/exploreController");

const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/", verifyUser, exploreProfiles);

module.exports = router;