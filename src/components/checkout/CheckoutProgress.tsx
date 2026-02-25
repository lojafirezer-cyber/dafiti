import { Check, User, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Dados', Icon: User },
  { id: 2, name: 'Entrega', Icon: Truck },
  { id: 3, name: 'Pagamento', Icon: CreditCard },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const StepIcon = step.Icon;
          
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                    isCompleted && 'bg-accent text-white',
                    isActive && 'bg-foreground text-background',
                    !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <StepIcon className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-[11px] font-medium',
                    (isActive || isCompleted) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 mb-6">
                  <div
                    className={cn(
                      'h-full transition-colors duration-300',
                      currentStep > step.id ? 'bg-accent' : 'bg-border'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
