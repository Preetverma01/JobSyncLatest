export default function LoadingSpinner({ message = "Analyzing your resume..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute h-20 w-20 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft" />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-800">{message}</p>
        <p className="mt-1 text-sm text-slate-400">
          This usually takes just a few seconds.
        </p>
      </div>
    </div>
  );
}
