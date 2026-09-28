import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "New Service Package | Admin Panel" }];
}

export default function ServicePackagesNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    deliveryDays: "",
    revisions: "0",
    features: "",
    status: "DRAFT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetchApi("/admin/service-packages", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          deliveryDays: parseInt(formData.deliveryDays, 10),
          revisions: parseInt(formData.revisions, 10),
          features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
        }),
      });
      navigate("/service-packages");
    } catch (err: any) {
      setError(err.message || "Failed to create service package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Create New Package</h2>
          <p className="text-slate-400 mt-1">Add a pricing tier to an existing service.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md p-8 space-y-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Package Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Basic, Standard, Premium"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Delivery Days</label>
            <input
              type="number"
              name="deliveryDays"
              required
              value={formData.deliveryDays}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Revisions</label>
            <input
              type="number"
              name="revisions"
              required
              value={formData.revisions}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Features (comma separated)</label>
          <textarea
            name="features"
            rows={3}
            value={formData.features}
            onChange={handleChange}
            placeholder="Responsive design, 3 pages, Source code"
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="w-1/2 pr-3">
          <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
          <button type="button" onClick={() => navigate("/service-packages")} className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all">Cancel</button>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition-all">
            {loading ? "Saving..." : "Save Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
