export type CategoryType = 'Sandálias' | 'Scarpin' | 'Tênis' | 'Botas' | 'Rasteiras' | 'Promoções';

export type ProductStatus = 'Publicado' | 'Rascunho' | 'Esgotado';

export interface SizeStock {
  size: number; // 33 to 42
  stock: number;
}

export interface ColorVariation {
  colorName: string; // e.g. "Dourado", "Nude", "Preto", "Off-White", "Metalizado"
  colorHex: string; // e.g. "#C9A84C", "#E8D3C3", "#1A1A1A"
  sizes: SizeStock[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  collection: string; // e.g. "Primavera/Verão 2026", "Noivas & Festas", "Casual Chic"
  originalPrice: number;
  promotionalPrice?: number;
  isHotDeal?: boolean; // Promoção Imperdível
  isFeatured?: boolean; // Coleção em Destaque
  images: string[]; // Primary image [0], Secondary hover image [1], etc.
  variations: ColorVariation[];
  status: ProductStatus;
  createdAt: string;
  orderCount?: number;
  rating?: number;
  reviewCount?: number;
}

export type OrderStatus = 'Aguardando' | 'Confirmado' | 'Em separação' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  color: string;
  size: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "AUR-1042"
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  item: OrderItem;
  notes?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  preferredSize?: number;
  favoriteColor?: string;
  notes?: string;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  tags: ('VIP' | 'Frequente' | 'Inativo' | 'Aniversariante' | 'Novo')[];
  createdAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: number;
  changeType: 'Entrada' | 'Saída' | 'Ajuste Manual' | 'Venda WhatsApp';
  quantityChanged: number;
  resultingStock: number;
  timestamp: string;
  user: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  approved: boolean;
  date: string;
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  targetSegment: string;
  sentAt?: string;
  status: 'Rascunho' | 'Agendado' | 'Enviado';
  openRate?: number;
  clickRate?: number;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  triggerEvent: string;
  templateText: string;
}

export interface StoreConfig {
  storeName: string;
  logoUrl?: string;
  cnpj: string;
  whatsappNumber: string; // e.g., "5511999887766"
  formattedPhone: string; // e.g., "(11) 99988-7766"
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  openingHours: string;
  lowStockThreshold: number; // e.g. 2
  orderMessageFormat: string;
  customOrderTemplate?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  aboutHistory: string;
  aboutMission: string;
  aboutVision: string;
  aboutValues: string;
  announcementBarText: string;
  showPromoBanner: boolean;
}

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Administradora' | 'Atendente';
  avatarUrl?: string;
}
