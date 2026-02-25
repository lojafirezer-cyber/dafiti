import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Package, RotateCcw, Clock, Mail, CheckCircle, AlertCircle, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ExchangesReturns() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trocas e Devoluções
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sua satisfação é nossa prioridade. Confira abaixo como funcionam nossos processos de troca e devolução.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-2xl text-foreground mb-1">7 dias</h3>
            <p className="text-muted-foreground text-sm">para devolução</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-2xl text-foreground mb-1">30 dias</h3>
            <p className="text-muted-foreground text-sm">para troca</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-2xl text-foreground mb-1">90 dias</h3>
            <p className="text-muted-foreground text-sm">para defeitos</p>
          </div>
        </div>

        {/* Passo a Passo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Como solicitar uma troca ou devolução?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-5 h-full">
                <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="font-semibold text-foreground mb-2">Acesse sua conta</h4>
                <p className="text-muted-foreground text-sm">
                  Faça login com o mesmo e-mail utilizado na compra.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border"></div>
            </div>
            
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-5 h-full">
                <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="font-semibold text-foreground mb-2">Localize o pedido</h4>
                <p className="text-muted-foreground text-sm">
                  Vá até "Meus Pedidos" e selecione o pedido desejado.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border"></div>
            </div>
            
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-5 h-full">
                <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="font-semibold text-foreground mb-2">Inicie a solicitação</h4>
                <p className="text-muted-foreground text-sm">
                  Clique em "Solicitar troca/devolução" e informe o motivo.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border"></div>
            </div>
            
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-5 h-full">
                <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  4
                </div>
                <h4 className="font-semibold text-foreground mb-2">Envie o produto</h4>
                <p className="text-muted-foreground text-sm">
                  Siga as instruções para enviar o produto de volta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seções Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Devolução */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-destructive/10 rounded-lg">
                <RotateCcw className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Devolução</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Prazo:</strong> Até 7 dias corridos após o recebimento do produto.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Reembolso:</strong> O valor será estornado na mesma forma de pagamento em até 10 dias úteis.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Frete:</strong> Sem custo adicional para devoluções dentro do prazo.
                </p>
              </div>
            </div>
          </div>
          
          {/* Troca */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-accent/10 rounded-lg">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Troca</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Prazo padrão:</strong> Até 30 dias corridos após o recebimento.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Por defeito:</strong> Até 90 dias após o recebimento do produto.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Frete:</strong> Grátis para primeira troca. Trocas adicionais podem ter custo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Condições */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Condições para troca e devolução
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Aceito</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                  Produto sem sinais de uso ou lavagem
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                  Etiquetas originais intactas
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                  Embalagem original (quando possível)
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                  Nota fiscal do pedido
                </li>
              </ul>
            </div>
            
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-foreground">Não aceito</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0"></span>
                  Produto lavado ou com odores
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0"></span>
                  Etiquetas removidas ou danificadas
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0"></span>
                  Produto com manchas ou rasgos
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0"></span>
                  Solicitação fora do prazo
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Perguntas frequentes
          </h2>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border px-6">
                <AccordionTrigger className="text-left font-medium">
                  Posso trocar por um tamanho diferente?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Você pode solicitar a troca por outro tamanho disponível em estoque. Caso o tamanho desejado não esteja disponível, você pode optar por outro produto de mesmo valor ou solicitar a devolução.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-border px-6">
                <AccordionTrigger className="text-left font-medium">
                  Quanto tempo leva para receber o reembolso?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Após recebermos o produto e confirmarmos as condições, o reembolso é processado em até 10 dias úteis. Para cartão de crédito, o estorno pode levar até 2 faturas para aparecer.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-border px-6">
                <AccordionTrigger className="text-left font-medium">
                  Como envio o produto de volta?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Após aprovarmos sua solicitação, você receberá um código de postagem por e-mail. Basta imprimir e levar o produto a uma agência dos Correios mais próxima. O envio é gratuito.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="px-6">
                <AccordionTrigger className="text-left font-medium">
                  Comprei como presente. Como faço a troca?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A pessoa presenteada pode entrar em contato conosco informando os dados do pedido. Faremos a troca normalmente, enviando o novo produto para o endereço desejado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contato */}
        <section className="bg-muted/50 border border-border rounded-xl p-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ainda tem dúvidas?
          </h3>
          <p className="text-muted-foreground mb-4">
            Nossa equipe está pronta para ajudar você.
          </p>
          <a 
            href="mailto:suporte@direitaraiz.com" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            suporte@direitaraiz.com
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
