import Analysis from "../models/Analysis.js";

const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9+#.\s-]/g, "").trim();

const contains = (source, target) => {
  const normalizedSource = normalize(source);
  const normalizedTarget = normalize(target);
  return normalizedSource === normalizedTarget || normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource);
};

export const matchCandidateToJob = async (student, job) => {
  const analysis = await Analysis.findOne({ userId: student._id }).sort({ createdAt: -1 });
  const candidateSkills = analysis?.skills || [];
  const requiredSkills = job.skillsRequired || [];
  const matchedSkills = requiredSkills.filter((required) => candidateSkills.some((skill) => contains(skill, required)));
  const missingSkills = requiredSkills.filter((required) => !matchedSkills.includes(required));
  const skillScore = requiredSkills.length ? (matchedSkills.length / requiredSkills.length) * 45 : 30;
  const readinessScore = ((analysis?.jobReadinessScore || 0) / 100) * 20;
  const atsScore = ((analysis?.score || 0) / 100) * 15;
  const projectScore = Math.min(10, (analysis?.projects?.length || 0) * 3.34);
  const certificationScore = Math.min(10, (analysis?.certifications?.length || 0) * 3.34);
  const matchScore = Math.round(Math.min(100, skillScore + readinessScore + atsScore + projectScore + certificationScore));

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    reasons: [
      ...matchedSkills.map((skill) => `Matches ${skill}`),
      analysis?.projects?.length ? `${analysis.projects.length} relevant project(s)` : "Add a role-specific project",
      analysis?.certifications?.length ? `${analysis.certifications.length} certification(s)` : "Add relevant certifications",
    ],
  };
};

export default { matchCandidateToJob };
