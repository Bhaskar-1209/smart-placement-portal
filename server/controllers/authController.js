const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const { signAccessToken, signRefreshToken } = require("../utils/generateToken");

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: signAccessToken(user),
  refreshToken: signRefreshToken(user),
});

const register = async (req, res) => {
  const { name, email, password, role = "student", companyName, enrollmentNo, branch, batch } = req.body;
  if (role === "admin") return res.status(403).json({ message: "Admin accounts must be seeded by an admin" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password, role });

  if (role === "company") {
    await Company.create({ user: user._id, companyName: companyName || name });
  } else {
    await Student.create({ user: user._id, enrollmentNo, branch, batch });
  }

  await Notification.create({
    title: "New registration",
    message: `${name} registered as ${role}`,
    audience: "admin",
    type: "info",
  });
  await sendEmail({ to: email, subject: "Welcome to Smart Placement Portal", text: `Hi ${name}, your account is ready.` });

  res.status(201).json(formatUser(user));
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json(formatUser(user));
};

const adminLogin = async (req, res) => {
  req.body.role = "admin";
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  res.json(formatUser(user));
};

const refresh = async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token required" });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "dev-refresh-secret");
  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "Invalid refresh token" });
  res.json(formatUser(user));
};

const me = async (req, res) => {
  let profile = null;
  if (req.user.role === "student") profile = await Student.findOne({ user: req.user._id });
  if (req.user.role === "company") profile = await Company.findOne({ user: req.user._id });
  res.json({ user: req.user, profile });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) return res.json({ message: "If that email exists, reset instructions have been sent" });

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;
  await sendEmail({ to: user.email, subject: "Reset your password", text: `Reset your password here: ${resetUrl}` });
  res.json({ message: "If that email exists, reset instructions have been sent" });
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) return res.status(400).json({ message: "Reset token is invalid or expired" });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
};

module.exports = { register, login, adminLogin, refresh, me, forgotPassword, resetPassword };
