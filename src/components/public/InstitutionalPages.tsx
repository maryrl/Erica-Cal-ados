import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import logoImg from '../../assets/images/donna_erica_logo_1786503502716.jpg';
import {
  Building2,
  Target,
  Compass,
  HeartHandshake,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Truck,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Layers
} from 'lucide-react';

interface InstitutionalPagesProps {
  activeTab?: string;
  pageType?: string;
  onTabChange?: (tab: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const InstitutionalPages: React.FC<InstitutionalPagesProps> = ({
  activeTab,
  pageType,
  onTabChange,
  onSelectCategory
}) => {
  const { siteContent, storeConfig, setSelectedCategoryFilter, setActivePublicPage } = useStore();
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const footwearScrollRef = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const currentTab = activeTab || pageType || 'quem-somos';

  const institutionalTabs = [
    { id: 'quem-somos', label: 'Quem Somos', icon: Building2 },
    { id: 'trocas', label: 'Troca & Devolução', icon: RotateCcw },
    { id: 'pagamento', label: 'Formas de Pagamento', icon: CreditCard },
    { id: 'entrega', label: 'Envio & Entrega', icon: Truck },
    { id: 'privacidade', label: 'Privacidade LGPD', icon: ShieldCheck },
    { id: 'atendimento', label: 'FAQ & Horários', icon: HelpCircle },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsScrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - tabsScrollRef.current.offsetLeft);
    setScrollLeftPos(tabsScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !tabsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsScrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const footwearCategories = [
    { name: 'Rasteiras', icon: '👡', tag: 'Modelo Leve & Elegante' },
    { name: 'Sapatilhas', icon: '🥿', tag: 'Conforto Essencial' },
    { name: 'Papetes', icon: '✨', tag: 'Tendência & Brilho' },
    { name: 'Sandálias', icon: '👠', tag: 'Elegância & Salto' },
    { name: 'Anabelas', icon: '👡', tag: 'Anabelas Confort' },
    { name: 'Tênis', icon: '👟', tag: 'Estilo Casual Chic' },
    { name: 'Acessórios', icon: '👜', tag: 'Bolsas & Acessórios' },
    { name: 'Promoções', icon: '🔥', tag: 'Ofertas Especiais' },
  ];

  const currentIndex = institutionalTabs.findIndex(t => t.id === currentTab);

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handlePrevTab = () => {
    const newIdx = currentIndex > 0 ? currentIndex - 1 : institutionalTabs.length - 1;
    handleTabClick(institutionalTabs[newIdx].id);
  };

  const handleNextTab = () => {
    const newIdx = currentIndex < institutionalTabs.length - 1 ? currentIndex + 1 : 0;
    handleTabClick(institutionalTabs[newIdx].id);
  };

  const handleProductCategoryClick = (catName: string) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else {
      setSelectedCategoryFilter(catName);
      setActivePublicPage('catalogo');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollFootwear = (direction: 'left' | 'right') => {
    if (footwearScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      footwearScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Os produtos são novos?',
      a: 'Sim. Todos os produtos são novos e cuidadosamente conferidos antes do envio.'
    },
    {
      q: 'Vocês possuem loja física?',
      a: 'Sim! Será um prazer receber sua visita. Nossa loja está localizada na Rua Lavras da Mangabeira, 1339 - Seminário, Crato-CE (Próximo a Grendene).'
    },
    {
      q: 'Fazem entregas?',
      a: 'Sim. Consulte a disponibilidade para sua região.'
    },
    {
      q: 'Posso trocar meu produto?',
      a: 'Sim, conforme nossa política de troca.'
    },
    {
      q: 'Como entro em contato?',
      a: 'Pelo WhatsApp ou Instagram da Donna Érica Calçados.'
    },
    {
      q: 'Como funciona o pedido via WhatsApp na vitrine?',
      a: 'Você escolhe o calçado na vitrine digital, seleciona a cor e a sua numeração (33 ao 42) e clica em "Enviar Pedido pelo WhatsApp". Uma mensagem formatada com os detalhes será gerada para concluir a compra diretamente com nossas atendentes!'
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Cursor Track - Same as Collection Section */}
        <div className="relative mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="flex absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#E8DFC8] shadow-md items-center justify-center text-zinc-700 hover:bg-[#F5EFE4] hover:text-[#C9A84C] transition cursor-pointer"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Track with Cursor Drag */}
          <div
            ref={tabsScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-9 sm:px-4 no-scrollbar scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {institutionalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id || (tab.id === 'atendimento' && currentTab === 'faq');

              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#DFBA61] shadow-md border border-[#C9A84C]/40 font-bold'
                      : 'bg-white text-zinc-700 hover:bg-[#F5EFE4] border border-[#E8DFC8]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="flex absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#E8DFC8] shadow-md items-center justify-center text-zinc-700 hover:bg-[#F5EFE4] hover:text-[#C9A84C] transition cursor-pointer"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: QUEM SOMOS */}
        {currentTab === 'quem-somos' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Story with Store Photo */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C9A84C]">
                  Nossa História
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  A Paixão por Encantar e Calçar com Elegância
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {siteContent.aboutHistory}
                </p>
                <div className="pt-4 flex items-center gap-6 border-t border-zinc-100 text-xs text-zinc-500 font-medium">
                  <div>
                    <strong className="block text-lg font-serif text-[#1A1A1A]">{storeConfig.storeName}</strong>
                    <span>Boutique Física & Vitrine Digital</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF8F5] bg-white flex flex-col items-center">
                  <div className="p-6 bg-white w-full flex items-center justify-center">
                    <img
                      src={logoImg}
                      alt="Logo Oficial Donna Érica Calçados"
                      className="w-full h-72 sm:h-80 object-contain hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="w-full bg-[#1A1A1A] text-white p-3 text-center text-xs font-semibold">
                    📍 Donna Érica Calçados - Marca & Loja Física no Crato-CE
                  </div>
                </div>
              </div>
            </div>

            {/* Mission, Vision, Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#F0EAE1] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center text-[#C9A84C] mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-2">Missão</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{siteContent.aboutMission}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F0EAE1] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center text-[#C9A84C] mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-2">Visão</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{siteContent.aboutVision}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F0EAE1] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center text-[#C9A84C] mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-2">Valores</h3>
                <p className="text-zinc-600 text-xs leading-relaxed whitespace-pre-line">{siteContent.aboutValues}</p>
              </div>
            </div>

            {/* Mobile Category Navigation / Footwear Carousel */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Mover entre Categorias
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                    Explorar Nossas Coleções de Calçados
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollFootwear('left')}
                    className="p-1.5 rounded-lg bg-[#FAF8F5] border border-zinc-200 text-zinc-700 hover:text-[#C9A84C]"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollFootwear('right')}
                    className="p-1.5 rounded-lg bg-[#FAF8F5] border border-zinc-200 text-zinc-700 hover:text-[#C9A84C]"
                    aria-label="Próxima"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Category Cards */}
              <div
                ref={footwearScrollRef}
                className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scrollbar-none touch-pan-x snap-x"
              >
                {footwearCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleProductCategoryClick(cat.name)}
                    className="snap-start shrink-0 min-w-[150px] p-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5EFE4] border border-[#E8DFC8] text-left transition group cursor-pointer"
                  >
                    <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#C9A84C] flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A84C]" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{cat.tag}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Section Switcher for Mobile */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF5EA] p-4 rounded-2xl border border-[#E8DFC8]">
              <span className="text-xs font-semibold text-zinc-700 text-center sm:text-left">
                Gostaria de saber mais sobre nossas políticas?
              </span>
              <button
                onClick={handleNextTab}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl gold-gradient text-white text-xs font-bold shadow-xs hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Política de Troca & Devolução</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TROCAS E DEVOLUÇÕES */}
        {currentTab === 'trocas' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-[#C9A84C]" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Política de Troca e Devolução
                </h2>
                <p className="text-zinc-500 text-xs">Transparência e segurança do primeiro ao último passo.</p>
              </div>
            </div>

            <div className="space-y-4 text-zinc-700 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-6">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] font-semibold text-[#8C6D21]">
                ✨ A sua 1ª troca é inteiramente GRÁTIS em até 30 dias após o recebimento!
              </div>

              <h3 className="font-serif font-bold text-base text-[#1A1A1A] pt-2">
                1. Condições para Troca ou Devolução
              </h3>
              <p>
                O calçado deve ser enviado em sua embalagem original, sem indícios de uso na sola ou couro, acompanhado de todos os acessórios (sacola de tecido protetora, certificados).
              </p>

              <h3 className="font-serif font-bold text-base text-[#1A1A1A] pt-2">
                2. Como solicitar a troca via WhatsApp
              </h3>
              <p>
                Basta enviar uma mensagem para nosso suporte no número <strong>{storeConfig.formattedPhone}</strong> informando o número do seu pedido ou nome completo. Nossa consultora emitirá a autorização de postagem dos Correios imediatamente sem custo.
              </p>

              <h3 className="font-serif font-bold text-base text-[#1A1A1A] pt-2">
                3. Restituição de Valores
              </h3>
              <p>
                Em caso de devolução por arrependimento (em até 7 dias após a entrega, conforme o Código de Defesa do Consumidor), o valor pago é reembolsado integralmente via Pix ou estorno na fatura do cartão.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={handlePrevTab}
                className="text-xs font-bold text-zinc-600 hover:text-[#C9A84C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar para Quem Somos</span>
              </button>
              <button
                onClick={handleNextTab}
                className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                <span>Formas de Pagamento</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FORMAS DE PAGAMENTO */}
        {currentTab === 'pagamento' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#C9A84C]" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Formas de Pagamento
                </h2>
                <p className="text-zinc-500 text-xs">Opções facilitadas para você adquirir seus calçados.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
                <div className="text-xl font-bold font-serif text-[#9E7D2E] mb-2">⚡ Pix com 5% OFF</div>
                <p className="text-xs text-zinc-600">
                  Desconto imediato aplicado na finalização. Confirmação instantânea do pedido no WhatsApp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
                <div className="text-xl font-bold font-serif text-[#1A1A1A] mb-2">💳 Cartão de Crédito</div>
                <p className="text-xs text-zinc-600">
                  Parcelamento em até <strong>10x sem juros</strong> nos cartões Visa, Mastercard, Elo e Amex.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
                <div className="text-xl font-bold font-serif text-[#1A1A1A] mb-2">📄 Boleto Bancário</div>
                <p className="text-xs text-zinc-600">
                  Vencimento em 2 dias úteis. Ideal para compras planejadas.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={handlePrevTab}
                className="text-xs font-bold text-zinc-600 hover:text-[#C9A84C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Troca & Devolução</span>
              </button>
              <button
                onClick={handleNextTab}
                className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                <span>Envio & Entrega</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: ENVIO E ENTREGA */}
        {currentTab === 'entrega' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-[#C9A84C]" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Envio e Entrega
                </h2>
                <p className="text-zinc-500 text-xs">Entregamos com agilidade em todo o território nacional.</p>
              </div>
            </div>

            <div className="space-y-4 text-zinc-700 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-6">
              <p>
                <strong>Postagem Expressa em até 24h:</strong> Todos os pedidos confirmados até as 14h são separados, higienizados, perfumados e postados no mesmo dia.
              </p>
              <p>
                <strong>Frete Grátis:</strong> Válido para compras com valor total acima de <strong>R$ 35,00</strong>.
              </p>
              <p>
                <strong>Código de Rastreamento:</strong> Assim que a encomenda é despachada, você recebe a notificação com o código via WhatsApp e e-mail.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={handlePrevTab}
                className="text-xs font-bold text-zinc-600 hover:text-[#C9A84C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Formas de Pagamento</span>
              </button>
              <button
                onClick={handleNextTab}
                className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                <span>Privacidade LGPD</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PRIVACIDADE LGPD */}
        {currentTab === 'privacidade' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Política de Privacidade (LGPD)
                </h2>
                <p className="text-zinc-500 text-xs">Seus dados pessoais tratados com máxima confidencialidade e respeito.</p>
              </div>
            </div>

            <div className="space-y-4 text-zinc-700 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-6">
              <p>
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), garantimos que seus dados fornecidos para o pedido (nome, telefone, endereço) são utilizados exclusivamente para o processamento da compra e atendimento ao cliente.
              </p>
              <p>
                Nunca vendemos, alugamos ou compartilhamos suas informações com terceiros. Você pode solicitar a alteração ou exclusão dos seus dados do nosso CRM a qualquer momento.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <button
                onClick={handlePrevTab}
                className="text-xs font-bold text-zinc-600 hover:text-[#C9A84C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Envio & Entrega</span>
              </button>
              <button
                onClick={handleNextTab}
                className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                <span>FAQ & Atendimento</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ E ATENDIMENTO */}
        {(currentTab === 'atendimento' || currentTab === 'faq') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Store Hours & Contacts */}
            <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#C9A84C]/30 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-[#DFBA61] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#DFBA61]">Horário de Atendimento</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{storeConfig.openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#DFBA61] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#DFBA61]">Endereço Loja Física</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{storeConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-base text-emerald-400">WhatsApp Oficial</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{storeConfig.formattedPhone}</p>
                  <a
                    href={`https://wa.me/${storeConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-[#DFBA61] underline hover:text-white"
                  >
                    Falar agora no WhatsApp →
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-6">
                Perguntas Frequentes (FAQ)
              </h3>

              <div className="space-y-3">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="border border-zinc-200 rounded-2xl overflow-hidden transition duration-200"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 bg-[#FAF8F5] hover:bg-[#F5EFE4] flex items-center justify-between font-serif font-bold text-sm text-[#1A1A1A] cursor-pointer"
                      >
                        <span>{item.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#C9A84C]" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handlePrevTab}
                className="text-xs font-bold text-zinc-600 hover:text-[#C9A84C] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Privacidade LGPD</span>
              </button>
              <button
                onClick={() => handleTabClick('quem-somos')}
                className="text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                <span>Voltar ao Início do Quem Somos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
