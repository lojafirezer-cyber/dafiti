import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, Truck, Star, CreditCard, Shield, RefreshCw, MapPin, Tag, Copy, Check, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { PromoAlert } from '@/components/store/PromoAlert';
import { Button } from '@/components/ui/button';
import { fetchProductByHandle, formatPrice, calculateDiscount, calculateInstallments, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RelatedProducts } from '@/components/store/RelatedProducts';
import { ProductReviews } from '@/components/store/ProductReviews';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import sizeGuideMale from '@/assets/size-guide-male.webp';
import sizeGuideFemale from '@/assets/size-guide-female.webp';
import sizeGuideBodyInfantil from '@/assets/size-guide-body-infantil.webp';
import sizeGuideInfantil from '@/assets/size-guide-infantil.webp';
import sewingTapeMeasure from '@/assets/sewing-tape-measure.svg';

// Coupon data (discount percentage is used for dynamic calculation)
const availableCoupons = [{
  code: 'RAIZ10',
  discountPercent: 10,
  minItems: 2
}];
export default function ProductDetail() {
  const {
    handle
  } = useParams<{
    handle: string;
  }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showModelWarning, setShowModelWarning] = useState(false);
  const mainButtonRef = React.useRef<HTMLButtonElement>(null);
  const modeloSectionRef = React.useRef<HTMLDivElement>(null);
  const [couponSheetOpen, setCouponSheetOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{
    city: string;
    state: string;
    deliveryDateStart: string;
    deliveryDateEnd: string;
  } | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [shippingSheetOpen, setShippingSheetOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const {
    addItem,
    setOpen
  } = useCartStore();
  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      setLoading(true);
      const data = await fetchProductByHandle(handle);
      setProduct(data);

      // Pre-select the first available variant (or first variant if none available)
      if (data) {
        const firstAvailable = data.variants.edges.find(v => v.node.availableForSale) || data.variants.edges[0];
        if (firstAvailable) {
          setSelectedVariant(firstAvailable.node.id);
          // Build selectedOptions from the variant's selectedOptions
          const options: Record<string, string> = {};
          firstAvailable.node.selectedOptions.forEach(opt => {
            options[opt.name] = opt.value;
          });
          setSelectedOptions(options);
        }
      }

      setLoading(false);
    }
    loadProduct();
  }, [handle]);
  useEffect(() => {
    const handleScroll = () => {
      if (mainButtonRef.current) {
        const rect = mainButtonRef.current.getBoundingClientRect();
        // Show mobile cart when main button is out of view (scrolled past)
        setShowMobileCart(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleAddToCart = () => {
    if (!product) {
      return;
    }
    
    // Check if variant is selected
    if (!selectedVariant) {
      // Scroll to modelo section
      modeloSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShowModelWarning(true);
      setTimeout(() => setShowModelWarning(false), 3000);
      return;
    }
    
    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;
    addItem({
      product: {
        node: product
      },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions
    });
    toast.success('Produto adicionado ao carrinho!', {
      position: 'top-center'
    });
    setOpen(true);
  };
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setCepError('');
    if (formatted.length < 9) {
      setShippingInfo(null);
    }
  };
  const calculateDeliveryDates = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 9);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 12);
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    };
    return {
      start: formatDate(startDate),
      end: formatDate(endDate)
    };
  };
  const getTimeUntilCutoff = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(18, 0, 0, 0); // 18:00 cutoff

    if (now > cutoff) {
      cutoff.setDate(cutoff.getDate() + 1);
    }
    const diff = cutoff.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
    return {
      hours,
      minutes
    };
  };
  const fetchCepInfo = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('CEP inválido');
      return;
    }
    setLoadingCep(true);
    setCepError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        setShippingInfo(null);
      } else {
        const dates = calculateDeliveryDates();
        setShippingInfo({
          city: data.localidade,
          state: data.uf,
          deliveryDateStart: dates.start,
          deliveryDateEnd: dates.end
        });
      }
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      setShippingInfo(null);
    } finally {
      setLoadingCep(false);
    }
  };
  const nextImage = () => {
    if (product) {
      setSelectedImage(prev => (prev + 1) % product.images.edges.length);
    }
  };
  const prevImage = () => {
    if (product) {
      setSelectedImage(prev => (prev - 1 + product.images.edges.length) % product.images.edges.length);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Produto não encontrado</p>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </div>;
  }
  const currentVariant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  const displayVariant = currentVariant || product.variants.edges[0]?.node;
  const price = displayVariant ? parseFloat(displayVariant.price.amount) : 0;
  const compareAtPrice = displayVariant?.compareAtPrice ? parseFloat(displayVariant.compareAtPrice.amount) : null;
  const discount = compareAtPrice ? calculateDiscount(compareAtPrice.toString(), price.toString()) : 0;

  // Promo end date - 4 days from now
  const promoEndDate = new Date();
  promoEndDate.setDate(promoEndDate.getDate() + 4);
  // Check if product has BODY INFANTIL or CAMISETA INFANTIL tag
  const hasBodyInfantilTag = product.tags?.some(tag => tag.toUpperCase() === 'BODY INFANTIL') ?? false;
  const hasCamisetaInfantilTag = product.tags?.some(tag => tag.toUpperCase() === 'CAMISETA INFANTIL') ?? false;
  
  const productTypeLabel = hasBodyInfantilTag ? 'BODY INFANTIL' : hasCamisetaInfantilTag ? 'CAMISETA INFANTIL' : 'CAMISETA';
  const displayTitle = hasBodyInfantilTag 
    ? product.title.replace(/CAMISETA/gi, 'BODY INFANTIL')
    : hasCamisetaInfantilTag 
      ? product.title.replace(/CAMISETA/gi, 'CAMISETA INFANTIL')
      : product.title;

  return <div className="min-h-screen bg-white">
      <Header />
      <PromoAlert message="FRETE GRÁTIS A PARTIR DE 2 PEÇAS" endDate={promoEndDate} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Header */}
        {(() => {
          // Generate consistent random review count based on product handle
          const reviewCount = 42 + (handle ? handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 46 : 0);
          return (
            <header className="flex flex-col gap-2 mb-6 lg:hidden">
              <p className="text-gray-400 text-sm uppercase">{productTypeLabel}</p>
              <h1 className="font-bold text-2xl uppercase">{displayTitle}</h1>
              <div className="inline-flex items-center gap-1.5">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-yellow-500">({reviewCount} avaliações)</span>
              </div>
            </header>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images - Carousel */}
          <section className="relative">
            {/* Build image list: product images + unique variant images */}
            {(() => {
            const productImages = product.images.edges.map(e => e.node);
            const variantImages = product.variants.edges.filter(v => v.node.image?.url).map(v => ({
              url: v.node.image!.url,
              altText: v.node.image!.altText,
              variantId: v.node.id
            }));

            // Get unique variant images (by URL) that aren't already in product images
            const productImageUrls = new Set(productImages.map(img => img.url));
            const uniqueVariantImages = variantImages.filter((img, index, self) => !productImageUrls.has(img.url) && self.findIndex(i => i.url === img.url) === index);

            // All images for the gallery
            const allImages = [...productImages.map(img => ({
              ...img,
              variantId: undefined as string | undefined
            })), ...uniqueVariantImages.map(img => ({
              url: img.url,
              altText: img.altText,
              variantId: img.variantId
            }))];

            const currentImageIndex = selectedImage >= allImages.length ? 0 : selectedImage;
            const currentImage = allImages[currentImageIndex] || allImages[0];
            return <>
                  <div
                    className="relative w-full aspect-square max-w-[740px] mx-auto overflow-hidden rounded-lg bg-gray-100 cursor-grab active:cursor-grabbing select-none"
                    onPointerDown={(e) => {
                      const el = e.currentTarget;
                      el.setPointerCapture(e.pointerId);
                      (el as any)._swipeStartX = e.clientX;
                      (el as any)._swiping = true;
                    }}
                    onPointerMove={(e) => {
                      const el = e.currentTarget;
                      if (!(el as any)._swiping) return;
                      const diff = e.clientX - (el as any)._swipeStartX;
                      if (Math.abs(diff) > 50) {
                        (el as any)._swiping = false;
                        if (diff < 0) {
                          setSelectedImage((currentImageIndex + 1) % allImages.length);
                        } else {
                          setSelectedImage((currentImageIndex - 1 + allImages.length) % allImages.length);
                        }
                      }
                    }}
                    onPointerUp={(e) => {
                      (e.currentTarget as any)._swiping = false;
                    }}
                    onPointerCancel={(e) => {
                      (e.currentTarget as any)._swiping = false;
                    }}
                  >
                    {currentImage && <img src={currentImage.url} alt={currentImage.altText || product.title} className="w-full h-full object-cover pointer-events-none" draggable={false} />}
                    
                    {/* Navigation Arrows */}
                    {allImages.length > 1 && <>
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setSelectedImage((currentImageIndex - 1 + allImages.length) % allImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center z-10 hover:bg-black/80 transition-colors pointer-events-auto" aria-label="Imagem anterior">
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setSelectedImage((currentImageIndex + 1) % allImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center z-10 hover:bg-black/80 transition-colors pointer-events-auto" aria-label="Próxima imagem">
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </>}

                    {/* Dots Indicator */}
                    {allImages.length > 1 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10" onPointerDown={(e) => e.stopPropagation()}>
                        {allImages.map((_, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`w-3 h-3 rounded-full transition-colors pointer-events-auto ${currentImageIndex === index ? 'bg-gray-800' : 'bg-gray-300'}`} aria-label={`Imagem ${index + 1}`} />)}
                      </div>}
                  </div>

                  {/* Thumbnails - Desktop */}
                  {allImages.length > 1 && <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                      {allImages.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-black' : 'border-transparent'}`}>
                          <img src={image.url} alt={image.altText || `${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                        </button>)}
                    </div>}
                </>;
          })()}
          </section>

          {/* Product Details */}
          <section className="flex flex-col gap-5">
            {/* Desktop Header */}
            {(() => {
              // Generate consistent random review count based on product handle
              const reviewCount = 42 + (handle ? handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 46 : 0);
              return (
                <header className="hidden lg:flex flex-col gap-2 mt-8">
                  <p className="text-gray-400 text-sm uppercase">{productTypeLabel}</p>
                  <h1 className="font-bold text-2xl uppercase">{displayTitle}</h1>
                  <div className="inline-flex items-center gap-1.5">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-sm text-yellow-500">({reviewCount} avaliações)</span>
                  </div>
                </header>
              );
            })()}

            {/* Price Section */}
            <div className="flex flex-col items-start gap-1 font-medium mt-5 lg:mt-0">
              <span className="flex flex-col justify-center flex-wrap gap-1 font-semibold">
                {compareAtPrice && discount > 0 && <del className="text-gray-500">
                    <p className="text-lg font-medium text-gray-500">
                      {formatPrice(compareAtPrice.toString())}
                    </p>
                  </del>}
                <div className="flex items-center gap-2">
                  <p className="text-3xl md:text-4xl font-bold">{formatPrice(price.toString())}</p>
                  {discount > 0 && <span className="text-xs md:text-sm text-green-800 font-medium py-1 px-2 md:px-3 leading-[21px] bg-green-100 rounded-md">
                      {discount}% OFF
                    </span>}
                </div>
              </span>
              <p className="font-medium text-base">
                ou em até <span className="text-emerald-700">3x de {calculateInstallments(price.toString())} sem juros</span>
              </p>
            </div>

            {/* Delivery Estimate */}
            {shippingInfo ? <div className="mt-3">
                <p className="text-sm text-gray-700">
                  Entrega entre <span className="font-bold text-gray-900">{shippingInfo.deliveryDateStart}</span> e <span className="font-bold text-gray-900">{shippingInfo.deliveryDateEnd}</span>.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Comprando dentro das próximas <span className="font-medium text-green-600">{getTimeUntilCutoff().hours} horas e {getTimeUntilCutoff().minutes} minutos</span>.
                </p>
              </div> : <button onClick={() => setShippingDialogOpen(true)} className="flex mt-2 gap-2 items-center leading-4 text-blue-600 font-normal text-base hover:underline">
                <MapPin className="w-5 h-5" />
                Calcule o prazo de entrega
              </button>}

            {/* Coupon Section */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
              <Tag className="w-5 h-5 text-gray-700" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Cupom</span>
                  <button onClick={() => setCouponSheetOpen(true)} className="text-blue-600 hover:underline text-sm font-normal md:hidden">
                    Ver cupons disponíveis
                  </button>
                  <button onClick={() => setCouponDialogOpen(true)} className="text-blue-600 hover:underline text-sm font-normal hidden md:inline">
                    Ver cupons disponíveis
                  </button>
                </div>
                <p className="text-sm text-gray-500">{availableCoupons.length} cupom disponível para esse produto</p>
              </div>
            </div>

            {/* Options - Modelo and Cor on same row */}
            {(() => {
            const modeloOption = product.options.find(o => o.name.toLowerCase() === 'modelo' || o.name.toLowerCase() === 'model');
            const corOption = product.options.find(o => o.name.toLowerCase() === 'cor' || o.name.toLowerCase() === 'color');
            const tamanhoOption = product.options.find(o => o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size');
            const otherOptions = product.options.filter(o => !['modelo', 'model', 'cor', 'color', 'tamanho', 'size'].includes(o.name.toLowerCase()));

            // Color mapping for visual color circles
            const colorMap: Record<string, string> = {
              'preto': '#000000',
              'preta': '#000000',
              'black': '#000000',
              'marinho': '#222E4B',
              'navy': '#222E4B',
              'azul': '#1e3a8a',
              'blue': '#1e3a8a',
              'verde': '#003218',
              'green': '#003218',
              'amarelo': '#a16207',
              'amarela': '#a16207',
              'yellow': '#a16207',
              'vermelho': '#991b1b',
              'vermelha': '#991b1b',
              'red': '#991b1b',
              'branco': '#ffffff',
              'branca': '#ffffff',
              'white': '#ffffff',
              'cinza': '#374151',
              'gray': '#374151',
              'rosa': '#be185d',
              'pink': '#be185d',
              'laranja': '#c2410c',
              'orange': '#c2410c',
              'roxo': '#5b21b6',
              'roxa': '#5b21b6',
              'purple': '#5b21b6',
              'bege': '#CA8A00',
              'beige': '#CA8A00',
              'marrom': '#451a03',
              'brown': '#451a03'
            };
            const getColorHex = (colorName: string) => {
              const lowerName = colorName.toLowerCase();
              return colorMap[lowerName] || '#222E4B';
            };
            const renderOption = (option: typeof product.options[0]) => {
              const isColorOption = option.name.toLowerCase() === 'cor' || option.name.toLowerCase() === 'color';
              const selectedColorName = isColorOption ? selectedOptions[option.name] : null;
              return <div key={option.name} className="flex flex-col items-start gap-2 flex-1">
                    <span className="font-bold text-gray-900">
                      {option.name}{isColorOption && selectedColorName ? `: ${selectedColorName}` : ''}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map(value => {
                    const isSelected = selectedOptions[option.name] === value;
                    const variantWithValue = product.variants.edges.find(v => v.node.selectedOptions.some(o => o.name === option.name && o.value === value));
                    const isAvailable = variantWithValue?.node.availableForSale ?? false;
                    const handleOptionSelect = () => {
                      const newSelectedOptions = {
                        ...selectedOptions,
                        [option.name]: value
                      };
                      setSelectedOptions(newSelectedOptions);

                      // Find a variant that matches all selected options
                      let matchingVariant = product.variants.edges.find(v => v.node.selectedOptions.every(opt => newSelectedOptions[opt.name] === opt.value));

                      // If no exact match, find first available variant with the newly selected option
                      if (!matchingVariant) {
                        matchingVariant = product.variants.edges.find(v => v.node.availableForSale && v.node.selectedOptions.some(opt => opt.name === option.name && opt.value === value));

                        // Update all selected options to match this variant
                        if (matchingVariant) {
                          const updatedOptions: Record<string, string> = {};
                          matchingVariant.node.selectedOptions.forEach(opt => {
                            updatedOptions[opt.name] = opt.value;
                          });
                          setSelectedOptions(updatedOptions);
                        }
                      }
                      if (matchingVariant) {
                        setSelectedVariant(matchingVariant.node.id);
                        // Navigate to variant image if it has one
                        const variantImageUrl = matchingVariant.node.image?.url;
                        if (variantImageUrl && product) {
                          const productImages = product.images.edges.map(e => e.node);
                          const productImageUrls = new Set(productImages.map(img => img.url));
                          const variantImagesUnique = product.variants.edges
                            .filter(v => v.node.image?.url && !productImageUrls.has(v.node.image!.url))
                            .map(v => v.node.image!.url)
                            .filter((url, i, self) => self.indexOf(url) === i);
                          const allImageUrls = [...productImages.map(img => img.url), ...variantImagesUnique];
                          const imgIdx = allImageUrls.indexOf(variantImageUrl);
                          if (imgIdx >= 0) setSelectedImage(imgIdx);
                        }
                      }
                    };
                    if (isColorOption) {
                      const colorHex = getColorHex(value);
                      const isWhite = colorHex.toLowerCase() === '#ffffff';
                      const isBlack = colorHex.toLowerCase() === '#000000';
                      return <button key={value} onClick={handleOptionSelect} className={`w-9 h-9 rounded-full transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900' : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-400'} ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''} ${isWhite ? 'border border-gray-300' : ''} ${isBlack ? 'border border-gray-400' : ''}`} style={{
                        backgroundColor: colorHex
                      }} disabled={!isAvailable} title={value} aria-label={value} />;
                    }
                    return <button key={value} onClick={handleOptionSelect} className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${isSelected ? 'border-[#111928] bg-[#111928] text-white' : 'border-gray-300 hover:border-[#111928] bg-white text-gray-900'} ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}`} disabled={!isAvailable}>
                            {value}
                          </button>;
                  })}
                    </div>
                  </div>;
            };
            return <>
                  {/* Row 1: Modelo and Cor */}
                  {(modeloOption || corOption) && <div ref={modeloSectionRef} className="flex flex-col sm:flex-row gap-5">
                      {modeloOption && (
                        <div className="relative">
                          {renderOption(modeloOption)}
                          {/* Warning tooltip */}
                          {showModelWarning && !selectedOptions[modeloOption.name] && (
                            <div className="absolute left-0 top-full mt-2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg animate-fade-in z-10">
                              <div className="w-5 h-5 bg-amber-400 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                              <span className="text-sm text-gray-700 whitespace-nowrap">Selecione o modelo</span>
                            </div>
                          )}
                        </div>
                      )}
                      {corOption && renderOption(corOption)}
                    </div>}

                  {/* Row 2: Tamanho and Quantidade */}
                  {(tamanhoOption || true) && <div className="flex flex-col sm:flex-row gap-5">
                      {tamanhoOption && renderOption(tamanhoOption)}
                      
                      {/* Quantity */}
                      <div className="flex flex-col items-start gap-2 flex-1">
                        <span className="font-bold text-gray-900">Quantidade</span>
                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>}

                  {/* Other options */}
                  {otherOptions.map(option => renderOption(option))}
                </>;
          })()}

            {/* Size Guide Link */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-blue-600 underline text-base font-normal">
                  <img src={sewingTapeMeasure} alt="Fita métrica" className="w-6 h-6" />
                  Confira suas medidas
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Guia de Medidas</DialogTitle>
                </DialogHeader>
                {hasBodyInfantilTag ? (
                  <div className="flex justify-center mt-4">
                    <img src={sizeGuideBodyInfantil} alt="Guia de medidas body infantil" className="w-full max-w-md object-contain rounded-lg" />
                  </div>
                ) : hasCamisetaInfantilTag ? (
                  <div className="flex justify-center mt-4">
                    <img src={sizeGuideInfantil} alt="Guia de medidas camiseta infantil" className="w-full max-w-md object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <img src={sizeGuideFemale} alt="Guia de medidas feminino" className="w-full md:w-1/2 object-contain rounded-lg" />
                    <img src={sizeGuideMale} alt="Guia de medidas masculino" className="w-full md:w-1/2 object-contain rounded-lg" />
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Add to Cart Button */}
            <Button ref={mainButtonRef} onClick={handleAddToCart} className="w-full py-6 text-base font-medium bg-black text-white hover:bg-black/90 rounded-lg" disabled={displayVariant && !displayVariant.availableForSale}>
              {displayVariant?.availableForSale !== false ? 'Adicionar ao Carrinho' : 'Produto indisponível'}
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-2 items-start">
                <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-700" />
                <span className="leading-5 text-gray-500 text-sm">
                  <em className="not-italic font-medium text-emerald-700">Primeira troca grátis.</em>{' '}
                  Você tem até 30 dias para trocar o produto.
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-700" />
                <span className="leading-5 text-gray-500 text-sm">
                  <em className="not-italic font-medium text-emerald-700">Compra segura.</em>{' '}
                  Site construído para a sua segurança.
                </span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-2 mt-2">
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/visa-4c562b0e312e36ce0daadaf465d3759ca162cb39c6a828454a5cfb2c95f8e26a.svg" alt="Visa" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/master-f27cb6ce5923f7f52ceded3fdc486079492ac922931c00db634211bb5453b11c.svg" alt="Mastercard" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/elo-c40efbc3640e09e5b4acd03ee7f09dd31d521959516adf224f007458739d77e3.svg" alt="Elo" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/amex-6f16117e3c9e8a546737b6951c187f2014009b8b40e374dc0c846561ea66c663.svg" alt="Amex" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/dinners-32c627a8ea96ce8e10b78feafe65bb95ae948af63539dcb9fea45a8c376a419f.svg" alt="Diners" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/pix-39099f2f23f9b0fcc7e66c2759d247b7f04e7bd44b8b8f1103aaa2ee28c0f86d.svg" alt="Pix" className="w-10 h-6" />
            </div>
          </section>
        </div>

        {/* Product Tabs */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <Tabs defaultValue="fabricacao" className="w-full">
            <TabsList className="w-full justify-center bg-transparent border-b border-gray-200 rounded-none h-auto p-0">
              <TabsTrigger value="fabricacao" className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-gray-800 data-[state=active]:bg-transparent rounded-none text-gray-500 data-[state=active]:text-gray-800 font-medium">
                Fabricação
              </TabsTrigger>
              <TabsTrigger value="material" className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-gray-800 data-[state=active]:bg-transparent rounded-none text-gray-500 data-[state=active]:text-gray-800 font-medium">
                Material
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fabricacao" className="p-4 bg-gray-50 rounded-lg mt-4">
              <p className="text-base text-gray-700 font-medium">
                Criada no Brasil e feita pro mundo, todos nossos produtos são feitos sob demanda
                para você usando tecnologia de ponta na estamparia.
              </p>
            </TabsContent>
            <TabsContent value="material" className="p-4 bg-gray-50 rounded-lg mt-4">
              <p className="text-base text-gray-700 font-medium">
                Nossas camisetas são de excelência em algodão brasileiro, ideais para todos os climas. 
                Todas as cores são 100% algodão; exceto cinzas: 88% algodão e 12% poliéster.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <Truck className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Primeira troca grátis</p>
            <p className="text-sm leading-tight font-normal text-gray-500">A primeira troca é gratuita, sem complicação</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <Star className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Alta qualidade</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Produtos feitos de algodão premium</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <CreditCard className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Até 3x sem juros</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Sem mínimo necessário</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" viewBox="0 0 452 452" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,452) scale(0.1,-0.1)" fill="currentColor" className="text-gray-700" stroke="none">
                <path d="M1605 4231 c-22 -10 -65 -39 -95 -65 -82 -72 -88 -73 -148 -35 -59 36 -109 41 -160 15 -72 -37 -82 -124 -26 -224 35 -62 36 -66 19 -78 -10 -8 -34 -17 -52 -20 -29 -5 -43 0 -91 33 -82 56 -116 68 -202 67 -95 0 -141 -16 -180 -61 -25 -28 -31 -43 -29 -73 2 -28 -3 -45 -24 -69 -40 -48 -37 -98 12 -197 22 -43 42 -100 46 -126 6 -41 4 -50 -17 -71 -14 -14 -51 -32 -84 -41 -116 -33 -149 -49 -200 -100 -43 -42 -56 -64 -75 -126 -30 -97 -33 -249 -6 -326 37 -107 137 -183 244 -187 51 -2 55 -4 60 -30 7 -36 64 -84 109 -93 79 -15 158 1 266 53 152 74 142 74 158 6 32 -147 97 -202 260 -218 81 -8 135 -23 154 -44 9 -11 15 -47 18 -107 3 -80 6 -95 30 -125 29 -40 85 -70 173 -96 71 -21 75 -32 51 -149 -40 -191 -1 -290 137 -348 53 -23 66 -34 86 -72 13 -24 41 -59 61 -78 31 -28 38 -41 42 -84 3 -34 14 -63 31 -85 l26 -34 -22 -20 c-12 -11 -56 -45 -98 -75 -149 -109 -213 -227 -164 -301 16 -25 61 -47 96 -47 10 0 49 -30 86 -67 37 -38 84 -77 104 -87 32 -17 36 -23 37 -61 1 -74 57 -126 118 -111 32 8 108 86 242 246 53 63 127 150 165 192 100 113 132 211 103 318 -15 54 -14 56 12 94 26 38 88 94 128 114 47 25 187 53 297 61 102 7 123 12 157 35 51 34 102 104 136 186 15 36 55 124 89 195 101 209 104 228 79 467 -8 69 -4 74 82 132 60 40 198 185 282 298 112 149 150 319 93 412 -26 41 -79 71 -166 90 -116 27 -121 30 -166 117 -74 142 -157 200 -308 220 -46 5 -105 14 -133 19 -28 6 -83 10 -122 10 l-71 0 -20 37 c-27 50 -85 89 -164 112 -99 29 -143 33 -194 21 -46 -12 -46 -12 -77 23 -17 20 -44 38 -59 42 -27 6 -28 8 -23 51 9 80 -50 267 -101 323 -26 28 -76 51 -112 51 -60 0 -134 -59 -176 -141 l-19 -39 -103 6 -102 7 -90 -48 c-74 -39 -102 -48 -157 -53 l-67 -5 -6 34 c-3 19 -10 86 -14 150 -9 126 -24 168 -66 187 -35 16 -53 15 -100 -7z m-5 -291 c0 -74 20 -136 57 -180 47 -55 85 -70 175 -70 97 1 148 13 240 61 l77 39 103 -6 c95 -5 106 -3 143 18 22 13 54 44 70 70 17 26 33 47 36 47 8 1 39 -109 39 -140 0 -13 -22 -62 -50 -109 -58 -99 -67 -158 -29 -199 50 -53 102 -48 178 18 l44 38 47 -49 c57 -59 99 -65 150 -21 l32 27 76 -20 c76 -19 76 -19 109 -77 49 -82 68 -92 183 -92 108 0 296 -20 355 -38 36 -11 43 -20 86 -100 25 -48 61 -103 80 -123 44 -45 117 -80 202 -95 37 -7 67 -18 67 -24 0 -35 -35 -119 -72 -172 -81 -115 -201 -244 -275 -294 -125 -85 -151 -138 -137 -288 17 -197 17 -198 -68 -376 -42 -88 -84 -178 -93 -200 -9 -22 -26 -55 -38 -72 -21 -32 -25 -33 -89 -33 -37 0 -111 -9 -165 -19 -204 -40 -311 -101 -402 -232 -58 -82 -69 -123 -52 -194 25 -105 25 -108 -11 -153 -63 -78 -279 -332 -283 -332 -16 0 -128 76 -155 106 -19 20 -49 52 -67 71 l-32 34 95 70 c119 89 157 146 151 226 -2 36 -12 64 -30 91 -16 23 -27 52 -27 73 -1 48 -33 113 -70 141 -18 12 -47 46 -65 74 -39 60 -79 93 -152 124 -50 21 -53 25 -53 57 0 19 7 63 16 97 10 38 15 89 12 137 -5 124 -53 175 -210 224 l-57 18 1 72 c1 61 -3 80 -28 125 -16 29 -47 66 -68 82 -46 33 -138 63 -221 73 -33 3 -69 8 -81 10 -23 5 -38 45 -49 131 -12 92 -64 144 -144 144 -43 0 -179 -45 -273 -91 -105 -50 -114 -50 -121 3 -6 48 -33 88 -71 107 -25 11 -35 10 -83 -8 -68 -26 -65 -26 -102 4 -43 37 -58 112 -42 203 18 101 38 128 108 147 124 35 153 47 198 87 56 49 85 104 92 172 6 58 -15 153 -48 218 l-21 42 25 18 c27 20 53 80 42 98 -15 25 54 7 100 -26 69 -49 109 -64 169 -64 81 0 144 26 203 85 64 65 78 117 48 187 -6 16 -3 17 24 12 45 -9 93 3 142 36 24 16 47 26 51 24 4 -3 8 -23 8 -44z" />
              </g>
            </svg>
            <p className="text-sm leading-tight font-bold text-gray-900">Todo o Brasil</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Envio para todas regiões brasileiras</p>
          </div>
        </div>

        {/* Product Collection */}
        <div className="mt-10">
          <RelatedProducts 
            title="Você também pode gostar" 
            excludeHandle={handle} 
            collectionFilter={hasCamisetaInfantilTag || hasBodyInfantilTag ? 'nacao-kids' : 'direita-raiz'}
          />
        </div>

        {/* Product Reviews Section */}
        <div className="mt-10">
          <ProductReviews />
        </div>
      </main>

      {/* Mobile Add to Cart Fixed Button */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden z-30 transition-transform duration-300 ${showMobileCart ? 'translate-y-0' : 'translate-y-full'}`}>
        <Button onClick={handleAddToCart} className="w-full py-4 text-base font-medium bg-black text-white hover:bg-black/90 rounded-lg" disabled={displayVariant && !displayVariant.availableForSale}>
          {displayVariant?.availableForSale !== false ? 'Adicionar ao Carrinho' : 'Produto indisponível'}
        </Button>
      </div>

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>

      {/* Coupon Sheet */}
      <Sheet open={couponSheetOpen} onOpenChange={setCouponSheetOpen}>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-2xl px-6 pt-6">
          <SheetHeader className="flex flex-row items-center justify-between pb-4">
            <SheetTitle className="text-xl font-semibold">Cupons</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Cupons disponíveis para esse produto.<br />
              Você pode apenas aplicar um cupom por compra.
            </p>
            
            {availableCoupons.map(coupon => <div key={coupon.code} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-800 font-bold py-1 px-3 leading-[21px] bg-green-100 rounded-md">
                    <Tag className="w-3.5 h-3.5" />
                    {coupon.code}
                  </span>
                  <button onClick={() => {
                navigator.clipboard.writeText(coupon.code);
                toast.success('Cupom copiado!');
              }} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  Você economiza <span className="text-green-600 font-medium">{formatPrice((price * coupon.discountPercent / 100).toString())}</span> na compra
                </p>
                <ul className="mt-2 text-sm text-gray-900 space-y-1">
                  <li>• {coupon.discountPercent}% OFF</li>
                  <li>• Mínimo do carrinho: {coupon.minItems} itens</li>
                </ul>
              </div>)}
          </div>
        </SheetContent>
      </Sheet>

      {/* Coupon Dialog (Desktop) */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Cupons</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Cupons disponíveis para esse produto.<br />
              Você pode apenas aplicar um cupom por compra.
            </p>
            
            {availableCoupons.map(coupon => (
              <div key={coupon.code} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-800 font-bold py-1 px-3 leading-[21px] bg-green-100 rounded-md">
                    <Tag className="w-3.5 h-3.5" />
                    {coupon.code}
                  </span>
                  <button onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    toast.success('Cupom copiado!');
                  }} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  Você economiza <span className="text-green-600 font-medium">{formatPrice((price * coupon.discountPercent / 100).toString())}</span> na compra
                </p>
                <ul className="mt-2 text-sm text-gray-900 space-y-1">
                  <li>• {coupon.discountPercent}% OFF</li>
                  <li>• Mínimo do carrinho: {coupon.minItems} itens</li>
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Shipping Dialog - Desktop & Mobile */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">Calcular frete e prazo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Digite seu CEP para calcular o prazo de entrega.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" value={cep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
              <button onClick={fetchCepInfo} disabled={loadingCep || cep.length < 9} className="px-6 py-3 bg-black text-white rounded-lg text-base font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingCep ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calcular'}
              </button>
            </div>
            
            {cepError && <p className="text-red-500 text-sm">{cepError}</p>}
            
            {shippingInfo && <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-base sm:text-lg">Entrega para {shippingInfo.city}, {shippingInfo.state}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <Truck className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-600">Frete Grátis</p>
                      <p className="text-sm text-gray-600">Prazo de 9 a 12 dias úteis</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                    <p className="text-sm text-gray-500">Receba entre</p>
                    <p className="font-medium text-gray-900 text-sm">{shippingInfo.deliveryDateStart}</p>
                    <p className="font-medium text-gray-900 text-sm">e {shippingInfo.deliveryDateEnd}</p>
                  </div>
                </div>
              </div>}
            
            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block">
              Não sei meu CEP
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shipping Sheet - Mobile */}
      <Sheet open={shippingSheetOpen} onOpenChange={setShippingSheetOpen}>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-2xl px-6 pt-6">
          <SheetHeader className="flex flex-row items-center justify-between pb-4">
            <SheetTitle className="text-xl font-semibold">Calcular frete e prazo</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Digite seu CEP para calcular o prazo de entrega.
            </p>
            
            <div className="flex gap-2">
              <input type="text" value={cep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
              <button onClick={fetchCepInfo} disabled={loadingCep || cep.length < 9} className="px-6 py-3 bg-black text-white rounded-lg text-base font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingCep ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calcular'}
              </button>
            </div>
            
            {cepError && <p className="text-red-500 text-sm">{cepError}</p>}
            
            {shippingInfo && <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold text-lg">Entrega para {shippingInfo.city}, {shippingInfo.state}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-600">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Prazo de 9 a 12 dias úteis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Receba entre</p>
                    <p className="font-medium text-gray-900 text-sm">{shippingInfo.deliveryDateStart}</p>
                    <p className="font-medium text-gray-900 text-sm">e {shippingInfo.deliveryDateEnd}</p>
                  </div>
                </div>
              </div>}
            
            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block">
              Não sei meu CEP
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </div>;
}