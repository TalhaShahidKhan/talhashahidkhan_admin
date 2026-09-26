import { useState } from "react";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Change Password | Admin Panel" }];
}

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await fetchApi("/admin/password_change", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setStep(2);
      setMessage("Verification code sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to initiate password change.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await fetchApi("/admin/password_change", {
        method: "POST",
        body: JSON.stringify({ newPassword, verificationCode: code }),
      });
      setStep(1);
      setCurrentPassword("");
      setNewPassword("");
      setCode("");
      setMessage("Password successfully changed!");
    } catch (err: any) {
      setError(err.message || "Failed to confirm password change.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 mt-10">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Change Password</h2>
        <p className="text-slate-400 mt-1">Update your admin account password.</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              Request Password Change
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
                placeholder="Check your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            >
              Confirm Password Change
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
