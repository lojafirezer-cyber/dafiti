import { Link } from 'react-router-dom';

interface MiniBanner {
  id: string;
  imageUrl: string;
  altText: string;
  link: string;
}

interface MiniBannersProps {
  banners?: MiniBanner[];
}

const defaultBanners: MiniBanner[] = [
  {
    id: '1',
    imageUrl: '/placeholder.svg',
    altText: 'Nação Kids',
    link: '/colecao/nacao-kids',
  },
  {
    id: '2',
    imageUrl: '/placeholder.svg',
    altText: 'Direita Raiz',
    link: '/colecao/nacao-raiz',
  },
];

export function MiniBanners({ banners = defaultBanners }: MiniBannersProps) {
  return (
    <section className="mt-0.5">
      {/* Desktop */}
      <div className="hidden md:flex items-stretch h-40 md:h-80 overflow-x-auto no-scrollbar">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link}
            className={`flex-none w-1/2 h-full ${index > 0 ? 'ml-0.5' : ''}`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        ))}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-2 gap-0.5 md:hidden">
        {banners.map((banner) => (
          <Link key={banner.id} to={banner.link} className="mini-banner">
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
