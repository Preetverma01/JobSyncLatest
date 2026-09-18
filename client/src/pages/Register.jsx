import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Data Scientist",
  "AI Engineer",
  "Cyber Security Engineer",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "Software Engineer",
    role: "student",
    branch: "CSE",
    batch: "2026",
    cgpa: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", formData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      navigate(user.role === "placement_officer" ? "/placement" : user.role === "recruiter" ? "/recruiter" : user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <UserPlus size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
            <p className="text-sm text-slate-500">Build your career plan with JobSync.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500">
              <option value="student">Student</option>
              <option value="placement_officer">Placement Officer</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Super Admin</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Branch</label>
              <select name="branch" value={formData.branch} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500">
                {["CSE", "IT", "ECE", "EE", "ME"].map((branch) => <option key={branch}>{branch}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Batch</label>
              <input type="text" name="batch" value={formData.batch} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Target Career</label>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-soft"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-brand-600">Login here</Link>
        </p>
      </div>
    </div>
  );
}
