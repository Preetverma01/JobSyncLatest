import { useEffect, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import api from "../services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [jobsResponse, applicationsResponse] = await Promise.all([api.get("/jobs"), api.get("/applications/me")]);
    setJobs(jobsResponse.data.jobs || []);
    setApplications(applicationsResponse.data.applications || []);
  };

  useEffect(() => { load().catch((error) => setMessage(error.response?.data?.message || "Could not load jobs.")); }, []);

  const apply = async (jobId) => {
    try {
      await api.post(`/applications/jobs/${jobId}`);
      setMessage("Application submitted. Your candidate match score has been recorded.");
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit application.");
    }
  };

  const appliedIds = new Set(applications.map((application) => application.jobId?._id));
  return <div className="mx-auto max-w-5xl space-y-8 px-6 py-14"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Student opportunities</p><h1 className="mt-2 text-3xl font-extrabold text-slate-950">Open campus roles</h1><p className="mt-2 text-slate-500">Apply to roles and let JobSync measure your fit from your latest analysis.</p></div>{message && <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</div>}<div className="grid gap-5 md:grid-cols-2">{jobs.length ? jobs.map((job) => { const applied = appliedIds.has(job._id); return <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><BriefcaseBusiness size={20} /></div><h2 className="text-xl font-bold text-slate-900">{job.title}</h2><p className="mt-1 font-medium text-slate-600">{job.companyId?.name || "Campus employer"}</p></div><Sparkles className="text-amber-500" size={20} /></div><div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500"><span className="flex items-center gap-1"><MapPin size={15} />{job.location}</span><span>{job.package}</span></div><p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{job.description}</p><div className="mt-5 flex flex-wrap gap-2">{job.skillsRequired?.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{skill}</span>)}</div><button disabled={applied} onClick={() => apply(job._id)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-emerald-600">{applied ? <><CheckCircle2 size={17} />Applied</> : "Apply now"}</button></article>; }) : <div className="md:col-span-2"><div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">No open roles are available right now.</div></div>}</div></div>;
}
