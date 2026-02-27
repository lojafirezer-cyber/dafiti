import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, ShoppingCart, CreditCard, CheckCircle, TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";

interface FunnelData {
  product_views: number;
  add_to_cart: number;
  checkout_started: number;
  purchases: number;
  top_viewed: Array<{ product_title: string; count: number }>;
  top_added: Array<{ product_title: string; count: number }>;
  recent_events: Array<{
    event_type: string;
    product_title: string | null;
    order_id: string | null;
    created_at: string;
    price: number | null;
    order_total: number | null;
    quantity: number | null;
  }>;
  prev_product_views: number;
  prev_add_to_cart: number;
  prev_checkout_started: number;
  prev_purchases: number;
}

const eventConfig: Record<string, { label: string; bgClass: string; textClass: string; statusLabel: string; statusClass: string }> = {
  product_view: { label: "VISITA", bgClass: "bg-blue-100", textClass: "text-blue-700", statusLabel: "Visualizado", statusClass: "text-blue-500" },
  add_to_cart: { label: "CARRINHO", bgClass: "bg-orange-100", textClass: "text-orange-700", statusLabel: "Ativo", statusClass: "text-orange-500" },
  checkout_started: { label: "CHECKOUT", bgClass: "bg-purple-100", textClass: "text-purple-700", statusLabel: "Pendente", statusClass: "text-yellow-500" },
  purchase: { label: "COMPRA", bgClass: "bg-green-100", textClass: "text-green-700", statusLabel: "Sucesso", statusClass: "text-green-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `Há ${diff}s`;
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)}h`;
  return `Há ${Math.floor(diff / 86400)}d`;
}

function pct(a: number, b: number) {
  return b > 0 ? ((a / b) * 100).toFixed(1) : "0.0";
}

function DiffBadge({ now, prev }: { now: number; prev: number }) {
  if (prev === 0) return <p className="text-xs text-slate-400 mt-4">Sem dados anteriores</p>;
  const diff = ((now - prev) / prev) * 100;
  const up = diff >= 0;
  return (
    <p className={`text-xs mt-4 font-medium ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? "↑" : "↓"} {Math.abs(diff).toFixed(1)}% vs período anterior
    </p>
  );
}

