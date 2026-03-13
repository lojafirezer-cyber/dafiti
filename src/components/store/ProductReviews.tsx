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
  image?: string;
}

const mockReviews: Review[] = [
  { id: '1', author: 'ANA PAULA S.', rating: 5, date: '08 de Março de 2026', content: 'Sandália perfeita! Super confortável para usar o dia todo. O solado é firme e não escorrega.', helpful: 14, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '2', author: 'JULIANA M.', rating: 5, date: '05 de Março de 2026', content: 'Amei demais! Já comprei a segunda sandália dessa marca. Qualidade incrível e entrega rápida.', helpful: 9, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '3', author: 'FERNANDA L.', rating: 5, date: '01 de Março de 2026', content: 'Muito confortável, usei numa festa e fiquei horas em pé sem sentir dor. Recomendo muito!', helpful: 11, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '4', author: 'CARLA R.', rating: 5, date: '26 de Fevereiro de 2026', content: 'O material é de ótima qualidade, macio e resistente. Vale cada centavo!', helpful: 7, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '5', author: 'PATRÍCIA O.', rating: 5, date: '22 de Fevereiro de 2026', content: 'Chegou antes do prazo e bem embalada. A sandália é linda e combina com tudo.', helpful: 8, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '6', author: 'MARIANA F.', rating: 5, date: '18 de Fevereiro de 2026', content: 'Já era cliente da loja e sempre fico satisfeita. Essa sandália é a melhor que já tive!', helpful: 5, verified: true, productName: 'Sandália Modare Casual' },
  { id: '7', author: 'RENATA B.', rating: 4, date: '14 de Fevereiro de 2026', content: 'Muito boa qualidade. Ficou um pouco apertada no início mas depois de usar um dia modelou perfeitamente.', helpful: 6, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '8', author: 'CAMILA V.', rating: 5, date: '10 de Fevereiro de 2026', content: 'Sandália super linda e elegante. O acabamento é impecável e o couro é macio.', helpful: 10, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '9', author: 'BRUNA A.', rating: 5, date: '06 de Fevereiro de 2026', content: 'Excelente! Já é minha terceira compra aqui. Nunca me decepcionou.', helpful: 4, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '10', author: 'LETÍCIA C.', rating: 5, date: '02 de Fevereiro de 2026', content: 'Minha sandália favorita! O solado antiderrapante é ótimo para o dia a dia.', helpful: 7, verified: true, productName: 'Sandália Modare Casual' },
  { id: '11', author: 'VANESSA P.', rating: 5, date: '28 de Janeiro de 2026', content: 'Produto de altíssima qualidade. Amei a cor e o design moderno.', helpful: 3, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '12', author: 'ISABELA N.', rating: 5, date: '24 de Janeiro de 2026', content: 'Confortabilidade incrível! Usei a semana toda sem tirar. Pé não cansou nada.', helpful: 9, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '13', author: 'AMANDA T.', rating: 5, date: '20 de Janeiro de 2026', content: 'Muito satisfeita! A sandália é exatamente como nas fotos. Chegou super bem embalada.', helpful: 5, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '14', author: 'GABRIELA S.', rating: 5, date: '16 de Janeiro de 2026', content: 'Linda demais! O material parece de sandália de boutique, mas com preço justo.', helpful: 8, verified: true, productName: 'Sandália Modare Casual' },
  { id: '15', author: 'PRISCILA M.', rating: 5, date: '12 de Janeiro de 2026', content: 'Ótimo custo-benefício. Sandália resistente e muito estilosa.', helpful: 2, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '16', author: 'NATÁLIA R.', rating: 5, date: '08 de Janeiro de 2026', content: 'Amei! Já indiquei para várias amigas. A entrega foi rápida e bem cuidada.', helpful: 6, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '17', author: 'SANDRA G.', rating: 5, date: '04 de Janeiro de 2026', content: 'Sandália muito confortável e elegante. Uso tanto no trabalho quanto em passeios.', helpful: 4, verified: true, productName: 'Sandália Modare Casual' },
  { id: '18', author: 'BEATRIZ A.', rating: 5, date: '30 de Dezembro de 2025', content: 'Perfeita para o verão! Leve, fresca e super bonita. Adorei a qualidade do couro.', helpful: 11, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '19', author: 'TATIANE F.', rating: 5, date: '26 de Dezembro de 2025', content: 'Ótima sandália, confortável e durável. O melhor presente que me dei nesse fim de ano!', helpful: 3, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '20', author: 'LUCIANA D.', rating: 5, date: '22 de Dezembro de 2025', content: 'Produto chegou super rápido. A sandália é linda e o couro é macio, não machuca de forma alguma.', helpful: 7, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '21', author: 'ELAINE C.', rating: 5, date: '18 de Dezembro de 2025', content: 'Maravilhosa! Comprei no número certo e ficou perfeita. Material excelente.', helpful: 5, verified: true, productName: 'Sandália Modare Casual' },
  { id: '22', author: 'SIMONE B.', rating: 5, date: '14 de Dezembro de 2025', content: 'Sandália de qualidade premium. Amei o acabamento e o design. Super recomendo!', helpful: 9, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '23', author: 'ALINE P.', rating: 5, date: '10 de Dezembro de 2025', content: 'Conforto e estilo em uma só sandália. Já é minha segunda compra dessa modelo.', helpful: 4, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '24', author: 'DÉBORA R.', rating: 4, date: '06 de Dezembro de 2025', content: 'Muito boa! Apenas o solado poderia ser um pouco mais grosso, mas no geral excelente.', helpful: 2, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '25', author: 'ROSANA L.', rating: 5, date: '02 de Dezembro de 2025', content: 'Que sandália linda! O material é resistente e não deforma com o uso. Amei!', helpful: 6, verified: true, productName: 'Sandália Modare Casual' },
  { id: '26', author: 'KARINA V.', rating: 5, date: '28 de Novembro de 2025', content: 'Sandália muito elegante e confortável. O preço é justo para a qualidade que oferece.', helpful: 8, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '27', author: 'TÂNIA S.', rating: 5, date: '24 de Novembro de 2025', content: 'Comprei para usar no casamento e recebi vários elogios. Perfeita!', helpful: 13, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '28', author: 'MÔNICA A.', rating: 5, date: '20 de Novembro de 2025', content: 'Sandália superleve e confortável. Ideal para quem fica muito tempo em pé.', helpful: 5, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '29', author: 'CRISTINA F.', rating: 5, date: '16 de Novembro de 2025', content: 'Produto de altíssima qualidade. A sandália não arranha e é super macia por dentro.', helpful: 3, verified: true, productName: 'Sandália Modare Casual' },
  { id: '30', author: 'ADRIANA M.', rating: 5, date: '12 de Novembro de 2025', content: 'Excelente! Chegou dentro do prazo, bem embalada. Sandália linda e confortável.', helpful: 7, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '31', author: 'FLÁVIA R.', rating: 5, date: '08 de Novembro de 2025', content: 'Comprei para o trabalho e a sandália aguentou o dia todo perfeitamente. Aprovadíssima!', helpful: 4, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '32', author: 'CLÁUDIA N.', rating: 5, date: '04 de Novembro de 2025', content: 'Amo essa loja! Sempre recebo produtos de qualidade. Essa sandália é linda.', helpful: 6, verified: true, productName: 'Sandália Modare Comfort' },
  { id: '33', author: 'JOANA B.', rating: 5, date: '31 de Outubro de 2025', content: 'Material muito resistente e macio. Não machuca em nenhum ponto do pé.', helpful: 2, verified: true, productName: 'Sandália Modare Casual' },
  { id: '34', author: 'VERA L.', rating: 5, date: '27 de Outubro de 2025', content: 'Sandália linda, elegante e muito confortável. Compra certeira!', helpful: 9, verified: true, productName: 'Sandália Rasteira Modare' },
  { id: '35', author: 'HELENA C.', rating: 5, date: '23 de Outubro de 2025', content: 'Amei a sandália! O design é moderno e a qualidade é excelente. Vale muito o preço.', helpful: 5, verified: true, productName: 'Sandália Modare Salto Baixo' },
  { id: '36', author: 'SUELI P.', rating: 5, date: '19 de Outubro de 2025', content: 'Muito satisfeita! Já é minha quarta compra aqui e sempre recebo produtos incríveis.', helpful: 10, verified: true, productName: 'Sandália Modare Comfort' },
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

    </section>
  );
}
