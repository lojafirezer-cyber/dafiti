import { useState, useEffect } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  Store,
  Tag,
  Target,
  FileText,
  Globe,
  Landmark,
  Settings,
  Eye,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  PaintBucket,
  File,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminAnalytics from "./AdminAnalytics";
import AdminProducts from "./AdminProducts";
import AdminFunnel from "./AdminFunnel";

interface AdminDashboardProps {
  password: string;
}

interface QuickStats {
  sessions: number;
  totalSales: number;
  ordersCount: number;
  conversionRate: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  children?: { id: string; label: string }[];
}

const mainNavItems: NavItem[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "orders", label: "Pedidos", icon: ShoppingCart },
  { id: "products", label: "Produtos", icon: Package },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "marketing", label: "Marketing", icon: Target },
  { id: "discounts", label: "Descontos", icon: Tag },
  { id: "content", label: "Conteúdo", icon: FileText },
  { id: "markets", label: "Markets", icon: Globe },
  { id: "finances", label: "Finanças", icon: Landmark },
  { id: "analytics", label: "Análises", icon: BarChart3 },
  { id: "funnel", label: "Funil de Vendas", icon: Target },
];

const salesChannels: NavItem[] = [
  {
    id: "online-store",
    label: "Loja virtual",
    icon: Store,
    children: [
      { id: "themes", label: "Temas" },
      { id: "pages", label: "Páginas" },
      { id: "preferences", label: "Preferências" },
    ],
  },
];

