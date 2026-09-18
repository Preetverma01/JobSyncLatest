import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="text-lg font-semibold text-slate-900">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-lg font-semibold text-slate-900">{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Target Career</p>
            <p className="text-lg font-semibold text-slate-900">{user?.targetRole || "Software Engineer"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