const AdminFunnel = () => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const since = new Date(now);
      since.setDate(since.getDate() - days);
      const prevSince = new Date(since);
      prevSince.setDate(prevSince.getDate() - days);

      const [currRes, prevRes] = await Promise.all([
        (supabase.from("funnel_events") as any)
          .select("*")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .limit(500),
        (supabase.from("funnel_events") as any)
          .select("event_type")
          .gte("created_at", prevSince.toISOString())
          .lt("created_at", since.toISOString())
          .limit(500),
      ]);

      const events = currRes.data || [];
      const prevEvents = prevRes.data || [];

      const count = (list: any[], type: string) => list.filter((e: any) => e.event_type === type).length;

      // Top viewed
      const viewMap: Record<string, number> = {};
      events.filter((e: any) => e.event_type === "product_view" && e.product_title).forEach((e: any) => {
        viewMap[e.product_title] = (viewMap[e.product_title] || 0) + 1;
      });
      const top_viewed = Object.entries(viewMap).map(([product_title, count]) => ({ product_title, count })).sort((a, b) => b.count - a.count).slice(0, 8);

      // Top added
      const atcMap: Record<string, number> = {};
      events.filter((e: any) => e.event_type === "add_to_cart" && e.product_title).forEach((e: any) => {
        atcMap[e.product_title] = (atcMap[e.product_title] || 0) + 1;
      });
      const top_added = Object.entries(atcMap).map(([product_title, count]) => ({ product_title, count })).sort((a, b) => b.count - a.count).slice(0, 8);

      setData({
        product_views: count(events, "product_view"),
        add_to_cart: count(events, "add_to_cart"),
        checkout_started: count(events, "checkout_started"),
        purchases: count(events, "purchase"),
        top_viewed,
        top_added,
        recent_events: events.slice(0, 40),
        prev_product_views: count(prevEvents, "product_view"),
        prev_add_to_cart: count(prevEvents, "add_to_cart"),
        prev_checkout_started: count(prevEvents, "checkout_started"),
        prev_purchases: count(prevEvents, "purchase"),
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const conversionRate = data ? (data.product_views > 0 ? ((data.purchases / data.product_views) * 100).toFixed(2) : "0.00") : "0.00";
  const cartAbandonment = data ? (data.add_to_cart > 0 ? (100 - (data.checkout_started / data.add_to_cart) * 100).toFixed(0) : "0") : "0";
  const checkoutEfficiency = data ? pct(data.purchases, data.checkout_started) : "0.0";

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["Evento", "Produto", "Valor", "Pedido", "Data/Hora"],
      ...data.recent_events.map((e) => [
        eventConfig[e.event_type]?.label || e.event_type,
        e.product_title || "-",
        e.price ? `R$ ${Number(e.price).toFixed(2)}` : e.order_total ? `R$ ${Number(e.order_total).toFixed(2)}` : "-",
        e.order_id || "-",
        new Date(e.created_at).toLocaleString("pt-BR"),
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "eventos-funil.csv"; a.click();
  };

  return (
    <div className="min-h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoramento de Eventos em Tempo Real</h1>
          <p className="text-slate-500 text-sm mt-0.5">Acompanhe o funil de conversão da loja</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period filter */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {[7, 15, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${days === d ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {d}d
              </button>
            ))}
          </div>
          <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-600"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </header>

      {lastUpdated && (
        <p className="text-xs text-slate-400 mb-6">
          Última atualização: {lastUpdated.toLocaleTimeString("pt-BR")}
        </p>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Produtos Visitados", value: data?.product_views ?? 0, prev: data?.prev_product_views ?? 0, icon: Eye, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Adicionados ao Carrinho", value: data?.add_to_cart ?? 0, prev: data?.prev_add_to_cart ?? 0, icon: ShoppingCart, iconBg: "bg-orange-50", iconColor: "text-orange-600" },
          { label: "Inícios de Checkout", value: data?.checkout_started ?? 0, prev: data?.prev_checkout_started ?? 0, icon: CreditCard, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
          { label: "Compras Finalizadas", value: data?.purchases ?? 0, prev: data?.prev_purchases ?? 0, icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-600" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{kpi.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {loading ? <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse" /> : kpi.value.toLocaleString("pt-BR")}
                  </h3>
                </div>
                <div className={`p-2.5 ${kpi.iconBg} ${kpi.iconColor} rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              {!loading && <DiffBadge now={kpi.value} prev={kpi.prev} />}
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Event Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-5">Log de Eventos Recentes</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs border-b border-slate-100">
                    <th className="pb-3 font-semibold">Evento</th>
                    <th className="pb-3 font-semibold">Produto</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold">Horário</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data?.recent_events.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-400">Nenhum evento registrado ainda</td></tr>
                  )}
                  {data?.recent_events.map((e, i) => {
                    const cfg = eventConfig[e.event_type] || eventConfig.product_view;
                    const value = e.order_total ? e.order_total : e.price ? e.price * (e.quantity || 1) : null;
                    return (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${cfg.bgClass} ${cfg.textClass}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 text-slate-700 max-w-[160px] truncate">
                          {e.product_title || (e.order_id ? `Pedido ${e.order_id}` : "—")}
                        </td>
                        <td className="py-3 text-slate-700 font-medium">
                          {value ? `R$ ${Number(value).toFixed(2)}` : "—"}
                        </td>
                        <td className="py-3 text-slate-400 text-xs">{timeAgo(e.created_at)}</td>
                        <td className="py-3">
                          <span className={`font-bold text-xs ${cfg.statusClass}`}>● {cfg.statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Conversion Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-sm border-0">
          <h3 className="font-bold mb-1 text-blue-100 text-sm">Conversão Geral</h3>
          <p className="text-xs text-blue-200 mb-6">Visita → Compra (últimos {days}d)</p>
          <div className="text-center py-6">
            <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-blue-400/30 mb-4">
              <span className="text-4xl font-bold">{conversionRate}%</span>
              <span className="text-blue-200 text-xs">conversão</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Abandono de Carrinho</span>
                <span className="font-bold">{cartAbandonment}%</span>
              </div>
              <div className="w-full bg-blue-900/50 h-2 rounded-full">
                <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${cartAbandonment}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Checkout Eficaz</span>
                <span className="font-bold">{checkoutEfficiency}%</span>
              </div>
              <div className="w-full bg-blue-900/50 h-2 rounded-full">
                <div className="bg-green-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(parseFloat(checkoutEfficiency), 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>View → Carrinho</span>
                <span className="font-bold">{pct(data?.add_to_cart || 0, data?.product_views || 1)}%</span>
              </div>
              <div className="w-full bg-blue-900/50 h-2 rounded-full">
                <div className="bg-blue-300 h-2 rounded-full transition-all" style={{ width: `${Math.min(parseFloat(pct(data?.add_to_cart || 0, data?.product_views || 1)), 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Funnel steps mini */}
          <div className="mt-6 pt-4 border-t border-blue-500/30 space-y-2">
            {[
              { label: "Visitas", value: data?.product_views || 0 },
              { label: "Carrinho", value: data?.add_to_cart || 0 },
              { label: "Checkout", value: data?.checkout_started || 0 },
              { label: "Compras", value: data?.purchases || 0 },
            ].map((step, i) => {
              const max = data?.product_views || 1;
              const w = Math.max((step.value / max) * 100, step.value > 0 ? 4 : 0);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-14 text-blue-200 text-right">{step.label}</span>
                  <div className="flex-1 bg-blue-900/50 h-5 rounded overflow-hidden">
                    <div className="h-full bg-white/20 rounded flex items-center px-2 transition-all" style={{ width: `${w}%`, minWidth: step.value > 0 ? "2rem" : 0 }}>
                      <span className="font-bold text-white text-[10px]">{step.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top viewed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            Produtos Mais Visitados
          </h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-8 bg-slate-100 rounded animate-pulse"/>)}</div>
          ) : data?.top_viewed.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Sem dados ainda</p>
          ) : (
            <div className="space-y-3">
              {data?.top_viewed.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-5 text-center font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-700 truncate">{p.product_title}</span>
                      <span className="text-xs font-bold text-blue-600 ml-2 flex-shrink-0">{p.count}x</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(p.count / (data.top_viewed[0]?.count || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top added to cart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-orange-500" />
            Mais Adicionados ao Carrinho
          </h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-8 bg-slate-100 rounded animate-pulse"/>)}</div>
          ) : data?.top_added.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Sem dados ainda</p>
          ) : (
            <div className="space-y-3">
              {data?.top_added.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-5 text-center font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-700 truncate">{p.product_title}</span>
                      <span className="text-xs font-bold text-orange-600 ml-2 flex-shrink-0">{p.count}x</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(p.count / (data.top_added[0]?.count || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFunnel;
