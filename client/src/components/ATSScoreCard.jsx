export default function ATSScoreCard({ score = 0, summary = "" }) {
  const clamped = Math.max(0, Math.min(100, score));

  const scoreColor =
    clamped >= 80
      ? "text-emerald-500"
      : clamped >= 60
      ? "text-brand-600"
      : clamped >= 40
      ? "text-amber-500"
      : "text-red-500";

  const ringColor =
    clamped >= 80
      ? "#10b981"
      : clamped >= 60
      ? "#3366ff"
      : clamped >= 40
      ? "#f59e0b"
      : "#ef4444";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="animate-fade-in-up rounded-2xl border border-brand-100 bg-white p-8 shadow-soft">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
          <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#eef4ff"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-3xl font-extrabold ${scoreColor}`}>
              {clamped}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            ATS Score
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {clamped >= 80
              ? "Excellent resume match"
              : clamped >= 60
              ? "Good, with room to improve"
              : clamped >= 40
              ? "Needs meaningful improvement"
              : "Significant gaps found"}
          </h2>
          {summary && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
