import { useEffect, useState } from "react";
import { Users, Eye, Clock, TrendingDown, RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  pageviewsPerVisit: number;
  sessionDuration: number;
  bounceRate: number;
  dailyVisitors: Array<{ date: string; visitors: number; pageviews: number }>;
  topPages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
}

const STATIC_DATA: AnalyticsData = {
  visitors: 585,
  pageviews: 1158,
  pageviewsPerVisit: 1.98,
  sessionDuration: 37,
  bounceRate: 65,
  dailyVisitors: [
    { date: "19 Fev", visitors: 0, pageviews: 0 },
    { date: "20 Fev", visitors: 0, pageviews: 0 },
    { date: "21 Fev", visitors: 0, pageviews: 0 },
    { date: "22 Fev", visitors: 0, pageviews: 0 },
    { date: "23 Fev", visitors: 0, pageviews: 0 },
    { date: "24 Fev", visitors: 0, pageviews: 0 },
    { date: "25 Fev", visitors: 0, pageviews: 0 },
    { date: "26 Fev", visitors: 280, pageviews: 586 },
    { date: "27 Fev", visitors: 305, pageviews: 572 },
  ],
  topPages: [
    { page: "/", count: 540 },
    { page: "/produto/sandalia-modare-plataforma-tiras-em-strass", count: 142 },
    { page: "/produto/tenis-modare-casual", count: 31 },
    { page: "/checkout", count: 26 },
    { page: "/produto/tenis-modare-calce-facil", count: 18 },
    { page: "/produtos", count: 15 },
    { page: "/produto/sandalia-rasteirinha-feminina-modare", count: 14 },
    { page: "/produto/sandalia-modare-detalhe-de-laco-oncinha", count: 10 },
    { page: "/produto/sandalia-modare-rasteirinha-tiras", count: 7 },
    { page: "/produto/sandalia-papete-modare-casual", count: 6 },
  ],
  sources: [
    { source: "tiktok.com", count: 450 },
    { source: "Direto", count: 137 },
  ],
  devices: [
    { device: "mobile", count: 548 },
    { device: "desktop", count: 31 },
    { device: "tablet", count: 6 },
  ],
  countries: [
    { country: "BR", count: 472 },
    { country: "Desconhecido", count: 94 },
    { country: "US", count: 18 },
    { country: "SG", count: 1 },
  ],
};

const deviceIcon = (d: string) => {
  if (d === "mobile") return <Smartphone className="w-3.5 h-3.5" />;
  if (d === "tablet") return <Tablet className="w-3.5 h-3.5" />;
  return <Monitor className="w-3.5 h-3.5" />;
};

const deviceLabel: Record<string, string> = { mobile: "Mobile", desktop: "Desktop", tablet: "Tablet" };

const AdminAnalytics = () => {
  const [data] = useState<AnalyticsData>(STATIC_DATA);
  const [activeMetric, setActiveMetric] = useState<"visitors" | "pageviews">("visitors");
  const [period] = useState("Últimos 7 dias");

  const maxPage = data.topPages[0]?.count || 1;
  const maxSource = data.sources[0]?.count || 1;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            8 visitantes atuais
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition">
            {period} ▾
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Visitantes", value: data.visitors.toLocaleString("pt-BR"), icon: Users, metric: "visitors" as const, active: activeMetric === "visitors" },
          { label: "Visualizações de página", value: data.pageviews.toLocaleString("pt-BR"), icon: Eye, metric: "pageviews" as const, active: activeMetric === "pageviews" },
          { label: "Páginas por visita", value: data.pageviewsPerVisit.toFixed(1), icon: null, metric: null, active: false },
          { label: "Duração da visita", value: `${data.sessionDuration}s`, icon: Clock, metric: null, active: false },
          { label: "Taxa de rejeição", value: `${data.bounceRate}%`, icon: TrendingDown, metric: null, active: false },
        ].map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => kpi.metric && setActiveMetric(kpi.metric)}
            className={`p-4 rounded-xl border text-left transition-all ${
              kpi.active
                ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                : "border-slate-200 bg-white hover:border-slate-300"
            } ${kpi.metric ? "cursor-pointer" : "cursor-default"}`}
          >
            <p className="text-xs text-slate-500 font-medium mb-1 leading-tight">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.active ? "text-blue-700" : "text-slate-800"}`}>
              {kpi.value}
            </p>
          </button>
        ))}
      </div>

      {/* Area Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyVisitors} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={activeMetric === "visitors" ? "#3b82f6" : "#8b5cf6"}
                strokeWidth={2}
                fill={activeMetric === "visitors" ? "url(#colorVisitors)" : "url(#colorPageviews)"}
                dot={false}
                activeDot={{ r: 4, fill: activeMetric === "visitors" ? "#3b82f6" : "#8b5cf6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Páginas</h3>
          <div className="space-y-2.5">
            {data.topPages.map((p) => (
              <div key={p.page}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 truncate max-w-[75%]">{p.page}</span>
                  <span className="font-semibold text-slate-800 ml-2 flex-shrink-0">{p.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(p.count / maxPage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Sources */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Fontes</h3>
            <div className="space-y-2.5">
              {data.sources.map((s) => (
                <div key={s.source}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{s.source}</span>
                    <span className="font-semibold text-slate-800">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(s.count / maxSource) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Dispositivos</h3>
            <div className="flex gap-3">
              {data.devices.map((d) => {
                const total = data.devices.reduce((s, x) => s + x.count, 0);
                const pct = ((d.count / total) * 100).toFixed(0);
                return (
                  <div key={d.device} className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-center text-slate-500 mb-1">{deviceIcon(d.device)}</div>
                    <p className="text-lg font-bold text-slate-800">{pct}%</p>
                    <p className="text-[10px] text-slate-500">{deviceLabel[d.device] || d.device}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Países</h3>
            <div className="space-y-2">
              {data.countries.map((c) => (
                <div key={c.country} className="flex justify-between text-xs">
                  <span className="text-slate-600">{c.country}</span>
                  <span className="font-semibold text-slate-800">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
