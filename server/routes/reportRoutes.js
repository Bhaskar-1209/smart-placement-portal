const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { dashboardStats, exportCsv, exportPdf } = require("../controllers/reportController");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), dashboardStats);
router.get("/export/excel", protect, authorize("admin"), exportCsv);
router.get("/export/pdf", protect, authorize("admin"), exportPdf);

module.exports = router;
