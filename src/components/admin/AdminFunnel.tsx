import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ShoppingCart, CreditCard, CheckCircle, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from "recharts";

interface FunnelData {
  product_views: number;
  add_to_cart: number;
  checkout_started: number;
  purchases: number;
  top_viewed: Array<{ product_title: string; count: number }>;
  top_added: Array<{ product_title: string; count: number }>;
  recent_events: Array<{ event_type: string; product_title: string | null; order_id: string | null; created_at: string; price: number | null; quantity: number | null }>;
  daily_atc: Array<{ date: string; count: number }>;
}

const AdminFunnel = () => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString();

      const { data: events } = await (supabase.from('funnel_events') as any)
        .select('*')
        .gte('created_at', sinceStr)
        .order('created_at', { ascending: false })
        .limit(500);

      if (!events) return;

      const counts = {
        product_views: events.filter((e: any) => e.event_type === 'product_view').length,
        add_to_cart: events.filter((e: any) => e.event_type === 'add_to_cart').length,
        checkout_started: events.filter((e: any) => e.event_type === 'checkout_started').length,
        purchases: events.filter((e: any) => e.event_type === 'purchase').length,
      };

      // Top viewed products
      const viewMap: Record<string, number> = {};
      events.filter((e: any) => e.event_type === 'product_view' && e.product_title).forEach((e: any) => {
        viewMap[e.product_title] = (viewMap[e.product_title] || 0) + 1;
      });
      const top_viewed = Object.entries(viewMap)
        .map(([product_title, count]) => ({ product_title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top added to cart
      const atcMap: Record<string, number> = {};
      events.filter((e: any) => e.event_type === 'add_to_cart' && e.product_title).forEach((e: any) => {
        atcMap[e.product_title] = (atcMap[e.product_title] || 0) + 1;
      });
      const top_added = Object.entries(atcMap)
        .map(([product_title, count]) => ({ product_title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily add to cart
      const dailyMap: Record<string, number> = {};
      events.filter((e: any) => e.event_type === 'add_to_cart').forEach((e: any) => {
        const day = e.created_at.split('T')[0];
        dailyMap[day] = (dailyMap[day] || 0) + 1;
      });
      const daily_atc = Object.entries(dailyMap)
        .map(([date, count]) => ({ date: date.slice(5), count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setData({
        ...counts,
        top_viewed,
        top_added,
        recent_events: events.slice(0, 30),
        daily_atc,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground text-center py-8">Sem dados de funil</p>;

  const funnelSteps = [
    { label: "Visualizações de Produto", value: data.product_views, icon: Eye, color: "hsl(217, 91%, 60%)" },
    { label: "Adicionou ao Carrinho", value: data.add_to_cart, icon: ShoppingCart, color: "hsl(43, 96%, 56%)" },
    { label: "Iniciou Checkout", value: data.checkout_started, icon: CreditCard, color: "hsl(27, 96%, 61%)" },
    { label: "Compras Finalizadas", value: data.purchases, icon: CheckCircle, color: "hsl(142, 71%, 45%)" },
  ];

  const convATC = data.product_views > 0 ? ((data.add_to_cart / data.product_views) * 100).toFixed(1) : '0';
  const convCheckout = data.add_to_cart > 0 ? ((data.checkout_started / data.add_to_cart) * 100).toFixed(1) : '0';
  const convPurchase = data.checkout_started > 0 ? ((data.purchases / data.checkout_started) * 100).toFixed(1) : '0';

  const eventLabels: Record<string, string> = {
    product_view: '👁️ Visualizou produto',
    add_to_cart: '🛒 Adicionou ao carrinho',
    checkout_started: '💳 Iniciou checkout',
    purchase: '✅ Compra finalizada',
  };

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="flex gap-2">
        {[7, 15, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all border ${
              days === d
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {d} dias
          </button>
        ))}
      </div>

      {/* Funnel Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {funnelSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: step.color + '22' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">{step.label}</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: step.color }}>{step.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion Rates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Taxas de Conversão do Funil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{convATC}%</p>
              <p className="text-[11px] text-muted-foreground mt-1">Visualização → Carrinho</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-bold text-orange-500">{convCheckout}%</p>
              <p className="text-[11px] text-muted-foreground mt-1">Carrinho → Checkout</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{convPurchase}%</p>
              <p className="text-[11px] text-muted-foreground mt-1">Checkout → Compra</p>
            </div>
          </div>
          {/* Visual funnel bar */}
          <div className="mt-4 space-y-2">
            {funnelSteps.map((step, i) => {
              const max = data.product_views || 1;
              const pct = Math.max((step.value / max) * 100, 2);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-36 text-right truncate">{step.label}</span>
                  <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${pct}%`, background: step.color }}
                    >
                      <span className="text-[10px] font-bold text-white">{step.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily ATC */}
        {data.daily_atc.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Adições ao Carrinho por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.daily_atc}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(43, 96%, 56%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top added to cart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Produtos Mais Adicionados ao Carrinho</CardTitle>
          </CardHeader>
          <CardContent>
            {data.top_added.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Sem dados ainda</p>
            ) : (
              <div className="space-y-2">
                {data.top_added.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] truncate">{p.product_title}</span>
                        <span className="text-[11px] font-bold text-yellow-600 ml-2">{p.count}x</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(p.count / data.top_added[0].count) * 100}%`, background: 'hsl(43, 96%, 56%)' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top viewed products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Produtos Mais Visualizados</CardTitle>
        </CardHeader>
        <CardContent>
          {data.top_viewed.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">Sem dados ainda</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Visualizações</TableHead>
                  <TableHead className="text-right">No carrinho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.top_viewed.map((p, i) => {
                  const atcCount = data.top_added.find(a => a.product_title === p.product_title)?.count || 0;
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground text-[12px]">{i + 1}</TableCell>
                      <TableCell className="font-medium text-[13px]">{p.product_title}</TableCell>
                      <TableCell className="text-right text-[13px]">{p.count}</TableCell>
                      <TableCell className="text-right text-[13px] text-yellow-600 font-medium">{atcCount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.recent_events.map((e: any, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <span className="text-[12px] whitespace-nowrap text-muted-foreground">
                  {new Date(e.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[12px] flex-1">
                  {eventLabels[e.event_type] || e.event_type}
                  {e.product_title && <span className="text-muted-foreground"> · {e.product_title}</span>}
                  {e.order_id && <span className="text-green-600 font-medium"> · Pedido {e.order_id}</span>}
                  {e.price && <span className="text-muted-foreground"> · R$ {Number(e.price).toFixed(2)}</span>}
                </span>
              </div>
            ))}
            {data.recent_events.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhum evento registrado ainda</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFunnel;
