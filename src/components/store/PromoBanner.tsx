import bannerTopDesktop from '@/assets/banner-top.png';
import bannerBottomDesktop from '@/assets/banner-bottom.png';
import bannerTopMobile from '@/assets/banner-mobile-top.jpg';
import bannerBottomMobile from '@/assets/banner-mobile-bottom.png';

interface PromoBannerProps {
  position: 'top' | 'bottom';
  link?: string;
}

export function PromoBanner({ position, link = '/produtos' }: PromoBannerProps) {
  const desktopSrc = position === 'top' ? bannerTopDesktop : bannerBottomDesktop;
  const mobileSrc = position === 'top' ? bannerTopMobile : bannerBottomMobile;
  const alt = position === 'top' ? 'Promoção - Sandálias até 60% OFF' : 'Saldos até 70% OFF no PIX';

  return (
    <section className="w-full mt-0.5">
      <a href={link} className="block w-full">
        <picture className="w-full">
          <source media="(max-width: 767px)" srcSet={mobileSrc} />
          <img
            src={desktopSrc}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </picture>
      </a>
    </section>
  );
}
