const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

const exploreProfiles = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const {
      teach,
      learn,
      location,
      experience,
    } = req.query;

    const query = {
      user: { $ne: currentUserId },
    };

    // Filter by teaching skill
    if (teach) {
      const skill = await Skill.findOne({
        name: {
          $regex: `^${teach}$`,
          $options: "i",
        },
      });

      if (!skill) {
        return res.status(200).json({
          success: true,
          count: 0,
          profiles: [],
        });
      }

      query.skillsToTeach = skill._id;
    }

    // Filter by learning skill
    if (learn) {
      const skill = await Skill.findOne({
        name: {
          $regex: `^${learn}$`,
          $options: "i",
        },
      });

      if (!skill) {
        return res.status(200).json({
          success: true,
          count: 0,
          profiles: [],
        });
      }

      query.skillsToLearn = skill._id;
    }

    // Filter by location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by experience
    if (experience) {
      query.experience = {
        $regex: experience,
        $options: "i",
      };
    }

    const profiles = await Profile.find(query)
      .populate("user", "name email role")
      .populate(
        "skillsToTeach",
        "name description category"
      )
      .populate(
        "skillsToLearn",
        "name description category"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Explore profiles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load explore profiles",
    });
  }
};

module.exports = {
  exploreProfiles,
};