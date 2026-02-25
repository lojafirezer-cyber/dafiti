import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Política de Privacidade
        </h1>
        
        <div className="h-px bg-border mb-10" />
        
        <div className="space-y-10 text-muted-foreground">
          {/* Informações do Usuário */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Informações do Usuário
            </h2>
            <p className="leading-relaxed">
              A Direita Raiz coleta as informações do Usuário, via formulários e cookies para poder prover um melhor serviço tanto como personalização da página como recomendações de produtos.
            </p>
            <p className="leading-relaxed mt-4">
              Informações sobre a sua visita ao nosso site, incluindo cookies, poderão ser utilizadas por terceiros, tais como o Google e Meta (antigo Facebook), para facilitar a apresentação de publicidade do tipo remarketing em outros sites da internet. Tais informações não incluem informações pessoais e confidenciais.
            </p>
          </section>

          {/* Privacidade dos dados do Usuário */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Privacidade dos dados do Usuário
            </h2>
            <p className="leading-relaxed">
              Os dados pessoais dos usuários poderão ser repassados aos parceiros quando você realiza a compra em uma de suas lojas. Isso ocorre porque a plataforma da Direita Raiz operacionaliza lojas de parceiros e, ao adquirir um produto, o parceiro dono da loja precisa dos dados para controle de venda, conhecimento do seu núcleo consumidor e estratégias de marketing.
            </p>
            <p className="leading-relaxed mt-4">
              Assim, você deve ter ciência que ao adquirir um produto, suas informações de compra (como nome, e-mail, endereço) serão informadas tanto à Direita Raiz para produção e envio dos pedidos, quanto aos parceiros responsáveis pelas lojas, respeitando toda legislação aplicável.
            </p>
            <p className="leading-relaxed mt-4">
              Além desse caso, nossa política de privacidade assegura a garantia de que quaisquer informações relativas aos Usuários, fornecidas por estes, não serão fornecidas, publicadas ou comercializadas a terceiros que não os citados previamente.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Cookies
            </h2>
            <p className="leading-relaxed">
              O site coleta informações através de cookies para identificar os Usuários. Servindo apenas para controle interno de audiência e de navegação e jamais para controlar, identificar ou rastrear preferências do internauta, exceto quando este desrespeitar alguma regra de segurança ou exercer qualquer atividade prejudicial ao bom funcionamento do site, como, por exemplo, tentativas de hackear o serviço.
            </p>
            <p className="leading-relaxed mt-4">
              A aceitação dos cookies pode ser livremente alterada na configuração de seu navegador.
            </p>
          </section>

          {/* Segurança da Informação */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Segurança da Informação
            </h2>
            <p className="leading-relaxed">
              Todos os dados pessoais informados ao nosso site são armazenados em um banco de dados reservado e com acesso restrito a alguns funcionários habilitados, que são obrigados, por contrato, a manter a confidencialidade das informações e utilizá-las adequadamente.
            </p>
          </section>

          {/* Solicitação de Exclusão de Dados */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Solicitação de Exclusão de Dados
            </h2>
            <p className="leading-relaxed">
              Os usuários têm o direito de solicitar a exclusão de seus dados pessoais a qualquer momento. Para isso, basta enviar um e-mail para{' '}
              <a 
                href="mailto:suporte@direitaraiz.com" 
                className="text-foreground underline hover:no-underline"
              >
                suporte@direitaraiz.com
              </a>{' '}
              com o assunto "Solicitação de Exclusão de Dados".
            </p>
            <p className="leading-relaxed mt-4">
              Nossa equipe de suporte responderá à solicitação e fornecerá as orientações necessárias para concluir o processo de exclusão, garantindo que todos os dados do usuário sejam removidos de forma segura e em conformidade com as leis de proteção de dados.
            </p>
          </section>

          {/* Compra Segura */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Compra Segura
            </h2>
            <p className="leading-relaxed">
              Nosso site é construído de modo a garantir a segurança dos dados dos Usuários, incluindo informações pessoais e de pagamento. Os dados do cartão de crédito são utilizados somente para a comunicação com as operadoras do cartão. Toda navegação por nosso site é feita via SSL (Secure Sockets Layer), o que garante que seus dados estão sendo criptografados.
            </p>
            <p className="leading-relaxed mt-4">
              Além da criptografia, outro fator de segurança é a automática destruição dos dados relativos ao número do cartão de crédito. A Direita Raiz utiliza o número do cartão somente no processamento da compra e, tão logo ocorra a confirmação pela Administradora do cartão, o número é automaticamente destruído, não sendo, de nenhuma forma, guardado em nossa base de dados.
            </p>
          </section>

          {/* Dúvidas e Sugestões */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Dúvidas e Sugestões
            </h2>
            <p className="leading-relaxed">
              Caso tenha qualquer dúvida ou sugestão sobre segurança e privacidade ou sobre qualquer outro assunto entre em contato direto com a nossa equipe através do e-mail{' '}
              <a 
                href="mailto:suporte@direitaraiz.com" 
                className="text-foreground underline hover:no-underline"
              >
                suporte@direitaraiz.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
