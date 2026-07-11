export interface LandingFaqItem {
  question: string;
  answer: string;
}

export const LANDING_FAQ_ITEMS: LandingFaqItem[] = [
  {
    question: 'Os convidados precisam baixar aplicativo?',
    answer:
      'Nao. O envio funciona direto pelo navegador do celular. O convidado escaneia o QR Code, escolhe as fotos e envia.',
  },
  {
    question: 'Precisa criar conta para enviar fotos?',
    answer:
      'Nao. A experiencia foi pensada para ser simples: sem login, sem cadastro e sem complicacao para os convidados.',
  },
  {
    question: 'Onde posso colocar o QR Code?',
    answer:
      'Voce pode usar nas mesas, no convite, na entrada da festa, no bar, no espelho, em totens, plaquinhas ou onde fizer sentido para o seu evento.',
  },
  {
    question: 'Pessoas mais velhas conseguem usar?',
    answer:
      'Sim. O fluxo e simples e direto. Basta escanear o QR Code, escolher as fotos e enviar.',
  },
  {
    question: 'As fotos ficam publicas?',
    answer:
      'A galeria da Memora e pensada para ser privada e acessivel pelo link ou QR Code do evento. Os noivos tem controle sobre as memorias recebidas.',
  },
  {
    question: 'A Memora substitui o fotografo?',
    answer:
      'Nao. A Memora complementa o trabalho do fotografo profissional. O fotografo registra os grandes momentos; os convidados registram bastidores, reacoes e cenas espontaneas.',
  },
  {
    question: 'E se a internet do local estiver ruim?',
    answer:
      'Os convidados podem enviar as fotos quando tiverem conexao. O QR Code continua levando para a pagina do evento.',
  },
  {
    question: 'Posso remover fotos?',
    answer:
      'Sim. Os noivos podem gerenciar as fotos recebidas na galeria privada.',
  },
  {
    question: 'Posso usar em aniversarios, formaturas ou eventos corporativos?',
    answer:
      'Sim. Apesar de ser ideal para casamentos, a Memora tambem pode ser usada em outros tipos de eventos.',
  },
  {
    question: 'O QR Code expira?',
    answer:
      'Depende do plano escolhido. Cada plano pode ter um periodo de armazenamento e disponibilidade da galeria.',
  },
  {
    question: 'As fotos perdem qualidade?',
    answer:
      'A Memora foi pensada para preservar boas lembrancas com qualidade adequada para visualizacao e organizacao. A qualidade final pode depender do arquivo enviado e das configuracoes do sistema.',
  },
  {
    question: 'Como os noivos acessam as fotos?',
    answer:
      'Os noivos acessam pelo painel privado, onde podem visualizar, organizar, favoritar e baixar as memorias recebidas.',
  },
];

export const QR_CODE_PLACEMENTS = [
  'Mesas dos convidados',
  'Convite digital',
  'Entrada da festa',
  'Espelho do banheiro',
  'Bar',
  'Totem',
  'Plaquinhas personalizadas',
  'Lembrancinhas',
] as const;
