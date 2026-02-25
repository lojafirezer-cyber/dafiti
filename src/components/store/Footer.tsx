import { Link } from 'react-router-dom';
import { Instagram, Globe } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="store-footer bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navegação</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/rastreio" className="hover:text-white transition-colors">Rastrear Pedido</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">Termos de uso</Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Perguntas frequentes</Link>
              </li>
              <li>
                <Link to="/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link>
              </li>
            </ul>
          </div>

          {/* Certifications & Payment */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">Selos e certificações</h3>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.reclameaqui.com.br/empresa/yampi/?utm_source=referral&utm_medium=embbed&utm_campaign=ra_verificada&utm_term=horizontal"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Selo RA Verificada"
                  className="flex items-center gap-1.5 bg-white rounded px-1.5 py-1 scale-90"
                >
                  <img 
                    src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/verified.svg" 
                    alt="Selo RA Verificada" 
                    className="w-9 h-9"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500">Verificada por</span>
                    <img 
                      src="https://s3.amazonaws.com/raichu-beta/ra-verified/assets/images/ra-logo.svg" 
                      alt="Reclame Aqui" 
                      className="w-[74px] h-[14px]"
                    />
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Formas de Pagamento</h3>
              <div className="flex flex-wrap gap-2">
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/visa-4c562b0e312e36ce0daadaf465d3759ca162cb39c6a828454a5cfb2c95f8e26a.svg" alt="Visa" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/master-f27cb6ce5923f7f52ceded3fdc486079492ac922931c00db634211bb5453b11c.svg" alt="Mastercard" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/elo-c40efbc3640e09e5b4acd03ee7f09dd31d521959516adf224f007458739d77e3.svg" alt="Elo" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/amex-6f16117e3c9e8a546737b6951c187f2014009b8b40e374dc0c846561ea66c663.svg" alt="Amex" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/dinners-32c627a8ea96ce8e10b78feafe65bb95ae948af63539dcb9fea45a8c376a419f.svg" alt="Diners" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/pix-39099f2f23f9b0fcc7e66c2759d247b7f04e7bd44b8b8f1103aaa2ee28c0f86d.svg" alt="Pix" className="w-10 h-6" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Redes Sociais</h3>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/nacaoraizbrasil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors text-white"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.nacaoraiz.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors text-white"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="md:text-right">
            <Logo className="w-20 h-auto mb-4 md:ml-auto" />
            <div className="text-sm text-neutral-400 space-y-1">
              <p>
                <a href="mailto:suporte@direitaraiz.com" className="hover:text-white">
                  suporte@direitaraiz.com
                </a>
              </p>
              <p>Rua Euclides Miragaia, 660</p>
              <p>São José dos Campos, SP</p>
              <p>CEP 12245-820</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>© 2026 DIREITA RAIZ | 63.195.375/0001-74</p>
        </div>
      </div>
    </footer>
  );
}
