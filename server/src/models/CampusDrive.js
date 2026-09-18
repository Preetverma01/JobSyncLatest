import mongoose from "mongoose";

const campusDriveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    package: { type: String, required: true },
    location: { type: String, required: true },
    eligibility: {
      minCgpa: { type: Number, default: 0 },
      branches: [String],
      batches: [String],
    },
    skillsRequired: [String],
    lastDate: { type: Date, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shortlistedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("CampusDrive", campusDriveSchema);
