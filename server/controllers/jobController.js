const Job = require("../models/Job");
const Company = require("../models/Company");

const listJobs = async (req, res) => {
  const { search = "", location, package: pkg, skills, status = "open", page = 1, limit = 10 } = req.query;
  const query = {
    ...(status !== "all" ? { status } : {}),
    ...(location ? { location: new RegExp(location, "i") } : {}),
    ...(pkg ? { package: { $gte: Number(pkg) } } : {}),
    ...(skills ? { requiredSkills: { $in: String(skills).split(",").map((skill) => new RegExp(skill.trim(), "i")) } } : {}),
    ...(search ? { $or: [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }] } : {}),
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Job.find(query).populate("company", "companyName location").sort("-createdAt").skip(skip).limit(Number(limit)),
    Job.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const createJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) return res.status(404).json({ message: "Company profile not found" });
  const job = await Job.create({ ...req.body, company: company._id });
  res.status(201).json(job);
};

const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate("company");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

const updateJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, company: company?._id };
  const job = await Job.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

const deleteJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, company: company?._id };
  const job = await Job.findOneAndDelete(query);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ message: "Job deleted" });
};

module.exports = { listJobs, createJob, getJob, updateJob, deleteJob };
