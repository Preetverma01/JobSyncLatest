import Job from "../models/Job.js";

export const listOpenJobs = async (_, res) => {
  try { return res.json({ success: true, jobs: await Job.find({ status: "open", applicationDeadline: { $gte: new Date() } }).populate("companyId").sort({ createdAt: -1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export default { listOpenJobs };
