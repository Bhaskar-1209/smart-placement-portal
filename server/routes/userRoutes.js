const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { getProfile, listUsers, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/", protect, authorize("admin"), listUsers);
router.patch("/:id", protect, authorize("admin"), updateUser);

module.exports = router;
