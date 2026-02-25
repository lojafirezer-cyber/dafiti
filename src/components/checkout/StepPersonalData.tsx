import { Input } from '@/components/ui/input';
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

interface FieldErrors {
  firstName?: boolean;
  email?: boolean;
  phone?: boolean;
  cpf?: boolean;
}

interface StepPersonalDataProps {
  customerData: CustomerData;
  onInputChange: (field: keyof CustomerData, value: string) => void;
  fieldErrors?: FieldErrors;
}

export function StepPersonalData({ customerData, onInputChange, fieldErrors = {} }: StepPersonalDataProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">1</span>
        <h2 className="text-lg font-semibold">Identificação</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Utilizaremos seu e-mail para: Identificar seu perfil, histórico de compra, notificação de pedidos e carrinho de compras.
      </p>
      
      <div className="space-y-4">
        {/* Nome completo */}
        <div className="space-y-1.5">
          <label htmlFor="firstName" className={cn("text-xs text-muted-foreground", fieldErrors.firstName && 'text-destructive')}>
            <strong className="text-foreground">Nome completo</strong>
          </label>
          <Input
            id="firstName"
            value={customerData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="ex.: Maria de Almeida Cruz"
            className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.firstName && 'border-destructive focus-visible:ring-destructive')}
          />
          {fieldErrors.firstName && (
            <p className="text-xs text-destructive">Informe seu nome completo</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className={cn("text-xs text-muted-foreground", fieldErrors.email && 'text-destructive')}>
            <strong className="text-foreground">E-mail</strong> (Informações e rastreio)
          </label>
          <Input
            id="email"
            type="email"
            value={customerData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="ex.: maria@gmail.com"
            className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.email && 'border-destructive focus-visible:ring-destructive')}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">Informe um email válido</p>
          )}
        </div>

        {/* CPF */}
        <div className="space-y-1.5">
          <label htmlFor="cpf" className={cn("text-xs text-muted-foreground", fieldErrors.cpf && 'text-destructive')}>
            <strong className="text-foreground">CPF</strong> (correspondente ao nome)
          </label>
          <Input
            id="cpf"
            value={customerData.cpf}
            onChange={(e) => onInputChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.cpf && 'border-destructive focus-visible:ring-destructive')}
          />
          {fieldErrors.cpf && (
            <p className="text-xs text-destructive">Informe um CPF válido</p>
          )}
        </div>

        {/* Celular / WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className={cn("text-xs text-muted-foreground", fieldErrors.phone && 'text-destructive')}>
            <strong className="text-foreground">Celular / WhatsApp</strong>
          </label>
          <div className="flex gap-2">
            <div className="flex items-center h-11 px-3 rounded-md border border-border/60 bg-[#FAFAFA] text-sm text-muted-foreground shrink-0">
              +55
            </div>
            <Input
              id="phone"
              value={customerData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className={cn("h-11 border-border/60 bg-[#FAFAFA] placeholder:text-muted-foreground/40", fieldErrors.phone && 'border-destructive focus-visible:ring-destructive')}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-xs text-destructive">Informe um telefone válido</p>
          )}
        </div>
      </div>
    </div>
  );
}
