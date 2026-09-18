import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const listNotifications = async (req, res) => {
  try { return res.json({ success: true, notifications: await Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const createNotification = async (req, res) => {
  try {
    const recipientIds = req.body.recipientIds?.length ? req.body.recipientIds : (await User.find({ role: "student" }).select("_id")).map((user) => user._id);
    const notifications = await Notification.insertMany(recipientIds.map((recipientId) => ({ recipientId, title: req.body.title, message: req.body.message, type: req.body.type || "announcement", createdBy: req.user._id })));
    return res.status(201).json({ success: true, notifications });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const markRead = async (req, res) => {
  try { const notification = await Notification.findOneAndUpdate({ _id: req.params.notificationId, recipientId: req.user._id }, { read: true }, { new: true }); return res.json({ success: true, notification }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export default { listNotifications, createNotification, markRead };
