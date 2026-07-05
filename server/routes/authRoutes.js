const express = require("express");
const { body } = require("express-validator");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { register, login, adminLogin, refresh, me, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 }), body("role").optional().isIn(["student", "company"])],
  validate,
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, login);
router.post("/admin/login", [body("email").isEmail(), body("password").notEmpty()], validate, adminLogin);
router.post("/refresh", refresh);
router.get("/me", protect, me);
router.post("/forgot-password", [body("email").isEmail()], validate, forgotPassword);
router.post("/reset-password", [body("token").notEmpty(), body("password").isLength({ min: 6 })], validate, resetPassword);

module.exports = router;
