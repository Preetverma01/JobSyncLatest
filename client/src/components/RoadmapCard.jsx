export default function RoadmapCard({ items = [] }) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-brand-100 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.618V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Learning Roadmap</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No roadmap available.</p>
      ) : (
        <ol className="relative ml-3 space-y-6 border-l-2 border-brand-100">
          {items.map((item, i) => (
            <li key={i} className="ml-6">
              <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 ring-4 ring-brand-50" />
              <p className="text-sm leading-relaxed text-slate-600">{item}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
