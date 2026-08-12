-- Seed File for Donna Érica Calçados
-- Populates initial store configuration, site content, and catalog items.

-- 1. STORE CONFIG SEED
INSERT INTO public.store_config (
    id, store_name, logo_url, cnpj, whatsapp_number, formatted_phone, email, address, instagram, facebook, opening_hours, low_stock_threshold, order_message_format
) VALUES (
    '1',
    'Donna Érica Calçados',
    'https://i.ibb.co/L5wJpWf/donna-erica-logo.png',
    '42.189.902/0001-85',
    '5588996595049',
    '(88) 9 9659-5049',
    'atendimento@donnaericacalcados.com.br',
    'Rua Principal, Ceará / Brasil - Atendimento Online e Presencial',
    '@donnaericacalcados',
    'Donna Érica Calçados',
    'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 13:00',
    2,
    'Olá, Donna Érica Calçados! Gostaria de finalizar a compra do pedido #{orderNumber}.\n\n*Detalhes do Produto:*\n- Produto: {productName}\n- Categoria: {category}\n- Cor: {color}\n- Tamanho: {size}\n- Valor: R$ {price}\n\n*Dados da Cliente:*\n- Nome: {clientName}\n- Telefone: {clientPhone}'
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    formatted_phone = EXCLUDED.formatted_phone,
    address = EXCLUDED.address;

-- 2. SITE CONTENT SEED
INSERT INTO public.site_content (
    id, hero_title, hero_subtitle, hero_button_text, hero_image, about_history, about_mission, about_vision, about_values, announcement_bar_text, show_promo_banner
) VALUES (
    '1',
    'Calçar com Elegância e Conforto Único',
    'Sapatos femininos com numeração do 33 ao 42, acabamento impecável e design sofisticado para realçar a beleza da mulher moderna.',
    'Ver Coleção Completa',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    'A história da Donna Érica Calçados é marcada por superação, fé, amor e dedicação. O que começou como o sonho de transformar a autoestima feminina através de calçados elegantes e confortáveis, tornou-se referência em qualidade e atendimento acolhedor. Enfrentamos desafios com determinação e sempre confiando no propósito de Deus para nossas vidas e negócios. Hoje, cada par de sapatos entregue carrega nossa carinho, história e gratidão a cada cliente que faz parte da família Donna Érica.',
    'Proporcionar calçados femininos de alta qualidade, elegância e conforto para mulheres de todos os estilos, oferecendo uma experiência de compra humanizada, atenciosa e acessível.',
    'Ser reconhecida como a loja de calçados femininos preferida do Ceará e do Brasil, destacando-se pela excelência no atendimento, variedade de tamanhos (do 33 ao 42) e compromisso ético com nossos clientes.',
    'Fé em Deus e gratidão em tudo; Atendimento humanizado e com amor; Respeito e transparência com cada cliente; Excelência e qualidade impecável; Produtos acessíveis com elegância incomparável.',
    '✨ Calçar com Elegância | Numeração do 33 ao 42 | Atendimento Humanizado via WhatsApp (88) 9 9659-5049',
    true
) ON CONFLICT (id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    about_history = EXCLUDED.about_history,
    about_mission = EXCLUDED.about_mission;

-- 3. INITIAL PRODUCTS SEED
INSERT INTO public.products (
    id, name, description, category, collection, original_price, promotional_price, is_hot_deal, is_featured, images, variations, status, order_count, rating, review_count
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Sandália Anabela Salto Anabela Médio Elegance',
    'Sandália salto anabela médio com tiras trançadas macias, palmilha anatômica e fechamento ajustável no tornozelo. Perfeita para usar o dia todo com elegância.',
    'Sandálias',
    'Primavera/Verão 2026',
    189.90,
    149.90,
    true,
    true,
    '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    '[{"colorName": "Nude", "colorHex": "#E8D3C3", "sizes": [{"size": 34, "stock": 5}, {"size": 35, "stock": 8}, {"size": 36, "stock": 10}, {"size": 37, "stock": 6}, {"size": 38, "stock": 4}, {"size": 39, "stock": 2}]}]'::jsonb,
    'Publicado',
    18,
    4.9,
    12
),
(
    '22222222-2222-2222-2222-222222222222',
    'Rasteira Pedrarias Brilho Nobre',
    'Rasteirinha com detalhes em pedrarias delicadas, solado emborrachado antiderrapante e palmilha ultra macia. Um toque de brilho e sofisticação para o seu dia a dia.',
    'Rasteiras',
    'Casual Chic',
    119.90,
    89.90,
    true,
    true,
    '["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    '[{"colorName": "Dourado", "colorHex": "#C9A84C", "sizes": [{"size": 35, "stock": 4}, {"size": 36, "stock": 7}, {"size": 37, "stock": 9}, {"size": 38, "stock": 5}, {"size": 39, "stock": 3}]}]'::jsonb,
    'Publicado',
    24,
    5.0,
    19
),
(
    '33333333-3333-3333-3333-333333333333',
    'Scarpin Bico Fino Salto Bloco Confort',
    'Scarpin bico fino clássico com salto bloco de 6cm para estabilidade incomparável. Couro ecológico premium com acabamento verniz refinado.',
    'Scarpin',
    'Noivas & Festas',
    219.90,
    179.90,
    false,
    true,
    '["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    '[{"colorName": "Preto", "colorHex": "#1A1A1A", "sizes": [{"size": 34, "stock": 3}, {"size": 35, "stock": 6}, {"size": 36, "stock": 8}, {"size": 37, "stock": 5}, {"size": 38, "stock": 4}, {"size": 39, "stock": 2}]}]'::jsonb,
    'Publicado',
    15,
    4.8,
    8
) ON CONFLICT (id) DO NOTHING;
