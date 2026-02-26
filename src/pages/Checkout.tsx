import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';
import { Logo } from '@/components/store/Logo';
import dafiti from '@/assets/dafiti-logo.png';
import { Lock, ChevronLeft, ChevronRight, Tag, X, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { StepPersonalData } from '@/components/checkout/StepPersonalData';
import { StepShipping } from '@/components/checkout/StepShipping';
import { StepPayment, type CardData } from '@/components/checkout/StepPayment';
import { NavigationLoader } from '@/components/NavigationLoader';
import { PixLoadingOverlay } from '@/components/checkout/PixLoadingOverlay';
import { PixResultScreen } from '@/components/checkout/PixResultScreen';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface FieldErrors {
  firstName?: boolean;
  email?: boolean;
  phone?: boolean;
  cpf?: boolean;
  cep?: boolean;
  street?: boolean;
  number?: boolean;
  neighborhood?: boolean;
  city?: boolean;
  state?: boolean;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, updateQuantity, removeItem, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<{
    dateStart: string;
    dateEnd: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('pix');
  const [isPixLoading, setIsPixLoading] = useState(false);
  const [pixResult, setPixResult] = useState<{ qrCodeBase64: string; copyPaste: string; saleId?: string } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponManuallyRemoved, setCouponManuallyRemoved] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selectedShipping, setSelectedShipping] = useState<'express' | 'standard' | 'free'>('free');
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });



  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  // Auto-apply RAIZ10 coupon when user has 2+ items (only if not manually removed)
  useEffect(() => {
    const totalItems = getTotalItems();
    if (totalItems >= 2 && !appliedCoupon && !couponManuallyRemoved) {
      setAppliedCoupon('RAIZ10');
    }
  }, [items, appliedCoupon, getTotalItems, couponManuallyRemoved]);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const hasFreeShipping = totalItems >= 2;

  // Opções de frete
  const shippingOptions = [
    { id: 'express', label: 'Entrega Prioritária', days: 'Até 24 horas', price: 26.12 },
    { id: 'standard', label: 'Entrega Padrão', days: '2 a 3 dias úteis', price: 19.90 },
    { id: 'free', label: 'Frete Grátis', days: '3 a 5 dias úteis', price: 0 },
  ];
  const shippingCost = selectedShipping === 'express' ? 26.12 : selectedShipping === 'standard' ? 19.90 : 0;

  // Cupom RAIZ10: 10% de desconto com mínimo de 2 itens
  // Cupom BRASIL22: cupom dev — total fixo em R$1,00
  const isDevCoupon = appliedCoupon === 'BRASIL22';
  const discount = isDevCoupon ? 0 : (appliedCoupon === 'RAIZ10' ? subtotal * 0.10 : 0);
  const totalPrice = isDevCoupon ? 1.00 : (subtotal - discount + shippingCost);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();

    if (code === 'BRASIL22') {
      setAppliedCoupon('BRASIL22');
      setCouponCode('');
      toast.success('Cupom aplicado com sucesso!');
    } else if (code === 'RAIZ10') {
      if (totalItems >= 2) {
        setAppliedCoupon('RAIZ10');
        setCouponCode('');
        toast.success('Cupom aplicado com sucesso!');
      } else {
        setCouponError('Mínimo de 2 itens para usar este cupom');
      }
    } else if (code !== '') {
      setCouponError('Cupom inválido');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponManuallyRemoved(true);
    setCouponError('');
    toast.info('Cupom removido');
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCpf(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'cep') {
      formattedValue = formatCep(value);
    }
    
    setCustomerData(prev => ({ ...prev, [field]: formattedValue }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: false }));
    }

    // Auto-busca o endereço quando CEP completo é digitado
    if (field === 'cep') {
      const cleanCep = formattedValue.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setTimeout(() => fetchAddressByCepValue(cleanCep), 0);
      }
    }
  };

  const calculateDeliveryDates = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 9);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 12);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short'
      });
    };
    
    return {
      dateStart: formatDate(startDate),
      dateEnd: formatDate(endDate)
    };
  };

  const fetchAddressByCepValue = async (cleanCep: string) => {
    if (cleanCep.length !== 8) return;
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCustomerData(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || '',
          state: data.uf || '',
        }));
        setDeliveryEstimate(calculateDeliveryDates());
      } else {
        setDeliveryEstimate(null);
      }
    } catch (error) {
      console.error('Error fetching CEP:', error);
      setDeliveryEstimate(null);
    } finally {
      setLoadingCep(false);
    }
  };

  const fetchAddressByCep = async () => {
    const cleanCep = customerData.cep.replace(/\D/g, '');
    fetchAddressByCepValue(cleanCep);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateCpf = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCpf)) return false;
    
    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
    
    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
    
    return true;
  };

  const validateStep1 = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (!customerData.firstName.trim() || customerData.firstName.trim().split(' ').length < 2) {
      errors.firstName = true;
      isValid = false;
    }
    if (!validateEmail(customerData.email)) {
      errors.email = true;
      isValid = false;
    }
    if (customerData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = true;
      isValid = false;
    }
    if (!validateCpf(customerData.cpf)) {
      errors.cpf = true;
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos corretamente');
    }
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (customerData.cep.replace(/\D/g, '').length !== 8) {
      errors.cep = true;
      isValid = false;
    }
    if (!customerData.street.trim()) {
      errors.street = true;
      isValid = false;
    }
    if (!customerData.number.trim()) {
      errors.number = true;
      isValid = false;
    }
    if (!customerData.neighborhood.trim()) {
      errors.neighborhood = true;
      isValid = false;
    }
    if (!customerData.city.trim()) {
      errors.city = true;
      isValid = false;
    }
    if (!customerData.state.trim()) {
      errors.state = true;
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos corretamente');
    }
    return isValid;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Fire TikTok InitiateCheckout when reaching payment step
      if (nextStep === 3 && typeof window !== 'undefined' && (window as any).ttq) {
        const total = getTotalPrice();
        (window as any).ttq.track('InitiateCheckout', {
          value: total,
          currency: 'BRL',
          contents: items.map(item => ({
            content_id: item.variantId,
            content_name: item.product.node.title,
            quantity: item.quantity,
            price: parseFloat(item.price.amount),
          })),
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sendOrderToShopify = async (orderItems: typeof items, orderDiscount: number, orderShippingCost: number, orderPaymentMethod: string, orderIdStr: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-shopify-order', {
        body: {
          items: orderItems.map(item => ({
            title: item.product.node.title,
            quantity: item.quantity,
            price: item.price.amount,
            variantId: item.variantId,
          })),
          customer: {
            name: customerData.firstName.trim(),
            email: customerData.email,
            phone: customerData.phone,
          },
          shipping: {
            street: customerData.street,
            number: customerData.number,
            complement: customerData.complement,
            neighborhood: customerData.neighborhood,
            city: customerData.city,
            state: customerData.state,
            cep: customerData.cep,
          },
          paymentMethod: orderPaymentMethod,
          discount: orderDiscount,
          shippingCost: orderShippingCost,
          orderId: orderIdStr,
        },
      });
      if (error) {
        console.error('Shopify order error:', error);
      } else {
        console.log('Shopify order created:', data);
      }
    } catch (err) {
      console.error('Failed to send order to Shopify:', err);
    }
  };

  const handleSubmitOrder = async (cardData?: CardData) => {
    setIsLoading(true);
    if (paymentMethod === 'pix') setIsPixLoading(true);
    
    try {
      // BlackCat API expects values in centavos
      const amountInCentavos = Math.round(totalPrice * 100);

      // Calculate discounted unit price proportionally so items sum matches total
      const rawSubtotal = items.reduce((acc, item) => acc + parseFloat(item.price.amount) * item.quantity, 0);
      const discountRatio = rawSubtotal > 0 ? (subtotal - discount) / rawSubtotal : 1;

      const apiItems = items.map((item) => ({
        title: item.product.node.title,
        unitPrice: Math.round(parseFloat(item.price.amount) * discountRatio * 100),
        quantity: item.quantity,
      }));

      const customer = {
        name: customerData.firstName.trim(),
        email: customerData.email,
        document: customerData.cpf.replace(/\D/g, ''),
        phone: customerData.phone.replace(/\D/g, ''),
      };

      const shipping = {
        street: customerData.street,
        number: customerData.number,
        complement: customerData.complement || '',
        neighborhood: customerData.neighborhood,
        city: customerData.city,
        state: customerData.state,
        zipCode: customerData.cep.replace(/\D/g, ''),
      };

      const paymentPayload: Record<string, unknown> = {
        amount: amountInCentavos,
        paymentMethod: paymentMethod === 'credit' ? 'credit_card' : 'pix',
        items: apiItems,
        customer,
        shipping,
        externalRef: `ORDER-${Date.now()}`,
      };

      if (paymentMethod === 'credit' && cardData) {
        const [expiryMonth, expiryYear] = (cardData.cardExpiry || '').split('/');
        paymentPayload.cardData = {
          number: cardData.cardNumber.replace(/\s/g, ''),
          holderName: cardData.cardName,
          expirationMonth: expiryMonth || '',
          expirationYear: expiryYear ? `20${expiryYear}` : '',
          cvv: cardData.cardCvv,
          holderDocument: cardData.cardCpf.replace(/\D/g, ''),
          installments: parseInt(cardData.installments) || 1,
        };
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentPayload,
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('Erro ao processar pagamento. Tente novamente.');
        return;
      }

      if (data && !data.success) {
        toast.error(data.message || 'Erro ao processar pagamento.');
        return;
      }

      console.log('Payment response:', data);

      console.log('Full payment response:', JSON.stringify(data));

      if (paymentMethod === 'pix') {
        const pixData = data?.data?.paymentData || data?.paymentData;
        if (!pixData) {
          toast.error('Não foi possível gerar o QR Code do PIX. Tente novamente.');
          return;
        }
        setIsPixLoading(false);

        // Save order data for thank you page
        const orderData = {
          items: items.map(item => ({
            title: item.product.node.title,
            quantity: item.quantity,
            price: item.price.amount,
            image: item.product.node.images?.edges?.[0]?.node?.url || '',
            variant: item.selectedOptions.map(o => o.value).join(' / '),
          })),
          subtotal,
          discount,
          shippingCost,
          total: totalPrice,
          coupon: appliedCoupon,
          customer: {
            name: customerData.firstName.trim(),
            email: customerData.email,
            phone: customerData.phone,
          },
          shipping: {
            street: customerData.street,
            number: customerData.number,
            complement: customerData.complement,
            neighborhood: customerData.neighborhood,
            city: customerData.city,
            state: customerData.state,
            cep: customerData.cep,
          },
          paymentMethod: 'PIX',
          orderId: `#${Date.now().toString().slice(-6)}`,
          deliveryEstimate,
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Send order to Shopify (don't block the PIX flow)
        sendOrderToShopify(items, discount, shippingCost, 'PIX', orderData.orderId);

        setPixResult({
          qrCodeBase64: pixData.qrCodeBase64 || pixData.qrcode || '',
          copyPaste: pixData.copyPaste || pixData.qrcode_text || pixData.brCode || '',
          saleId: data.data?.id || data.data?.saleId || '',
        });
      } else if (paymentMethod === 'credit') {
        // data?.success OR data?.data indicates success (BlackCat may vary)
        if (data && (data.success === false || data.status === 'failed' || data.error)) {
          toast.error(data.message || 'Pagamento recusado. Verifique os dados do cartão.');
          return;
        }
        // Save order data for thank you page
        const orderData = {
          items: items.map(item => ({
            title: item.product.node.title,
            quantity: item.quantity,
            price: item.price.amount,
            image: item.product.node.images?.edges?.[0]?.node?.url || '',
            variant: item.selectedOptions.map(o => o.value).join(' / '),
          })),
          subtotal,
          discount,
          shippingCost,
          total: totalPrice,
          coupon: appliedCoupon,
          customer: {
            name: customerData.firstName.trim(),
            email: customerData.email,
            phone: customerData.phone,
          },
          shipping: {
            street: customerData.street,
            number: customerData.number,
            complement: customerData.complement,
            neighborhood: customerData.neighborhood,
            city: customerData.city,
            state: customerData.state,
            cep: customerData.cep,
          },
          paymentMethod: 'Cartão de Crédito',
          orderId: `#${Date.now().toString().slice(-6)}`,
          deliveryEstimate,
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Send order to Shopify
        await sendOrderToShopify(items, discount, shippingCost, 'Cartão de Crédito', orderData.orderId);

        clearCart();
        navigate('/obrigado');
      }
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsPixLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] md:origin-top md:scale-110" style={{ overflowX: 'clip' }}>
      {/* Overlays */}
      <NavigationLoader isVisible={isNavigating} message="Voltando para a loja..." />
      <PixLoadingOverlay isVisible={isPixLoading} />



      {/* Minimal Header */}
      <header className="bg-black py-4 px-4 border-b border-neutral-800">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            onClick={(e) => {
              e.preventDefault();
              setIsNavigating(true);
              setTimeout(() => navigate('/'), 400);
            }}
          >
            <img src={dafiti} alt="Dafiti" className="h-8 md:h-10 w-auto invert brightness-100" />
          </Link>
          <div className="flex items-center gap-2 text-white text-sm">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Checkout Seguro</span>
          </div>
        </div>
      </header>

      {/* Gradient line */}
      {pixResult && (
        <div className="w-full h-[2px]" style={{ background: 'linear-gradient(90deg, #4CAF50, #FFEB3B)' }} />
      )}

      {/* Promo Bar */}
      {!pixResult && (
        <div className="bg-[#171717] text-white py-1.5 px-4 text-center text-[12px] font-medium tracking-wide whitespace-nowrap">
          ENVIO EM ATÉ 24H + GARANTIA DE ENTREGA
        </div>
      )}
      
      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-6xl mx-auto px-4">
          {pixResult ? (
            <PixResultScreen
              qrCodeBase64={pixResult.qrCodeBase64}
              copyPasteCode={pixResult.copyPaste}
              amount={totalPrice}
              saleId={pixResult.saleId}
              onPaymentDone={() => {
                clearCart();
                navigate('/obrigado');
              }}
            />
          ) : (
          <>
          {currentStep > 1 && (
            <button 
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          {/* Progress Indicator */}
          <CheckoutProgress currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Order Summary - Sidebar */}
            <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 p-2 bg-muted/30 rounded-lg">
                      <div className="w-14 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1 uppercase">{item.product.node.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedOptions.map(o => o.value).join(' / ')}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-muted hover:bg-muted/80 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                            <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {formatPrice((parseFloat(item.price.amount) * item.quantity).toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="py-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cupom de desconto</span>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-muted rounded-md px-3 py-2">
                      <span className="text-sm font-medium text-foreground">
                        {appliedCoupon} aplicado
                      </span>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Digite o cupom"
                          className="flex-1 h-9 text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <Button 
                          onClick={handleApplyCoupon}
                          variant="outline"
                          size="sm"
                          className="h-9"
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-destructive">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Summary Totals */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal.toString())}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="text-foreground">-{formatPrice(discount.toString())}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className={hasFreeShipping ? 'text-foreground font-semibold' : ''}>
                      {hasFreeShipping ? 'Grátis' : formatPrice(shippingCost.toString())}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-foreground">{formatPrice(totalPrice.toString())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="lg:col-span-2 lg:order-1 space-y-6">
              {currentStep === 1 && (
                <StepPersonalData
                  customerData={customerData}
                  onInputChange={handleInputChange}
                  fieldErrors={fieldErrors}
                />
              )}

              {currentStep === 2 && (
                <StepShipping
                  customerData={customerData}
                  onInputChange={handleInputChange}
                  onCepBlur={fetchAddressByCep}
                  loadingCep={loadingCep}
                  deliveryEstimate={deliveryEstimate}
                  hasFreeShipping={hasFreeShipping}
                  shippingCost={shippingCost}
                  fieldErrors={fieldErrors}
                  shippingOptions={shippingOptions}
                  selectedShipping={selectedShipping}
                  onShippingChange={setSelectedShipping}
                />
              )}

              {currentStep === 3 && (
                <StepPayment
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  subtotal={subtotal}
                  discount={discount}
                  appliedCoupon={appliedCoupon}
                  shippingCost={shippingCost}
                  hasFreeShipping={hasFreeShipping}
                  totalPrice={totalPrice}
                  isLoading={isLoading}
                  onSubmit={handleSubmitOrder}
                />
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 sm:flex-none bg-black hover:bg-black/80 text-white font-bold"
                  >
                    {currentStep === 1 ? 'Ir para Entrega' : 'Ir para Pagamento'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* Footer with seals */}
      <footer className="bg-black text-white py-6 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Seals */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.reclameaqui.com.br/empresa/yampi/?utm_source=referral&utm_medium=embbed&utm_campaign=ra_verificada&utm_term=horizontal"
                target="_blank"
                rel="noopener noreferrer"
                title="Selo RA Verificada"
                className="flex items-center gap-1.5 bg-white rounded px-1.5 py-1"
              >
                <img 
                  src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/verified.svg" 
                  alt="Selo RA Verificada" 
                  className="w-7 h-7"
                />
                <div className="flex flex-col">
                  <span className="text-[9px] text-neutral-500">Verificada por</span>
                  <img 
                    src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/ra-logo.svg" 
                    alt="Reclame Aqui" 
                    className="w-[60px] h-[12px]"
                  />
                </div>
              </a>
            </div>

            {/* Address */}
            <div className="text-center md:text-right text-xs text-neutral-400">
              <p>GFG COMÉRCIO DIGITAL LTDA. - CNPJ: 11.200.418/0006-73</p>
              <p>Estrada Municipal Luiz Lopes Neto, 617 - Bairro dos Tenentes, CEP: 37640-915, Extrema, MG, Brasil.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
