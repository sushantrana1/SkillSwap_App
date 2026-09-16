const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Skills the user can teach
    skillsToTeach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    // Skills the user wants to learn
    skillsToLearn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    availability: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);