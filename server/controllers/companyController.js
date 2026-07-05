const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

const listCompanies = async (req, res) => {
  const { search = "", location, page = 1, limit = 10 } = req.query;
  const query = {
    ...(location ? { location: new RegExp(location, "i") } : {}),
    ...(search
      ? { $or: [{ companyName: new RegExp(search, "i") }, { industry: new RegExp(search, "i") }, { location: new RegExp(search, "i") }] }
      : {}),
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Company.find(query).populate("user", "name email").sort("-createdAt").skip(skip).limit(Number(limit)),
    Company.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const getCompany = async (req, res) => {
  const company = await Company.findById(req.params.id).populate("user", "name email");
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.json(company);
};

const myProfile = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id }).populate("user", "name email");
  if (!company) return res.status(404).json({ message: "Company profile not found" });
  res.json(company);
};

const updateMyProfile = async (req, res) => {
  const company = await Company.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!company) return res.status(404).json({ message: "Company profile not found" });
  res.json(company);
};

const companyDashboard = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) return res.status(404).json({ message: "Company profile not found" });
  const [jobs, applications] = await Promise.all([
    Job.find({ company: company._id }).sort("-createdAt"),
    Application.find({ company: company._id }).populate("student").populate("job", "title"),
  ]);
  res.json({
    jobs,
    applications,
    stats: {
      jobs: jobs.length,
      openJobs: jobs.filter((job) => job.status === "open").length,
      applicants: applications.length,
      shortlisted: applications.filter((item) => item.status === "shortlisted").length,
    },
  });
};

module.exports = { listCompanies, getCompany, myProfile, updateMyProfile, companyDashboard };
