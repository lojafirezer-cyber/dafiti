import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import pixIcon from '@/assets/pix-icon.jpg';

interface PixLoadingOverlayProps {
  isVisible: boolean;
}

export function PixLoadingOverlay({ isVisible }: PixLoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Conectando ao servidor seguro...');

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setStatusText('Conectando ao servidor seguro...');
      return;
    }

    const steps = [
      { at: 15, text: 'Validando seus dados...' },
      { at: 35, text: 'Gerando código PIX...' },
      { at: 60, text: 'Comunicando com o banco...' },
      { at: 80, text: 'Quase lá...' },
      { at: 95, text: 'Finalizando...' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 1;
        const clamped = Math.min(next, 98);

        const step = steps.find((s) => prev < s.at && clamped >= s.at);
        if (step) setStatusText(step.text);

        return clamped;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-[9999] animate-fade-in">
      <div className="flex flex-col items-center gap-6 max-w-xs text-center px-4">
        {/* Pix icon with pulse */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <img src={pixIcon} alt="Pix" className="w-8 h-8 object-contain rounded" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/30 animate-ping" />
        </div>

        {/* Spinner */}
        <Loader2 className="w-6 h-6 animate-spin text-accent" />

        {/* Status text */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{statusText}</p>
          <p className="text-xs text-muted-foreground">Não feche esta página</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Ambiente 100% seguro</span>
        </div>
      </div>
    </div>
  );
}
