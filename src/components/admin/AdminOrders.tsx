import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, DollarSign, Clock } from "lucide-react";

interface AdminOrdersProps {
  password: string;
}

interface Order {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: Array<{ title: string; quantity: number; price: string }>;
  customer?: { first_name: string; last_name: string; email: string; phone: string };
  shipping_address?: { address1: string; city: string; province: string; zip: string };
  note?: string;
  tags?: string;
}

const AdminOrders = ({ password }: AdminOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { password, action: "orders", params: { limit: 50 } },
      });
      if (data?.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(value));

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      paid: { label: "Pago", variant: "default" },
      pending: { label: "Pendente", variant: "secondary" },
      refunded: { label: "Reembolsado", variant: "destructive" },
      voided: { label: "Cancelado", variant: "destructive" },
      authorized: { label: "Autorizado", variant: "outline" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const getFulfillmentBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Não enviado</Badge>;
    const map: Record<string, string> = { fulfilled: "Enviado", partial: "Parcial" };
    return <Badge variant="default">{map[status] || status}</Badge>;
  };

  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || "0"), 0);
  const paidOrders = orders.filter((o) => o.financial_status === "paid").length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue.toString())}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Pagos</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paidOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum pedido encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Envio</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "—"}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(order.financial_status)}</TableCell>
                      <TableCell>{getFulfillmentBadge(order.fulfillment_status)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(order.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
