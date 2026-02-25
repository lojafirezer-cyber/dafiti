import { Loader2 } from 'lucide-react';

interface NavigationLoaderProps {
  isVisible: boolean;
  message?: string;
}

export function NavigationLoader({ isVisible, message = 'Carregando...' }: NavigationLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
