export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Analytics Overview</h2>
        <p className="text-slate-400 mt-1">Monitor traffic and real-time user engagement.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Page Visits", value: "1,428,950", trend: "+14.2%" },
          { label: "Recent Post Views", value: "384,120", trend: "+8.6%" },
          { label: "Avg. Session Duration", value: "4m 32s", trend: "+18.4%" },
          { label: "Active Conversion Rate", value: "3.84%", trend: "+1.2%" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-medium text-slate-400">{kpi.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white">{kpi.value}</span>
              <span className="text-xs font-medium text-emerald-400">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area Placeholder */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Interactive Chart Component (To be integrated from Stitch UI)</p>
      </div>
    </div>
  );
}
