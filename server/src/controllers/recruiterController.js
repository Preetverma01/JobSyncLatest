import User from "../models/User.js";
import Company from "../models/Company.js";
import Recruiter from "../models/Recruiter.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";
import { matchCandidateToJob } from "../services/matchingService.js";
import normalizeJobPayload from "../services/jobPayload.js";

const getOrCreateCompany = async (userId) => {
  const recruiter = await Recruiter.findOne({ userId });
  return recruiter?.companyId ? Company.findById(recruiter.companyId) : null;
};

export const getRecruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);
    const [applications, interviews, shortlisted, hired] = await Promise.all([
      Application.countDocuments({ jobId: { $in: jobIds } }),
      Interview.countDocuments({ recruiterId: req.user._id, status: "scheduled" }),
      Application.countDocuments({ jobId: { $in: jobIds }, status: "shortlisted" }),
      Application.countDocuments({ jobId: { $in: jobIds }, status: "selected" }),
    ]);
    return res.json({ success: true, metrics: { totalJobsPosted: jobs.length, totalApplicants: applications, interviewsScheduled: interviews, candidatesShortlisted: shortlisted, candidatesHired: hired } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const getCompany = async (req, res) => {
  try { return res.json({ success: true, company: await getOrCreateCompany(req.user._id) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const saveCompany = async (req, res) => {
  try {
    let recruiter = await Recruiter.findOne({ userId: req.user._id });
    let company = recruiter?.companyId ? await Company.findByIdAndUpdate(recruiter.companyId, { ...req.body, createdBy: req.user._id }, { new: true, runValidators: true }) : null;
    if (!company) company = await Company.create({ ...req.body, createdBy: req.user._id });
    if (!recruiter) recruiter = await Recruiter.create({ userId: req.user._id, companyId: company._id });
    else if (!recruiter.companyId) { recruiter.companyId = company._id; await recruiter.save(); }
    return res.json({ success: true, company });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const listJobs = async (req, res) => {
  try { return res.json({ success: true, jobs: await Job.find({ recruiterId: req.user._id }).populate("companyId").sort({ createdAt: -1 }).lean() }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const createJob = async (req, res) => {
  try {
    const company = await getOrCreateCompany(req.user._id);
    if (!company) return res.status(400).json({ success: false, message: "Create your company profile before posting a job." });

    const normalized = normalizeJobPayload(req.body);
    const job = await Job.create({
      ...normalized,
      recruiterId: req.user._id,
      companyId: company._id,
    });

    return res.status(201).json({ success: true, job });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    const students = await User.find({ role: "student" }).select("-password").lean();
    const candidates = await Promise.all(students.map(async (student) => ({ student, ...(await matchCandidateToJob(student, job)) })));
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ success: true, job, candidates });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const listApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).select("_id");
    const applications = await Application.find({ jobId: { $in: jobs.map((job) => job._id) } }).populate("jobId studentId").sort({ matchScore: -1, createdAt: -1 });
    return res.json({ success: true, applications });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const updateApplication = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.body.jobId || req.params.jobId, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    const application = await Application.findOneAndUpdate({ _id: req.params.applicationId, jobId: job._id }, { status: req.body.status }, { new: true, runValidators: true }).populate("jobId studentId");
    return res.json({ success: true, application });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const scheduleInterview = async (req, res) => {
  try {
    const application = await Application.findById(req.body.applicationId).populate("jobId");
    if (!application || String(application.jobId.recruiterId) !== String(req.user._id)) return res.status(404).json({ success: false, message: "Application not found." });
    const interview = await Interview.create({ ...req.body, jobId: application.jobId._id, studentId: application.studentId, recruiterId: req.user._id });
    application.status = "interview_scheduled";
    await application.save();
    return res.status(201).json({ success: true, interview });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const listInterviews = async (req, res) => {
  try { return res.json({ success: true, interviews: await Interview.find({ recruiterId: req.user._id }).populate("jobId studentId").sort({ scheduledAt: 1 }) }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const submitFeedback = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.body.interviewId, recruiterId: req.user._id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found." });
    const feedback = await Feedback.create({ ...req.body, applicationId: interview.applicationId, studentId: interview.studentId, recruiterId: req.user._id });
    return res.status(201).json({ success: true, feedback });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export default { getRecruiterDashboard, getCompany, saveCompany, listJobs, createJob, getRecommendations, listApplications, updateApplication, scheduleInterview, listInterviews, submitFeedback };
