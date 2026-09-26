import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Service Requests | Admin Panel" }];
}

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchApi("/admin/service-requests").then(setRequests).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Service Requests</h2>
        <p className="text-slate-400 mt-1">Track incoming service tickets.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Client</th>
              <th className="px-6 py-4 font-medium text-slate-200">Email</th>
              <th className="px-6 py-4 font-medium text-slate-200">Status</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No service requests found.
                </td>
              </tr>
            ) : (
              requests.map((r: any) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{r.name}</td>
                  <td className="px-6 py-4">{r.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-400 hover:text-blue-300">Review</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
