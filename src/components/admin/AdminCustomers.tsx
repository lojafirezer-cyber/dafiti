import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface AdminCustomersProps {
  password: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  orders_count: number;
  total_spent: string;
  created_at: string;
  default_address?: { city: string; province: string };
}

const AdminCustomers = ({ password }: AdminCustomersProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { password, action: "customers", params: { limit: 50 } },
      });
      if (data?.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(value));

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gasto</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(customers.reduce((sum, c) => sum + parseFloat(c.total_spent || "0"), 0).toString())}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead className="text-center">Pedidos</TableHead>
                    <TableHead className="text-right">Total Gasto</TableHead>
                    <TableHead>Desde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.first_name} {customer.last_name}</TableCell>
                      <TableCell className="text-sm">{customer.email}</TableCell>
                      <TableCell className="text-sm">{customer.phone || "—"}</TableCell>
                      <TableCell className="text-sm">
                        {customer.default_address ? `${customer.default_address.city}, ${customer.default_address.province}` : "—"}
                      </TableCell>
                      <TableCell className="text-center">{customer.orders_count}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(customer.total_spent)}</TableCell>
                      <TableCell className="text-sm">{formatDate(customer.created_at)}</TableCell>
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

export default AdminCustomers;
