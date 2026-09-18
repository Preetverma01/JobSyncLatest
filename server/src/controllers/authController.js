import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "jobsync-secret", {
    expiresIn: "7d",
  });

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  targetRole: user.targetRole,
  branch: user.branch,
  batch: user.batch,
  cgpa: user.cgpa,
  placementStatus: user.placementStatus,
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, role, branch, batch, cgpa } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const accountRole = process.env.NODE_ENV === "production" ? "student" : (role || "student");
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: accountRole,
      targetRole: targetRole || "Software Engineer",
      branch: branch || "CSE",
      batch: batch || "2026",
      cgpa: Number(cgpa) || 0,
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not fetch profile.",
    });
  }
};

export default { registerUser, loginUser, getProfile };
