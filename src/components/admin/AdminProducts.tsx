import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

interface AdminProductsProps {
  password: string;
}

interface Product {
  id: number;
  title: string;
  status: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    inventory_quantity: number;
    sku: string;
  }>;
  images: Array<{ src: string }>;
  tags: string;
  product_type: string;
}

const AdminProducts = ({ password }: AdminProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { password, action: "products", params: { limit: 50 } },
      });
      if (data?.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(value));

  const getTotalInventory = (product: Product) =>
    product.variants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0);

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          <Package className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{products.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum produto encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Variantes</TableHead>
                    <TableHead className="text-center">Estoque</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images?.[0] ? (
                          <img src={product.images[0].src} alt={product.title} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{product.title}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status === "active" ? "Ativo" : product.status === "draft" ? "Rascunho" : product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{product.product_type || "—"}</TableCell>
                      <TableCell className="text-center">{product.variants.length}</TableCell>
                      <TableCell className="text-center">{getTotalInventory(product)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {product.variants.length > 0 ? formatCurrency(product.variants[0].price) : "—"}
                      </TableCell>
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

export default AdminProducts;
