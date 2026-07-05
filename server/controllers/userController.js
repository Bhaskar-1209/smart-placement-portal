const User = require("../models/User");

const getProfile = async (req, res) => {
  res.json(req.user);
};

const listUsers = async (req, res) => {
  const { role, search = "", page = 1, limit = 10 } = req.query;
  const query = {
    ...(role ? { role } : {}),
    ...(search ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] } : {}),
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(query).select("-password").sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

module.exports = { getProfile, listUsers, updateUser };
