-- Migration: Initial Schema for Donna Érica Calçados E-Commerce & CRM
-- Created at: 2026-08-11

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Sandálias' | 'Scarpin' | 'Tênis' | 'Botas' | 'Rasteiras' | 'Promoções'
    collection TEXT NOT NULL DEFAULT 'Primavera/Verão 2026',
    original_price NUMERIC(10, 2) NOT NULL,
    promotional_price NUMERIC(10, 2),
    is_hot_deal BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    images JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of image URLs
    variations JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { colorName, colorHex, sizes: [{ size, stock }] }
    status TEXT NOT NULL DEFAULT 'Publicado', -- 'Publicado' | 'Rascunho' | 'Esgotado'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    order_count INT NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. "AUR-1042"
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    item JSONB NOT NULL, -- { productId, productName, category, color, size, price, image }
    notes TEXT,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aguardando', -- 'Aguardando' | 'Confirmado' | 'Em separação' | 'Enviado' | 'Entregue' | 'Cancelado'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tracking_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_client_phone ON public.orders(client_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. CLIENTS TABLE (CRM)
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
    tags TEXT[] DEFAULT ARRAY['Novo']::TEXT[], -- 'VIP', 'Frequente', 'Inativo', 'Aniversariante', 'Novo'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);

-- 4. REVIEWS TABLE
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

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);

-- 5. STOCK LOGS TABLE
CREATE TABLE IF NOT EXISTS public.stock_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    color TEXT NOT NULL,
    size INT NOT NULL,
    change_type TEXT NOT NULL, -- 'Entrada' | 'Saída' | 'Ajuste Manual' | 'Venda WhatsApp'
    quantity_changed INT NOT NULL,
    resulting_stock INT NOT NULL,
    user_name TEXT NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. EMAIL CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    target_segment TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'Rascunho', -- 'Rascunho' | 'Agendado' | 'Enviado'
    open_rate NUMERIC(5, 2),
    click_rate NUMERIC(5, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. WHATSAPP TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    template_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. STORE CONFIG TABLE
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

-- 9. SITE CONTENT TABLE
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

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read policies for storefront
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public Read Store Config" ON public.store_config FOR SELECT USING (true);
CREATE POLICY "Public Read Site Content" ON public.site_content FOR SELECT USING (true);

-- Public write policies for WhatsApp checkout & review submission
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Service Role / Authenticated Full Access Policies
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Clients" ON public.clients FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Stock Logs" ON public.stock_logs FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Email Campaigns" ON public.email_campaigns FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All WA Templates" ON public.whatsapp_templates FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Store Config" ON public.store_config FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Site Content" ON public.site_content FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
