import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Service Packages | Admin Panel" }];
}

export default function ServicePackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchApi("/admin/service-packages").then(setPackages).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await fetchApi(`/admin/service-packages/${id}`, { method: "DELETE" });
      setPackages((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete package: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Service Packages
          </h2>
          <p className="text-slate-400 mt-1">Manage tiers for your services.</p>
        </div>
        <Link
          to="/service-packages/new"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          + New Package
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Name</th>
              <th className="px-6 py-4 font-medium text-slate-200">Service</th>
              <th className="px-6 py-4 font-medium text-slate-200">Price</th>
              <th className="px-6 py-4 font-medium text-slate-200">Status</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No service packages found.
                </td>
              </tr>
            ) : (
              packages.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 text-slate-400">{p.services?.length > 0 ? p.services.map((s: any) => s.title).join(', ') : 'No Services'}</td>
                  <td className="px-6 py-4">${Number(p.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                      p.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/service-packages/${p.id}`} className="text-blue-400 hover:text-blue-300 mr-3">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300">
                      Delete
                    </button>
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
