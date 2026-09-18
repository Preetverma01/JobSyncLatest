import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    matchScore: { type: Number, min: 0, max: 100, default: 0 },
    matchReasons: [String],
    missingSkills: [String],
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview_scheduled", "selected", "rejected"],
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);
