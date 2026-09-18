import multer from "multer";
import path from "path";
import fs from "fs";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import {
  extractSkillsFromText,
  compareSkillsWithRole,
  calculateReadinessScore,
  generateRoleInsights,
  generateRoadmap,
} from "../services/aiService.js";
import { extractResumeText } from "../services/resumeService.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF files are allowed."), false);
  },
}).single("resume");

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF resume." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const resumeText = await extractResumeText(req.file.path);
    const savedResume = await Resume.create({
      userId: user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      resumeText,
    });

    const skillMatches = extractSkillsFromText(resumeText);
    const { existingSkills, missingSkills } = compareSkillsWithRole(
      skillMatches,
      user.targetRole || "Software Engineer"
    );

    const insights = generateRoleInsights(user.targetRole || "Software Engineer");

    const resumeQuality = Math.min(95, Math.max(35, 70 + existingSkills.length * 2));
    const skillsCoverage = Math.min(100, Math.max(0, 100 - missingSkills.length * 10));
    const projects = Math.min(100, 55 + insights.projects.length * 10);
    const experience = Math.min(100, 50 + (skillMatches.length > 6 ? 30 : 15));
    const certifications = Math.min(100, 40 + insights.certifications.length * 15);

    const jobReadinessScore = calculateReadinessScore({
      skillsCoverage,
      resumeQuality,
      projects,
      experience,
      certifications,
    });

    const summary = `Your resume shows strong alignment with ${user.targetRole || "Software Engineer"}, with notable strengths in ${existingSkills.slice(0, 3).join(", ") || "core technical fundamentals"}. Focus on improving your ${missingSkills.slice(0, 3).join(", ") || "role-specific skill gaps"} to increase job readiness.`;

    const roadmapData = generateRoadmap(user.targetRole || "Software Engineer", missingSkills);

    const analysis = await Analysis.create({
      userId: user._id,
      targetRole: user.targetRole || "Software Engineer",
      skills: skillMatches,
      missingSkills,
      score: resumeQuality,
      jobReadinessScore,
      resumeSummary: summary,
      strengths: existingSkills.length ? existingSkills.slice(0, 5) : ["Core problem solving"],
      weaknesses: missingSkills.length ? missingSkills.slice(0, 5) : ["Target role specialization"],
      roadmap: roadmapData.map((week) => `${week.week}: ${week.topics.join(", ")}`),
      projects: insights.projects,
      certifications: insights.certifications,
      resources: insights.resources,
      readinessTrend: [45, 55, 68, jobReadinessScore],
      skillsDistribution: [
        { name: "Covered", value: Math.max(1, existingSkills.length) },
        { name: "Missing", value: Math.max(1, missingSkills.length) },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully.",
      resume: savedResume,
      analysis,
    });
  } catch (error) {
    console.error("Analyze resume error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Resume analysis failed.",
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, analyses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not fetch history.",
    });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume?.filePath || !fs.existsSync(resume.filePath)) {
      return res.status(404).json({ success: false, message: "Resume file not found." });
    }
    return res.download(resume.filePath, resume.fileName || "resume.pdf");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Could not download resume." });
  }
};

export default { uploadResume, analyzeResume, getAnalysisHistory, downloadResume };
