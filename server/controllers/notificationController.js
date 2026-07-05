const Notification = require("../models/Notification");

const listNotifications = async (req, res) => {
  const items = await Notification.find({
    $or: [{ audience: "all" }, { audience: req.user.role }, { user: req.user._id }],
  }).sort("-createdAt");
  res.json(items);
};

const createNotification = async (req, res) => {
  const item = await Notification.create(req.body);
  res.status(201).json(item);
};

const markRead = async (req, res) => {
  const item = await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user._id } }, { new: true });
  if (!item) return res.status(404).json({ message: "Notification not found" });
  res.json(item);
};

module.exports = { listNotifications, createNotification, markRead };
