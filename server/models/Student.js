const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    enrollmentNo: { type: String, trim: true, unique: true, sparse: true },
    branch: { type: String, trim: true, default: "" },
    batch: { type: String, trim: true, default: "" },
    semester: { type: Number, min: 1, max: 12 },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    education: [
      {
        degree: String,
        institute: String,
        year: String,
        score: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    achievements: [{ type: String, trim: true }],
    certificates: [
      {
        name: String,
        issuer: String,
        link: String,
      },
    ],
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date,
    },
  },
  { timestamps: true }
);

studentSchema.virtual("profileCompletion").get(function profileCompletion() {
  const checks = [
    this.enrollmentNo,
    this.branch,
    this.batch,
    this.cgpa,
    this.phone,
    this.skills?.length,
    this.education?.length,
    this.resume?.fileUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
});

studentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);
