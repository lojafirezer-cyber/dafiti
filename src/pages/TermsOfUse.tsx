import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Termos de Uso
        </h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <h3 className="text-xl font-semibold text-foreground">Boas-vindas ao nosso site!</h3>
          
          <p>
            O acesso ao nosso Site, nossos serviços e relações com os usuários, são regulados pelo presente Termo de Uso Para Usuário Consumidor ("Termo de Uso").
          </p>
          
          <p>
            Ao utilizar esse Site, seus serviços e funcionalidades, você concorda com este Termo de Uso, com a Política de Privacidade da Direita Raiz e com os demais Documentos Obrigatórios conforme o caso, ficando responsável pelo cumprimento de todas as determinações contidas nestes documentos e na legislação aplicável aos assuntos a ele correlatos. Se você não concordar com as disposições deste Termo de Uso, por favor, não utilize nosso Site ou qualquer dos serviços oferecidos.
          </p>
          
          <p>
            Informamos que as condições estabelecidas neste Termo de Uso poderão ser atualizadas ou alteradas, a qualquer momento, com objetivo de atualização de acordo com o desenvolvimento do mercado, de novas regulamentações e das exigências oriundas de interpretação de qualquer autoridade competente pelo ordenamento jurídico vigente. É obrigação do Usuário verificar a atualização dos Termos de Uso, sendo certo que ao permanecer utilizando o site, expressa sua aceitação às atualizações realizadas.
          </p>
          
          <p>
            Leia atentamente todas as condições estabelecidas neste Termo de Uso e nos demais Documentos Obrigatórios e, caso precise de algum esclarecimento adicional, entre em contato conosco através do e-mail: <a href="mailto:suporte@direitaraiz.com" className="text-primary hover:underline">suporte@direitaraiz.com</a>
          </p>
          
          <p>
            Este Termo de Uso disciplina o uso do Site pelos Usuários que se enquadram na condição de Usuários Consumidores, que deverão ler e aceitar as disposições aqui previstas para utilização correta e consciente do Site.
          </p>
          
          <p>
            A Direita Raiz também possui compromisso de respeitar a privacidade e as informações pessoais dos Usuários. Consulte nossa Política de Privacidade, disponível ao final dessa página. Ao aderir a este Termo de Uso, o Usuário estará concordando, também, com a nossa Política de Privacidade.
          </p>
          
          <hr className="my-8 border-border" />
          
          <h2 className="text-2xl font-bold text-foreground">1. DEFINIÇÕES</h2>
          
          <p>
            Neste Termo de Uso, incluindo sua anterior parte introdutória, salvo se disposto de forma diversa, as expressões iniciadas por letra maiúscula, a seguir indicadas, utilizadas no gênero masculino ou feminino, no singular ou no plural, têm o seguinte significado:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Conteúdo de Usuário:</strong> Significa os conteúdos que os Usuários podem postar, carregar, enviar, submeter, armazenar ou contribuir de forma diversa com conteúdo para o Serviço.</li>
            <li><strong>Dados:</strong> Significa toda e qualquer informação do Usuário Consumidor submetida por este à Direita Raiz em razão da utilização pelo Usuário Consumidor do Site e dos Serviços.</li>
            <li><strong>Direito de Propriedade Intelectual:</strong> Significa os direitos relativos às obras literárias, artísticas e científicas, às interpretações dos artistas intérpretes e às execuções dos artistas executantes.</li>
            <li><strong>Documentos Obrigatórios:</strong> Significa o presente Termo de Uso, a Política de Privacidade e a Política de Devolução e Reembolso.</li>
            <li><strong>Produtos:</strong> Significa os produtos disponibilizados para venda no Site, observadas as disposições deste Termo de Uso.</li>
            <li><strong>Serviços:</strong> Significa os Serviços oferecidos aos Usuários por meio do Site abrangendo toda e qualquer opção, ferramenta, atividade e interação que o Site possibilita.</li>
            <li><strong>Site:</strong> Significa o Site "direitaraiz.com.br", destinado ao comércio virtual.</li>
            <li><strong>Termo de Uso:</strong> Significa o presente Termo de Uso Para Usuário Consumidor.</li>
            <li><strong>Usuário:</strong> Significa todo e qualquer usuário que acesse ou utilize o Site.</li>
            <li><strong>Usuário Consumidor:</strong> Significa os usuários que se cadastrarem no Site para compra de Produtos.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">2. OBJETIVO</h2>
          
          <p>
            O Site, através dos Serviços que oferece, tem como objetivo promover o comércio eletrônico de produtos personalizados.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">3. CADASTRO E UTILIZAÇÃO</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Capacidade:</strong> O cadastro de Usuários Consumidores é destinado para maiores de 18 (dezoito) anos.</li>
            <li><strong>Requisitos:</strong> Apenas será confirmado o cadastro do Usuário Consumidor que preencher todos campos com os dados indicados, bem como os requisitos e condições especificadas neste Termo de Uso.</li>
            <li><strong>Acesso:</strong> Os Usuários acessarão suas contas mediante inserção de e-mail e senha nos respectivos campos de preenchimento.</li>
            <li><strong>Uso Não-Autorizado:</strong> Os Usuários se comprometem a não informar a terceiros esses dados, ficando a Direita Raiz livre e isenta de responsabilização.</li>
            <li><strong>Intransferibilidade:</strong> Em nenhuma hipótese será permitida a cessão, venda, aluguel ou outra forma de transferência da conta do titular originário.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">4. COMPRA E TROCA</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Login:</strong> Para que o interessado possa realizar compras no Site, é necessário estar devidamente cadastrado como Usuário Consumidor e efetuar o seu login.</li>
            <li><strong>Pagamento:</strong> O Usuário Consumidor efetuará a compra por meio do pagamento do valor devido, pelos meios disponíveis no Site.</li>
            <li><strong>Trocas e Cancelamento:</strong> O cliente pode solicitar a troca dos Produtos dentro do prazo de 30 (trinta) dias, contados do recebimento do produto adquirido. O cliente poderá solicitar a devolução dos Produtos dentro do prazo de 07 (sete) dias contados do recebimento do produto adquirido.</li>
          </ul>
          
          <p>
            O Cliente poderá solicitar a devolução ou troca do Produto através do e-mail <a href="mailto:suporte@direitaraiz.com" className="text-primary hover:underline">suporte@direitaraiz.com</a>, onde será informado do procedimento para efetuar a devolução e troca dos produtos.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">5. DEVERES E RESPONSABILIDADE DO USUÁRIO</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>O Usuário declara que é o único responsável por todos os atos por si praticados no Site.</li>
            <li>O Usuário é responsável por sua interação com outros Usuários e a Direita Raiz não se responsabiliza por qualquer dano causado em razão da interação entre Usuários.</li>
            <li>O Usuário se responsabiliza, direta e integralmente, por todo o conteúdo, dados e informações que disponibilizar no Site.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">6. POLÍTICA DE USO E RESPONSABILIDADE</h2>
          
          <p>
            O Usuário Consumidor garante a veracidade dos dados fornecidos no Site, tanto para contato como os dados utilizados no pagamento.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">7. VIOLAÇÃO NO SISTEMA OU BASE DE DADOS</h2>
          
          <p>
            É expressamente vedada a utilização de qualquer dispositivo, software ou outro recurso que venha a interferir nas atividades operacionais e comerciais da Direita Raiz.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">8. SANÇÕES</h2>
          
          <p>
            Sem prejuízo de outras medidas, a Direita Raiz poderá advertir, suspender ou desabilitar, temporária ou definitivamente e, a qualquer tempo, a conta de Usuários que violem este Termo de Uso.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">9. CONTEÚDO DO SITE</h2>
          
          <p>
            O Site, todo o conteúdo disponibilizado, as informações divulgadas, nomes empresariais e marcas da Direita Raiz, quaisquer outras sociedades ou terceiros, bem como todos os direitos referentes a qualquer Direito de Propriedade Intelectual, são de propriedade exclusiva da Direita Raiz ou das respectivas sociedades e terceiros.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">10. DISPONIBILIDADE E NÍVEL DO SERVIÇO</h2>
          
          <p>
            A Direita Raiz não se responsabiliza por qualquer dano, prejuízo ou perda no equipamento dos Usuários causados por falhas no sistema, no servidor ou na internet decorrentes de condutas de terceiros.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">11. EXTINÇÃO</h2>
          
          <p>
            O presente Termo de Uso tem prazo indeterminado, podendo ser resilido unilateralmente por qualquer uma das partes, a qualquer tempo.
          </p>
          
          <p>
            Os Usuários cadastrados poderão extinguir suas contas, a qualquer momento, mediante envio de e-mail para <a href="mailto:suporte@direitaraiz.com" className="text-primary hover:underline">suporte@direitaraiz.com</a>.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">12. INDENIZAÇÃO</h2>
          
          <p>
            Os Usuários indenizarão a Direita Raiz, suas filiais, empresas controladas ou controladoras, diretores, administradores, colaboradores, representantes e empregados, por qualquer demanda promovida por outros usuários ou terceiros decorrentes de suas atividades no Site ou por seu descumprimento dos Termos de Uso.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">13. COMUNICAÇÕES</h2>
          
          <p>
            A realização de comunicações e notificações, pelos Usuários, à Direita Raiz, deverá ser realizada somente pelo endereço eletrônico <a href="mailto:suporte@direitaraiz.com" className="text-primary hover:underline">suporte@direitaraiz.com</a>.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">14. DISPOSIÇÕES GERAIS</h2>
          
          <p>
            As condições estabelecidas neste Termo de Uso poderão ser alteradas a qualquer momento, com objetivo de atualização de acordo com o desenvolvimento do mercado, de novas regulamentações e das exigências oriundas de interpretação de qualquer autoridade competente pelo ordenamento jurídico vigente.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">15. SOLUÇÃO DE CONTROVÉRSIAS</h2>
          
          <p>
            O presente Termo foi elaborado e é regido pelas leis em vigor na República Federativa do Brasil.
          </p>
          
          <p>
            Em caso de qualquer controvérsia a ser solucionada em razão do presente Termo de Uso, o Usuário Consumidor concorda em procurar a Direita Raiz, previamente, com objetivo de resolver o conflito amigável e extrajudicialmente.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
