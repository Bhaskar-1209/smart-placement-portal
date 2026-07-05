const Student = require("../models/Student");
const Application = require("../models/Application");

const buildStudentQuery = ({ search, branch, batch, cgpa, skills }) => ({
  ...(branch ? { branch } : {}),
  ...(batch ? { batch } : {}),
  ...(cgpa ? { cgpa: { $gte: Number(cgpa) } } : {}),
  ...(skills ? { skills: { $in: String(skills).split(",").map((skill) => new RegExp(skill.trim(), "i")) } } : {}),
  ...(search ? { $or: [{ enrollmentNo: new RegExp(search, "i") }, { branch: new RegExp(search, "i") }] } : {}),
});

const listStudents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const query = buildStudentQuery(req.query);
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Student.find(query).populate("user", "name email").sort("-createdAt").skip(skip).limit(Number(limit)),
    Student.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate("user", "name email");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

const myProfile = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate("user", "name email");
  if (!student) return res.status(404).json({ message: "Student profile not found" });
  res.json(student);
};

const updateMyProfile = async (req, res) => {
  const student = await Student.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  }).populate("user", "name email");
  if (!student) return res.status(404).json({ message: "Student profile not found" });
  res.json(student);
};

const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume PDF is required" });
  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    {
      resume: {
        fileName: req.file.filename,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedAt: new Date(),
      },
    },
    { new: true }
  );
  res.json(student);
};

const deleteResume = async (req, res) => {
  const student = await Student.findOneAndUpdate({ user: req.user._id }, { $unset: { resume: "" } }, { new: true });
  res.json(student);
};

const studentDashboard = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) return res.status(404).json({ message: "Student profile not found" });
  const applications = await Application.find({ student: student._id }).populate("job", "title package").populate("company", "companyName");
  res.json({
    profileCompletion: student.profileCompletion,
    applications,
    stats: {
      applied: applications.length,
      shortlisted: applications.filter((item) => item.status === "shortlisted").length,
      interviews: applications.filter((item) => item.status === "interview").length,
      offers: applications.filter((item) => item.status === "offered").length,
    },
  });
};

module.exports = { listStudents, getStudent, myProfile, updateMyProfile, uploadResume, deleteResume, studentDashboard };
