import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String, trim: true }],
    experienceRequired: { type: String, default: "Entry level" },
    package: { type: String, required: true },
    location: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
