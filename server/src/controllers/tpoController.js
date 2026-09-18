import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Recruiter from "../models/Recruiter.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import CampusDrive from "../models/CampusDrive.js";
import Resume from "../models/Resume.js";

const latestAnalysis = (studentId) => Analysis.findOne({ userId: studentId }).sort({ createdAt: -1 }).lean();

const riskFor = (analysis) => {
  const score = analysis?.jobReadinessScore || 0;
  const missing = analysis?.missingSkills?.length || 0;
  if (score >= 70 && missing <= 4) return { label: "Placement Ready", level: "ready", reason: "Strong readiness score and manageable skill gaps." };
  if (score >= 45) return { label: "Moderate Risk", level: "moderate", reason: "Some role-specific skills or portfolio evidence need improvement." };
  return { label: "High Risk", level: "high", reason: "Readiness score is low and the resume has significant missing skills." };
};

const decorateStudent = async (student) => {
  const analysis = await latestAnalysis(student._id);
  return {
    ...student.toObject?.() || student,
    analysis,
    atsScore: analysis?.score || 0,
    readinessScore: analysis?.jobReadinessScore || 0,
    risk: riskFor(analysis),
  };
};

export const getTpoDashboard = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).lean();
    const analyses = await Analysis.find({ userId: { $in: students.map((student) => student._id) } }).lean();
    const latest = new Map();
    analyses.forEach((analysis) => {
      const key = String(analysis.userId);
      if (!latest.has(key) || latest.get(key).createdAt < analysis.createdAt) latest.set(key, analysis);
    });
    const readinessScores = students.map((student) => latest.get(String(student._id))?.jobReadinessScore || 0);
    const placed = students.filter((student) => student.placementStatus === "placed").length;
    const branchNames = ["CSE", "IT", "ECE", "EE", "ME"];
    const branchAnalytics = branchNames.map((branch) => {
      const branchStudents = students.filter((student) => student.branch === branch);
      const branchAnalyses = branchStudents.map((student) => latest.get(String(student._id))).filter(Boolean);
      const average = (field) => branchAnalyses.length ? Math.round(branchAnalyses.reduce((sum, item) => sum + (item[field] || 0), 0) / branchAnalyses.length) : 0;
      return { branch, students: branchStudents.length, averageAtsScore: average("score"), averageReadinessScore: average("jobReadinessScore"), placementReady: branchStudents.length ? Math.round((branchAnalyses.filter((item) => (item.jobReadinessScore || 0) >= 70).length / branchStudents.length) * 100) : 0 };
    });
    const missingCounts = {};
    analyses.forEach((analysis) => (analysis.missingSkills || []).forEach((skill) => { missingCounts[skill] = (missingCounts[skill] || 0) + 1; }));
    const skillGapDistribution = Object.entries(missingCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([skill, count]) => ({ skill, count }));
    const [recruiters, activeJobs, applications] = await Promise.all([
      Recruiter.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Application.countDocuments(),
    ]);
    return res.json({ success: true, metrics: { totalStudents: students.length, placementReadyStudents: readinessScores.filter((score) => score >= 70).length, studentsNeedingImprovement: readinessScores.filter((score) => score < 70).length, totalRecruiters: recruiters, activeJobOpenings: activeJobs, applicationsSubmitted: applications, studentsPlaced: placed, averageReadinessScore: readinessScores.length ? Math.round(readinessScores.reduce((sum, score) => sum + score, 0) / readinessScores.length) : 0 }, branchAnalytics, skillGapDistribution, riskDistribution: [{ name: "Placement Ready", value: readinessScores.filter((score) => score >= 70).length }, { name: "Moderate Risk", value: readinessScores.filter((score) => score >= 45 && score < 70).length }, { name: "High Risk", value: readinessScores.filter((score) => score < 45).length }] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listStudents = async (req, res) => {
  try {
    const { search = "", branch, batch, minCgpa, minReadiness, placementStatus } = req.query;
    const query = { role: "student" };
    if (branch) query.branch = branch;
    if (batch) query.batch = batch;
    if (placementStatus) query.placementStatus = placementStatus;
    if (minCgpa) query.cgpa = { $gte: Number(minCgpa) };
    if (search) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
    const students = await User.find(query).select("-password").sort({ name: 1 });
    const decorated = await Promise.all(students.map(decorateStudent));
    return res.json({ success: true, students: minReadiness ? decorated.filter((student) => student.readinessScore >= Number(minReadiness)) : decorated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.studentId, role: "student" }).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    const [analysis, resume, applications] = await Promise.all([latestAnalysis(student._id), Resume.findOne({ userId: student._id }).sort({ createdAt: -1 }).lean(), Application.find({ studentId: student._id }).populate("jobId").sort({ createdAt: -1 }).lean()]);
    return res.json({ success: true, student: { ...student.toObject(), analysis, resume, applications, risk: riskFor(analysis) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listDrives = async (_, res) => {
  try { return res.json({ success: true, drives: await CampusDrive.find().sort({ createdAt: -1 }).lean() }); } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const createDrive = async (req, res) => {
  try { return res.status(201).json({ success: true, drive: await CampusDrive.create({ ...req.body, createdBy: req.user._id }) }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export const getDriveEligibility = async (req, res) => {
  try {
    const drive = await CampusDrive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found." });
    const students = await User.find({ role: "student", cgpa: { $gte: drive.eligibility.minCgpa || 0 }, ...(drive.eligibility.branches?.length ? { branch: { $in: drive.eligibility.branches } } : {}), ...(drive.eligibility.batches?.length ? { batch: { $in: drive.eligibility.batches } } : {}) }).select("-password");
    const eligible = await Promise.all(students.map(decorateStudent));
    return res.json({ success: true, eligibleStudents: eligible, notEligibleStudents: await User.find({ role: "student", _id: { $nin: eligible.map((student) => student._id) } }).select("name email branch batch cgpa") });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const updateDrive = async (req, res) => {
  try { const drive = await CampusDrive.findByIdAndUpdate(req.params.driveId, req.body, { new: true, runValidators: true }); return res.json({ success: true, drive }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

export { riskFor };
