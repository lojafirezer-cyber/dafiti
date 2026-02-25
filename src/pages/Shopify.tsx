import { useEffect } from 'react';

export default function Shopify() {
  useEffect(() => {
    window.location.href = 'https://redirect.direitaraiz.com';
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}
