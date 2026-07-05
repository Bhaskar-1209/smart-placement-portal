const PlacementDrive = require("../models/PlacementDrive");

const listDrives = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { ...(status ? { status } : {}) };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    PlacementDrive.find(query).populate("company", "companyName").populate("jobs", "title").sort("-startDate").skip(skip).limit(Number(limit)),
    PlacementDrive.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const createDrive = async (req, res) => {
  const drive = await PlacementDrive.create(req.body);
  res.status(201).json(drive);
};

const getDrive = async (req, res) => {
  const drive = await PlacementDrive.findById(req.params.id).populate("company jobs assignedStudents");
  if (!drive) return res.status(404).json({ message: "Placement drive not found" });
  res.json(drive);
};

const updateDrive = async (req, res) => {
  const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!drive) return res.status(404).json({ message: "Placement drive not found" });
  res.json(drive);
};

const deleteDrive = async (req, res) => {
  const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
  if (!drive) return res.status(404).json({ message: "Placement drive not found" });
  res.json({ message: "Placement drive deleted" });
};

module.exports = { listDrives, createDrive, getDrive, updateDrive, deleteDrive };
