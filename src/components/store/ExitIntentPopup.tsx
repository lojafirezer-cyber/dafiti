import { useEffect, useState, useCallback } from 'react';
import { X, Tag } from 'lucide-react';
import dafitiLogo from '@/assets/dafiti-logo-popup.png';

const COUPON_CODE = 'DAFITI15';
const SESSION_KEY = 'exit_intent_shown';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setIsVisible(true);
    sessionStorage.setItem(SESSION_KEY, '1');
  }, []);

  useEffect(() => {
    // Desktop: mouse leaving viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) show();
    };

    // Mobile/tablet: page visibility change (user switching tab)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') show();
    };

    // Fallback: show after 45s of inactivity
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(show, 45000);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);
    resetIdle();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('mousemove', resetIdle);
      document.removeEventListener('keydown', resetIdle);
      clearTimeout(idleTimer);
    };
  }, [show]);

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-zinc-600" />
        </button>

        {/* Top dark band with logo */}
        <div className="relative bg-zinc-900 h-24 flex items-end justify-center pb-0">
          <div className="absolute -bottom-8 bg-black rounded-2xl p-3 shadow-lg border-2 border-white">
            <img src={dafitiLogo} alt="Dafiti" className="h-9 w-auto invert" />
          </div>
        </div>

        {/* Body */}
        <div className="pt-14 pb-6 px-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-3">
            Espera! Não vá ainda 🎁
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed mb-6">
            Que tal <strong className="text-zinc-900">15% de desconto</strong> na sua compra?
            Use o cupom abaixo e aproveite agora mesmo.
          </p>

          {/* Coupon box */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 border-2 border-dashed border-zinc-300 hover:border-zinc-900 rounded-xl px-4 py-3 transition-all group mb-4"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
              <span className="text-lg font-bold tracking-widest text-zinc-900">{COUPON_CODE}</span>
            </div>
            <span className={`text-xs font-semibold transition-colors ${copied ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-900'}`}>
              {copied ? '✓ Copiado!' : 'Copiar'}
            </span>
          </button>

          {/* CTA */}
          <button
            onClick={handleClose}
            className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-semibold py-4 rounded-full transition-colors text-sm"
          >
            Usar meu desconto agora
          </button>

          <button
            onClick={handleClose}
            className="mt-4 text-xs text-zinc-400 hover:text-zinc-600 underline transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
