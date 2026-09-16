const Skill = require("../models/Skill");

// Create a new skill
const createSkill = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }

    const existingSkill = await Skill.findOne({
      name: name.trim(),
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      description: description || "",
      category: category.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};


// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Get skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get skills",
    });
  }
};


// Get skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Get skill by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get skill",
    });
  }
};

// Find skills by their names
const getSkillsByNames = async (req, res) => {
  try {
    const { names } = req.body;

    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skill names are required",
      });
    }

    const skills = await Skill.find({
      name: {
        $in: names,
      },
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Get skills by names error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find skills",
    });
  }
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  getSkillsByNames,
};