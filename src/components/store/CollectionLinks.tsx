import { Link, useLocation } from 'react-router-dom';

interface CollectionLinksProps {
  activeCollection?: 'nacao-raiz' | 'nacao-kids';
  onCollectionChange?: (collection: 'nacao-raiz' | 'nacao-kids') => void;
}

export function CollectionLinks({ activeCollection, onCollectionChange }: CollectionLinksProps) {
  const location = useLocation();
  
  // If used as tabs (on home page), use activeCollection prop
  // If used as navigation (on collection pages), use URL
  const isTabMode = !!onCollectionChange;
  
  const isActive = (key: 'nacao-raiz' | 'nacao-kids') => {
    if (isTabMode) return activeCollection === key;
    if (key === 'nacao-raiz') return location.pathname === '/colecao/direita-raiz';
    return location.pathname === '/colecao/nacao-kids';
  };

  const baseClass = "block px-6 md:px-16 pt-11 md:pt-14 pb-2 md:pb-3 text-[13px] md:text-[18px] uppercase tracking-[0.08em] transition-all cursor-pointer whitespace-nowrap";
  const activeClass = "text-foreground font-bold border-b-[2.5px] border-foreground";
  const inactiveClass = "text-muted-foreground hover:text-foreground font-normal border-b-2 border-border";

  if (isTabMode) {
    return (
      <section className="bg-background">
        <ul className="flex items-center justify-center">
          <li>
            <button
              onClick={() => onCollectionChange('nacao-raiz')}
              className={`${baseClass} ${isActive('nacao-raiz') ? activeClass : inactiveClass}`}
            >
              Nação Raiz
            </button>
          </li>
          <li>
            <button
              onClick={() => onCollectionChange('nacao-kids')}
              className={`${baseClass} ${isActive('nacao-kids') ? activeClass : inactiveClass}`}
            >
              Nação Kids
            </button>
          </li>
        </ul>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <ul className="flex items-center justify-center">
        <li>
          <Link
            to="/colecao/direita-raiz"
            className={`${baseClass} ${isActive('nacao-raiz') ? activeClass : inactiveClass}`}
          >
            Nação Raiz
          </Link>
        </li>
        <li>
          <Link
            to="/colecao/nacao-kids"
            className={`${baseClass} ${isActive('nacao-kids') ? activeClass : inactiveClass}`}
          >
            Nação Kids
          </Link>
        </li>
      </ul>
    </section>
  );
}
