import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import dafiti from '@/assets/dafiti-logo.png';

const helpLinks = [
  { label: 'Dúvidas Frequentes', href: '/faq' },
  { label: 'Atendimento', href: '/faq' },
  { label: 'Trocas e Devoluções', href: '/trocas' },
  { label: 'Rastrear Pedido', href: '/rastreio' },
  { label: 'Termos de Uso', href: '/termos' },
];

const institutionalLinks = [
  { label: 'Sobre Nós', href: '/sobre' },
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Trocas e Devoluções', href: '/trocas' },
];

const deliveryBenefits = [
  { label: 'Frete grátis a partir de 2 peças' },
  { label: 'Entrega rápida' },
  { label: 'Primeira troca sem custo' },
  { label: 'Parcele em até 3x sem juros' },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Benefits strip */}
      <div className="border-b border-neutral-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {deliveryBenefits.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Social */}
          <div className="space-y-6">
            <img src={dafiti} alt="Logo" className="h-8 w-auto brightness-100 invert" />
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Redes Sociais</p>
              <div className="flex gap-3">
                <a href="https://facebook.com/nacaoraizbrasil" target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-neutral-700 hover:border-white hover:bg-white hover:text-black transition-colors text-white">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/nacaoraizbrasil" target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-neutral-700 hover:border-white hover:bg-white hover:text-black transition-colors text-white">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/nacaoraizbrasil" target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-neutral-700 hover:border-white hover:bg-white hover:text-black transition-colors text-white">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Ajuda */}
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Ajuda</p>
            <ul className="space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-neutral-300 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Institucional</p>
            <ul className="space-y-2.5">
              {institutionalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-neutral-300 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formas de pagamento + contato */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Formas de Pagamento</p>
              <div className="flex flex-wrap gap-2">
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/visa-4c562b0e312e36ce0daadaf465d3759ca162cb39c6a828454a5cfb2c95f8e26a.svg" alt="Visa" className="h-6 w-auto" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/master-f27cb6ce5923f7f52ceded3fdc486079492ac922931c00db634211bb5453b11c.svg" alt="Mastercard" className="h-6 w-auto" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/elo-c40efbc3640e09e5b4acd03ee7f09dd31d521959516adf224f007458739d77e3.svg" alt="Elo" className="h-6 w-auto" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/amex-6f16117e3c9e8a546737b6951c187f2014009b8b40e374dc0c846561ea66c663.svg" alt="Amex" className="h-6 w-auto" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/pix-39099f2f23f9b0fcc7e66c2759d247b7f04e7bd44b8b8f1103aaa2ee28c0f86d.svg" alt="Pix" className="h-6 w-auto" />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Contato</p>
              <a href="https://www.dafiti.com.br/atendimento/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Central de Atendimento
              </a>
              <p className="text-sm text-neutral-500 mt-1">Extrema, MG, Brasil</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Selos</p>
              <a
                href="https://www.reclameaqui.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white rounded px-2 py-1"
              >
                <img src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/verified.svg" alt="RA Verificada" className="w-7 h-7" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-neutral-500">Verificada por</span>
                  <img src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/ra-logo.svg" alt="Reclame Aqui" className="w-16 h-3" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© Dafiti 2011 - 2016. Todos os direitos reservados. | *Frete Grátis: Confira as regras.</p>
          <p>GFG COMÉRCIO DIGITAL LTDA. - CNPJ: 11.200.418/0006-73 - Estrada Municipal Luiz Lopes Neto, 617 - Bairro dos Tenentes, CEP: 37640-915, Extrema, MG, Brasil.</p>
        </div>
      </div>
    </footer>
  );
}
