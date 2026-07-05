const express = require("express");
const { body } = require("express-validator");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { listJobs, createJob, getJob, updateJob, deleteJob } = require("../controllers/jobController");

const router = express.Router();

router.get("/", protect, listJobs);
router.post(
  "/",
  protect,
  authorize("company"),
  [body("title").notEmpty(), body("description").notEmpty(), body("location").notEmpty(), body("package").isNumeric(), body("deadline").isISO8601()],
  validate,
  createJob
);
router.get("/:id", protect, getJob);
router.patch("/:id", protect, authorize("company", "admin"), updateJob);
router.delete("/:id", protect, authorize("company", "admin"), deleteJob);

module.exports = router;
