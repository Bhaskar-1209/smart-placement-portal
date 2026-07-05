const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { listInterviews, scheduleInterview, updateInterview } = require("../controllers/interviewController");

const router = express.Router();

router.get("/", protect, listInterviews);
router.post("/", protect, authorize("company", "admin"), scheduleInterview);
router.patch("/:id", protect, authorize("company", "admin"), updateInterview);

module.exports = router;
