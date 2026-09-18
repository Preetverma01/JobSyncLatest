import Interview from "../models/Interview.js";

export const listStudentInterviews = async (req, res) => {
  try { return res.json({ success: true, interviews: await Interview.find({ studentId: req.user._id }).populate("jobId").sort({ scheduledAt: 1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export default { listStudentInterviews };
