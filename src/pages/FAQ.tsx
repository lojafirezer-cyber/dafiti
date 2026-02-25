import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Qual é o tecido das camisetas?",
    answer: "O tecido das camisetas é Algodão 30.1 Penteado. Nossas camisetas são feitas de 100% algodão, com exceção da cinza-mescla, que possui 12% de poliéster em sua composição."
  },
  {
    question: "Como é calculado o frete?",
    answer: "O valor e prazo dos fretes é calculado com base nas diversas formas de entrega disponíveis, localidade do CEP, quantidade de peças e valor dos produtos. O valor de todos os fretes fica disponível para os clientes tanto no carrinho de compras quanto na página de produtos."
  },
  {
    question: "Qual o tempo de envio e entrega do meu pedido?",
    answer: "O tempo de produção demora de 2 a 5 dias úteis, dependendo da demanda. O tempo da entrega em si depende da transportadora escolhida e do CEP. Os prazos de entrega disponíveis no site já abrangem o prazo de produção e entrega para o cliente final."
  },
  {
    question: "Como funciona o processo de devolução e reembolso?",
    answer: "O cliente tem até 7 dias corridos a partir do recebimento do produto para solicitar a devolução. Para isso, basta acessar a área de pedidos na página da loja, selecionar o pedido em questão e iniciar a solicitação de devolução. Durante a solicitação, o cliente deverá fornecer o motivo da devolução."
  },
  {
    question: "Como é o processo de troca?",
    answer: "O prazo para troca ser solicitada é de até 30 dias corridos após o recebimento do produto. Nos casos de defeito o prazo de trocas é de 90 dias após o recebimento do produto. Para iniciar uma solicitação de troca, o cliente deve fazer cadastro/login com o mesmo e-mail de compra e acessar a área de pedidos. Lá, ele encontrará a opção de solicitar uma troca."
  },
  {
    question: "Como eu acompanho minha entrega?",
    answer: "Você pode acompanhar sua entrega através do seu e-mail de confirmação da compra, ou logando no nosso site e selecionando a aba 'Meus Pedidos'. Lá você terá acesso ao rastreamento do seu pedido e informações sobre a compra."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "No momento aceitamos Pix, cartões de crédito (parcelamento em até 3x)."
  },
  {
    question: "Quanto tempo para aprovação do meu pagamento?",
    answer: "O prazo do cartão de crédito normalmente costuma ser na hora."
  },
  {
    question: "Em quais canais eu posso receber suporte?",
    answer: "Para questões sobre pedidos, você pode falar conosco através do e-mail suporte@direitaraiz.com, WhatsApp ou nossas redes sociais."
  },
  {
    question: "Qual a relação da Direita Raiz com a Reserva?",
    answer: "Nossa loja utiliza o serviço da Reserva INK, uma marca do grupo AR&Co (grupo da qual a Reserva também faz parte), como parceiro de produção e logística de nossos produtos. Todos os produtos comprados na loja serão produzidos e enviados pela Reserva INK com qualidade e entrega garantidas pela empresa."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Perguntas Frequentes
        </h1>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Ainda tem dúvidas? Entre em contato conosco:
          </p>
          <a 
            href="mailto:suporte@direitaraiz.com" 
            className="text-primary hover:underline font-medium"
          >
            suporte@direitaraiz.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
