const Profile = require("../models/Profile");

const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Get current user's profile
    const currentProfile = await Profile.findOne({
      user: currentUserId,
    });

    if (!currentProfile) {
      return res.status(404).json({
        success: false,
        message: "Please create your profile first",
      });
    }

    const myTeachSkills = currentProfile.skillsToTeach || [];
    const myLearnSkills = currentProfile.skillsToLearn || [];

    // User needs to have at least one skill
    if (
      myTeachSkills.length === 0 &&
      myLearnSkills.length === 0
    ) {
      return res.status(200).json({
        success: true,
        count: 0,
        matches: [],
        message: "Add skills to find matches",
      });
    }

    // Find potential matches
    const profiles = await Profile.find({
      user: { $ne: currentUserId },

      $or: [
        {
          skillsToTeach: {
            $in: myLearnSkills,
          },
        },
        {
          skillsToLearn: {
            $in: myTeachSkills,
          },
        },
      ],
    })
      .populate("user", "name email role")
      .populate(
        "skillsToTeach",
        "name description category"
      )
      .populate(
        "skillsToLearn",
        "name description category"
      );

    const matches = profiles
      .map((profile) => {
        // --------------------------------
        // Skills they can teach me
        // --------------------------------

        const skillsTheyCanTeachMe =
          profile.skillsToTeach.filter((skill) =>
            myLearnSkills.some(
              (mySkill) =>
                mySkill.toString() ===
                skill._id.toString()
            )
          );

        // --------------------------------
        // Skills I can teach them
        // --------------------------------

        const skillsICanTeachThem =
          profile.skillsToLearn.filter((skill) =>
            myTeachSkills.some(
              (mySkill) =>
                mySkill.toString() ===
                skill._id.toString()
            )
          );

        // --------------------------------
        // Count both directions
        // --------------------------------

        const teachMeCount =
          skillsTheyCanTeachMe.length;

        const teachThemCount =
          skillsICanTeachThem.length;

        // --------------------------------
        // Calculate score
        // --------------------------------

        const totalMySkills =
          myTeachSkills.length +
          myLearnSkills.length;

        const matchedSkills =
          teachMeCount +
          teachThemCount;

        let matchScore = 0;

        if (totalMySkills > 0) {
          matchScore = Math.round(
            (matchedSkills / totalMySkills) * 100
          );
        }

        // --------------------------------
        // Two-way exchange bonus
        // --------------------------------

        const isTwoWayMatch =
          teachMeCount > 0 &&
          teachThemCount > 0;

        if (isTwoWayMatch) {
          matchScore += 20;
        }

        // Maximum score = 100
        matchScore = Math.min(matchScore, 100);

        return {
          profile,

          matchScore,

          isTwoWayMatch,

          skillsTheyCanTeachMe,

          skillsICanTeachThem,
        };
      })
      .filter(
        (match) =>
          match.skillsTheyCanTeachMe.length > 0 ||
          match.skillsICanTeachThem.length > 0
      );

    // --------------------------------
    // Best matches first
    // --------------------------------

    matches.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Get matches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find matches",
    });
  }
};

module.exports = {
  getMatches,
};