import mongoose from "mongoose";

const placementOfficerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    institution: { type: String, required: true, trim: true },
    department: { type: String, default: "Training & Placement" },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementOfficer", placementOfficerSchema);
