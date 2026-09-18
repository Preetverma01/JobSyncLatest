import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getAdminDashboard = async (_, res) => {
  try {
    const [students, recruiters, officers, companies, jobs, applications] = await Promise.all([
      User.countDocuments({ role: "student" }), User.countDocuments({ role: "recruiter" }), User.countDocuments({ role: "placement_officer" }), Company.countDocuments(), Job.countDocuments(), Application.countDocuments(),
    ]);
    return res.json({ success: true, metrics: { students, recruiters, placementOfficers: officers, companies, jobs, applications } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const listUsers = async (req, res) => {
  try { const query = req.query.role ? { role: req.query.role } : {}; return res.json({ success: true, users: await User.find(query).select("-password").sort({ createdAt: -1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const updateUserRole = async (req, res) => {
  try { const user = await User.findByIdAndUpdate(req.params.userId, { role: req.body.role }, { new: true, runValidators: true }).select("-password"); return res.json({ success: true, user }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const listCompanies = async (_, res) => {
  try { return res.json({ success: true, companies: await Company.find().sort({ createdAt: -1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export default { getAdminDashboard, listUsers, updateUserRole, listCompanies };
