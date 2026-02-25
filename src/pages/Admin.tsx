import { useState } from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "direitaraiz2025") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  if (authenticated) {
    return <AdminDashboard password={password} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-sm text-muted-foreground text-center">
              Digite a senha para acessar o painel administrativo
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
