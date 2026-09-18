import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    technicalRating: { type: Number, min: 1, max: 5, required: true },
    communicationRating: { type: Number, min: 1, max: 5, required: true },
    recommendation: { type: String, enum: ["strong_yes", "yes", "hold", "no"], required: true },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
