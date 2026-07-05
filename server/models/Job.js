const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: { type: String, enum: ["Full Time", "Internship", "Contract"], default: "Full Time" },
    package: { type: Number, required: true, min: 0 },
    requiredSkills: [{ type: String, trim: true }],
    eligibility: {
      minCgpa: { type: Number, default: 0 },
      branches: [{ type: String, trim: true }],
      batches: [{ type: String, trim: true }],
    },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Job", jobSchema);
