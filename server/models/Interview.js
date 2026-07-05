const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ["online", "offline"], default: "online" },
    meetingLink: { type: String, trim: true, default: "" },
    venue: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    feedback: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
