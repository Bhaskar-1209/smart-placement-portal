const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const pdfOnly = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") return cb(new Error("Only PDF files are allowed"));
  cb(null, true);
};

module.exports = multer({ storage, fileFilter: pdfOnly, limits: { fileSize: 5 * 1024 * 1024 } });
