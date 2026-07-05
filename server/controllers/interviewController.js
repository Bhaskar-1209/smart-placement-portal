const Interview = require("../models/Interview");
const Application = require("../models/Application");
const sendEmail = require("../utils/sendEmail");

const listInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("company", "companyName")
    .populate("application")
    .sort("scheduledAt");
  res.json(interviews);
};

const scheduleInterview = async (req, res) => {
  const application = await Application.findById(req.body.application).populate({ path: "student", populate: { path: "user", select: "email name" } });
  if (!application) return res.status(404).json({ message: "Application not found" });
  const interview = await Interview.create({
    ...req.body,
    student: application.student._id,
    company: application.company,
  });
  application.status = "interview";
  await application.save();
  await sendEmail({
    to: application.student.user.email,
    subject: "Interview scheduled",
    text: `Your interview has been scheduled for ${new Date(req.body.scheduledAt).toLocaleString()}.`,
  });
  res.status(201).json(interview);
};

const updateInterview = async (req, res) => {
  const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  res.json(interview);
};

module.exports = { listInterviews, scheduleInterview, updateInterview };
