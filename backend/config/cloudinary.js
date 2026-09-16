require("dotenv").config();

const { v2: cloudinary } = require("cloudinary");

console.log("Cloudinary config:");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "API secret exists:",
  !!process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;