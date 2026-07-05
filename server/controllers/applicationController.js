const Application = require("../models/Application");
const Job = require("../models/Job");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Notification = require("../models/Notification");

const listApplications = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { ...(status ? { status } : {}) };

  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id });
    query.student = student?._id;
  }
  if (req.user.role === "company") {
    const company = await Company.findOne({ user: req.user._id });
    query.company = company?._id;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Application.find(query)
      .populate({ path: "student", populate: { path: "user", select: "name email" } })
      .populate("job", "title package location")
      .populate("company", "companyName")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Application.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const applyJob = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  const job = await Job.findById(req.params.jobId);
  if (!student || !job) return res.status(404).json({ message: "Student or job not found" });
  if (job.status !== "open" || new Date(job.deadline) < new Date()) return res.status(400).json({ message: "Job is not open for applications" });
  if (student.cgpa < job.eligibility.minCgpa) return res.status(400).json({ message: "You do not meet the CGPA eligibility" });

  const application = await Application.create({
    student: student._id,
    job: job._id,
    company: job.company,
    coverLetter: req.body.coverLetter,
  });
  await Notification.create({ title: "Application submitted", message: `Application received for ${job.title}`, user: req.user._id, audience: "student" });
  res.status(201).json(application);
};

const updateApplicationStatus = async (req, res) => {
  const company = req.user.role === "company" ? await Company.findOne({ user: req.user._id }) : null;
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, company: company?._id };
  const application = await Application.findOneAndUpdate(query, req.body, { new: true, runValidators: true }).populate("student");
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.json(application);
};

module.exports = { listApplications, applyJob, updateApplicationStatus };
