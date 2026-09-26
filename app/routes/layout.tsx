import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { clearAuthToken, getAuthToken } from "../lib/api";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 font-sans flex relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col z-10">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Portfolio Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/posts"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Blog Posts
          </Link>
          <Link
            to="/service-requests"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Service Requests
          </Link>
          <Link
            to="/contacts"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Contacts
          </Link>
          <Link
            to="/media"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Media Library
          </Link>
          <Link
            to="/password-change"
            className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Change Password
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left rounded-lg hover:bg-white/10 text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8">
          <div className="text-sm text-slate-400">Admin Panel Overview</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="text-xs text-slate-300">System Online</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
