import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";

export function meta() {
  return [{ title: "Contacts | Admin Panel" }];
}

export default function Contacts() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    // Assuming /admin/contacts exists based on the backend discussion,
    // or fallback to an empty array for now
    fetchApi("/admin/contacts").then(setMessages).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Contact Messages
        </h2>
        <p className="text-slate-400 mt-1">
          Read messages from the contact form.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-200">Name</th>
              <th className="px-6 py-4 font-medium text-slate-200">Email</th>
              <th className="px-6 py-4 font-medium text-slate-200">Date</th>
              <th className="px-6 py-4 font-medium text-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((m: any) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{m.name}</td>
                  <td className="px-6 py-4">{m.email}</td>
                  <td className="px-6 py-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedMessage(m)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Read
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Read Message</h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Name</p>
                <p className="text-white text-base">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Email & WhatsApp</p>
                <p className="text-white break-all">{selectedMessage.email}</p>
                {selectedMessage.whatsapp && <p className="text-white">{selectedMessage.whatsapp}</p>}
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Date</p>
                <p className="text-white">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-slate-400 text-xs uppercase tracking-wider mb-1">Message</p>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
