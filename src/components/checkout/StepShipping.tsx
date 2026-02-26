import { Input } from '@/components/ui/input';
import { Loader2, Package } from 'lucide-react';
import deliveryIcon from '@/assets/delivery-icon.png';
import { formatPrice } from '@/lib/shopify';
import { cn } from '@/lib/utils';

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

interface DeliveryEstimate {
  dateStart: string;
  dateEnd: string;
}

interface FieldErrors {
  cep?: boolean;
  street?: boolean;
  number?: boolean;
  neighborhood?: boolean;
  city?: boolean;
  state?: boolean;
}

interface ShippingOption {
  id: string;
  label: string;
  days: string;
  price: number;
}

interface StepShippingProps {
  customerData: CustomerData;
  onInputChange: (field: keyof CustomerData, value: string) => void;
  onCepBlur: () => void;
  loadingCep: boolean;
  deliveryEstimate: DeliveryEstimate | null;
  hasFreeShipping: boolean;
  shippingCost: number;
  fieldErrors?: FieldErrors;
  shippingOptions: ShippingOption[];
  selectedShipping: string;
  onShippingChange: (id: 'express' | 'standard' | 'free') => void;
}

export function StepShipping({
  customerData,
  onInputChange,
  onCepBlur,
  loadingCep,
  deliveryEstimate,
  shippingCost,
  fieldErrors = {},
  shippingOptions,
  selectedShipping,
  onShippingChange,
}: StepShippingProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Address Form */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">2</span>
          <h2 className="text-lg font-semibold">Endereço de Entrega</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Informe o endereço completo para envio do seu pedido.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="cep" className={cn("text-xs text-muted-foreground", fieldErrors.cep && 'text-destructive')}>
              <strong className="text-foreground">CEP</strong> *
            </label>
            <div className="relative">
              <Input
                id="cep"
                value={customerData.cep}
                onChange={(e) => onInputChange('cep', e.target.value)}
                onBlur={onCepBlur}
                placeholder="00000-000"
                maxLength={9}
                className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.cep && 'border-destructive focus-visible:ring-destructive')}
              />
              {loadingCep && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {fieldErrors.cep && (
              <p className="text-xs text-destructive">Informe um CEP válido</p>
            )}
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="street" className={cn("text-xs text-muted-foreground", fieldErrors.street && 'text-destructive')}>
              <strong className="text-foreground">Endereço</strong> *
            </label>
            <Input
              id="street"
              value={customerData.street}
              onChange={(e) => onInputChange('street', e.target.value)}
              placeholder="Rua, Avenida..."
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.street && 'border-destructive focus-visible:ring-destructive')}
            />
            {fieldErrors.street && (
              <p className="text-xs text-destructive">Informe o endereço</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="number" className={cn("text-xs text-muted-foreground", fieldErrors.number && 'text-destructive')}>
              <strong className="text-foreground">Número</strong> *
            </label>
            <Input
              id="number"
              value={customerData.number}
              onChange={(e) => onInputChange('number', e.target.value)}
              placeholder="123"
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.number && 'border-destructive focus-visible:ring-destructive')}
            />
            {fieldErrors.number && (
              <p className="text-xs text-destructive">Informe o número</p>
            )}
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="complement" className="text-xs text-muted-foreground">
              <strong className="text-foreground">Complemento</strong>
            </label>
            <Input
              id="complement"
              value={customerData.complement}
              onChange={(e) => onInputChange('complement', e.target.value)}
              placeholder="Apto, Bloco..."
              className="h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="neighborhood" className={cn("text-xs text-muted-foreground", fieldErrors.neighborhood && 'text-destructive')}>
              <strong className="text-foreground">Bairro</strong> *
            </label>
            <Input
              id="neighborhood"
              value={customerData.neighborhood}
              onChange={(e) => onInputChange('neighborhood', e.target.value)}
              placeholder="Seu bairro"
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.neighborhood && 'border-destructive focus-visible:ring-destructive')}
            />
            {fieldErrors.neighborhood && (
              <p className="text-xs text-destructive">Informe o bairro</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="city" className={cn("text-xs text-muted-foreground", fieldErrors.city && 'text-destructive')}>
              <strong className="text-foreground">Cidade</strong> *
            </label>
            <Input
              id="city"
              value={customerData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Sua cidade"
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.city && 'border-destructive focus-visible:ring-destructive')}
            />
            {fieldErrors.city && (
              <p className="text-xs text-destructive">Informe a cidade</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="state" className={cn("text-xs text-muted-foreground", fieldErrors.state && 'text-destructive')}>
              <strong className="text-foreground">Estado</strong> *
            </label>
            <Input
              id="state"
              value={customerData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              placeholder="UF"
              maxLength={2}
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.state && 'border-destructive focus-visible:ring-destructive')}
            />
            {fieldErrors.state && (
              <p className="text-xs text-destructive">Informe o estado</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      {deliveryEstimate && customerData.city && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <img src={deliveryIcon} alt="Entrega" className="w-7 h-7" />
            <h3 className="text-base font-semibold">Opções de Entrega</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {customerData.city}, {customerData.state}
          </p>

          <div className="space-y-3">
            {shippingOptions.map((option) => {
              const isSelected = selectedShipping === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onShippingChange(option.id as 'express' | 'standard' | 'free')}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg border p-4 text-left transition-all",
                    isSelected
                      ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                      : "border-border hover:border-foreground/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "border-foreground" : "border-muted-foreground"
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Correios · {option.days}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    option.price === 0 ? "text-emerald-600" : "text-foreground"
                  )}>
                    {option.price === 0 ? 'Grátis' : formatPrice(option.price.toFixed(2))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border text-[10px] text-muted-foreground">
            <Package className="w-3 h-3" />
            <span>Prazo a partir da confirmação do pagamento · {deliveryEstimate.dateStart} – {deliveryEstimate.dateEnd}</span>
          </div>
        </div>
      )}
    </div>
  );
}
