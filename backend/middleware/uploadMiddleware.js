const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    console.log("========== FILE INFO ==========");
    console.log("File name:", file.originalname);
    console.log("File type:", file.mimetype);
    console.log("===============================");

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"), false);
    }
  },
});

module.exports = upload;