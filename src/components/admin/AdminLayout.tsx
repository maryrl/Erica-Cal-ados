import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import logoImg from '../../assets/logo.jpg';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { StockManagement } from './StockManagement';
import { OrderManagement } from './OrderManagement';
import { ClientCRM } from './ClientCRM';
import { MarketingCommunication } from './MarketingCommunication';
import { ContentManagement } from './ContentManagement';
import { SystemSettings } from './SystemSettings';

import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Eye,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  onPreviewProductFromAdmin: (product: Product) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onPreviewProductFromAdmin }) => {
  const {
    adminUser,
    logoutAdmin,
    setCurrentView,
    orders,
    products,
    storeConfig
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'produtos' | 'estoque' | 'pedidos' | 'crm' | 'comunicacao' | 'cms' | 'configuracoes'
  >('overview');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Counts for badges
  const pendingOrders = orders.filter((o) => o.status === 'Aguardando' || o.status === 'Confirmado').length;

  let lowStockCount = 0;
  products.forEach((p) => {
    p.variations.forEach((v) => {
      v.sizes.forEach((s) => {
        if (s.stock > 0 && s.stock <= storeConfig.lowStockThreshold) {
          lowStockCount++;
        }
      });
    });
  });

  const menuItems = [
    { id: 'overview', label: 'Dashboard & Vendas', icon: LayoutDashboard },
    { id: 'produtos', label: 'Gestão de Produtos', icon: Package },
    { id: 'estoque', label: 'Controle de Estoque', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'pedidos', label: 'Pedidos WhatsApp (Kanban)', icon: ShoppingBag, badge: pendingOrders > 0 ? pendingOrders : null, badgeColor: 'bg-[#C9A84C] text-white' },
    { id: 'crm', label: 'CRM — Clientes', icon: Users },
    { id: 'comunicacao', label: 'Disparos WA & E-mail', icon: MessageSquare },
    { id: 'cms', label: 'Conteúdo do Site', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-zinc-900 flex flex-col md:flex-row">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1A1A] text-white border-r border-[#332F28] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2D2A24] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={storeConfig.logoUrl || logoImg}
              alt={storeConfig.storeName}
              className="w-10 h-10 rounded-full object-cover border border-[#C9A84C] bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-serif text-base font-bold tracking-wider text-white leading-tight">
                {storeConfig.storeName}
              </h1>
              <span className="text-[10px] text-[#DFBA61] font-semibold uppercase tracking-widest block">
                Painel CRM Lojista
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'gold-gradient text-white shadow-lg shadow-[#C9A84C]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-[#282520]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer & Return to Vitrine */}
        <div className="p-4 border-t border-[#2D2A24] space-y-2">
          <button
            onClick={() => setCurrentView('vitrine')}
            className="w-full py-2.5 px-3 rounded-xl bg-[#282520] hover:bg-[#38342D] text-xs text-[#DFBA61] font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-[#3D382F]"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Vitrine Pública</span>
          </button>

          <div className="p-3 rounded-2xl bg-[#121212] border border-[#2D2A24] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#38342D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {adminUser?.name.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-white truncate">{adminUser?.name || 'Administrador'}</span>
                <span className="block text-[10px] text-zinc-500 truncate">{adminUser?.role}</span>
              </div>
            </div>

            <button
              onClick={logoutAdmin}
              className="text-zinc-500 hover:text-rose-400 p-1 transition"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-[#332F28] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img
            src={storeConfig.logoUrl || logoImg}
            alt={storeConfig.storeName}
            className="w-8 h-8 rounded-full object-cover border border-[#C9A84C] bg-white"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif font-bold text-sm tracking-wide">{storeConfig.storeName} CRM</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('vitrine')}
            className="text-xs text-[#DFBA61] font-bold underline"
          >
            Vitrine
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-1">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] text-white p-4 space-y-2 border-b border-[#332F28] z-30">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                  isActive ? 'gold-gradient text-white' : 'text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <DashboardOverview onNavigateTab={(tab) => setActiveTab(tab as any)} />
        )}
        {activeTab === 'produtos' && (
          <ProductManagement onPreviewProduct={onPreviewProductFromAdmin} />
        )}
        {activeTab === 'estoque' && <StockManagement />}
        {activeTab === 'pedidos' && <OrderManagement />}
        {activeTab === 'crm' && <ClientCRM />}
        {activeTab === 'comunicacao' && <MarketingCommunication />}
        {activeTab === 'cms' && <ContentManagement />}
        {activeTab === 'configuracoes' && <SystemSettings />}
      </main>

    </div>
  );
};
