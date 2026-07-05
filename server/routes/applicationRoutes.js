const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { listApplications, applyJob, updateApplicationStatus } = require("../controllers/applicationController");

const router = express.Router();

router.get("/", protect, listApplications);
router.post("/jobs/:jobId/apply", protect, authorize("student"), applyJob);
router.patch("/:id", protect, authorize("company", "admin"), updateApplicationStatus);

module.exports = router;
