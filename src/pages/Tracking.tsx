import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface TrackingStep {
  status: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
}

interface TrackingResult {
  code: string;
  cpf: string;
  status: string;
  estimatedDelivery: string;
  steps: TrackingStep[];
}

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);

  const cpfFromParam = searchParams.get('cpf') || '';
  const pedidoFromParam = searchParams.get('pedido') || '';

  useEffect(() => {
    if (cpfFromParam && pedidoFromParam) {
      setTrackingCode(pedidoFromParam);
      // Auto-search when coming from order login
      performTrack(pedidoFromParam, cpfFromParam);
    }
  }, [cpfFromParam, pedidoFromParam]);

  const performTrack = (code: string, cpf?: string) => {
    if (!code.trim()) {
      toast.error('Por favor, insira um código de rastreio');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      toast.info('Rastreamento em processamento', {
        description: 'Você receberá atualizações por e-mail sobre seu pedido.'
      });
      setIsLoading(false);
      
      setTrackingResult({
        code: code.toUpperCase(),
        cpf: cpf || '',
        status: 'Em trânsito',
        estimatedDelivery: 'Previsão: 3-5 dias úteis',
        steps: [
          {
            status: 'Pedido confirmado',
            location: 'Sistema',
            date: '05/02/2025',
            time: '14:30',
            completed: true
          },
          {
            status: 'Pedido enviado',
            location: 'Centro de Distribuição - SP',
            date: '06/02/2025',
            time: '09:15',
            completed: true
          },
          {
            status: 'Em trânsito',
            location: 'A caminho do destino',
            date: '07/02/2025',
            time: '11:45',
            completed: true
          },
          {
            status: 'Saiu para entrega',
            location: 'Unidade local',
            date: '-',
            time: '-',
            completed: false
          },
          {
            status: 'Entregue',
            location: 'Endereço de entrega',
            date: '-',
            time: '-',
            completed: false
          }
        ]
      });
    }, 1500);
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(trackingCode);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <Clock className="w-5 h-5 text-muted-foreground" />;
    
    switch (status) {
      case 'Pedido confirmado':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Pedido enviado':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'Em trânsito':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'Saiu para entrega':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'Entregue':
        return <MapPin className="w-5 h-5 text-green-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Rastreie seu Pedido</h1>
            <p className="text-muted-foreground">
              Insira o código de rastreio para acompanhar sua entrega
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Digite o código de rastreio"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    className="pl-10 h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-black hover:bg-neutral-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Buscando...' : 'Rastrear'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {trackingResult && (
            <Card className="animate-fade-in">
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Código: {trackingResult.code}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trackingResult.estimatedDelivery}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium w-fit">
                    <Truck className="w-4 h-4" />
                    {trackingResult.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-0">
                  {trackingResult.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-1 ${step.completed ? 'bg-green-50' : 'bg-muted'}`}>
                          {getStatusIcon(step.status, step.completed)}
                        </div>
                        {index < trackingResult.steps.length - 1 && (
                          <div className={`w-0.5 h-16 ${step.completed ? 'bg-green-500' : 'bg-muted'}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.location}</p>
                        {step.completed && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.date} às {step.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Dúvidas sobre seu pedido?{' '}
              <a href="/faq" className="text-foreground underline hover:no-underline">
                Acesse nossa FAQ
              </a>{' '}
              ou entre em contato conosco.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
