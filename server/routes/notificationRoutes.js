const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { listNotifications, createNotification, markRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, listNotifications);
router.post("/", protect, authorize("admin"), createNotification);
router.patch("/:id/read", protect, markRead);

module.exports = router;
