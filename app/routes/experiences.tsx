import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Experiences | Admin Panel" }];
}

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const navigate = useNavigate();

  const loadExperiences = () => {
    fetchApi("/admin/experiences").then(setExperiences).catch(console.error);
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await fetchApi(`/admin/experiences/${id}`, { method: "DELETE" });
      loadExperiences();
    } catch (err: any) {
      alert(err.message || "Failed to delete experience");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Experiences
          </h2>
          <p className="text-slate-400 mt-1">Manage your professional experiences.</p>
        </div>
        <Link
          to="/experiences/new"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          + New Experience
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Title</th>
              <th className="px-6 py-4 font-medium text-slate-200">Company</th>
              <th className="px-6 py-4 font-medium text-slate-200">Start Date</th>
              <th className="px-6 py-4 font-medium text-slate-200">End Date</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {experiences.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No experiences found.
                </td>
              </tr>
            ) : (
              experiences.map((exp: any) => (
                <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{exp.title}</td>
                  <td className="px-6 py-4">{exp.company}</td>
                  <td className="px-6 py-4">
                    {new Date(exp.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="text-blue-400 hover:text-blue-300 mr-3"
                      onClick={() => navigate(`/experiences/${exp.id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(exp.id)}
                    >
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
