import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are an expert technical recruiter, resume reviewer, and career coach.
You will be given the raw extracted text of a candidate's resume.

Analyze it carefully and respond with ONLY valid JSON. Do not include any
markdown formatting, code fences, explanations, or extra text before or
after the JSON. Your entire response must be a single valid JSON object
that can be parsed directly with JSON.parse.

Return JSON in EXACTLY this shape:

{
  "atsScore": number (0-100, how well this resume would perform against an Applicant Tracking System),
  "summary": string (2-4 sentence overview of the candidate),
  "strengths": string[] (specific strengths found in the resume),
  "weaknesses": string[] (specific weaknesses or gaps in the resume),
  "missingSkills": string[] (relevant skills the candidate appears to be missing for their apparent target role),
  "suggestions": string[] (specific, actionable improvements to the resume itself),
  "roadmap": string[] (a step-by-step personalized learning roadmap, ordered),
  "projects": string[] (specific project ideas that would strengthen the resume),
  "certifications": string[] (specific certifications worth pursuing)
}

Rules:
- All array fields must contain at least 3 items when possible.
- Be specific and concrete, never vague or generic.
- atsScore must be an integer between 0 and 100.
- Do not wrap the JSON in backticks or any other text.`;

/**
 * Sends resume text to Groq and returns a validated analysis object.
 * @param {string} resumeText
 * @returns {Promise<object>} parsed analysis JSON
 */
export async function analyzeResumeWithGroq(resumeText) {
  let completion;

  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 3000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Here is the resume text to analyze:\n\n"""${resumeText}"""`,
        },
      ],
    });
  } catch (err) {
    console.error("[Groq API Error]", err.message);
    throw new Error("GROQ_API_FAILED");
  }

  const raw = completion?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("GROQ_API_FAILED");
  }

  return safeParseAnalysis(raw);
}

/**
 * Safely parses the AI's response into the expected analysis shape,
 * tolerating stray markdown fences or surrounding text.
 */
function safeParseAnalysis(raw) {
  let jsonString = raw.trim();

  // Strip markdown code fences if the model added them anyway
  if (jsonString.startsWith("```")) {
    jsonString = jsonString
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }

  // Extract the outermost JSON object if there's extra surrounding text
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error("INVALID_AI_JSON");
  }

  return normalizeAnalysis(parsed);
}

/**
 * Ensures the parsed object has every expected field with the right type,
 * filling in safe defaults for anything missing or malformed.
 */
function normalizeAnalysis(obj) {
  const toArray = (val) =>
    Array.isArray(val) ? val.filter((v) => typeof v === "string") : [];

  const atsScoreRaw = Number(obj.atsScore);
  const atsScore = Number.isFinite(atsScoreRaw)
    ? Math.max(0, Math.min(100, Math.round(atsScoreRaw)))
    : 0;

  return {
    atsScore,
    summary: typeof obj.summary === "string" ? obj.summary : "",
    strengths: toArray(obj.strengths),
    weaknesses: toArray(obj.weaknesses),
    missingSkills: toArray(obj.missingSkills),
    suggestions: toArray(obj.suggestions),
    roadmap: toArray(obj.roadmap),
    projects: toArray(obj.projects),
    certifications: toArray(obj.certifications),
  };
}

export default analyzeResumeWithGroq;
