const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["scheduled", "ongoing", "completed", "cancelled"], default: "scheduled" },
    attendance: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        present: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);
