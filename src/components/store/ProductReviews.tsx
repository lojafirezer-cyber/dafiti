import { useState } from 'react';
import { Star, ThumbsUp, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import reviewImage1 from '@/assets/review-image-1.jpg';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified: boolean;
  productName?: string;
  image?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'BRUNO S.',
    rating: 5,
    date: '07 de Janeiro de 2026',
    content: '',
    helpful: 0,
    verified: true,
    productName: 'Constituição Socialista art 1',
  },
  {
    id: '2',
    author: 'DIONE A.',
    rating: 5,
    date: '03 de Janeiro de 2026',
    content: '',
    helpful: 0,
    verified: true,
    productName: 'Brasil, Acima de todos',
  },
  {
    id: '3',
    author: 'ALEX S.',
    rating: 5,
    date: '02 de Janeiro de 2026',
    content: 'Excelente, material bom e design muito bom.',
    helpful: 0,
    verified: true,
    productName: 'Nação Raiz',
    image: 'https://rsv-ink-images.ink.rsvcloud.com/images/review_image/f18454360343166de9275e261386863f.jpg',
  },
  {
    id: '4',
    author: 'JOÃO CARLOS S.',
    rating: 5,
    date: '08 de Setembro de 2025',
    content: 'Produto de excelente qualidade! Superou minhas expectativas.',
    helpful: 12,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://rsv-ink-images.ink.rsvcloud.com/images/review_image/14baa0d5827e0c66bc3df1198c0ee4dc.jpg',
  },
  {
    id: '5',
    author: 'MARIA S.',
    rating: 5,
    date: '05 de Setembro de 2025',
    content: 'Amei o caimento e a qualidade do algodão.',
    helpful: 8,
    verified: true,
    productName: 'Magnitsky',
    
  },
  {
    id: '6',
    author: 'PEDRO L.',
    rating: 5,
    date: '01 de Setembro de 2025',
    content: 'Muito boa, o acabamento é impecável.',
    helpful: 5,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://rsv-ink-images.ink.rsvcloud.com/images/review_image/0e3fa667f280c5a563faafd7ff87c135.jpg',
  },
  {
    id: '7',
    author: 'LUCAS M.',
    rating: 5,
    date: '28 de Agosto de 2025',
    content: 'Camiseta muito confortável, tecido de alta qualidade.',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
    image: reviewImage1,
  },
  {
    id: '8',
    author: 'FERNANDA R.',
    rating: 5,
    date: '25 de Agosto de 2025',
    content: 'Adorei! A estampa é linda e não desbota na lavagem.',
    helpful: 7,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '9',
    author: 'CARLOS E.',
    rating: 4,
    date: '22 de Agosto de 2025',
    content: 'Boa qualidade, apenas achei um pouco larga.',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '10',
    author: 'ANA P.',
    rating: 5,
    date: '20 de Agosto de 2025',
    content: 'Perfeita! Chegou antes do prazo e bem embalada.',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '11',
    author: 'ROBERTO S.',
    rating: 5,
    date: '18 de Agosto de 2025',
    content: 'Excelente produto, recomendo!',
    helpful: 6,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '12',
    author: 'JULIANA C.',
    rating: 5,
    date: '15 de Agosto de 2025',
    content: 'Muito satisfeita com a compra. Qualidade top!',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '13',
    author: 'MARCOS V.',
    rating: 5,
    date: '12 de Agosto de 2025',
    content: 'Camiseta com ótimo caimento. Comprarei mais.',
    helpful: 5,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '14',
    author: 'PATRÍCIA L.',
    rating: 5,
    date: '10 de Agosto de 2025',
    content: 'Material excelente e design diferenciado.',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '15',
    author: 'THIAGO N.',
    rating: 5,
    date: '08 de Agosto de 2025',
    content: 'Produto chegou certinho, muito bom!',
    helpful: 1,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '16',
    author: 'CAMILA D.',
    rating: 5,
    date: '05 de Agosto de 2025',
    content: 'Amei a camiseta! Super confortável.',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '17',
    author: 'FELIPE G.',
    rating: 5,
    date: '03 de Agosto de 2025',
    content: 'Qualidade do tecido é surpreendente.',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '18',
    author: 'LETÍCIA F.',
    rating: 5,
    date: '01 de Agosto de 2025',
    content: 'Entrega rápida e produto impecável.',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '19',
    author: 'GUSTAVO H.',
    rating: 5,
    date: '30 de Julho de 2025',
    content: 'Muito bom! Estampa de qualidade.',
    helpful: 5,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '20',
    author: 'BEATRIZ A.',
    rating: 5,
    date: '28 de Julho de 2025',
    content: 'Camiseta linda, recomendo demais!',
    helpful: 6,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '21',
    author: 'ANDERSON M.',
    rating: 5,
    date: '25 de Julho de 2025',
    content: 'Produto excelente, superou expectativas.',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '22',
    author: 'RENATA S.',
    rating: 5,
    date: '22 de Julho de 2025',
    content: 'Amei! Vou comprar outras cores.',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '23',
    author: 'DIEGO R.',
    rating: 5,
    date: '20 de Julho de 2025',
    content: 'Tecido macio e durável. Aprovado!',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '24',
    author: 'VANESSA P.',
    rating: 5,
    date: '18 de Julho de 2025',
    content: 'Qualidade excelente, vale cada centavo.',
    helpful: 7,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '25',
    author: 'RICARDO B.',
    rating: 5,
    date: '15 de Julho de 2025',
    content: 'Muito satisfeito com a compra!',
    helpful: 1,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '26',
    author: 'AMANDA T.',
    rating: 5,
    date: '12 de Julho de 2025',
    content: 'Design incrível e confortável.',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '27',
    author: 'EDUARDO C.',
    rating: 5,
    date: '10 de Julho de 2025',
    content: 'Ótima camiseta, recomendo a todos.',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '28',
    author: 'GABRIELA M.',
    rating: 5,
    date: '08 de Julho de 2025',
    content: 'Produto de primeira! Voltarei a comprar.',
    helpful: 5,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '29',
    author: 'HENRIQUE L.',
    rating: 5,
    date: '05 de Julho de 2025',
    content: 'Caimento perfeito, muito confortável.',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '30',
    author: 'ISABELA N.',
    rating: 5,
    date: '03 de Julho de 2025',
    content: 'Adorei a qualidade e o acabamento.',
    helpful: 6,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '31',
    author: 'LEANDRO F.',
    rating: 5,
    date: '01 de Julho de 2025',
    content: 'Estampa não desbota, excelente!',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '32',
    author: 'NATÁLIA R.',
    rating: 5,
    date: '28 de Junho de 2025',
    content: 'Camiseta top! Super recomendo.',
    helpful: 3,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '33',
    author: 'OTÁVIO S.',
    rating: 5,
    date: '25 de Junho de 2025',
    content: 'Produto chegou rápido e bem embalado.',
    helpful: 1,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '34',
    author: 'PRISCILA A.',
    rating: 5,
    date: '22 de Junho de 2025',
    content: 'Muito boa qualidade, amei!',
    helpful: 5,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '35',
    author: 'RAFAEL D.',
    rating: 5,
    date: '20 de Junho de 2025',
    content: 'Excelente custo-benefício.',
    helpful: 2,
    verified: true,
    productName: 'Magnitsky',
  },
  {
    id: '36',
    author: 'SANDRA G.',
    rating: 5,
    date: '18 de Junho de 2025',
    content: 'Camiseta confortável e bonita.',
    helpful: 4,
    verified: true,
    productName: 'Magnitsky',
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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const visibleReviews = mockReviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < mockReviews.length;

  // Get all images from reviews
  const allReviewImages = mockReviews
    .filter(r => r.image)
    .map(r => ({ image: r.image!, author: r.author, rating: r.rating }));

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

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allReviewImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allReviewImages.length) % allReviewImages.length);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
    };
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

  // Photos reviews (ones with images)
  const photoReviews = mockReviews.filter(r => r.image);

  return (
    <section className="flex flex-col gap-6 mb-20">
      {/* Photo Reviews Section */}
      <div className="flex flex-col gap-4">
        <p className="text-xl leading-normal text-gray-900 font-medium">Fotos de avaliações</p>
        <div className="relative w-full grid grid-cols-4 md:grid-cols-8 gap-4">
          {photoReviews.map((review, index) => (
            <button 
              key={review.id} 
              className="relative w-fit cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openImageModal(index)}
            >
              <img
                src={review.image}
                alt={`Avaliação de ${review.author}`}
                className="rounded-lg object-cover h-28 w-28 md:w-36 md:h-36"
              />
              <span className="absolute flex flex-row items-center rounded-full px-2 py-1 bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium leading-normal text-gray-900 bg-white bg-opacity-90">
                {review.rating.toFixed(1)}
                <span className="text-yellow-300 ml-0.5 flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-current" />
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

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
                    Produtos comprados: <br />
                    <span className="text-gray-500 font-normal">{review.productName}</span>
                  </p>
                )}
              </div>

              {/* Right column - Content */}
              <div className="flex flex-col gap-4 md:max-w-4xl">
                {review.content && (
                  <p className="text-base text-gray-500 leading-6 font-normal">{review.content}</p>
                )}
                
                {/* Review images inline */}
                {review.image && (
                  <div className="flex flex-row gap-2">
                    <img 
                      src={review.image} 
                      alt={`Foto de ${review.author}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>
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

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0 overflow-hidden">
          <div className="relative flex items-center justify-center min-h-[50vh] md:min-h-[70vh]">
            {/* Close button */}
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            {allReviewImages[currentImageIndex] && (
              <div className="flex flex-col items-center">
                <img
                  src={allReviewImages[currentImageIndex].image}
                  alt={`Avaliação de ${allReviewImages[currentImageIndex].author}`}
                  className="max-h-[60vh] md:max-h-[70vh] object-contain"
                />
                <div className="mt-4 flex items-center gap-2 text-white">
                  <span className="font-medium">{allReviewImages[currentImageIndex].author}</span>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1">
                    <span>{allReviewImages[currentImageIndex].rating.toFixed(1)}</span>
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 rounded-full px-4 py-2 text-white text-sm">
              {currentImageIndex + 1} / {allReviewImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
