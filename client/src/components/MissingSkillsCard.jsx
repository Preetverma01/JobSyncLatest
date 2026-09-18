export default function MissingSkillsCard({ items = [] }) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-red-100 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Missing Skills</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No missing skills identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
