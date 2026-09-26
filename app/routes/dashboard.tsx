import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    pageVisits: 0,
    postViews: 0,
    postShares: 0,
    postClicks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [pagesRes, postsRes] = await Promise.all([
          fetchApi("/admin/analytics/pages"),
          fetchApi("/admin/analytics/posts")
        ]);

        let totalVisits = 0;
        if (Array.isArray(pagesRes)) {
          totalVisits = pagesRes.reduce((sum, item) => sum + (item.visits || item._sum?.visitCount || 0), 0);
        }

        let totalViews = 0;
        let totalShares = 0;
        let totalClicks = 0;
        if (Array.isArray(postsRes)) {
          postsRes.forEach(post => {
            totalViews += (post.views || post._sum?.views || 0);
            totalShares += (post.shares || post._sum?.shares || 0);
            totalClicks += (post.clicks || post._sum?.clicks || 0);
          });
        }

        setStats({
          pageVisits: totalVisits,
          postViews: totalViews,
          postShares: totalShares,
          postClicks: totalClicks
        });
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Analytics Overview</h2>
        <p className="text-slate-400 mt-1">Real data fetched from backend analytics tables.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Page Visits", value: loading ? "..." : stats.pageVisits.toLocaleString() },
          { label: "Total Post Views", value: loading ? "..." : stats.postViews.toLocaleString() },
          { label: "Total Post Shares", value: loading ? "..." : stats.postShares.toLocaleString() },
          { label: "Total Post Clicks", value: loading ? "..." : stats.postClicks.toLocaleString() },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-medium text-slate-400">{kpi.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area Placeholder */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Interactive Chart Component (To be integrated from Stitch UI or Recharts)</p>
      </div>
    </div>
  );
}
