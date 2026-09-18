import { useLocation, useNavigate } from "react-router-dom";
import ATSScoreCard from "../components/ATSScoreCard.jsx";
import StrengthsCard from "../components/StrengthsCard.jsx";
import WeaknessesCard from "../components/WeaknessesCard.jsx";
import MissingSkillsCard from "../components/MissingSkillsCard.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";
import RecommendationsCard from "../components/RecommendationsCard.jsx";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          No analysis found
        </h1>
        <p className="mt-3 text-slate-500">
          It looks like you navigated here directly. Please upload a resume
          first to see your analysis.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="mt-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-3 font-semibold text-white shadow-soft"
        >
          Upload a Resume
        </button>
      </div>
    );
  }

  const atsScore = analysis.atsScore ?? analysis.jobReadinessScore ?? analysis.score ?? 0;
  const summary = analysis.summary ?? analysis.resumeSummary ?? "";
  const strengths = analysis.strengths ?? [];
  const weaknesses = analysis.weaknesses ?? [];
  const missingSkills = analysis.missingSkills ?? [];
  const suggestions = analysis.suggestions ?? analysis.resources ?? [];
  const roadmap = analysis.roadmap ?? [];
  const projects = analysis.projects ?? [];
  const certifications = analysis.certifications ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-14">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Your Analysis Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Here's the complete breakdown of your resume.
        </p>
      </div>

      <ATSScoreCard score={atsScore} summary={summary} />

      <div className="grid gap-6 sm:grid-cols-2">
        <StrengthsCard items={strengths} />
        <WeaknessesCard items={weaknesses} />
      </div>

      <MissingSkillsCard items={missingSkills} />

      {suggestions?.length > 0 && (
        <div className="animate-fade-in-up rounded-2xl border border-brand-100 bg-white p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Suggested Improvements
          </h3>
          <ul className="space-y-2.5">
            {suggestions.map((item, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm leading-relaxed text-slate-600"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <RoadmapCard items={roadmap} />

      <RecommendationsCard projects={projects} certifications={certifications} />

      <div className="flex justify-center pt-6">
        <button
          onClick={() => navigate("/upload")}
          className="rounded-xl border border-brand-200 bg-white px-8 py-3 font-semibold text-brand-600 shadow-soft transition-transform hover:scale-[1.02]"
        >
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
