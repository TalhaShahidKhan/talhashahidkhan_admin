import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Service Package Requests | Admin Panel" }];
}

export default function ServicePackageRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetchApi("/admin/service-package-requests").then(setRequests).catch(console.error);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setStatusUpdating(true);
    try {
      await fetchApi(`/admin/service-package-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      fetchRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Service Package Requests</h2>
        <p className="text-slate-400 mt-1">Track incoming requests for service packages.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Client</th>
              <th className="px-6 py-4 font-medium text-slate-200">Email</th>
              <th className="px-6 py-4 font-medium text-slate-200">Package</th>
              <th className="px-6 py-4 font-medium text-slate-200">Status</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No service package requests found.
                </td>
              </tr>
            ) : (
              requests.map((r: any) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{r.name}</td>
                  <td className="px-6 py-4">{r.email}</td>
                  <td className="px-6 py-4">{r.package?.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedRequest(r)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Review Package Request</h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Client Name</p>
                <p className="text-white text-base">{selectedRequest.name}</p>
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Email & WhatsApp</p>
                <p className="text-white">{selectedRequest.email}</p>
                {selectedRequest.whatsapp && <p className="text-white">{selectedRequest.whatsapp}</p>}
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Package</p>
                <p className="text-white">{selectedRequest.package?.name || 'Unknown Package'}</p>
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Message</p>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                  {selectedRequest.message || "No message provided."}
                </div>
              </div>
              {selectedRequest.additionalRequirements && selectedRequest.additionalRequirements.length > 0 && (
                <div>
                  <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Additional Requirements</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedRequest.additionalRequirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'].map((status) => (
                  <button
                    key={status}
                    disabled={statusUpdating}
                    onClick={() => handleStatusUpdate(selectedRequest.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedRequest.status === status 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
