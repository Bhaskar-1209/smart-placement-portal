const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    coverLetter: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "interview", "offered", "accepted"],
      default: "applied",
    },
    offerLetterStatus: {
      type: String,
      enum: ["not-issued", "issued", "accepted", "declined"],
      default: "not-issued",
    },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
