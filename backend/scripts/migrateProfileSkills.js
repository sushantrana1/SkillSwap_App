require("dotenv").config();
const mongoose = require("mongoose");

const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

const migrateProfileSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const profiles = await Profile.find();

    for (const profile of profiles) {
      const teachSkills = profile.skillsToTeach || [];
      const learnSkills = profile.skillsToLearn || [];

      const teachSkillIds = [];
      const learnSkillIds = [];

      for (const skillName of teachSkills) {
        const skill = await Skill.findOne({
          name: skillName,
        });

        if (skill) {
          teachSkillIds.push(skill._id);
        } else {
          console.log(`Skill not found: ${skillName}`);
        }
      }

      for (const skillName of learnSkills) {
        const skill = await Skill.findOne({
          name: skillName,
        });

        if (skill) {
          learnSkillIds.push(skill._id);
        } else {
          console.log(`Skill not found: ${skillName}`);
        }
      }

      profile.skillsToTeach = teachSkillIds;
      profile.skillsToLearn = learnSkillIds;

      await profile.save();

      console.log(`Migrated profile: ${profile._id}`);
    }

    console.log("Skill migration completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateProfileSkills();