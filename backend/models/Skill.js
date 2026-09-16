const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);