import { useState } from "react";
import { uploadFile } from "../lib/api";

export function meta() {
  return [{ title: "Media Library | Admin Panel" }];
}

export default function MediaLibrary() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // In a real scenario, you'd fetch these from your backend
  const [mediaItems, setMediaItems] = useState<{url: string, name: string}[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await uploadFile("/upload", file);
      // Assuming backend returns { url: "..." }
      const newMediaUrl = data.url || data.secure_url || ""; 
      if (newMediaUrl) {
        setMediaItems(prev => [{ url: newMediaUrl, name: file.name }, ...prev]);
        setSuccessMsg("Image uploaded successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Media Library</h2>
          <p className="text-slate-400 mt-1">Upload and manage your assets.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMsg}
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-md flex flex-col items-center justify-center border-dashed relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
        />
        <div className="text-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
             {uploading ? (
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
             )}
          </div>
          <p className="text-lg font-medium text-white">
            {uploading ? "Uploading..." : "Click or drag image to upload"}
          </p>
          <p className="text-sm text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Recent Uploads</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden group relative aspect-square">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 font-medium hover:text-blue-300 bg-white/10 px-2 py-1 rounded">View Original</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
