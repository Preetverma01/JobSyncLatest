import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Application from "../models/Application.js";
import PDFDocument from "pdfkit";

export const getPlacementReport = async (req, res) => {
  try {
    const [students, analyses, applications] = await Promise.all([User.find({ role: "student" }).select("name branch batch cgpa placementStatus"), Analysis.find().sort({ createdAt: -1 }).lean(), Application.find().populate("jobId", "title package").populate("studentId", "name branch")]);
    const latest = new Map();
    analyses.forEach((analysis) => { const key = String(analysis.userId); if (!latest.has(key)) latest.set(key, analysis); });
    const rows = students.map((student) => ({ ...student.toObject(), atsScore: latest.get(String(student._id))?.score || 0, readinessScore: latest.get(String(student._id))?.jobReadinessScore || 0, applicationCount: applications.filter((application) => String(application.studentId?._id) === String(student._id)).length }));
    if (req.query.format === "pdf") {
      const document = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=jobsync-placement-report.pdf");
      document.pipe(res);
      document.fontSize(20).text("JobSync Placement Report");
      document.moveDown().fontSize(10).fillColor("#64748b").text(`Generated ${new Date().toLocaleString()}`);
      document.moveDown().fillColor("#0f172a");
      rows.forEach((row) => {
        document.fontSize(11).text(`${row.name} | ${row.branch} | CGPA ${row.cgpa || "-"} | ATS ${row.atsScore} | Readiness ${row.readinessScore} | Applications ${row.applicationCount}`);
      });
      document.end();
      return;
    }
    return res.json({ success: true, generatedAt: new Date(), rows });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export default { getPlacementReport };
