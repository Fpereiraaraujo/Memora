export interface LandingFaqItem {
  question: string;
  answer: string;
}

export const LANDING_FAQ_ITEMS: LandingFaqItem[] = [
  {
    question: 'Os convidados precisam baixar aplicativo?',
    answer:
      'Não. O envio funciona direto pelo navegador do celular. O convidado escaneia o QR Code, escolhe as fotos e envia.',
  },
  {
    question: 'Precisa criar conta para enviar fotos?',
    answer:
      'Não. A experiência foi pensada para ser simples: sem login, sem cadastro e sem complicação para os convidados.',
  },
  {
    question: 'Onde posso colocar o QR Code?',
    answer:
      'Você pode usar nas mesas, no convite, na entrada da festa, no bar, no espelho, em totens, plaquinhas ou onde fizer sentido para o seu evento.',
  },
  {
    question: 'Pessoas mais velhas conseguem usar?',
    answer:
      'Sim. O fluxo é simples e direto. Basta escanear o QR Code, escolher as fotos e enviar.',
  },
  {
    question: 'As fotos ficam públicas?',
    answer:
      'A galeria da Memora é pensada para ser privada e acessível pelo link ou QR Code do evento. Quem organiza tem controle sobre as memórias recebidas.',
  },
  {
    question: 'A Memora substitui o fotógrafo?',
    answer:
      'Não. A Memora complementa o trabalho do fotógrafo profissional. O fotógrafo registra os grandes momentos; os convidados registram bastidores, reações e cenas espontâneas.',
  },
  {
    question: 'E se a internet do local estiver ruim?',
    answer:
      'Os convidados podem enviar as fotos quando tiverem conexão. O QR Code continua levando para a página do evento.',
  },
  {
    question: 'Posso remover fotos?',
    answer:
      'Sim. Quem organiza o evento pode gerenciar as fotos recebidas na galeria privada.',
  },
  {
    question: 'Posso usar em aniversários, formaturas ou eventos corporativos?',
    answer:
      'Sim. A Memora funciona muito bem em casamentos, aniversários infantis, aniversários adultos, festas de 15 anos, formaturas e eventos corporativos.',
  },
  {
    question: 'O QR Code expira?',
    answer:
      'Depende do plano escolhido. Cada plano pode ter um período de armazenamento e disponibilidade da galeria.',
  },
  {
    question: 'As fotos perdem qualidade?',
    answer:
      'A Memora foi pensada para preservar boas lembranças com qualidade adequada para visualização e organização. A qualidade final pode depender do arquivo enviado e das configurações do sistema.',
  },
  {
    question: 'Como o anfitrião acessa as fotos?',
    answer:
      'O anfitrião acessa pelo painel privado, onde pode visualizar, organizar, favoritar e baixar as memórias recebidas.',
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
