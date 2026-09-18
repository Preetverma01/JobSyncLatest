export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row">
        <p>© {new Date().getFullYear()} JobSync. All rights reserved.</p>
        <p>Built with React, Express &amp; Groq AI.</p>
      </div>
    </footer>
  );
}
