const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    audience: { type: String, enum: ["admin", "student", "company", "all"], default: "all" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: { type: String, enum: ["info", "success", "warning", "danger"], default: "info" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
