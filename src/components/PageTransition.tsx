import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-muted overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-[#4CAF50] to-[#FFEB3B] animate-[progress_0.3s_ease-out_forwards]" 
        style={{
          animation: 'progress 0.3s ease-out forwards'
        }}
      />
      <style>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
