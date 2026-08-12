import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Menu, X, Sparkles, MapPin, PhoneCall } from 'lucide-react';
import logoImg from '../../assets/images/donna_erica_logo_1786503502716.jpg';

interface HeaderProps {
  onOpenSearch?: () => void;
  activePage?: string;
  onNavClick?: (page: string) => void;
  onSecretAdminTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, activePage, onNavClick, onSecretAdminTrigger }) => {
  const {
    storeConfig,
    siteContent,
    activePublicPage,
    setActivePublicPage,
    currentView,
    setCurrentView,
    setSelectedCategoryFilter
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const currentPage = activePage || activePublicPage;

  const handleLogoClick = () => {
    handleNavClick('home');
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setLogoClickCount(0);
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
      }
    } else {
      setTimeout(() => setLogoClickCount(0), 3000);
    }
  };

  const handleNavClick = (page: string) => {
    if (onNavClick) {
      onNavClick(page);
    } else {
      setActivePublicPage(page);
      if (page === 'promocoes') {
        setSelectedCategoryFilter('Promoções');
      } else if (page === 'catalogo' || page === 'home') {
        setSelectedCategoryFilter('Todas');
      }
      setCurrentView('vitrine');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] shadow-sm border-b border-[#F0EAE1]">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A1A1A] text-[#F0E6CE] py-2 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 animate-pulse" />
            <span>{siteContent.announcementBarText}</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-zinc-300 text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
              {storeConfig.address.split('-')[0]}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#C9A84C]" />
              {storeConfig.formattedPhone}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-zinc-700 hover:text-[#C9A84C] transition"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer flex items-center gap-3 group py-1"
        >
          <img
            src={storeConfig.logoUrl || logoImg}
            alt={storeConfig.storeName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#C9A84C]/50 shadow-md group-hover:scale-105 transition-transform duration-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#1A1A1A] group-hover:text-[#C9A84C] transition leading-tight">
              {storeConfig.storeName}
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#C9A84C] font-semibold uppercase -mt-0.5">
              CALÇADOS FEMININOS
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition py-1 border-b-2 cursor-pointer ${
              currentPage === 'home' && currentView === 'vitrine'
                ? 'border-[#C9A84C] text-[#C9A84C] font-semibold'
                : 'border-transparent text-zinc-700 hover:text-[#C9A84C]'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => handleNavClick('catalogo')}
            className={`transition py-1 border-b-2 cursor-pointer ${
              currentPage === 'catalogo' && currentView === 'vitrine'
                ? 'border-[#C9A84C] text-[#C9A84C] font-semibold'
                : 'border-transparent text-zinc-700 hover:text-[#C9A84C]'
            }`}
          >
            Coleção Completa
          </button>
          <button
            onClick={() => handleNavClick('promocoes')}
            className={`transition py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              currentPage === 'promocoes' && currentView === 'vitrine'
                ? 'border-[#C9A84C] text-[#C9A84C] font-semibold'
                : 'border-transparent text-zinc-700 hover:text-[#C9A84C]'
            }`}
          >
            <span className="bg-[#C9A84C]/15 text-[#9E7D2E] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
              OFF
            </span>
            Promoções
          </button>
          <button
            onClick={() => handleNavClick('quem-somos')}
            className={`transition py-1 border-b-2 cursor-pointer ${
              currentPage === 'quem-somos' && currentView === 'vitrine'
                ? 'border-[#C9A84C] text-[#C9A84C] font-semibold'
                : 'border-transparent text-zinc-700 hover:text-[#C9A84C]'
            }`}
          >
            Quem Somos
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className={`transition py-1 border-b-2 cursor-pointer ${
              (currentPage === 'atendimento' || currentPage === 'faq') && currentView === 'vitrine'
                ? 'border-[#C9A84C] text-[#C9A84C] font-semibold'
                : 'border-transparent text-zinc-700 hover:text-[#C9A84C]'
            }`}
          >
            Atendimento & FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-zinc-700 hover:text-[#C9A84C] hover:bg-zinc-100 rounded-full transition cursor-pointer"
              title="Buscar calçado"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-1.5 animate-in slide-in-from-top duration-200 shadow-xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm transition cursor-pointer ${
              currentPage === 'home' && currentView === 'vitrine'
                ? 'bg-[#FAF5EA] text-[#C9A84C] font-bold border-l-4 border-[#C9A84C]'
                : 'text-zinc-800 hover:bg-zinc-50 hover:text-[#C9A84C]'
            }`}
          >
            🏠 Início
          </button>
          <button
            onClick={() => handleNavClick('catalogo')}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm transition cursor-pointer ${
              currentPage === 'catalogo' && currentView === 'vitrine'
                ? 'bg-[#FAF5EA] text-[#C9A84C] font-bold border-l-4 border-[#C9A84C]'
                : 'text-zinc-800 hover:bg-zinc-50 hover:text-[#C9A84C]'
            }`}
          >
            👠 Coleção Completa
          </button>
          <button
            onClick={() => handleNavClick('promocoes')}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm transition cursor-pointer ${
              currentPage === 'promocoes' && currentView === 'vitrine'
                ? 'bg-[#FAF5EA] text-[#C9A84C] font-bold border-l-4 border-[#C9A84C]'
                : 'text-zinc-800 hover:bg-zinc-50 hover:text-[#C9A84C]'
            }`}
          >
            ✨ Promoções Imperdíveis
          </button>
          <button
            onClick={() => handleNavClick('quem-somos')}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm transition cursor-pointer ${
              currentPage === 'quem-somos' && currentView === 'vitrine'
                ? 'bg-[#FAF5EA] text-[#C9A84C] font-bold border-l-4 border-[#C9A84C]'
                : 'text-zinc-800 hover:bg-zinc-50 hover:text-[#C9A84C]'
            }`}
          >
            📖 Quem Somos
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-medium text-sm transition cursor-pointer ${
              (currentPage === 'atendimento' || currentPage === 'faq') && currentView === 'vitrine'
                ? 'bg-[#FAF5EA] text-[#C9A84C] font-bold border-l-4 border-[#C9A84C]'
                : 'text-zinc-800 hover:bg-zinc-50 hover:text-[#C9A84C]'
            }`}
          >
            💬 Atendimento, Trocas & FAQ
          </button>
          
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>WhatsApp: {storeConfig.formattedPhone}</span>
          </div>
        </div>
      )}
    </header>
  );
};
