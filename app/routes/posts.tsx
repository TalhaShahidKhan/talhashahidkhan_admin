import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchApi } from "~/lib/api";

export function meta() {
  return [{ title: "Blog Posts | Admin Panel" }];
}

export default function Posts() {
  const [posts, setPosts] = useState([]);

  // In a real scenario, fetch posts here:
  useEffect(() => {
    fetchApi("/admin/posts").then(setPosts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetchApi(`/admin/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete post: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Blog Posts
          </h2>
          <p className="text-slate-400 mt-1">
            Manage your publications and content.
          </p>
        </div>
        <Link
          to="/posts/new"
          className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Title</th>
              <th className="px-6 py-4 font-medium text-slate-200">Slug</th>
              <th className="px-6 py-4 font-medium text-slate-200">Status</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {p.title}
                  </td>
                  <td className="px-6 py-4">{p.slug}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/posts/${p.id}`} className="text-blue-400 hover:text-blue-300 mr-3">
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
