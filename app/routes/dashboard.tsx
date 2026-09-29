import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { format, subDays } from "date-fns";

export function meta() {
  return [{ title: "Dashboard | Admin Panel" }];
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    pageVisits: 0,
    uniquePageVisits: 0,
    postViews: 0,
    postShares: 0,
    postClicks: 0,
    uniquePostVisitors: 0,
  });
  const [timeSeriesPages, setTimeSeriesPages] = useState<any[]>([]);
  const [timeSeriesPosts, setTimeSeriesPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default to last 30 days
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const [pagesData, postsData] = await Promise.all([
          fetchApi(`/admin/analytics/pages${queryString}`),
          fetchApi(`/admin/analytics/posts${queryString}`)
        ]);

        const pagesRes = pagesData.aggregates || pagesData;
        const pagesTimeSeries = pagesData.timeSeries || [];
        
        const postsRes = postsData.aggregates || postsData;
        const postsTimeSeries = postsData.timeSeries || [];

        let totalVisits = 0;
        let uniqueVisits = 0;
        if (Array.isArray(pagesRes)) {
          pagesRes.forEach(item => {
            totalVisits += (item.visitCount || 0);
            uniqueVisits += (item.uniqueIPs || 0);
          });
        }

        let totalViews = 0;
        let totalShares = 0;
        let totalClicks = 0;
        let uniquePostVisitors = 0;
        if (Array.isArray(postsRes)) {
          postsRes.forEach(post => {
            totalViews += (post.views || 0);
            totalShares += (post.shares || 0);
            totalClicks += (post.clicks || 0);
            uniquePostVisitors += (post.uniqueIPs || 0);
          });
        }

        setStats({
          pageVisits: totalVisits,
          uniquePageVisits: uniqueVisits,
          postViews: totalViews,
          postShares: totalShares,
          postClicks: totalClicks,
          uniquePostVisitors: uniquePostVisitors,
        });

        setTimeSeriesPages(pagesTimeSeries);
        setTimeSeriesPosts(postsTimeSeries);

      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [startDate, endDate]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Analytics Overview</h2>
          <p className="text-slate-400 mt-1">Detailed performance metrics for your portfolio and blog.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-lg backdrop-blur-md">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]"
          />
          <span className="text-slate-500">to</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Total Page Visits", value: loading ? "..." : stats.pageVisits.toLocaleString() },
          { label: "Unique Visitors", value: loading ? "..." : stats.uniquePageVisits.toLocaleString(), highlight: true },
          { label: "Total Post Views", value: loading ? "..." : stats.postViews.toLocaleString() },
          { label: "Unique Readers", value: loading ? "..." : stats.uniquePostVisitors.toLocaleString(), highlight: true },
          { label: "Total Post Shares", value: loading ? "..." : stats.postShares.toLocaleString() },
          { label: "Total Post Clicks", value: loading ? "..." : stats.postClicks.toLocaleString() },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md relative overflow-hidden ${kpi.highlight ? 'ring-1 ring-primary/30' : ''}`}>
            {kpi.highlight && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8" />}
            <h3 className="text-sm font-medium text-slate-400">{kpi.label}</h3>
            <div className="mt-2 flex items-baseline gap-2 relative z-10">
              <span className="text-3xl font-semibold text-white">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Page Visits Chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-medium text-white mb-6">Page Visits Over Time</h3>
          <div className="h-[350px] w-full">
            {timeSeriesPages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesPages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" name="Total Visits" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                {loading ? "Loading chart data..." : "No visit data for this period"}
              </div>
            )}
          </div>
        </div>

        {/* Post Engagement Chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-medium text-white mb-6">Post Engagement Over Time</h3>
          <div className="h-[350px] w-full">
            {timeSeriesPosts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesPosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Views" />
                  <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Shares" />
                  <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Clicks" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                {loading ? "Loading chart data..." : "No engagement data for this period"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
