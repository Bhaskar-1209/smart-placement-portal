const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../utils/fileUpload");
const {
  listStudents,
  getStudent,
  myProfile,
  updateMyProfile,
  uploadResume,
  deleteResume,
  studentDashboard,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/dashboard", protect, authorize("student"), studentDashboard);
router.get("/me", protect, authorize("student"), myProfile);
router.patch("/me", protect, authorize("student"), updateMyProfile);
router.post("/resume", protect, authorize("student"), upload.single("resume"), uploadResume);
router.delete("/resume", protect, authorize("student"), deleteResume);
router.get("/", protect, authorize("admin", "company"), listStudents);
router.get("/:id", protect, authorize("admin", "company"), getStudent);

module.exports = router;
