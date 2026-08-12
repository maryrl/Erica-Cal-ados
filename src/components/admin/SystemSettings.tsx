import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { supabaseService } from '../../lib/supabaseService';
import {
  Settings,
  Store,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Users,
  Save,
  CheckCircle2,
  Database,
  Key,
  Copy,
  ExternalLink,
  Code2,
  AlertTriangle
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { storeConfig, updateStoreConfig, isSupabaseConfigured, showToast } = useStore();

  const [storeName, setStoreName] = useState(storeConfig.storeName);
  const [cnpj, setCnpj] = useState(storeConfig.cnpj);
  const [whatsappNumber, setWhatsappNumber] = useState(storeConfig.whatsappNumber);
  const [formattedPhone, setFormattedPhone] = useState(storeConfig.formattedPhone);
  const [address, setAddress] = useState(storeConfig.address);
  const [email, setEmail] = useState(storeConfig.email);
  const [instagram, setInstagram] = useState(storeConfig.instagram);
  const [facebook, setFacebook] = useState(storeConfig.facebook);
  const [openingHours, setOpeningHours] = useState(storeConfig.openingHours);
  const [lowStockThreshold, setLowStockThreshold] = useState(storeConfig.lowStockThreshold);
  const [customOrderTemplate, setCustomOrderTemplate] = useState(storeConfig.customOrderTemplate);

  const [showSqlModal, setShowSqlModal] = useState(false);
  const hasTablesMissing = supabaseService.hasTablesMissing();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      storeName,
      cnpj,
      whatsappNumber,
      formattedPhone,
      address,
      email,
      instagram,
      facebook,
      openingHours,
      lowStockThreshold,
      customOrderTemplate
    });
  };

  const sqlMigrationCode = `-- Migration SQL para Donna Érica Calçados no Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    collection TEXT NOT NULL DEFAULT 'Primavera/Verão 2026',
    original_price NUMERIC(10, 2) NOT NULL,
    promotional_price NUMERIC(10, 2),
    is_hot_deal BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    variations JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Publicado',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    order_count INT NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    item JSONB NOT NULL,
    notes TEXT,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aguardando',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tracking_code TEXT
);

-- CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    birth_date DATE,
    preferred_size INT,
    favorite_color TEXT,
    notes TEXT,
    loyalty_points INT NOT NULL DEFAULT 0,
    total_orders INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    last_order_date DATE,
    tags TEXT[] DEFAULT ARRAY['Novo']::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT false,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STORE CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.store_config (
    id TEXT PRIMARY KEY DEFAULT '1',
    store_name TEXT NOT NULL DEFAULT 'Donna Érica Calçados',
    logo_url TEXT,
    cnpj TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    formatted_phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    instagram TEXT NOT NULL,
    facebook TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    low_stock_threshold INT NOT NULL DEFAULT 2,
    order_message_format TEXT NOT NULL,
    custom_order_template TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT '1',
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_button_text TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    about_history TEXT NOT NULL,
    about_mission TEXT NOT NULL,
    about_vision TEXT NOT NULL,
    about_values TEXT NOT NULL,
    announcement_bar_text TEXT NOT NULL,
    show_promo_banner BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public Read Store Config" ON public.store_config FOR SELECT USING (true);
CREATE POLICY "Public Read Site Content" ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
`;

  const copyMigrationToClipboard = () => {
    navigator.clipboard.writeText(sqlMigrationCode);
    showToast('Código de migration copiado para a área de transferência!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#C9A84C]" />
          <span>Configurações do Sistema e Loja Física</span>
        </h2>
        <p className="text-zinc-500 text-xs mt-0.5">
          Ajuste as informações cadastrais da {storeConfig.storeName}, banco de dados Supabase e os parâmetros de redirecionamento.
        </p>
      </div>

      {/* Supabase Status & Integration Card */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 rounded-3xl border border-slate-700 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-white">
                <span>Integração Banco de Dados Supabase</span>
              </h3>
              <p className="text-xs text-slate-400">
                Sincronização em nuvem para produtos, clientes, pedidos e configurações do CMS.
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isSupabaseConfigured && !hasTablesMissing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supabase Conectado e Ativo</span>
              </span>
            ) : isSupabaseConfigured && hasTablesMissing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Conectado (Tabelas SQL Pendentes)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700 border border-slate-600 text-slate-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Modo Local / Demo</span>
              </span>
            )}
          </div>
        </div>

        {hasTablesMissing && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-amber-300">As tabelas da loja ainda não foram criadas no Supabase.</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Para ativar a persistência remota, copie a migration SQL abaixo e execute no SQL Editor do seu projeto Supabase. A aplicação está rodando normalmente no modo local/offline.
              </p>
            </div>
            <button
              type="button"
              onClick={copyMigrationToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar SQL Migration</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Variáveis de Ambiente</span>
            <p className="font-mono text-[11px] text-slate-200">VITE_SUPABASE_URL</p>
            <p className="font-mono text-[11px] text-slate-200">VITE_SUPABASE_ANON_KEY</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Migrations & SQL Schema</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                O arquivo de migration oficial foi gerado em <code>/supabase/migrations/</code>.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyMigrationToClipboard}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar SQL</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSqlModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Ver DDL SQL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Section 1: Store Information */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Store className="w-5 h-5 text-[#C9A84C]" />
            <span>Dados Institucionais e Endereço</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Nome da Loja *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">CNPJ *</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1">Endereço Completo da Loja Física *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Horário de Atendimento *</label>
              <input
                type="text"
                required
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">E-mail de Contato *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Target & Template */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2 pb-2 border-b border-zinc-100">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Integração WhatsApp Vendas</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Número do WhatsApp Destino (Apenas Números com DDD) *</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Telefone Formatado (Exibição no Site)</label>
              <input
                type="text"
                value={formattedPhone}
                onChange={(e) => setFormattedPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1">
                Template da Mensagem de Pedido Redirecionada ao WhatsApp:
              </label>
              <textarea
                rows={4}
                value={customOrderTemplate}
                onChange={(e) => setCustomOrderTemplate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-[11px]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Variáveis que o sistema preenche: <code>{"{PRODUTO}"}</code>, <code>{"{COR}"}</code>, <code>{"{TAMANHO}"}</code>, <code>{"{VALOR}"}</code>, <code>{"{NOME}"}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Thresholds & Security Roles */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2 pb-2 border-b border-zinc-100">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Parâmetros de Estoque e Permissões de Usuários</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Limite para Alerta de Estoque Baixo (unidades)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 2)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 font-bold"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Itens com estoque menor ou igual a este valor ficarão destacados na cor âmbar.
              </span>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Usuários de Acesso ao CRM</label>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-zinc-200 space-y-1 text-[11px]">
                <p><strong>• admin@donnaerica.com.br</strong> (Administrador Total)</p>
                <p><strong>• atendimento@donnaerica.com.br</strong> (Apenas Vendas & Atendimento)</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-full gold-gradient text-white font-bold text-xs shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Todas as Configurações do Sistema</span>
        </button>

      </form>

      {/* SQL Migration Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-slate-100 max-w-2xl w-full rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-700 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-emerald-400">
                <Code2 className="w-5 h-5" />
                <span>Migration SQL para Supabase</span>
              </h3>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copie este código SQL e cole diretamente no <strong>SQL Editor do Dashboard do Supabase</strong> para criar todas as tabelas, políticas RLS e índices.
            </p>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre">
              {sqlMigrationCode}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={copyMigrationToClipboard}
                className="px-4 py-2 rounded-xl gold-gradient text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar SQL</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
