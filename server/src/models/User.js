import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["student", "placement_officer", "recruiter", "admin"],
      default: "student",
    },
    branch: { type: String, default: "CSE", trim: true },
    batch: { type: String, default: "2026", trim: true },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    placementStatus: {
      type: String,
      enum: ["seeking", "placed", "not_placed", "opted_out"],
      default: "seeking",
    },
    phone: { type: String, trim: true },
    targetRole: {
      type: String,
      enum: [
        "Software Engineer",
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Data Analyst",
        "Data Scientist",
        "AI Engineer",
        "Cyber Security Engineer",
      ],
      default: "Software Engineer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
