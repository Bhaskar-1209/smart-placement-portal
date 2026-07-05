const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    website: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    contactPerson: { type: String, trim: true, default: "" },
    contactPhone: { type: String, trim: true, default: "" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
