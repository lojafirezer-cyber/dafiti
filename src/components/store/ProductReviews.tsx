import { useState } from 'react';
import { Star, ThumbsUp, Check } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified: boolean;
  productName?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'BRUNO S.',
    rating: 5,
    date: '07 de Janeiro de 2026',
    content: 'Camiseta de altíssima qualidade, o tecido é muito macio e não desbotou após várias lavagens. Vale cada centavo!',
    helpful: 4,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '2',
    author: 'DIONE A.',
    rating: 5,
    date: '03 de Janeiro de 2026',
    content: 'Amei! O algodão é premium mesmo, não fica aquela sensação de roupa barata. Comprei duas e já quero mais.',
    helpful: 6,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '3',
    author: 'ALEX S.',
    rating: 5,
    date: '02 de Janeiro de 2026',
    content: 'Estampa linda e bem fixada, lavei várias vezes e continua perfeita. O caimento é excelente!',
    helpful: 3,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '4',
    author: 'JOÃO CARLOS S.',
    rating: 5,
    date: '08 de Setembro de 2025',
    content: 'Produto de excelente qualidade! Superou minhas expectativas. O acabamento é impecável e o tamanho bateu certinho.',
    helpful: 12,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '5',
    author: 'MARIA S.',
    rating: 5,
    date: '05 de Setembro de 2025',
    content: 'Amei o caimento e a qualidade do algodão. Muito confortável para o dia a dia e o tecido não amassa fácil.',
    helpful: 8,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '6',
    author: 'PEDRO L.',
    rating: 5,
    date: '01 de Setembro de 2025',
    content: 'Muito boa, o acabamento é impecável e a estampa está bem detalhada. Produto feito com capricho.',
    helpful: 5,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '7',
    author: 'LUCAS M.',
    rating: 5,
    date: '28 de Agosto de 2025',
    content: 'Camiseta muito confortável, algodão de alta qualidade. Recomendo demais para quem quer qualidade!',
    helpful: 3,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '8',
    author: 'FERNANDA R.',
    rating: 5,
    date: '25 de Agosto de 2025',
    content: 'Adorei! O design é lindo e o tecido não desfia nem com o uso intenso. Comprarei mais peças.',
    helpful: 7,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '9',
    author: 'CARLOS E.',
    rating: 4,
    date: '22 de Agosto de 2025',
    content: 'Boa qualidade, apenas achei um pouco grande no ombro. Mas o conforto é excelente e a estampa linda.',
    helpful: 2,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '10',
    author: 'ANA P.',
    rating: 5,
    date: '20 de Agosto de 2025',
    content: 'Perfeita! Chegou antes do prazo, bem embalada e o tamanho estava certinho. Muito feliz com a compra!',
    helpful: 4,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '11',
    author: 'ROBERTO S.',
    rating: 5,
    date: '18 de Agosto de 2025',
    content: 'Excelente camiseta, recomendo! O tecido 100% algodão faz toda a diferença no conforto.',
    helpful: 6,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '12',
    author: 'JULIANA C.',
    rating: 5,
    date: '15 de Agosto de 2025',
    content: 'Muito satisfeita com a compra. Qualidade top, uso no dia a dia e recebo elogios toda vez.',
    helpful: 3,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '13',
    author: 'MARCOS V.',
    rating: 5,
    date: '12 de Agosto de 2025',
    content: 'Camiseta com ótimo caimento, estampa vibrante e duradoura. Com certeza comprarei mais.',
    helpful: 5,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '14',
    author: 'PATRÍCIA L.',
    rating: 5,
    date: '10 de Agosto de 2025',
    content: 'Material excelente e design diferenciado. Recebi elogios de todo mundo que me viu usando.',
    helpful: 2,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '15',
    author: 'THIAGO N.',
    rating: 5,
    date: '08 de Agosto de 2025',
    content: 'Produto chegou certinho, camiseta muito boa e confortável! Vou indicar para os amigos.',
    helpful: 1,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '16',
    author: 'CAMILA D.',
    rating: 5,
    date: '05 de Agosto de 2025',
    content: 'Amei a camiseta! Super confortável, uso para passear e para o trabalho casual.',
    helpful: 4,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '17',
    author: 'FELIPE G.',
    rating: 5,
    date: '03 de Agosto de 2025',
    content: 'Qualidade do algodão é surpreendente. Muito macio, não encolhe e a cor não desbota.',
    helpful: 3,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
  {
    id: '18',
    author: 'LETÍCIA F.',
    rating: 5,
    date: '01 de Agosto de 2025',
    content: 'Entrega rápida e camiseta impecável. Estampa com detalhes precisos e tecido de primeira linha.',
    helpful: 2,
    verified: true,
    productName: 'Camiseta Brasil de Verdade',
  },
  {
    id: '19',
    author: 'GUSTAVO H.',
    rating: 5,
    date: '30 de Julho de 2025',
    content: 'Muito boa! Algodão de qualidade e design diferente do que se encontra por aí. Produto único.',
    helpful: 5,
    verified: true,
    productName: 'Camiseta Direita Raiz',
  },
  {
    id: '20',
    author: 'BEATRIZ A.',
    rating: 5,
    date: '28 de Julho de 2025',
    content: 'Camiseta linda, recomendo demais! Já comprei para presentear também, faz sucesso.',
    helpful: 6,
    verified: true,
    productName: 'Camiseta Nação Raiz',
  },
];

