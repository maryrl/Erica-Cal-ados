import {
  Product,
  Order,
  Client,
  Review,
  StoreConfig,
  SiteContent,
  StockLog,
  EmailCampaign,
  WhatsAppTemplate,
  UserAdmin
} from '../types';

import rasteiraStrassImg from '../assets/images/rasteira_strass_dourada_1786477889145.jpg';
import sandaliaCarameloImg from '../assets/images/sandalia_caramelo_dupla_1786477901227.jpg';
import rasteiraAmarracaoImg from '../assets/images/rasteira_amarracao_caramelo_1786477912283.jpg';
import donnaEricaLogo from '../assets/images/donna_erica_logo_1786503502716.jpg';

export const INITIAL_STORE_CONFIG: StoreConfig = {
  storeName: 'Donna Érica Calçados',
  logoUrl: donnaEricaLogo,
  cnpj: '34.567.890/0001-12',
  whatsappNumber: '5588996595049',
  formattedPhone: '(88) 9 9659-5049',
  email: 'donnaericaloja@gmail.com',
  address: 'Rua Lavras da Mangabeira, 1339 - Seminário, Crato-CE (Próximo a Grendene)',
  instagram: '@donnaericacalcados',
  facebook: '/donnaericacalcados',
  openingHours: 'Seg a sexta: 09h às 12h | 14h às 18h • Sábado: 09h às 12h',
  lowStockThreshold: 2,
  orderMessageFormat: `📋 *PEDIDO - {STORE_NAME}*
👠 *Produto:* {PRODUCT_NAME}
🎨 *Cor:* {COLOR}
📏 *Numeração:* {SIZE}
📝 *Observação:* {NOTES}
📅 *Data:* {DATE}
Olá! Gostaria de finalizar a compra. 😊`
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: 'Elegância e Conforto a Cada Passo',
  heroSubtitle: 'Coleção Exclusiva de Calçados Femininos com Acabamento Artesanal e Design Sofisticado.',
  heroButtonText: 'Ver Coleção',
  heroImage: rasteiraStrassImg,
  heroVideoUrl: '',
  heroMediaType: 'image',
  heroVideoTitle: 'Assistir Vídeo da Coleção',
  aboutHistory: 'A Donna Érica Calçados surgiu da coragem de transformar um sonho em realidade.\n\nDepois de muitos desafios, nasceu uma loja criada com amor, dedicação e muita fé, com o propósito de oferecer calçados que unem estilo, conforto e qualidade para mulheres de todas as idades.\n\nCada conquista da Donna Érica representa uma história de perseverança, e cada cliente faz parte dessa caminhada.',
  aboutMission: 'Oferecer calçados de qualidade, com conforto, beleza e preços acessíveis, proporcionando uma experiência de compra acolhedora e satisfatória.',
  aboutVision: 'Ser referência em atendimento, confiança e qualidade, tornando-se uma das lojas de calçados mais lembradas da região e expandindo nossa marca para todo o Brasil.',
  aboutValues: '• Honestidade\n• Respeito ao cliente\n• Qualidade\n• Compromisso\n• Atendimento humanizado\n• Transparência\n• Fé em Deus\n• Amor pelo que fazemos',
  announcementBarText: '✨ FRETE GRÁTIS nas compras acima de R$ 35,00 | Primeiras trocas sem custo adicionais!',
  showPromoBanner: true
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Rasteira Off-White Manta de Strass e Tachas',
    description: 'Rasteirinha sofisticada confeccionada na cor off-white com cabedal ornamentado em manta rica em brilho de strass e detalhes de tachinhas metálicas. Palmilha macia para garantir conforto inigualável o dia inteiro.',
    category: 'Rasteiras',
    collection: 'Lançamentos 2026',
    originalPrice: 119.90,
    promotionalPrice: 89.90,
    isHotDeal: true,
    isFeatured: true,
    images: [
      rasteiraStrassImg,
      sandaliaCarameloImg
    ],
    variations: [
      {
        colorName: 'Off-White / Dourado',
        colorHex: '#F8F6F0',
        sizes: [
          { size: 33, stock: 2 },
          { size: 34, stock: 4 },
          { size: 35, stock: 6 },
          { size: 36, stock: 8 },
          { size: 37, stock: 5 },
          { size: 38, stock: 3 },
          { size: 39, stock: 2 },
          { size: 40, stock: 1 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-08-01T10:00:00Z',
    orderCount: 54,
    rating: 5.0,
    reviewCount: 32
  },
  {
    id: 'prod-2',
    name: 'Sandália Flat Caramelo Tiras Duplas',
    description: 'Sandália rasteira feminina no tom caramelo atemporal com tiras duplas delicadas, acabamento pespontado de alta qualidade e detalhes metálicos folheados a ouro no tornozelo.',
    category: 'Sandálias',
    collection: 'Lançamentos 2026',
    originalPrice: 99.90,
    promotionalPrice: 79.90,
    isHotDeal: true,
    isFeatured: true,
    images: [
      sandaliaCarameloImg,
      rasteiraAmarracaoImg
    ],
    variations: [
      {
        colorName: 'Caramelo',
        colorHex: '#A06540',
        sizes: [
          { size: 33, stock: 1 },
          { size: 34, stock: 3 },
          { size: 35, stock: 5 },
          { size: 36, stock: 7 },
          { size: 37, stock: 4 },
          { size: 38, stock: 2 },
          { size: 39, stock: 1 },
          { size: 40, stock: 0 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-08-02T14:30:00Z',
    orderCount: 42,
    rating: 4.9,
    reviewCount: 23
  },
  {
    id: 'prod-3',
    name: 'Rasteira Amarração Gladiadora Caramelo com Strass',
    description: 'Rasteira estilo gladiadora com tiras finas de amarração para destacar as pernas com muito estilo. Apresenta tira frontal com aplicação de strass dourado brilhante e solado emborrachado antiderrapante.',
    category: 'Rasteiras',
    collection: 'Lançamentos 2026',
    originalPrice: 129.90,
    promotionalPrice: 99.90,
    isHotDeal: true,
    isFeatured: true,
    images: [
      rasteiraAmarracaoImg,
      rasteiraStrassImg
    ],
    variations: [
      {
        colorName: 'Caramelo / Bronze',
        colorHex: '#8C5230',
        sizes: [
          { size: 33, stock: 2 },
          { size: 34, stock: 4 },
          { size: 35, stock: 7 },
          { size: 36, stock: 9 },
          { size: 37, stock: 6 },
          { size: 38, stock: 3 },
          { size: 39, stock: 2 },
          { size: 40, stock: 1 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-08-03T09:15:00Z',
    orderCount: 61,
    rating: 5.0,
    reviewCount: 38
  },
  {
    id: 'prod-4',
    name: 'Tênis Casual Couro Premium Gold Detail',
    description: 'Tênis feminino confeccionado em couro legítimo branco com passadores e detalhes posteriores em couro dourado metálico. Solado plataforma reto de 3.5cm extremamente macio.',
    category: 'Tênis',
    collection: 'Casual Chic',
    originalPrice: 359.90,
    promotionalPrice: undefined,
    isHotDeal: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
    ],
    variations: [
      {
        colorName: 'Branco & Dourado',
        colorHex: '#FAF8F5',
        sizes: [
          { size: 33, stock: 1 },
          { size: 34, stock: 3 },
          { size: 35, stock: 6 },
          { size: 36, stock: 9 },
          { size: 37, stock: 8 },
          { size: 38, stock: 5 },
          { size: 39, stock: 3 },
          { size: 40, stock: 2 },
          { size: 41, stock: 1 },
          { size: 42, stock: 1 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-07-28T16:00:00Z',
    orderCount: 29,
    rating: 4.9,
    reviewCount: 14
  },
  {
    id: 'prod-5',
    name: 'Bota Ankle Boot Couro Nobre Fivela Dourada',
    description: 'Bota cano curto Ankle Boot em couro nobre ultra macio, bico fino, zíper lateral funcional e detalhe de fivela folheada a ouro. Salto robusto de 7cm para caminhar o dia inteiro com poder.',
    category: 'Botas',
    collection: 'Inverno Luxo',
    originalPrice: 499.90,
    promotionalPrice: 399.90,
    isHotDeal: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=800&auto=format&fit=crop'
    ],
    variations: [
      {
        colorName: 'Preto Absoluto',
        colorHex: '#1A1A1A',
        sizes: [
          { size: 33, stock: 1 },
          { size: 34, stock: 2 },
          { size: 35, stock: 4 },
          { size: 36, stock: 5 },
          { size: 37, stock: 3 },
          { size: 38, stock: 2 },
          { size: 39, stock: 1 },
          { size: 40, stock: 1 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      },
      {
        colorName: 'Café Mel',
        colorHex: '#6E473B',
        sizes: [
          { size: 33, stock: 0 },
          { size: 34, stock: 1 },
          { size: 35, stock: 2 },
          { size: 36, stock: 3 },
          { size: 37, stock: 2 },
          { size: 38, stock: 1 },
          { size: 39, stock: 0 },
          { size: 40, stock: 0 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-06-10T11:20:00Z',
    orderCount: 18,
    rating: 4.7,
    reviewCount: 12
  },
  {
    id: 'prod-6',
    name: 'Mule Feminino Bico Fino Laço Dourado',
    description: 'Mule aberto atrás em veludo cotelê de toque suave, bico fino estruturado e fivela com laço metálico dourado. Estilo prático que transforma qualquer look básico em alta costura.',
    category: 'Rasteiras',
    collection: 'Casual Chic',
    originalPrice: 249.90,
    promotionalPrice: 189.90,
    isHotDeal: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop'
    ],
    variations: [
      {
        colorName: 'Nude Camel',
        colorHex: '#C6A183',
        sizes: [
          { size: 33, stock: 1 },
          { size: 34, stock: 3 },
          { size: 35, stock: 5 },
          { size: 36, stock: 6 },
          { size: 37, stock: 4 },
          { size: 38, stock: 2 },
          { size: 39, stock: 1 },
          { size: 40, stock: 0 },
          { size: 41, stock: 0 },
          { size: 42, stock: 0 }
        ]
      }
    ],
    status: 'Publicado',
    createdAt: '2026-07-01T08:00:00Z',
    orderCount: 42,
    rating: 4.8,
    reviewCount: 22
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AUR-1042',
    clientName: 'Camila Alcantara',
    clientPhone: '(11) 99123-4567',
    clientEmail: 'camila.alcantara@gmail.com',
    item: {
      productId: 'prod-1',
      productName: 'Scarpin Dourado Salto Fino Aurélia',
      category: 'Scarpin',
      color: 'Dourado Metalizado',
      size: 37,
      price: 299.90,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    },
    notes: 'Por favor embalar em caixa de presente com laço dourado.',
    total: 299.90,
    status: 'Aguardando',
    createdAt: '2026-08-09T09:15:00Z',
    updatedAt: '2026-08-09T09:15:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AUR-1041',
    clientName: 'Juliana Paes Mendes',
    clientPhone: '(11) 98877-6655',
    clientEmail: 'juliana.mendes@hotmail.com',
    item: {
      productId: 'prod-2',
      productName: 'Sandália Tiras Finas Salto Bloco Dourada',
      category: 'Sandálias',
      color: 'Dourado Ouro',
      size: 36,
      price: 259.90,
      image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=800&auto=format&fit=crop'
    },
    notes: 'Vou retirar pessoalmente na loja às 17h.',
    total: 259.90,
    status: 'Confirmado',
    createdAt: '2026-08-09T08:30:00Z',
    updatedAt: '2026-08-09T08:45:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'AUR-1040',
    clientName: 'Fernanda Lima Souza',
    clientPhone: '(11) 97766-5544',
    clientEmail: 'fe.lima.souza@yahoo.com.br',
    item: {
      productId: 'prod-3',
      productName: 'Rasteira Metalizada Folha Dourada',
      category: 'Rasteiras',
      color: 'Dourado',
      size: 38,
      price: 159.90,
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop'
    },
    notes: 'Enviar via Sedex expresso.',
    total: 159.90,
    status: 'Em separação',
    createdAt: '2026-08-08T16:20:00Z',
    updatedAt: '2026-08-09T07:10:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'AUR-1039',
    clientName: 'Renata Vasconcelos',
    clientPhone: '(11) 96655-4433',
    clientEmail: 'renata.vasco@uol.com.br',
    item: {
      productId: 'prod-4',
      productName: 'Tênis Casual Couro Premium Gold Detail',
      category: 'Tênis',
      color: 'Branco & Dourado',
      size: 37,
      price: 359.90,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    },
    notes: 'Sem observações.',
    total: 359.90,
    status: 'Enviado',
    createdAt: '2026-08-07T11:00:00Z',
    updatedAt: '2026-08-08T10:00:00Z',
    trackingCode: 'BR987654321SP'
  },
  {
    id: 'ord-1005',
    orderNumber: 'AUR-1038',
    clientName: 'Beatriz Siqueira',
    clientPhone: '(11) 95544-3322',
    clientEmail: 'biassiqueira@gmail.com',
    item: {
      productId: 'prod-1',
      productName: 'Scarpin Dourado Salto Fino Aurélia',
      category: 'Scarpin',
      color: 'Nude Rosê',
      size: 35,
      price: 299.90,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    },
    notes: 'Entregue com sucesso.',
    total: 299.90,
    status: 'Entregue',
    createdAt: '2026-08-05T14:10:00Z',
    updatedAt: '2026-08-06T18:00:00Z'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Camila Alcantara',
    phone: '(11) 99123-4567',
    email: 'camila.alcantara@gmail.com',
    birthDate: '1992-08-15', // Aniversariante do Mês de Agosto!
    preferredSize: 37,
    favoriteColor: 'Dourado',
    notes: 'Cliente VIP assídua. Prefere salão de atendimento privativo.',
    loyaltyPoints: 320,
    totalOrders: 4,
    totalSpent: 1249.60,
    lastOrderDate: '2026-08-09',
    tags: ['VIP', 'Frequente', 'Aniversariante'],
    createdAt: '2025-10-12T10:00:00Z'
  },
  {
    id: 'cli-2',
    name: 'Juliana Paes Mendes',
    phone: '(11) 98877-6655',
    email: 'juliana.mendes@hotmail.com',
    birthDate: '1988-11-20',
    preferredSize: 36,
    favoriteColor: 'Nude Rosê',
    notes: 'Gosta de saltos confortáveis para uso corporativo.',
    loyaltyPoints: 180,
    totalOrders: 2,
    totalSpent: 649.80,
    lastOrderDate: '2026-08-09',
    tags: ['Frequente'],
    createdAt: '2026-01-15T12:00:00Z'
  },
  {
    id: 'cli-3',
    name: 'Fernanda Lima Souza',
    phone: '(11) 97766-5544',
    email: 'fe.lima.souza@yahoo.com.br',
    birthDate: '1995-04-03',
    preferredSize: 38,
    favoriteColor: 'Dourado',
    notes: 'Comprou rasteiras para viagem de praia.',
    loyaltyPoints: 50,
    totalOrders: 1,
    totalSpent: 159.90,
    lastOrderDate: '2026-08-08',
    tags: ['Novo'],
    createdAt: '2026-08-08T16:20:00Z'
  },
  {
    id: 'cli-4',
    name: 'Renata Vasconcelos',
    phone: '(11) 96655-4433',
    email: 'renata.vasco@uol.com.br',
    birthDate: '1985-08-28', // Aniversariante do Mês de Agosto!
    preferredSize: 37,
    favoriteColor: 'Branco & Dourado',
    notes: 'Adora tênis em couro macio.',
    loyaltyPoints: 210,
    totalOrders: 3,
    totalSpent: 980.00,
    lastOrderDate: '2026-08-07',
    tags: ['VIP', 'Aniversariante'],
    createdAt: '2025-05-10T14:00:00Z'
  },
  {
    id: 'cli-5',
    name: 'Mariana Rios Castro',
    phone: '(11) 94433-2211',
    email: 'marianarios@gmail.com',
    birthDate: '1990-01-10',
    preferredSize: 35,
    favoriteColor: 'Preto Gloss',
    notes: 'Cliente inativa há mais de 45 dias. Enviar cupom de retorno.',
    loyaltyPoints: 90,
    totalOrders: 1,
    totalSpent: 389.90,
    lastOrderDate: '2026-05-20',
    tags: ['Inativo'],
    createdAt: '2026-02-10T09:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Scarpin Dourado Salto Fino Aurélia',
    clientName: 'Camila A.',
    rating: 5,
    comment: 'O Scarpin mais lindo e confortável que já comprei! Usei no casamento da minha irmã e não doeu nada durante 8 horas de festa. Entrega super rápida e embalagem perfumada.',
    approved: true,
    date: '2026-08-02'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'Sandália Tiras Finas Salto Bloco Dourada',
    clientName: 'Juliana P.',
    rating: 5,
    comment: 'Acabamento impecável! O salto bloco dá um equilíbrio perfeito. A equipe da loja me atendeu pelo WhatsApp com muito carinho ajudando a escolher a numeração exata (uso 36).',
    approved: true,
    date: '2026-08-04'
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    productName: 'Rasteira Metalizada Folha Dourada',
    clientName: 'Mariana R.',
    rating: 5,
    comment: 'Super delicada! Combina tanto com vestidos fluidos quanto com jeans. O detalhe folhado a ouro é chiquérrimo.',
    approved: true,
    date: '2026-07-28'
  }
];

export const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    productName: 'Scarpin Dourado Salto Fino Aurélia',
    color: 'Dourado Metalizado',
    size: 37,
    changeType: 'Venda WhatsApp',
    quantityChanged: -1,
    resultingStock: 4,
    timestamp: '2026-08-09T09:15:00Z',
    user: 'Sistema Pedidos'
  },
  {
    id: 'log-2',
    productId: 'prod-2',
    productName: 'Sandália Tiras Finas Salto Bloco Dourada',
    color: 'Dourado Ouro',
    size: 38,
    changeType: 'Ajuste Manual',
    quantityChanged: +5,
    resultingStock: 1,
    timestamp: '2026-08-08T14:00:00Z',
    user: 'Érica (Admin)'
  }
];

export const INITIAL_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'camp-1',
    title: 'Lançamento Coleção Primavera/Verão 2026',
    subject: '✨ Descubra em primeira mão os novos modelos banhados a ouro!',
    content: 'Olá {NOME}, preparamos uma seleção exclusiva de calçados leves, sofisticados e repletos de brilho para a sua nova estação.',
    targetSegment: 'Todos os Clientes',
    sentAt: '2026-08-01T10:00:00Z',
    status: 'Enviado',
    openRate: 48.5,
    clickRate: 22.1
  },
  {
    id: 'camp-2',
    title: 'Aniversariantes do Mês - Mimo Especial 15% OFF',
    subject: '🎂 Parabéns! Seu presente especial de aniversário chegou na Donna Érica',
    content: 'Olá {NOME}, desejamos um feliz aniversário com muita saúde e elegância! Use o cupom NIVER15 em seu próximo pedido pelo WhatsApp.',
    targetSegment: 'Aniversariantes do Mês',
    sentAt: '2026-08-05T09:00:00Z',
    status: 'Enviado',
    openRate: 75.0,
    clickRate: 40.0
  }
];

export const INITIAL_WA_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wa-tpl-1',
    title: 'Confirmação de Pedido Recebido',
    triggerEvent: 'Ao confirmar pedido',
    templateText: 'Olá {NOME}! ✨ Seu pedido #{PEDIDO} do {PRODUTO} (Cor: {COR}, Tam: {TAMANHO}) foi confirmado com sucesso! Já estamos preparando tudo com muito carinho. 👠'
  },
  {
    id: 'wa-tpl-2',
    title: 'Aviso de Envio com Rastreio',
    triggerEvent: 'Ao marcar como Enviado',
    templateText: 'Oi {NOME}! 🚚 Seu pedido #{PEDIDO} acabou de ser enviado! Seu código de rastreamento é: {RASTREIO}. Acompanhe sua entrega e prepare-se para se apaixonar!'
  },
  {
    id: 'wa-tpl-3',
    title: 'Mensagem de Aniversário',
    triggerEvent: 'Automático no Aniversário',
    templateText: 'Parabéns {NOME}! 🎂✨ A equipe Donna Érica Calçados te deseja um dia inesquecível! Para celebrar, preparamos um presente exclusivo: 15% OFF + Frete Grátis na sua próxima escolha. Responda essa mensagem para resgatar!'
  }
];

export const CURRENT_ADMIN_USER: UserAdmin = {
  id: 'usr-1',
  name: 'Donna Érica Rodrigues',
  email: 'admin@donnaerica.com.br',
  role: 'Administradora',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
};
