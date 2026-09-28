import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Edit Experience | Admin Panel" }];
}

export default function ExperiencesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi("/admin/experiences")
      .then((data) => {
        // Alternatively we can fetch from admin, but backend GET /experiences is public and returns all. 
        // Wait, does GET /experiences/:id exist?
        // Let's assume we fetch all and find the one, or we fetch from a specific route if exists.
        const exp = data.find((e: any) => e.id === id);
        if (exp) {
          setFormData({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
            description: exp.description || "",
          });
        } else {
          setError("Experience not found.");
        }
      })
      .catch((err: any) => setError(err.message || "Failed to load experience"))
      .finally(() => setInitialLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: any = {
        title: formData.title,
        company: formData.company,
        startDate: new Date(formData.startDate).toISOString(),
        description: formData.description,
      };
      // For PATCH, we explicitly send null if it was cleared, or undefined to keep it? 
      // Prisma requires `null` to clear a nullable Date field.
      payload.endDate = formData.endDate ? new Date(formData.endDate).toISOString() : null;

      await fetchApi(`/admin/experiences/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      navigate("/experiences");
    } catch (err: any) {
      setError(err.message || "Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-slate-400 p-8">Loading experience data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Edit Experience</h2>
          <p className="text-slate-400 mt-1">Update the details of your professional experience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md p-8 space-y-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">End Date (Leave empty if present)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate("/experiences")} className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all">Cancel</button>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition-all">
            {loading ? "Updating..." : "Update Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}
