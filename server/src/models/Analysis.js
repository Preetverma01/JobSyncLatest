import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetRole: { type: String, required: true },
    skills: [{ type: String }],
    missingSkills: [{ type: String }],
    score: { type: Number, min: 0, max: 100 },
    jobReadinessScore: { type: Number, min: 0, max: 100 },
    resumeSummary: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    roadmap: [{ type: String }],
    projects: [{ type: String }],
    certifications: [{ type: String }],
    resources: [{ type: String }],
    readinessTrend: [{ type: Number }],
    skillsDistribution: [{
      name: String,
      value: Number,
    }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
