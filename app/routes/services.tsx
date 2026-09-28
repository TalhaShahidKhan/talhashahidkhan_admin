import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Services | Admin Panel" }];
}

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchApi("/admin/services").then(setServices).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetchApi(`/admin/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s: any) => s.id !== id));
    } catch (err: any) {
      alert("Failed to delete service: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Services
          </h2>
          <p className="text-slate-400 mt-1">Manage your offered services.</p>
        </div>
        <Link
          to="/services/new"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          + New Service
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Title</th>
              <th className="px-6 py-4 font-medium text-slate-200">Category</th>
              <th className="px-6 py-4 font-medium text-slate-200">Price</th>
              <th className="px-6 py-4 font-medium text-slate-200">Status</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((s: any) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{s.title}</td>
                  <td className="px-6 py-4">{s.category}</td>
                  <td className="px-6 py-4">${Number(s.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                      s.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/services/${s.id}`} className="text-blue-400 hover:text-blue-300 mr-3">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300">
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
