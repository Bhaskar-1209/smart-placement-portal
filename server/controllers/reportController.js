const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const PlacementDrive = require("../models/PlacementDrive");
const Interview = require("../models/Interview");

const dashboardStats = async (req, res) => {
  const [students, companies, jobs, applications, drives, interviews] = await Promise.all([
    Student.countDocuments(),
    Company.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    PlacementDrive.countDocuments(),
    Interview.countDocuments(),
  ]);
  const byStatus = await Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  res.json({ students, companies, jobs, applications, drives, interviews, byStatus });
};

const exportCsv = async (req, res) => {
  const applications = await Application.find().populate({ path: "student", populate: { path: "user", select: "name email" } }).populate("job", "title package").populate("company", "companyName");
  const rows = [["Student", "Email", "Company", "Job", "Package", "Status"], ...applications.map((item) => [
    item.student?.user?.name || "",
    item.student?.user?.email || "",
    item.company?.companyName || "",
    item.job?.title || "",
    item.job?.package || "",
    item.status,
  ])];
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=placement-report.csv");
  res.send(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n"));
};

const exportPdf = async (req, res) => {
  const stats = await Promise.all([Student.countDocuments(), Company.countDocuments(), Job.countDocuments(), Application.countDocuments()]);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=placement-summary.pdf");
  res.send(Buffer.from(`Smart Placement Portal Report\nStudents: ${stats[0]}\nCompanies: ${stats[1]}\nJobs: ${stats[2]}\nApplications: ${stats[3]}`));
};

module.exports = { dashboardStats, exportCsv, exportPdf };
