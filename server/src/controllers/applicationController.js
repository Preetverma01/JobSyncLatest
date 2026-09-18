import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { matchCandidateToJob } from "../services/matchingService.js";

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, status: "open" });
    if (!job) return res.status(404).json({ success: false, message: "Job is no longer accepting applications." });
    const match = await matchCandidateToJob(req.user, job);
    const application = await Application.create({ jobId: job._id, studentId: req.user._id, matchScore: match.matchScore, matchReasons: match.reasons, missingSkills: match.missingSkills });
    return res.status(201).json({ success: true, application });
  } catch (error) { return res.status(400).json({ success: false, message: error.code === 11000 ? "You already applied to this job." : error.message }); }
};

export const listMyApplications = async (req, res) => {
  try { return res.json({ success: true, applications: await Application.find({ studentId: req.user._id }).populate("jobId").sort({ createdAt: -1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export default { applyToJob, listMyApplications };
