import { useState } from 'react';
import pixIcon from '@/assets/pix-icon.jpg';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Loader2, HelpCircle } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CardData {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  cardCpf: string;
  installments: string;
}

interface StepPaymentProps {
  paymentMethod: 'credit' | 'pix';
  onPaymentMethodChange: (value: 'credit' | 'pix') => void;
  subtotal: number;
  discount: number;
  appliedCoupon: string | null;
  shippingCost: number;
  hasFreeShipping: boolean;
  totalPrice: number;
  isLoading: boolean;
  onSubmit: (cardData?: CardData) => void;
}

export function StepPayment({
  paymentMethod,
  onPaymentMethodChange,
  subtotal,
  discount,
  appliedCoupon,
  shippingCost,
  hasFreeShipping,
  totalPrice,
  isLoading,
  onSubmit,
}: StepPaymentProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardCpf, setCardCpf] = useState('');
  const [installments, setInstallments] = useState('1');

  const detectBrand = (number: string): { name: string; logo: string } | null => {
    const nums = number.replace(/\D/g, '');
    if (!nums) return null;
    if (/^4/.test(nums)) return { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' };
    if (/^5[1-5]/.test(nums) || /^2[2-7]/.test(nums)) return { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' };
    if (/^3[47]/.test(nums)) return { name: 'Amex', logo: 'https://github.bubbstore.com/svg/card-amex.svg' };
    if (/^(?:636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(nums) || /^6(?:36|5)/.test(nums)) return { name: 'Elo', logo: 'https://github.bubbstore.com/svg/card-elo.svg' };
    if (/^3(?:0[0-5]|[68])/.test(nums)) return { name: 'Diners', logo: 'https://github.bubbstore.com/svg/card-diners.svg' };
    if (/^6011|^65|^64[4-9]/.test(nums)) return { name: 'Discover', logo: 'https://github.bubbstore.com/svg/card-discover.svg' };
    return null;
  };

  const brand = detectBrand(cardNumber);

  const formatCardNumber = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 4);
    if (nums.length <= 2) return nums;
    return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  };

  const formatCpf = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  const displayNumber = cardNumber || '•••• •••• •••• ••••';
  const displayName = cardName || 'NOME E SOBRENOME';
  const displayExpiry = cardExpiry || '••/••';

  const generateInstallmentOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      const value = totalPrice / i;
      const label = i === 1
        ? `1x de ${formatPrice(totalPrice.toString())} sem juros`
        : `${i}x de ${formatPrice(value.toFixed(2))} sem juros`;
      options.push({ value: String(i), label });
    }
    return options;
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">3</span>
        <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Escolha como deseja pagar seu pedido.
      </p>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) => onPaymentMethodChange(value as 'credit' | 'pix')}
        className="space-y-3"
      >
        {/* Credit Card Option */}
        <div className={`border rounded-lg transition-colors ${paymentMethod === 'credit' ? 'border-accent bg-accent/5' : 'border-border'}`}>
          <div className="flex items-start space-x-3 p-4 cursor-pointer">
            <RadioGroupItem value="credit" id="credit" className="mt-0.5" />
            <label htmlFor="credit" className="cursor-pointer flex-1">
              <p className="font-bold text-sm">Cartão de crédito</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-amex.svg" alt="American Express" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-visa.svg" alt="Visa" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-diners.svg" alt="Diners" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-mastercard.svg" alt="Mastercard" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-discover.svg" alt="Discover" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-aura.svg" alt="Aura" className="h-4" />
                <img loading="lazy" src="https://github.bubbstore.com/svg/card-elo.svg" alt="Elo" className="h-4" />
              </div>
            </label>
          </div>

          {/* Credit Card Form - inside the same container */}
          {paymentMethod === 'credit' && (
            <div className="px-4 pb-4 space-y-5 animate-fade-in border-t border-accent/20 pt-4">
              {/* Card Preview */}
              <div className="relative w-full max-w-[320px] mx-auto aspect-[1.586/1] rounded-lg p-5 text-white shadow-xl overflow-hidden select-none"
                style={{ background: 'linear-gradient(145deg, #1c1c1c 0%, #2a2a2a 30%, #1a1a1a 60%, #111111 100%)' }}>
                {/* Subtle shine */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)' }} />
                
                {brand && (
                  <img src={brand.logo} alt={brand.name} className={`absolute top-4 right-5 z-10 rounded-sm ${brand.name === 'Visa' ? 'h-4' : brand.name === 'Mastercard' ? 'h-5' : 'h-8'}`} style={{ mixBlendMode: 'lighten' }} />
                )}
                <div className="relative flex flex-col justify-end h-full gap-2 z-10">
                  {/* Realistic Chip */}
                  <div className="w-[36px] h-[26px] rounded-md mb-1 relative" style={{ background: 'linear-gradient(145deg, #d4af37 0%, #c5a028 25%, #e8c84a 50%, #b8941e 75%, #d4af37 100%)' }}>
                    <div className="absolute inset-[3px] rounded-sm" style={{ background: 'linear-gradient(145deg, #c9a42e, #dbb840)' }}>
                      {/* Chip lines */}
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-900/30" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-900/30" />
                      <div className="absolute top-[4px] bottom-[4px] left-[4px] right-[4px] border border-yellow-900/20 rounded-[2px]" />
                    </div>
                  </div>
                  <p className="text-[13px] font-mono tracking-[0.18em] opacity-95 drop-shadow-sm">{displayNumber}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-[11px] uppercase tracking-wide opacity-70 truncate max-w-[65%]">{displayName}</p>
                    <div className="text-right">
                      <p className="text-[8px] uppercase opacity-40 tracking-wider">validade</p>
                      <p className="text-[11px] opacity-75">{displayExpiry}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label htmlFor="cardNumber" className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Número do cartão</strong>
                </label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 1234 1234 1234"
                  maxLength={19}
                  inputMode="numeric"
                  className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40 font-mono tracking-wide"
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cardExpiry" className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Validade</strong> (mês/ano)
                  </label>
                  <Input
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    inputMode="numeric"
                    className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <TooltipProvider>
                    <label htmlFor="cardCvv" className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      <strong className="text-foreground">Cód. segurança</strong>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground/60 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[180px] text-xs">
                          3 dígitos no verso do cartão. Amex: 4 dígitos na frente.
                        </TooltipContent>
                      </Tooltip>
                    </label>
                  </TooltipProvider>
                  <Input
                    id="cardCvv"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    inputMode="numeric"
                    className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="space-y-1.5">
                <label htmlFor="cardName" className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Nome e sobrenome do titular</strong>
                </label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="ex.: Maria de Almeida Cruz"
                  className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Card Holder CPF */}
              <div className="space-y-1.5">
                <label htmlFor="cardCpf" className="text-xs text-muted-foreground">
                  <strong className="text-foreground">CPF do titular</strong>
                </label>
                <Input
                  id="cardCpf"
                  value={cardCpf}
                  onChange={(e) => setCardCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  inputMode="numeric"
                  className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Installments */}
              <div className="space-y-1.5">
                <label htmlFor="installments" className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Nº de Parcelas</strong>
                </label>
                <Select value={installments} onValueChange={setInstallments}>
                  <SelectTrigger className="h-11 border-border/60 bg-[#FAFAFA]">
                    <SelectValue placeholder="Selecione as parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateInstallmentOptions().map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button inside card */}
              <Button
                onClick={() => onSubmit({ cardNumber, cardName, cardExpiry, cardCvv, cardCpf, installments })}
                disabled={isLoading}
                className="w-full py-6 text-base font-bold bg-accent hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Finalizar compra
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          )}
        </div>

        {/* PIX Option */}
        <div className={`border rounded-lg transition-colors ${paymentMethod === 'pix' ? 'border-accent bg-accent/5' : 'border-border'}`}>
          <div className="relative flex items-start space-x-3 p-4 pl-3 cursor-pointer">
            <span className="absolute -top-2 right-3 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              5% DE DESCONTO
            </span>
            <RadioGroupItem value="pix" id="pix" className="mt-0.5" />
            <label htmlFor="pix" className="cursor-pointer flex-1">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <img src={pixIcon} alt="Pix" className="h-3 w-3 object-contain" />
                Pix
              </p>
            </label>
          </div>

          {/* PIX Content */}
          {paymentMethod === 'pix' && (
            <div className="px-4 pb-4 space-y-4 animate-fade-in border-t border-accent/20 pt-4">
              <p className="text-sm text-muted-foreground">
                A confirmação de pagamento é realizada em poucos minutos.
                Utilize o aplicativo do seu banco para pagar.
              </p>
              <p className="text-base font-bold">
                Valor no Pix: <span className="text-accent">{formatPrice(totalPrice.toString())}</span>
              </p>

              {/* Submit Button inside pix */}
              <Button
                onClick={() => onSubmit()}
                disabled={isLoading}
                className="w-full py-6 text-base font-bold bg-accent hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Finalizar compra
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
