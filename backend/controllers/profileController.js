const Profile = require("../models/Profile");
const Skill = require("../models/Skill");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "skillswap/profiles",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(fileBuffer);
  });
};


// Create or Update Profile
const createOrUpdateProfile = async (req, res) => {
  try {
    console.log("========== PROFILE REQUEST ==========");

    console.log("User:", req.user);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const userId = req.user.userId;

    const {
      bio,
      location,
      skillsToTeach,
      skillsToLearn,
      experience,
      availability,
    } = req.body;


    // ---------------------------------------
    // Convert skill names to Skill ObjectIds
    // ---------------------------------------

    const teachSkillNames = skillsToTeach
      ? Array.isArray(skillsToTeach)
        ? skillsToTeach
        : [skillsToTeach]
      : [];

    const learnSkillNames = skillsToLearn
      ? Array.isArray(skillsToLearn)
        ? skillsToLearn
        : [skillsToLearn]
      : [];


    const teachSkills = await Skill.find({
      name: {
        $in: teachSkillNames,
      },
    }).select("_id");


    const learnSkills = await Skill.find({
      name: {
        $in: learnSkillNames,
      },
    }).select("_id");


    const teachSkillIds = teachSkills.map(
      (skill) => skill._id
    );

    const learnSkillIds = learnSkills.map(
      (skill) => skill._id
    );


    // ---------------------------------------
    // Find existing profile
    // ---------------------------------------

    let profile = await Profile.findOne({
      user: userId,
    });

    console.log(
      "Existing profile:",
      profile ? "YES" : "NO"
    );


    let profileImage = profile?.profileImage || "";


    // ---------------------------------------
    // Upload profile image
    // ---------------------------------------

    if (req.file) {
      console.log("Image received by Multer");

      console.log(
        "Image name:",
        req.file.originalname
      );

      console.log(
        "Image type:",
        req.file.mimetype
      );

      console.log(
        "Image size:",
        req.file.size
      );

      console.log(
        "Uploading image to Cloudinary..."
      );


      const result = await uploadToCloudinary(
        req.file.buffer
      );


      console.log(
        "Cloudinary upload successful"
      );

      console.log(
        "Cloudinary URL:",
        result.secure_url
      );


      profileImage = result.secure_url;

    } else {
      console.log("NO IMAGE RECEIVED");
    }


    // ---------------------------------------
    // Update existing profile
    // ---------------------------------------

    if (profile) {

      profile.bio =
        bio ?? profile.bio;

      profile.location =
        location ?? profile.location;

      profile.profileImage =
        profileImage;


      if (skillsToTeach !== undefined) {
        profile.skillsToTeach =
          teachSkillIds;
      }


      if (skillsToLearn !== undefined) {
        profile.skillsToLearn =
          learnSkillIds;
      }


      profile.experience =
        experience ?? profile.experience;

      profile.availability =
        availability ?? profile.availability;


      await profile.save();


      console.log("Profile updated");


      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile,
      });
    }


    // ---------------------------------------
    // Create new profile
    // ---------------------------------------

    profile = await Profile.create({

      user: userId,

      bio: bio || "",

      location: location || "",

      profileImage,

      skillsToTeach:
        teachSkillIds,

      skillsToLearn:
        learnSkillIds,

      experience:
        experience || "",

      availability:
        availability || "",
    });


    console.log("Profile created");


    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });


  } catch (error) {

    console.error(
      "========== PROFILE ERROR =========="
    );

    console.error(error);

    console.error(
      "==================================="
    );


    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message,
    });
  }
};


// ---------------------------------------
// Get My Profile
// ---------------------------------------

const getMyProfile = async (req, res) => {
  try {

    const userId = req.user.userId;


    const profile = await Profile.findOne({
      user: userId,
    })
      .populate(
        "user",
        "name email role"
      )
      .populate(
        "skillsToTeach",
        "name description category"
      )
      .populate(
        "skillsToLearn",
        "name description category"
      );


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }


    return res.status(200).json({
      success: true,
      profile,
    });


  } catch (error) {

    console.error(
      "Get profile error:",
      error.message
    );


    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ---------------------------------------
// Get Public Profile
// ---------------------------------------

const getPublicProfile = async (req, res) => {
  try {

    const { userId } = req.params;


    const profile = await Profile.findOne({
      user: userId,
    })
      .populate(
        "user",
        "name email role"
      )
      .populate(
        "skillsToTeach",
        "name description category"
      )
      .populate(
        "skillsToLearn",
        "name description category"
      );


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }


    return res.status(200).json({
      success: true,
      profile,
    });


  } catch (error) {

    console.error(
      "Get public profile error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getPublicProfile,
};