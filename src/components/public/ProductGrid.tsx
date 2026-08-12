import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryType } from '../../types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Sparkles, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  onSelectProduct?: (product: Product) => void;
  onOpenOrderModal?: (product: Product) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onSelectProduct,
  onOpenOrderModal,
  selectedCategory,
  onSelectCategory
}) => {
  const { products, selectedCategoryFilter, setSelectedCategoryFilter } = useStore();
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setScrollLeftPos(categoryScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoryScrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleSelectProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onOpenOrderModal) {
      onOpenOrderModal(product);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'orders'>('featured');

  const categories: CategoryType[] = ['Sandálias', 'Scarpin', 'Tênis', 'Botas', 'Rasteiras', 'Promoções'];
  const availableSizes = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42];

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryFilter !== 'Todas') {
        if (selectedCategoryFilter === 'Promoções') {
          if (!p.isHotDeal && (!p.promotionalPrice || p.promotionalPrice >= p.originalPrice)) {
            return false;
          }
        } else if (p.category !== selectedCategoryFilter) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesColor = p.variations.some((v) => v.colorName.toLowerCase().includes(query));
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesColor) return false;
      }

      // Size Filter
      if (selectedSizeFilter !== null) {
        const hasSizeWithStock = p.variations.some((v) =>
          v.sizes.some((s) => s.size === selectedSizeFilter && s.stock > 0)
        );
        if (!hasSizeWithStock) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = a.promotionalPrice || a.originalPrice;
        const priceB = b.promotionalPrice || b.originalPrice;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = a.promotionalPrice || a.originalPrice;
        const priceB = b.promotionalPrice || b.originalPrice;
        return priceB - priceA;
      }
      if (sortBy === 'orders') {
        return (b.orderCount || 0) - (a.orderCount || 0);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategoryFilter, searchQuery, selectedSizeFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategoryFilter('Todas');
    setSearchQuery('');
    setSelectedSizeFilter(null);
    setSortBy('featured');
  };

  return (
    <section id="catalogo-colecao" className="py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C9A84C]">
            Catálogo Online Exclusivo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-1">
            Escolha seu Calçado dos Sonhos
          </h2>
          <p className="text-zinc-500 text-sm mt-2">
            Selecione as especificações desejadas e receba seu pedido direto no WhatsApp da loja.
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="relative mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="flex absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#E8DFC8] shadow-md items-center justify-center text-zinc-700 hover:bg-[#F5EFE4] hover:text-[#C9A84C] transition cursor-pointer"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={categoryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-9 sm:px-3 no-scrollbar scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter('Todas')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shadow-2xs shrink-0 ${
                selectedCategoryFilter === 'Todas'
                  ? 'bg-[#1A1A1A] text-[#DFBA61] shadow-md border border-[#C9A84C]/40'
                  : 'bg-white text-zinc-700 hover:bg-[#F5EFE4] border border-[#E8DFC8]'
              }`}
            >
              Todas as Categorias
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5 ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#1A1A1A] text-[#DFBA61] shadow-md border border-[#C9A84C]/40'
                    : 'bg-white text-zinc-700 hover:bg-[#F5EFE4] border border-[#E8DFC8]'
                }`}
              >
                {cat === 'Promoções' && <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="flex absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#E8DFC8] shadow-md items-center justify-center text-zinc-700 hover:bg-[#F5EFE4] hover:text-[#C9A84C] transition cursor-pointer"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search, Size Filter & Sorting Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EAE1] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, cor, modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#C9A84C] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Size Filter Buttons (33 - 42) */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap mr-1">Tamanho:</span>
            {availableSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? null : sz)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center border cursor-pointer ${
                  selectedSizeFilter === sz
                    ? 'bg-[#C9A84C] text-white border-[#C9A84C] shadow-xs'
                    : 'bg-[#FAF8F5] text-zinc-700 border-zinc-200 hover:border-[#C9A84C]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#C9A84C] bg-white cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="orders">Mais Vendidos</option>
            </select>
            {(searchQuery || selectedSizeFilter !== null || selectedCategoryFilter !== 'Todas') && (
              <button
                onClick={resetFilters}
                className="p-2 text-zinc-500 hover:text-[#C9A84C] hover:bg-zinc-100 rounded-lg transition"
                title="Limpar Filtros"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <span>
            Exibindo <strong className="text-zinc-800">{filteredProducts.length}</strong> modelo(s) de calçados
          </span>
          {selectedSizeFilter && (
            <span className="bg-[#C9A84C]/15 text-[#8C6D21] px-2.5 py-1 rounded-full font-semibold">
              Filtro ativo: Tam {selectedSizeFilter}
            </span>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelectProduct={handleSelectProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8 max-w-md mx-auto">
            <Search className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-zinc-800">Nenhum calçado encontrado</h3>
            <p className="text-zinc-500 text-xs mt-1 mb-4">
              Tente alterar os filtros de numeração, categoria ou termo de busca.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 rounded-full gold-gradient text-white text-xs font-semibold shadow-sm"
            >
              Ver Todos os Calçados
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
