import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroBannerImage from '@/assets/hero-banner.png';
import heroBannerMobileImage from '@/assets/hero-banner-mobile.png';

interface Banner {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  altText: string;
  link?: string;
}

interface HeroBannerProps {
  banners?: Banner[];
}

// Default placeholder banners
const defaultBanners: Banner[] = [
  {
    id: '1',
    imageUrl: heroBannerImage,
    mobileImageUrl: heroBannerMobileImage,
    altText: 'Liberdade é a Nossa Bandeira - Camisetas 100% algodão premium',
    link: '/produtos',
  },
];

export function HeroBanner({ banners = defaultBanners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden bg-muted">
      {/* Banner Images */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            {banner.link ? (
              <a href={banner.link} className="block w-full h-full">
                <picture className="w-full h-full">
                  {banner.mobileImageUrl && (
                    <source media="(max-width: 767px)" srcSet={banner.mobileImageUrl} />
                  )}
                  <img
                    src={banner.imageUrl}
                    alt={banner.altText}
                    className="w-full h-full object-cover"
                  />
                </picture>
              </a>
            ) : (
              <picture className="w-full h-full">
                {banner.mobileImageUrl && (
                  <source media="(max-width: 767px)" srcSet={banner.mobileImageUrl} />
                )}
                <img
                  src={banner.imageUrl}
                  alt={banner.altText}
                  className="w-full h-full object-cover"
                />
              </picture>
            )}
            {/* Desktop text overlay */}
            <div className="absolute inset-0 hidden md:flex items-start justify-start">
              <div className="flex flex-col items-start max-w-2xl mt-20 ml-28 lg:mt-24 lg:ml-40 gap-4">
                <p className="text-white/90 text-base lg:text-lg drop-shadow-md leading-relaxed tracking-wide">
                  Sua compra apoia o movimento pela liberdade.
                </p>
                <h1 className="text-white text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-normal drop-shadow-lg uppercase text-left">
                  <span className="bg-gradient-to-r from-[#4CAF50] to-[#FFEB3B] bg-clip-text text-transparent">Liberdade</span> é a<br />nossa bandeira
                </h1>
                <p className="text-white/90 text-base lg:text-lg drop-shadow-md leading-relaxed">
                  Camisetas 100% algodão premium, feitas para durar e<br />expressar atitude.
                </p>
              </div>
            </div>
            {/* Mobile text overlay */}
            <div className="absolute top-6 left-4 flex flex-col items-start md:hidden">
              <h1 className="text-white text-2xl font-bold text-left leading-tight tracking-widest drop-shadow-lg uppercase">
                <span className="bg-gradient-to-r from-[#4CAF50] to-[#FFEB3B] bg-clip-text text-transparent drop-shadow-lg">Liberdade</span> é a<br />nossa bandeira
              </h1>
              <p className="text-white/90 text-xs mt-2 drop-shadow-md leading-relaxed">
                Sua compra apoia o<br />movimento pela<br />liberdade.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/50 hover:bg-background/80 rounded-full transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/50 hover:bg-background/80 rounded-full transition-colors"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-primary/50'
              }`}
              aria-label={`Ir para banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
