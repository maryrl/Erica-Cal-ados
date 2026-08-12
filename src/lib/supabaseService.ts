import { supabase, isSupabaseConfigured } from './supabase';
import {
  Product,
  Order,
  Client,
  Review,
  StoreConfig,
  SiteContent,
  OrderStatus
} from '../types';

let tablesMissingFlag = false;

function isTableMissingError(err: any): boolean {
  if (!err) return false;
  return (
    err.code === 'PGRST205' ||
    err.code === '42P01' ||
    (typeof err.message === 'string' && err.message.includes('Could not find the table'))
  );
}

function handleSupabaseError(context: string, err: any) {
  if (isTableMissingError(err)) {
    tablesMissingFlag = true;
    console.warn(`[Supabase Notice] As tabelas SQL ainda não foram criadas no seu projeto Supabase (${context}). A aplicação continuará utilizando os dados locais com transparência.`);
  } else if (err) {
    console.warn(`[Supabase Warning] ${context}:`, err.message || err);
  }
}

export const supabaseService = {
  // Config & Status
  isConfigured: () => isSupabaseConfigured,
  hasTablesMissing: () => tablesMissingFlag,

  // --- PRODUCTS ---
  async fetchProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError('fetchProducts', error);
        return null;
      }
      if (!data) return [];

      return data.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        collection: p.collection,
        originalPrice: Number(p.original_price),
        promotionalPrice: p.promotional_price ? Number(p.promotional_price) : undefined,
        isHotDeal: p.is_hot_deal,
        isFeatured: p.is_featured,
        images: p.images || [],
        variations: p.variations || [],
        status: p.status,
        createdAt: p.created_at,
        orderCount: p.order_count || 0,
        rating: p.rating ? Number(p.rating) : 5.0,
        reviewCount: p.review_count || 0,
      }));
    } catch (err) {
      handleSupabaseError('fetchProducts exception', err);
      return null;
    }
  },

  async insertProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const dbRecord = {
        name: product.name,
        description: product.description,
        category: product.category,
        collection: product.collection,
        original_price: product.originalPrice,
        promotional_price: product.promotionalPrice ?? null,
        is_hot_deal: product.isHotDeal ?? false,
        is_featured: product.isFeatured ?? false,
        images: product.images,
        variations: product.variations,
        status: product.status,
        order_count: 0,
        rating: 5.0,
        review_count: 0,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        handleSupabaseError('insertProduct', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        collection: data.collection,
        originalPrice: Number(data.original_price),
        promotionalPrice: data.promotional_price ? Number(data.promotional_price) : undefined,
        isHotDeal: data.is_hot_deal,
        isFeatured: data.is_featured,
        images: data.images,
        variations: data.variations,
        status: data.status,
        createdAt: data.created_at,
        orderCount: data.order_count,
        rating: Number(data.rating),
        reviewCount: data.review_count,
      };
    } catch (err) {
      handleSupabaseError('insertProduct exception', err);
      return null;
    }
  },

  async updateProduct(id: string, updated: Partial<Product>): Promise<boolean> {
    if (!isSupabaseConfigured || tablesMissingFlag) return false;
    try {
      const payload: Record<string, any> = {};
      if (updated.name !== undefined) payload.name = updated.name;
      if (updated.description !== undefined) payload.description = updated.description;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.collection !== undefined) payload.collection = updated.collection;
      if (updated.originalPrice !== undefined) payload.original_price = updated.originalPrice;
      if (updated.promotionalPrice !== undefined) payload.promotional_price = updated.promotionalPrice;
      if (updated.isHotDeal !== undefined) payload.is_hot_deal = updated.isHotDeal;
      if (updated.isFeatured !== undefined) payload.is_featured = updated.isFeatured;
      if (updated.images !== undefined) payload.images = updated.images;
      if (updated.variations !== undefined) payload.variations = updated.variations;
      if (updated.status !== undefined) payload.status = updated.status;

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

      if (error) {
        handleSupabaseError('updateProduct', error);
        return false;
      }
      return true;
    } catch (err) {
      handleSupabaseError('updateProduct exception', err);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || tablesMissingFlag) return false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        handleSupabaseError('deleteProduct', error);
        return false;
      }
      return true;
    } catch (err) {
      handleSupabaseError('deleteProduct exception', err);
      return false;
    }
  },

  // --- ORDERS ---
  async fetchOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError('fetchOrders', error);
        return null;
      }
      if (!data) return [];

      return data.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        clientName: o.client_name,
        clientPhone: o.client_phone,
        clientEmail: o.client_email,
        item: o.item,
        notes: o.notes,
        total: Number(o.total),
        status: o.status,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        trackingCode: o.tracking_code,
      }));
    } catch (err) {
      handleSupabaseError('fetchOrders exception', err);
      return null;
    }
  },

  async insertOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const dbRecord = {
        order_number: order.orderNumber,
        client_name: order.clientName,
        client_phone: order.clientPhone,
        client_email: order.clientEmail || null,
        item: order.item,
        notes: order.notes || null,
        total: order.total,
        status: order.status,
        tracking_code: order.trackingCode || null,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        handleSupabaseError('insertOrder', error);
        return null;
      }

      return {
        id: data.id,
        orderNumber: data.order_number,
        clientName: data.client_name,
        clientPhone: data.client_phone,
        clientEmail: data.client_email,
        item: data.item,
        notes: data.notes,
        total: Number(data.total),
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        trackingCode: data.tracking_code,
      };
    } catch (err) {
      handleSupabaseError('insertOrder exception', err);
      return null;
    }
  },

  async updateOrderStatus(id: string, status: OrderStatus, trackingCode?: string): Promise<boolean> {
    if (!isSupabaseConfigured || tablesMissingFlag) return false;
    try {
      const payload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (trackingCode !== undefined) payload.tracking_code = trackingCode;

      const { error } = await supabase.from('orders').update(payload).eq('id', id);
      if (error) {
        handleSupabaseError('updateOrderStatus', error);
        return false;
      }
      return true;
    } catch (err) {
      handleSupabaseError('updateOrderStatus exception', err);
      return false;
    }
  },

  // --- CLIENTS ---
  async fetchClients(): Promise<Client[] | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError('fetchClients', error);
        return null;
      }
      if (!data) return [];

      return data.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        birthDate: c.birth_date,
        preferredSize: c.preferred_size,
        favoriteColor: c.favorite_color,
        notes: c.notes,
        loyaltyPoints: c.loyalty_points || 0,
        totalOrders: c.total_orders || 0,
        totalSpent: Number(c.total_spent || 0),
        lastOrderDate: c.last_order_date,
        tags: c.tags || ['Novo'],
        createdAt: c.created_at,
      }));
    } catch (err) {
      handleSupabaseError('fetchClients exception', err);
      return null;
    }
  },

  async insertClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const dbRecord = {
        name: client.name,
        phone: client.phone,
        email: client.email || null,
        birth_date: client.birthDate || null,
        preferred_size: client.preferredSize || null,
        favorite_color: client.favoriteColor || null,
        notes: client.notes || null,
        loyalty_points: client.loyaltyPoints || 0,
        total_orders: client.totalOrders || 0,
        total_spent: client.totalSpent || 0,
        last_order_date: client.lastOrderDate || null,
        tags: client.tags || ['Novo'],
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        handleSupabaseError('insertClient', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthDate: data.birth_date,
        preferredSize: data.preferred_size,
        favoriteColor: data.favorite_color,
        notes: data.notes,
        loyaltyPoints: data.loyalty_points,
        totalOrders: data.total_orders,
        totalSpent: Number(data.total_spent),
        lastOrderDate: data.last_order_date,
        tags: data.tags,
        createdAt: data.created_at,
      };
    } catch (err) {
      handleSupabaseError('insertClient exception', err);
      return null;
    }
  },

  // --- REVIEWS ---
  async fetchReviews(): Promise<Review[] | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        handleSupabaseError('fetchReviews', error);
        return null;
      }
      if (!data) return [];

      return data.map((r) => ({
        id: r.id,
        productId: r.product_id,
        productName: r.product_name,
        clientName: r.client_name,
        rating: r.rating,
        comment: r.comment,
        approved: r.approved,
        date: r.date,
      }));
    } catch (err) {
      handleSupabaseError('fetchReviews exception', err);
      return null;
    }
  },

  async insertReview(review: Omit<Review, 'id'>): Promise<Review | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const dbRecord = {
        product_id: review.productId,
        product_name: review.productName,
        client_name: review.clientName,
        rating: review.rating,
        comment: review.comment,
        approved: review.approved,
        date: review.date,
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        handleSupabaseError('insertReview', error);
        return null;
      }

      return {
        id: data.id,
        productId: data.product_id,
        productName: data.product_name,
        clientName: data.client_name,
        rating: data.rating,
        comment: data.comment,
        approved: data.approved,
        date: data.date,
      };
    } catch (err) {
      handleSupabaseError('insertReview exception', err);
      return null;
    }
  },

  // --- STORE CONFIG ---
  async fetchStoreConfig(): Promise<StoreConfig | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        handleSupabaseError('fetchStoreConfig', error);
        return null;
      }
      if (!data) return null;

      return {
        storeName: data.store_name,
        logoUrl: data.logo_url,
        cnpj: data.cnpj,
        whatsappNumber: data.whatsapp_number,
        formattedPhone: data.formatted_phone,
        email: data.email,
        address: data.address,
        instagram: data.instagram,
        facebook: data.facebook,
        openingHours: data.opening_hours,
        lowStockThreshold: data.low_stock_threshold,
        orderMessageFormat: data.order_message_format,
        customOrderTemplate: data.custom_order_template,
      };
    } catch (err) {
      handleSupabaseError('fetchStoreConfig exception', err);
      return null;
    }
  },

  async updateStoreConfig(config: Partial<StoreConfig>): Promise<boolean> {
    if (!isSupabaseConfigured || tablesMissingFlag) return false;
    try {
      const dbPayload: Record<string, any> = {};
      if (config.storeName !== undefined) dbPayload.store_name = config.storeName;
      if (config.logoUrl !== undefined) dbPayload.logo_url = config.logoUrl;
      if (config.cnpj !== undefined) dbPayload.cnpj = config.cnpj;
      if (config.whatsappNumber !== undefined) dbPayload.whatsapp_number = config.whatsappNumber;
      if (config.formattedPhone !== undefined) dbPayload.formatted_phone = config.formattedPhone;
      if (config.email !== undefined) dbPayload.email = config.email;
      if (config.address !== undefined) dbPayload.address = config.address;
      if (config.instagram !== undefined) dbPayload.instagram = config.instagram;
      if (config.facebook !== undefined) dbPayload.facebook = config.facebook;
      if (config.openingHours !== undefined) dbPayload.opening_hours = config.openingHours;
      if (config.lowStockThreshold !== undefined) dbPayload.low_stock_threshold = config.lowStockThreshold;
      if (config.orderMessageFormat !== undefined) dbPayload.order_message_format = config.orderMessageFormat;
      if (config.customOrderTemplate !== undefined) dbPayload.custom_order_template = config.customOrderTemplate;

      const { error } = await supabase
        .from('store_config')
        .upsert({ id: '1', ...dbPayload });

      if (error) {
        handleSupabaseError('updateStoreConfig', error);
        return false;
      }
      return true;
    } catch (err) {
      handleSupabaseError('updateStoreConfig exception', err);
      return false;
    }
  },

  // --- SITE CONTENT ---
  async fetchSiteContent(): Promise<SiteContent | null> {
    if (!isSupabaseConfigured || tablesMissingFlag) return null;
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        handleSupabaseError('fetchSiteContent', error);
        return null;
      }
      if (!data) return null;

      return {
        heroTitle: data.hero_title,
        heroSubtitle: data.hero_subtitle,
        heroButtonText: data.hero_button_text,
        heroImage: data.hero_image,
        aboutHistory: data.about_history,
        aboutMission: data.about_mission,
        aboutVision: data.about_vision,
        aboutValues: data.about_values,
        announcementBarText: data.announcement_bar_text,
        showPromoBanner: data.show_promo_banner,
      };
    } catch (err) {
      handleSupabaseError('fetchSiteContent exception', err);
      return null;
    }
  },

  async updateSiteContent(content: Partial<SiteContent>): Promise<boolean> {
    if (!isSupabaseConfigured || tablesMissingFlag) return false;
    try {
      const dbPayload: Record<string, any> = {};
      if (content.heroTitle !== undefined) dbPayload.hero_title = content.heroTitle;
      if (content.heroSubtitle !== undefined) dbPayload.hero_subtitle = content.heroSubtitle;
      if (content.heroButtonText !== undefined) dbPayload.hero_button_text = content.heroButtonText;
      if (content.heroImage !== undefined) dbPayload.hero_image = content.heroImage;
      if (content.aboutHistory !== undefined) dbPayload.about_history = content.aboutHistory;
      if (content.aboutMission !== undefined) dbPayload.about_mission = content.aboutMission;
      if (content.aboutVision !== undefined) dbPayload.about_vision = content.aboutVision;
      if (content.aboutValues !== undefined) dbPayload.about_values = content.aboutValues;
      if (content.announcementBarText !== undefined) dbPayload.announcement_bar_text = content.announcementBarText;
      if (content.showPromoBanner !== undefined) dbPayload.show_promo_banner = content.showPromoBanner;

      const { error } = await supabase
        .from('site_content')
        .upsert({ id: '1', ...dbPayload });

      if (error) {
        handleSupabaseError('updateSiteContent', error);
        return false;
      }
      return true;
    } catch (err) {
      handleSupabaseError('updateSiteContent exception', err);
      return false;
    }
  }
};
