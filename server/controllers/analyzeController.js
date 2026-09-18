import { extractTextFromPDF } from "../services/pdfService.js";
import { analyzeResumeWithGroq } from "../services/groqService.js";

/**
 * POST /api/analyze
 * Accepts a PDF resume (multipart/form-data, field "resume"),
 * extracts its text, sends it to Groq, and returns a structured analysis.
 */
export async function analyzeResume(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("NO_FILE_UPLOADED");
    }

    const resumeText = await extractTextFromPDF(req.file.path);
    const analysis = await analyzeResumeWithGroq(resumeText);

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (err) {
    return next(err);
  }
}

export default analyzeResume;
