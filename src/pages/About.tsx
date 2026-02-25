import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Instagram, Globe } from 'lucide-react';

export default function About() {
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            DIREITA RAIZ
          </h1>
        </div>
        
        <div className="text-muted-foreground text-center max-w-2xl mx-auto">
          <p className="text-lg leading-relaxed text-primary text-left">
            A Direita Raiz nasceu da vontade de vestir o Brasil de verdade — o povo que acorda cedo, fala o que pensa e tem orgulho de suas origens. Aqui, cada camiseta carrega atitude, liberdade e identidade, sem filtros e sem frescura. Somos mais que uma marca: somos a voz de quem não se dobra, de quem carrega no peito a força, a garra e o humor do brasileiro raiz. Nossas peças são criadas pra quem vive com propósito, pra quem acredita que o estilo também é uma forma de expressão.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <a href="https://instagram.com/direitaraizbrasil" target="_blank" rel="noopener noreferrer" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://www.direitaraiz.com.br" target="_blank" rel="noopener noreferrer" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </main>

      <Footer />
    </div>;
}