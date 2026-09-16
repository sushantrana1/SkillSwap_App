const express = require("express");

const {
  createSkill,
  getAllSkills,
  getSkillById,
  getSkillsByNames,
} = require("../controllers/skillController");

const router = express.Router();

// Create skill
router.post("/", createSkill);

// Find skills by names
router.post("/by-names", getSkillsByNames);

// Get all skills
router.get("/", getAllSkills);

// Get skill by ID
router.get("/:id", getSkillById);

module.exports = router;