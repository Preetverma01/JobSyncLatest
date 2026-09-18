import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", protect, async (req, res) => {
  try {
    const { message, userProfile } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message for the advisor.",
      });
    }

    const prompt = `You are a career mentor helping a job seeker. User profile: ${JSON.stringify(userProfile || {})}. User asks: ${message}. Provide a concise but useful answer with actionable steps.`;

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        reply: `Based on your profile, focus on ${userProfile?.targetRole || "your target role"}. Start by identifying core technical skills, building a small project, and improving your resume with measurable outcomes.`,
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I can help with your career path. Start by improving your resume and core skills for your target role.";

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Chat failed.",
    });
  }
});

export default router;
