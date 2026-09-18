import { Link } from "react-router-dom";
import { BrainCircuit, ChartNoAxesCombined, Route, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const FEATURES = [
  { title: "AI Resume Analysis", desc: "Understand your strengths, weaknesses, and overall fit for a target role.", icon: BrainCircuit },
  { title: "Skill Gap Detection", desc: "Compare your current skills with the exact role requirements you want to pursue.", icon: ChartNoAxesCombined },
  { title: "Career Roadmaps", desc: "Get step-by-step weekly plans to improve with practice tasks and mini projects.", icon: Route },
  { title: "Readiness Scoring", desc: "See a measurable job readiness score with trends and clear improvement signals.", icon: TrendingUp },
  { title: "Project & Certs", desc: "Receive actionable project and certification recommendations tailored to your role.", icon: Sparkles },
  { title: "Career Guidance", desc: "Use the AI advisor chatbot to get answers about your next learning priorities.", icon: ShieldCheck },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="flex flex-col items-center gap-6 pb-20 pt-16 text-center">
        <span className="rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          AI-Powered Job Readiness
        </span>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Turn your resume into a job-ready roadmap with
          <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent"> JobSync</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-500">
          Analyze your resume, discover missing skills, compare against your target role, and build a personalized learning roadmap that gets you interview-ready.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-3.5 font-semibold text-white shadow-soft">
            Get Started
          </Link>
          <Link to="/login" className="rounded-xl border border-brand-200 bg-white px-8 py-3.5 font-semibold text-brand-700 shadow-soft">
            Login
          </Link>
        </div>
      </section>

      <section className="grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, desc, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft transition-transform hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <Icon size={22} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