const AdminDashboard = ({ password }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState("home");
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [expandedChannels, setExpandedChannels] = useState<string[]>(["online-store"]);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    setLoadingStats(true);
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        supabase.functions.invoke("admin-data", {
          body: { password, action: "analytics", params: { days: 30 } },
        }),
        supabase.functions.invoke("admin-data", {
          body: { password, action: "orders", params: { limit: 50 } },
        }),
      ]);

      const sessions = analyticsRes.data?.success ? analyticsRes.data.data.uniqueVisitors : 0;
      const orders = ordersRes.data?.success ? ordersRes.data.data : [];
      const totalSales = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total_price || "0"), 0);
      const conversionRate = sessions > 0 ? (orders.length / sessions) * 100 : 0;

      setQuickStats({ sessions, totalSales, ordersCount: orders.length, conversionRate });
    } catch (err) {
      console.error("Error fetching quick stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => window.location.reload();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const toggleChannel = (id: string) => {
    setExpandedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "orders": return <AdminOrders password={password} />;
      case "products": return <AdminProducts password={password} />;
      case "customers": return <AdminCustomers password={password} />;
      case "analytics": return <AdminAnalytics password={password} />;
      case "funnel": return <AdminFunnel />;
      case "home":
      default: return <DashboardHome
        quickStats={quickStats}
        loadingStats={loadingStats}
        formatCurrency={formatCurrency}
        onNavigate={setActiveSection}
      />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ─── Sidebar ─── */}
      <aside
        className="w-[240px] flex flex-col flex-shrink-0 overflow-y-auto"
        style={{ background: "hsl(var(--polaris-nav-bg))" }}
      >
        {/* Store selector */}
        <div className="px-3 pt-3 pb-1">
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors hover:bg-[hsl(var(--polaris-nav-bg-hover))]">
            <div className="w-7 h-7 rounded-md bg-[hsl(153,52%,45%)] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-[11px]">DR</span>
            </div>
            <span className="text-[13px] font-semibold text-white truncate">Direita Raiz</span>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-2 py-1">
          <ul className="space-y-[1px]">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-all ${
                      isActive
                        ? "bg-[hsl(var(--polaris-nav-bg-active))] text-white font-medium"
                        : "text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sales channels */}
          <div className="mt-4 pt-3 border-t border-white/[0.08]">
            <p className="px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--polaris-nav-text))]/50">
              Canais de vendas
            </p>
            {salesChannels.map((channel) => {
              const Icon = channel.icon;
              const isExpanded = expandedChannels.includes(channel.id);
              return (
                <div key={channel.id}>
                  <div className="flex items-center group">
                    <button
                      onClick={() => toggleChannel(channel.id)}
                      className="flex-1 flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white transition-all"
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.8} />
                      <span>{channel.label}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                    <button className="p-1 mr-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[hsl(var(--polaris-nav-bg-active))] transition-all">
                      <Eye className="w-3.5 h-3.5 text-[hsl(var(--polaris-nav-text))]" />
                    </button>
                  </div>
                  {isExpanded && channel.children && (
                    <ul className="ml-4 pl-3 border-l border-white/[0.06]">
                      {channel.children.map((child) => (
                        <li key={child.id}>
                          <button className="w-full text-left px-2.5 py-[6px] rounded-lg text-[13px] text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white transition-all">
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Apps */}
          <div className="mt-3 pt-3 border-t border-white/[0.08]">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white transition-all">
              <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={1.8} />
              <span>Apps</span>
            </button>
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-2 py-2 border-t border-white/[0.08]">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white transition-all">
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span>Configurações</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-[hsl(var(--polaris-nav-text))] hover:bg-[hsl(var(--polaris-nav-bg-hover))] hover:text-white transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ─── Main area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "hsl(var(--polaris-bg-surface))" }}>
        {/* Top bar */}
        <header
          className="h-[52px] flex items-center px-4 gap-3 flex-shrink-0 border-b"
          style={{
            background: "hsl(var(--polaris-topbar-bg))",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="relative flex-1 max-w-[580px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              placeholder="Pesquisar"
              readOnly
              className="w-full h-9 pl-9 pr-16 rounded-lg text-[13px] text-white/80 placeholder:text-white/30 border border-white/[0.12] bg-white/[0.06] outline-none focus:border-white/[0.25] focus:bg-white/[0.09] transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 bg-white/[0.06] border border-white/[0.1] rounded px-1.5 py-0.5 font-mono">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Sidekick */}
            <button className="p-2 rounded-lg hover:bg-white/[0.08] transition-colors">
              <Sparkles className="w-[18px] h-[18px] text-white/50" />
            </button>
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/[0.08] transition-colors">
              <Bell className="w-[18px] h-[18px] text-white/50" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                4
              </span>
            </button>
            {/* Avatar */}
            <button className="ml-1 w-7 h-7 rounded-full bg-[hsl(153,52%,45%)] flex items-center justify-center hover:ring-2 hover:ring-white/20 transition-all">
              <span className="text-white text-[10px] font-bold">DR</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[960px] mx-auto px-6 py-6">
            {activeSection !== "home" && (
              <div className="mb-5">
                <h1 className="text-xl font-semibold" style={{ color: "hsl(var(--polaris-text-primary))" }}>
                  {mainNavItems.find((n) => n.id === activeSection)?.label}
                </h1>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ─── Dashboard Home component ─── */
interface DashboardHomeProps {
  quickStats: QuickStats | null;
  loadingStats: boolean;
  formatCurrency: (v: number) => string;
  onNavigate: (section: string) => void;
}

const DashboardHome = ({ quickStats, loadingStats, formatCurrency, onNavigate }: DashboardHomeProps) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold" style={{ color: "hsl(var(--polaris-text-primary))" }}>
        Início
      </h1>
      <Button variant="outline" size="sm" className="gap-1.5 text-[13px] font-normal rounded-lg h-8 border-[hsl(var(--polaris-border-subdued))]">
        📅 Últimos 30 dias <ChevronDown className="w-3 h-3" />
      </Button>
    </div>

    {/* Stats */}
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--polaris-border-subdued))", background: "hsl(var(--polaris-bg-surface-secondary))" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {loadingStats ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border-r last:border-r-0" style={{ borderColor: "hsl(var(--polaris-border-subdued))" }}>
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Sessões" value={String(quickStats?.sessions ?? 0)} />
            <StatCard label="Total de vendas" value={formatCurrency(quickStats?.totalSales ?? 0)} />
            <StatCard label="Pedidos" value={String(quickStats?.ordersCount ?? 0)} />
            <StatCard label="Taxa de conversão" value={`${(quickStats?.conversionRate ?? 0).toFixed(1)}%`} isLast />
          </>
        )}
      </div>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { id: "orders", label: "Pedidos", desc: "Ver todos os pedidos recentes", icon: ShoppingCart },
        { id: "products", label: "Produtos", desc: "Gerenciar catálogo de produtos", icon: Package },
        { id: "customers", label: "Clientes", desc: "Ver dados dos clientes", icon: Users },
        { id: "analytics", label: "Análises", desc: "Acompanhar acessos e métricas", icon: BarChart3 },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all hover:shadow-sm active:scale-[0.99]"
            style={{
              borderColor: "hsl(var(--polaris-border-subdued))",
              background: "hsl(var(--polaris-bg-surface-secondary))",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(var(--polaris-bg-surface))" }}
            >
              <Icon className="w-5 h-5" style={{ color: "hsl(var(--polaris-icon-default))" }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "hsl(var(--polaris-text-primary))" }}>
                {item.label}
              </p>
              <p className="text-[12px]" style={{ color: "hsl(var(--polaris-text-secondary))" }}>
                {item.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) => (
  <div
    className={`p-4 ${isLast ? "" : "border-r"}`}
    style={{ borderColor: "hsl(var(--polaris-border-subdued))" }}
  >
    <p className="text-[11px] font-medium mb-1" style={{ color: "hsl(var(--polaris-text-secondary))" }}>
      {label}
    </p>
    <span className="text-lg font-semibold" style={{ color: "hsl(var(--polaris-text-primary))" }}>
      {value}
    </span>
  </div>
);

export default AdminDashboard;
