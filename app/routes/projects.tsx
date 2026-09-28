import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Projects | Admin Panel" }];
}

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchApi("/admin/projects").then(setProjects).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetchApi(`/admin/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Projects
          </h2>
          <p className="text-slate-400 mt-1">Manage your portfolio projects.</p>
        </div>
        <Link
          to="/projects/new"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          + New Project
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Name</th>
              <th className="px-6 py-4 font-medium text-slate-200">Tags</th>
              <th className="px-6 py-4 font-medium text-slate-200">
                Date Added
              </th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4">{p.tags?.join(", ")}</td>
                  <td className="px-6 py-4">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/projects/${p.id}`} className="text-blue-400 hover:text-blue-300 mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:text-red-300"
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