const ratingDistribution = [
  { stars: 5, count: 41 },
  { stars: 4, count: 1 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const REVIEWS_PER_PAGE = 6;

export function ProductReviews() {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const visibleReviews = mockReviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < mockReviews.length;

  const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const averageRating = (ratingDistribution.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews).toFixed(1);

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5' };
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-300 text-yellow-300' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-6 mb-20">
      {/* Main Reviews Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl leading-normal text-gray-900 font-medium">Avaliações</h2>
        
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Average Rating */}
          <div className="flex flex-row items-center gap-3">
            <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(parseFloat(averageRating)), 'md')}
              </div>
              <p className="text-gray-500 text-sm mt-0.5">({averageRating}) {totalReviews} avaliações</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 max-w-sm">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 mb-1.5">
                <span className="text-sm text-gray-700 w-4 font-medium">{item.stars}</span>
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <div className="flex-1 h-1 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-yellow-300 rounded transition-all"
                    style={{ width: `${(item.count / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-24">
                  {item.count} <span className="hidden md:inline">{item.count === 1 ? 'avaliação' : 'avaliações'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-6">
        {visibleReviews.map((review, index) => (
          <div key={review.id}>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Left column - Author info */}
              <div className="flex flex-col gap-2 w-full md:max-w-72">
                <div className="flex flex-row gap-1">
                  {renderStars(review.rating, 'sm')}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold leading-normal text-base">{review.author}</p>
                  <p className="text-gray-500 leading-5 font-normal text-sm">{review.date}</p>
                </div>
                {review.verified && (
                  <p className="text-gray-900 leading-normal font-normal text-sm flex flex-row items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    Compra verificada
                  </p>
                )}
                {review.productName && (
                  <p className="text-sm font-medium leading-5 text-gray-900">
                    Produto comprado: <br />
                    <span className="text-gray-500 font-normal">{review.productName}</span>
                  </p>
                )}
              </div>

              {/* Right column - Content */}
              <div className="flex flex-col gap-4 md:max-w-4xl">
                {review.content && (
                  <p className="text-base text-gray-500 leading-6 font-normal">{review.content}</p>
                )}

                {/* Helpful Section */}
                <div className="flex flex-row gap-4">
                  <p className="text-gray-500 font-medium text-sm leading-5">Isso foi útil para você?</p>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex flex-row gap-2 transition-colors ${
                      helpfulClicked.has(review.id) ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-gray-900 text-xs font-medium leading-5">
                      {review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            {index !== visibleReviews.length - 1 && (
              <hr className="border-gray-300 my-6" />
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + REVIEWS_PER_PAGE)}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
          >
            Ver mais avaliações
          </button>
        </div>
      )}
    </section>
  );
}
