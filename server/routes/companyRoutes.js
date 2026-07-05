const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { listCompanies, getCompany, myProfile, updateMyProfile, companyDashboard } = require("../controllers/companyController");

const router = express.Router();

router.get("/dashboard", protect, authorize("company"), companyDashboard);
router.get("/me", protect, authorize("company"), myProfile);
router.patch("/me", protect, authorize("company"), updateMyProfile);
router.get("/", protect, authorize("admin", "student"), listCompanies);
router.get("/:id", protect, getCompany);

module.exports = router;
