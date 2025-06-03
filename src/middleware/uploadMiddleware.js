const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { error } = require("console");

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedTypes = [".png", ".jpg", ".jpeg", ".gif"];

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only Images are allowed"), false);
    }
  },
});

module.exports = upload;
