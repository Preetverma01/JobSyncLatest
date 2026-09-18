import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-brand-600"
        : "text-slate-500 hover:text-brand-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-soft">
            J
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Job<span className="text-brand-600">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className={linkClass("/")}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
              <Link to="/upload" className={linkClass("/upload")}>Upload</Link>
              {user.role === "student" && <Link to="/jobs" className={linkClass("/jobs")}>Jobs</Link>}
              <Link to="/chat" className={linkClass("/chat")}>AI Advisor</Link>
              <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
              {user.role === "placement_officer" && <Link to="/placement" className={linkClass("/placement")}>Placement Cell</Link>}
              {user.role === "recruiter" && <Link to="/recruiter" className={linkClass("/recruiter")}>Recruiter Hub</Link>}
              {user.role === "admin" && <Link to="/admin" className={linkClass("/admin")}>Admin</Link>}
              <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-brand-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass("/login")}>Login</Link>
              <Link to="/register" className={linkClass("/register")}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
