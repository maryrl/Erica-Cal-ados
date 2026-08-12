import React, { createContext, useContext, useState, useEffect } from 'react';
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
  UserAdmin,
  OrderStatus
} from '../types';
import {
  INITIAL_STORE_CONFIG,
  INITIAL_SITE_CONTENT,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CLIENTS,
  INITIAL_REVIEWS,
  INITIAL_STOCK_LOGS,
  INITIAL_EMAIL_CAMPAIGNS,
  INITIAL_WA_TEMPLATES,
  CURRENT_ADMIN_USER
} from '../data/mockData';
import { supabaseService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Public & General state
  products: Product[];
  orders: Order[];
  clients: Client[];
  reviews: Review[];
  storeConfig: StoreConfig;
  siteContent: SiteContent;
  stockLogs: StockLog[];
  emailCampaigns: EmailCampaign[];
  waTemplates: WhatsAppTemplate[];
  
  // Supabase status
  isSupabaseConfigured: boolean;

  // Auth state
  isAdminLoggedIn: boolean;
  adminUser: UserAdmin | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // View navigation state
  currentView: 'vitrine' | 'admin';
  setCurrentView: (view: 'vitrine' | 'admin') => void;
  activePublicPage: string; // 'home' | 'catalogo' | 'quem-somos' | 'politicas' | 'faq'
  setActivePublicPage: (page: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleHotDeal: (id: string) => void;
  
  // Stock Actions
  updateVariationStock: (productId: string, colorName: string, size: number, newStock: number, reason?: string) => void;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'total'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string) => void;

  // Client CRM Actions
  addClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'loyaltyPoints' | 'totalOrders' | 'totalSpent'>) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;

  // Review Actions
  addReview: (reviewData: Omit<Review, 'id' | 'approved' | 'date'>) => void;
  approveReview: (id: string, approved: boolean) => void;

  // Communication Actions
  sendWhatsAppBroadcast: (segment: string, messageText: string) => void;
  sendEmailCampaign: (campaignData: Omit<EmailCampaign, 'id' | 'status' | 'sentAt'>) => void;

  // CMS Content Actions
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
  updateSiteContent: (content: Partial<SiteContent>) => void;

  // Reset to original demo state
  resetToDemoData: () => void;

  // Toast notifications
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage hydration
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aurelia_products');
    if (saved) {
      const parsed: Product[] = JSON.parse(saved);
      if (
        !parsed.length ||
        parsed[0]?.name?.includes('Scarpin') ||
        parsed[0]?.images?.[0]?.includes('unsplash')
      ) {
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aurelia_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('aurelia_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('aurelia_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('aurelia_store_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        !parsed.storeName ||
        parsed.storeName.includes('Aurélia') ||
        !parsed.logoUrl ||
        parsed.logoUrl.includes('logo.jpg') ||
        parsed.address.includes('Oscar Freire') ||
        parsed.email !== INITIAL_STORE_CONFIG.email ||
        parsed.whatsappNumber !== INITIAL_STORE_CONFIG.whatsappNumber ||
        parsed.instagram !== INITIAL_STORE_CONFIG.instagram
      ) {
        return INITIAL_STORE_CONFIG;
      }
      return parsed;
    }
    return INITIAL_STORE_CONFIG;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('aurelia_site_content');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        !parsed.aboutHistory ||
        parsed.aboutHistory.includes('Jardins') ||
        parsed.aboutHistory.includes('italiano') ||
        parsed.aboutHistory.includes('autoestima') ||
        !parsed.heroImage ||
        parsed.heroImage.includes('unsplash') ||
        !parsed.announcementBarText ||
        parsed.announcementBarText.includes('299')
      ) {
        return INITIAL_SITE_CONTENT;
      }
      return parsed;
    }
    return INITIAL_SITE_CONTENT;
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    const saved = localStorage.getItem('aurelia_stock_logs');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_LOGS;
  });

  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(() => {
    const saved = localStorage.getItem('aurelia_email_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_CAMPAIGNS;
  });

  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WA_TEMPLATES);

  // Hydrate from Supabase on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const remoteProducts = await supabaseService.fetchProducts();
          if (remoteProducts && remoteProducts.length > 0) setProducts(remoteProducts);

          const remoteOrders = await supabaseService.fetchOrders();
          if (remoteOrders) setOrders(remoteOrders);

          const remoteClients = await supabaseService.fetchClients();
          if (remoteClients) setClients(remoteClients);

          const remoteReviews = await supabaseService.fetchReviews();
          if (remoteReviews) setReviews(remoteReviews);

          const remoteStoreConfig = await supabaseService.fetchStoreConfig();
          if (remoteStoreConfig) setStoreConfig(remoteStoreConfig);

          const remoteSiteContent = await supabaseService.fetchSiteContent();
          if (remoteSiteContent) setSiteContent(remoteSiteContent);
        } catch (err) {
          console.error('Error hydrating state from Supabase:', err);
        }
      })();
    }
  }, []);

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('aurelia_admin_token') === 'true';
  });

  const [adminUser, setAdminUser] = useState<UserAdmin | null>(() => {
    return localStorage.getItem('aurelia_admin_token') === 'true' ? CURRENT_ADMIN_USER : null;
  });

  // UI View state
  const [currentView, setCurrentView] = useState<'vitrine' | 'admin'>('vitrine');
  const [activePublicPage, setActivePublicPage] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // LocalStorage Persist Effects
  useEffect(() => {
    localStorage.setItem('aurelia_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aurelia_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aurelia_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('aurelia_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aurelia_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('aurelia_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('aurelia_stock_logs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  useEffect(() => {
    localStorage.setItem('aurelia_email_campaigns', JSON.stringify(emailCampaigns));
  }, [emailCampaigns]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Login / Logout
  const loginAdmin = (email: string, pass: string): boolean => {
    if ((email === 'admin@donnaerica.com.br' || email.includes('@')) && pass.length >= 4) {
      setIsAdminLoggedIn(true);
      setAdminUser(CURRENT_ADMIN_USER);
      localStorage.setItem('aurelia_admin_token', 'true');
      showToast('Bem-vinda ao Painel CRM Donna Érica!', 'success');
      return true;
    } else {
      showToast('Credenciais inválidas. Use admin@donnaerica.com.br e senha admin123', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('aurelia_admin_token');
    setCurrentView('vitrine');
    showToast('Sessão encerrada com segurança.', 'info');
  };

  // Products CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      orderCount: 0,
      rating: 5.0,
      reviewCount: 0
    };

    if (isSupabaseConfigured) {
      const createdRemote = await supabaseService.insertProduct(productData);
      if (createdRemote) {
        setProducts((prev) => [createdRemote, ...prev]);
        showToast(`Produto "${createdRemote.name}" cadastrado no Supabase!`);
        return;
      }
    }

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produto "${newProduct.name}" cadastrado com sucesso!`);
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    if (isSupabaseConfigured) {
      await supabaseService.updateProduct(id, updated);
    }

    showToast('Produto atualizado!');
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured) {
      await supabaseService.deleteProduct(id);
    }

    showToast('Produto excluído com sucesso.', 'info');
  };

  const toggleHotDeal = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (target) {
      const newStatus = !target.isHotDeal;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isHotDeal: newStatus } : p))
      );
      if (isSupabaseConfigured) {
        await supabaseService.updateProduct(id, { isHotDeal: newStatus });
      }
      showToast('Status de promoção alterado.');
    }
  };

  // Stock Management
  const updateVariationStock = (
    productId: string,
    colorName: string,
    size: number,
    newStock: number,
    reason: string = 'Ajuste Manual'
  ) => {
    let changedQty = 0;
    let targetProductName = '';

    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        if (p.id !== productId) return p;
        targetProductName = p.name;
        const newVariations = p.variations.map((v) => {
          if (v.colorName !== colorName) return v;
          const newSizes = v.sizes.map((s) => {
            if (s.size !== size) return s;
            changedQty = newStock - s.stock;
            return { ...s, stock: Math.max(0, newStock) };
          });
          return { ...v, sizes: newSizes };
        });
        const updatedProd = { ...p, variations: newVariations };
        if (isSupabaseConfigured) {
          supabaseService.updateProduct(productId, { variations: newVariations });
        }
        return updatedProd;
      });
      return updatedProducts;
    });

    if (changedQty !== 0) {
      const newLog: StockLog = {
        id: `log-${Date.now()}`,
        productId,
        productName: targetProductName,
        color: colorName,
        size,
        changeType: reason as any,
        quantityChanged: changedQty,
        resultingStock: newStock,
        timestamp: new Date().toISOString(),
        user: adminUser ? adminUser.name : 'Sistema'
      };
      setStockLogs((prev) => [newLog, ...prev]);
      showToast(`Estoque atualizado: Tam ${size} (${colorName}) -> ${newStock} un.`);
    }
  };

  // Order Creation
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'total'>
  ): Order => {
    const orderNum = `DE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const total = orderData.item.price;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      total,
      status: 'Aguardando',
      createdAt: now,
      updatedAt: now
    };

    if (isSupabaseConfigured) {
      supabaseService.insertOrder({
        ...newOrder,
        total,
      });
    }

    setOrders((prev) => [newOrder, ...prev]);

    // Automatically check or create client in CRM
    setClients((prevClients) => {
      const existing = prevClients.find(
        (c) => c.phone.replace(/\D/g, '') === orderData.clientPhone.replace(/\D/g, '')
      );
      if (existing) {
        return prevClients.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + total,
                lastOrderDate: now.split('T')[0],
                preferredSize: orderData.item.size,
                favoriteColor: orderData.item.color,
                loyaltyPoints: c.loyaltyPoints + Math.floor(total / 10)
              }
            : c
        );
      } else {
        const newClient: Client = {
          id: `cli-${Date.now()}`,
          name: orderData.clientName,
          phone: orderData.clientPhone,
          email: orderData.clientEmail,
          preferredSize: orderData.item.size,
          favoriteColor: orderData.item.color,
          loyaltyPoints: Math.floor(total / 10),
          totalOrders: 1,
          totalSpent: total,
          lastOrderDate: now.split('T')[0],
          tags: ['Novo'],
          createdAt: now
        };
        if (isSupabaseConfigured) {
          supabaseService.insertClient(newClient);
        }
        return [newClient, ...prevClients];
      }
    });

    // Automatically subtract stock
    updateVariationStock(
      orderData.item.productId,
      orderData.item.color,
      orderData.item.size,
      Math.max(0, (products.find(p => p.id === orderData.item.productId)?.variations.find(v => v.colorName === orderData.item.color)?.sizes.find(s => s.size === orderData.item.size)?.stock || 1) - 1),
      'Venda WhatsApp'
    );

    showToast(`Pedido #${orderNum} registrado no CRM!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingCode?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
          ...(trackingCode ? { trackingCode } : {})
        };
      })
    );
    if (isSupabaseConfigured) {
      await supabaseService.updateOrderStatus(orderId, status, trackingCode);
    }
    showToast(`Status do pedido alterado para "${status}"`, 'info');
  };

  // Client Actions
  const addClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'loyaltyPoints' | 'totalOrders' | 'totalSpent'>
  ): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      supabaseService.insertClient(newClient);
    }
    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente ${newClient.name} cadastrada.`);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...clientData } : c))
    );
    showToast('Dados da cliente atualizados.');
  };

  // Review Actions
  const addReview = (reviewData: Omit<Review, 'id' | 'approved' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      approved: false,
      date: new Date().toISOString().split('T')[0]
    };
    if (isSupabaseConfigured) {
      supabaseService.insertReview(newRev);
    }
    setReviews((prev) => [newRev, ...prev]);
    showToast('Avaliação enviada! Aguardando aprovação do moderador.');
  };

  const approveReview = (id: string, approved: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved } : r))
    );
    showToast(approved ? 'Avaliação aprovada e exibida na vitrine!' : 'Avaliação rejeitada.');
  };

  // Broadcast & Email
  const sendWhatsAppBroadcast = (segment: string, messageText: string) => {
    showToast(`Disparo em massa via WhatsApp simulado para o segmento "${segment}"!`);
  };

  const sendEmailCampaign = (campaignData: Omit<EmailCampaign, 'id' | 'status' | 'sentAt'>) => {
    const newCamp: EmailCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      status: 'Enviado',
      sentAt: new Date().toISOString(),
      openRate: 52.4,
      clickRate: 28.1
    };
    setEmailCampaigns((prev) => [newCamp, ...prev]);
    showToast(`Campanha de e-mail "${newCamp.title}" enviada!`);
  };

  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    setStoreConfig((prev) => {
      const updated = { ...prev, ...config };
      if (isSupabaseConfigured) {
        supabaseService.updateStoreConfig(updated);
      }
      return updated;
    });
    showToast('Configurações da loja salvas com sucesso.');
  };

  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, ...content };
      if (isSupabaseConfigured) {
        supabaseService.updateSiteContent(updated);
      }
      return updated;
    });
    showToast('Conteúdo do site atualizado!');
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setClients(INITIAL_CLIENTS);
    setReviews(INITIAL_REVIEWS);
    setStoreConfig(INITIAL_STORE_CONFIG);
    setSiteContent(INITIAL_SITE_CONTENT);
    setStockLogs(INITIAL_STOCK_LOGS);
    setEmailCampaigns(INITIAL_EMAIL_CAMPAIGNS);
    showToast('Dados restaurados para o padrão de demonstração!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        clients,
        reviews,
        storeConfig,
        siteContent,
        stockLogs,
        emailCampaigns,
        waTemplates,
        isSupabaseConfigured,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        currentView,
        setCurrentView,
        activePublicPage,
        setActivePublicPage,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleHotDeal,
        updateVariationStock,
        createOrder,
        updateOrderStatus,
        addClient,
        updateClient,
        addReview,
        approveReview,
        sendWhatsAppBroadcast,
        sendEmailCampaign,
        updateStoreConfig,
        updateSiteContent,
        resetToDemoData,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
