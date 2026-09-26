import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";

export default function Contacts() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Assuming /admin/contacts exists based on the backend discussion, 
    // or fallback to an empty array for now
    fetchApi("/admin/contacts").then(setMessages).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Contact Messages</h2>
        <p className="text-slate-400 mt-1">Read messages from the contact form.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Side: Message List */}
        <div className="w-1/3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 font-medium text-slate-200">Inbox</div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {messages.length === 0 ? (
               <div className="text-slate-500 p-4 text-center text-sm">No messages.</div>
            ) : (
              messages.map((m: any) => (
                <div key={m.id} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                  <div className="font-medium text-white text-sm">{m.name}</div>
                  <div className="text-xs text-slate-400 truncate mt-1">{m.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Message Preview */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md p-8 flex items-center justify-center text-slate-500">
          Select a message to read.
        </div>
      </div>
    </div>
  );
}
