import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Sparkles, Flame, Tag, ArrowRight } from 'lucide-react';

interface PromotionsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onSelectProduct }) => {
  const { products } = useStore();

  const hotDeals = products.filter(
    (p) => p.isHotDeal || (p.promotionalPrice && p.promotionalPrice < p.originalPrice)
  );

  if (hotDeals.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-[#1A1A1A] to-[#2B2823] text-white overflow-hidden relative">
      {/* Background Decorative Gold Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#3D382F] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFBA61] text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-[#DFBA61]" />
              <span>Oportunidades Especiais</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Promoções Imperdíveis
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Descontos de até 30% OFF em modelos selecionados da temporada.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#DFBA61] font-semibold bg-[#3D382F] px-3 py-1.5 rounded-lg border border-[#C9A84C]/30 inline-block">
              ⏳ Estoque Limitado — Garanta a sua numeração!
            </span>
          </div>
        </div>

        {/* Promo Products Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotDeals.slice(0, 3).map((product) => {
            const hasPromo = product.promotionalPrice && product.promotionalPrice < product.originalPrice;
            const discountPercent = hasPromo
              ? Math.round(((product.originalPrice - product.promotionalPrice!) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct?.(product)}
                className="group cursor-pointer bg-[#24211C] rounded-2xl p-4 border border-[#3D382F] hover:border-[#C9A84C] transition duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-900 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>-{discountPercent}% OFF</span>
                    </div>
                  </div>

                  {/* Title & info */}
                  <span className="text-[10px] text-[#C9A84C] uppercase font-bold tracking-widest">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-bold text-base text-white group-hover:text-[#DFBA61] transition line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 mt-4 border-t border-[#3D382F] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500 line-through block">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#DFBA61]">
                      R$ {(product.promotionalPrice || product.originalPrice).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button className="px-4 py-2 rounded-full gold-gradient text-white text-xs font-bold flex items-center gap-1.5 shadow-md group-hover:scale-105 transition">
                    <span>Aproveitar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
