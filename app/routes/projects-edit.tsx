import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchApi, uploadFile } from "../lib/api";

export function meta() {
  return [{ title: "Edit Project | Admin Panel" }];
}

export default function ProjectsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const generateSlug = (str: string) => str.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    liveLink: "",
    githubRepository: "",
    tags: "",
    techStack: "",
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi(`/admin/projects/${id}`)
      .then((data) => {
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          liveLink: data.liveLink || "",
          githubRepository: data.githubRepository || "",
          tags: data.tags ? data.tags.join(", ") : "",
          techStack: data.techStack ? data.techStack.join(", ") : "",
          images: data.images || [],
        });
        setFetching(false);
      })
      .catch((err) => {
        setError("Failed to load project");
        setFetching(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: value, slug: generateSlug(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const urls = [...formData.images];
      for (let i = 0; i < e.target.files.length; i++) {
        const data = await uploadFile("/upload", e.target.files[i]);
        urls.push(data.url || data.secure_url);
      }
      setFormData(prev => ({ ...prev, images: urls }));
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/admin/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
          techStack: formData.techStack.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      navigate("/projects");
    } catch (err: any) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-white text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Edit Project</h2>
          <p className="text-slate-400 mt-1">Update project details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md p-8 space-y-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            readOnly
            value={formData.slug}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white/50 focus:outline-none cursor-not-allowed"
          />
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

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Live Link</label>
            <input
              type="text"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">GitHub Repository</label>
            <input
              type="text"
              name="githubRepository"
              value={formData.githubRepository}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, Nextjs, Cloud"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="PostgreSQL, Redis, NestJS"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Project Images</label>
          <div className="flex flex-col gap-4">
             <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm text-slate-300" />
             {uploading && <span className="text-blue-400 text-sm">Uploading...</span>}
             
             {formData.images.length > 0 && (
               <div className="flex flex-wrap gap-4 mt-2">
                 {formData.images.map((url, idx) => (
                   <div key={idx} className="relative group">
                     <img src={url} className="w-24 h-24 rounded-lg object-cover border border-white/10" />
                     <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate("/projects")} className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all">Cancel</button>
          <button type="submit" disabled={loading || uploading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition-all">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
