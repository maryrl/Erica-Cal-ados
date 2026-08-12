import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product } from './types';

// Public Components
import { Header } from './components/public/Header';
import { HeroBanner } from './components/public/HeroBanner';
import { ProductGrid } from './components/public/ProductGrid';
import { WhatsAppOrderModal } from './components/public/WhatsAppOrderModal';
import { PromotionsSection } from './components/public/PromotionsSection';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { CustomerReviews } from './components/public/CustomerReviews';
import { InstitutionalPages } from './components/public/InstitutionalPages';
import { FloatingWhatsAppButton } from './components/public/FloatingWhatsAppButton';
import { BackToTopButton } from './components/public/BackToTopButton';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainApp: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isAdminLoggedIn,
    siteContent,
    activePublicPage,
    setActivePublicPage,
    setSelectedCategoryFilter,
    selectedCategoryFilter
  } = useStore();

  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Auto detect ?admin or #admin in URL, or keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const handleUrlCheck = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (search.includes('admin') || hash.includes('admin')) {
        if (isAdminLoggedIn) {
          setCurrentView('admin');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    handleUrlCheck();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setCurrentView(currentView === 'admin' ? 'vitrine' : 'admin');
        } else {
          setIsAdminLoginModalOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminLoggedIn, currentView, setCurrentView]);

  const handleNavClick = (page: string) => {
    setActivePublicPage(page);
    if (page === 'promocoes') {
      setSelectedCategoryFilter('Promoções');
    } else if (page === 'catalogo' || page === 'home') {
      setSelectedCategoryFilter('Todas');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategoryFilter(category);
    setActivePublicPage('catalogo');
    setTimeout(() => {
      const catalogEl = document.getElementById('catalogo-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenOrderModal = (product: Product) => {
    setSelectedProductForOrder(product);
  };

  // Render Admin Panel View
  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer />
        <AdminLayout
          onPreviewProductFromAdmin={(product) => {
            setSelectedProductForOrder(product);
          }}
        />
        {selectedProductForOrder && (
          <WhatsAppOrderModal
            product={selectedProductForOrder}
            onClose={() => setSelectedProductForOrder(null)}
          />
        )}
      </>
    );
  }

  // Render Public Vitrine View
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 flex flex-col selection:bg-[#C9A84C] selection:text-white">
      <ToastContainer />

      {/* Top Announcement Bar */}
      <div className="bg-[#1A1A1A] text-[#DFBA61] text-[11px] py-1.5 px-4 text-center font-semibold tracking-wider border-b border-[#C9A84C]/20 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
        <span>{siteContent.announcementBarText}</span>
      </div>

      {/* Main Header */}
      <Header
        activePage={activePublicPage}
        onNavClick={handleNavClick}
        onSecretAdminTrigger={() => setIsAdminLoginModalOpen(true)}
      />

      {/* PAGE ROUTING */}
      <main className="flex-1">
        {activePublicPage === 'home' && (
          <>
            <HeroBanner
              onExploreCollection={() => handleNavClick('catalogo')}
              onCategorySelect={handleCategorySelect}
            />

            <PromotionsSection onSelectProduct={handleOpenOrderModal} />

            <div id="catalogo-section">
              <ProductGrid
                selectedCategory={selectedCategoryFilter}
                onSelectCategory={setSelectedCategoryFilter}
                onSelectProduct={handleOpenOrderModal}
                onOpenOrderModal={handleOpenOrderModal}
              />
            </div>

            <WhyChooseUs />

            <CustomerReviews />
          </>
        )}

        {activePublicPage === 'catalogo' && (
          <div className="pt-8">
            <ProductGrid
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={setSelectedCategoryFilter}
              onSelectProduct={handleOpenOrderModal}
              onOpenOrderModal={handleOpenOrderModal}
            />
          </div>
        )}

        {activePublicPage === 'promocoes' && (
          <div className="pt-8 space-y-8">
            <PromotionsSection onSelectProduct={handleOpenOrderModal} />
            <ProductGrid
              selectedCategory="Promoções"
              onSelectCategory={setSelectedCategoryFilter}
              onSelectProduct={handleOpenOrderModal}
              onOpenOrderModal={handleOpenOrderModal}
            />
          </div>
        )}

        {['quem-somos', 'trocas', 'pagamento', 'entrega', 'privacidade', 'atendimento'].includes(
          activePublicPage
        ) && (
          <InstitutionalPages
            activeTab={activePublicPage}
            pageType={activePublicPage}
            onTabChange={handleNavClick}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </main>

      {/* Floating Elements & Footer */}
      <FloatingWhatsAppButton />
      <BackToTopButton />

      <Footer
        onNavClick={handleNavClick}
      />

      {/* MODALS */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />

      {selectedProductForOrder && (
        <WhatsAppOrderModal
          product={selectedProductForOrder}
          onClose={() => setSelectedProductForOrder(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
