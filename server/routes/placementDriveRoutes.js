const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { listDrives, createDrive, getDrive, updateDrive, deleteDrive } = require("../controllers/placementDriveController");

const router = express.Router();

router.get("/", protect, listDrives);
router.post("/", protect, authorize("admin"), createDrive);
router.get("/:id", protect, getDrive);
router.patch("/:id", protect, authorize("admin"), updateDrive);
router.delete("/:id", protect, authorize("admin"), deleteDrive);

module.exports = router;
