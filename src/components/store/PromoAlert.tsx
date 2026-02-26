import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PromoAlertProps {
  message: string;
  endDate?: Date;
}

export function PromoAlert({ message, endDate }: PromoAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsVisible(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!isVisible) return null;

  return (
    <div className="promo-alert relative">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="promo-alert-text font-black uppercase tracking-widest">{message}</p>
        
        {endDate && (
          <div className="promo-countdown">
            <span className="text-xs font-semibold opacity-70">A promoção termina em:</span>
            <div className="flex items-center gap-3">
              <div className="promo-countdown-item">
                <span className="promo-countdown-value font-black">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="promo-countdown-label">dias</span>
              </div>
              <div className="promo-countdown-item">
                <span className="promo-countdown-value font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="promo-countdown-label">horas</span>
              </div>
              <div className="promo-countdown-item">
                <span className="promo-countdown-value font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="promo-countdown-label">min</span>
              </div>
              <div className="promo-countdown-item">
                <span className="promo-countdown-value font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="promo-countdown-label">seg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 p-1 rounded-full transition-colors hidden md:block"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
