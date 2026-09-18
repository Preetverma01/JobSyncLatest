import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    title: { type: String, default: "Recruiter" },
  },
  { timestamps: true }
);

export default mongoose.model("Recruiter", recruiterSchema);
