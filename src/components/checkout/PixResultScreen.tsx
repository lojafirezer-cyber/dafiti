import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pixIcon from '@/assets/pix-icon.jpg';
import { formatPrice } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

interface PixResultScreenProps {
  qrCodeBase64: string;
  copyPasteCode: string;
  amount: number;
  saleId?: string;
  expiresInSeconds?: number;
  onPaymentDone?: () => void;
}

export function PixResultScreen({
  qrCodeBase64,
  copyPasteCode,
  amount,
  saleId,
  expiresInSeconds = 1800,
  onPaymentDone,
}: PixResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(expiresInSeconds);
  const [isVerifying, setIsVerifying] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const checkPaymentStatus = useCallback(async (): Promise<boolean> => {
    if (!saleId) return false;
    try {
      const { data, error } = await supabase.functions.invoke('check-payment-status', {
        body: { saleId },
      });
      if (error) {
        console.error('Error checking payment status:', error);
        return false;
      }
      console.log('Payment status:', data);
      const status = data?.data?.status || data?.status;
      return status === 'paid' || status === 'approved' || status === 'completed';
    } catch (err) {
      console.error('Payment check error:', err);
      return false;
    }
  }, [saleId]);

  // Auto-polling every 5 seconds
  useEffect(() => {
    if (!saleId || !onPaymentDone) return;

    pollingRef.current = setInterval(async () => {
      const isPaid = await checkPaymentStatus();
      if (isPaid) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        toast.success('Pagamento confirmado!');
        onPaymentDone();
      }
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [saleId, onPaymentDone, checkPaymentStatus]);

  const handleManualCheck = async () => {
    if (!saleId) {
      onPaymentDone?.();
      return;
    }
    setIsVerifying(true);
    try {
      const isPaid = await checkPaymentStatus();
      if (isPaid) {
        toast.success('Pagamento confirmado!');
        onPaymentDone?.();
      } else {
        toast.error('Pagamento ainda não identificado. Aguarde alguns instantes e tente novamente.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = useCallback((s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyPasteCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = copyPasteCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const qrSrc = qrCodeBase64
    ? qrCodeBase64.startsWith('data:')
      ? qrCodeBase64
      : `data:image/png;base64,${qrCodeBase64}`
    : '';

  return (
    <div className="w-full max-w-lg md:max-w-4xl mx-auto animate-fade-in py-4">
      <div className="flex flex-col md:flex-row md:gap-8 md:items-start">
        {/* Left side - Title, timer, status */}
        <div className="md:flex-1 space-y-4 text-center md:text-left mb-6 md:mb-0 md:pt-8">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Quase lá...</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Pague seu Pix dentro de{' '}
              <span className="font-bold text-foreground">{formatTime(secondsLeft)}</span>
              <br />
              para garantir sua compra.
            </p>
          </div>

          {/* Awaiting payment indicator */}
          <div className="inline-flex items-center justify-center gap-2 text-xs md:text-sm font-normal text-[#BF9500] bg-[#D4A017]/10 rounded-full px-6 py-2.5">
            <span>Aguardando pagamento</span>
            <svg viewBox="0 0 36 8" fill="#D4A017" className="w-6 h-2">
              <circle cx="4" cy="4" r="3">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1" />
              </circle>
              <circle cx="18" cy="4" r="3">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3" />
              </circle>
              <circle cx="32" cy="4" r="3">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".5" />
              </circle>
            </svg>
          </div>
        </div>

        {/* Right side - Card with QR, price, copy button */}
        <div className="md:flex-1">
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-5 text-center md:border md:border-border">
            {/* Instructions */}
            <p className="text-sm text-muted-foreground">
              Abra seu aplicativo de pagamento onde você utiliza o Pix e escolha a opção{' '}
              <span className="font-bold text-accent">Ler QR Code</span>
            </p>

            {/* QR Code */}
            <div className="bg-white border border-border rounded-xl p-5 inline-block">
              {qrSrc ? (
                <img src={qrSrc} alt="QR Code PIX" className="w-52 h-52 object-contain mx-auto" />
              ) : (
                <div className="w-52 h-52 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  QR Code indisponível
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 text-base">
              <span className="text-muted-foreground">Valor do Pix:</span>
              <span className="font-bold text-[#36B376]">{formatPrice(amount.toString())}</span>
            </div>

            {/* Copy button */}
            <Button
              onClick={handleCopy}
              className="w-full py-5 text-sm font-bold bg-[#36B376] hover:bg-[#36B376]/90 text-white gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar código
                </>
              )}
            </Button>
          </div>

          {/* Instruções visuais - mobile only */}
          <img 
            src="https://cdn.shopify.com/s/files/1/0642/4736/5860/files/COMO_PAGAR_SEU_PIX_1.svg?v=1692943736" 
            alt="Como pagar seu PIX" 
            className="w-full max-w-sm mx-auto mt-5 md:hidden"
          />

          {/* Já paguei button */}
          {onPaymentDone && (
            <div className="mt-4 text-center">
              <button
                onClick={handleManualCheck}
                disabled={isVerifying}
                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Verificando pagamento...
                  </>
                ) : (
                  'Já realizei o pagamento'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security - mobile */}
      <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-4 pb-4">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>Pagamento 100% seguro</span>
      </div>
    </div>
  );
}
