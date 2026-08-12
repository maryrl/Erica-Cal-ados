import React, { useState } from 'react';
import { Product } from '../../types';
import { Star, ShoppingBag, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Calculate discount percentage if promo price exists
  const hasPromo = product.promotionalPrice && product.promotionalPrice < product.originalPrice;
  const discountPercent = hasPromo
    ? Math.round(((product.originalPrice - product.promotionalPrice!) / product.originalPrice) * 100)
    : 0;

  // Check total stock and low stock warnings
  const totalStock = product.variations.reduce(
    (acc, color) => acc + color.sizes.reduce((sAcc, s) => sAcc + s.stock, 0),
    0
  );

  const isLowStock = totalStock > 0 && totalStock <= 3;
  const isOutOfStock = totalStock === 0 || product.status === 'Esgotado';

  const displayPrice = hasPromo ? product.promotionalPrice! : product.originalPrice;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-[#F0EAE1] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => product.images.length > 1 && setCurrentImgIndex(1)}
      onMouseLeave={() => setCurrentImgIndex(0)}
    >
      {/* Top Badges Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isHotDeal && (
            <span className="bg-[#1A1A1A] text-[#DFBA61] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-[#DFBA61]/30">
              <Sparkles className="w-3 h-3 text-[#C9A84C]" />
              Imperdível
            </span>
          )}
          {hasPromo && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Low Stock Warning Badge */}
        {isLowStock && (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Poucas unidades!
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-zinc-800 text-zinc-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Esgotado
          </span>
        )}
      </div>

      {/* Image Container with Hover Zoom & Transition */}
      <div className="relative aspect-4/5 w-full bg-[#FAF8F5] overflow-hidden cursor-pointer" onClick={() => onSelectProduct?.(product)}>
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct?.(product);
            }}
            className="px-5 py-2.5 rounded-full bg-white/95 text-[#1A1A1A] text-xs font-semibold shadow-lg hover:bg-[#C9A84C] hover:text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Collection */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#8C6D21]">{product.category}</span>
            <span>{product.collection}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct?.(product)}
            className="font-serif font-bold text-base text-[#1A1A1A] hover:text-[#C9A84C] transition line-clamp-1 cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-[#C9A84C]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-[#C9A84C] text-[#C9A84C]'
                      : 'text-zinc-200 fill-zinc-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              {product.rating?.toFixed(1) || '5.0'} ({product.reviewCount || 12})
            </span>
          </div>

          {/* Color Swatches Preview */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">Cores:</span>
            {product.variations.map((v, idx) => (
              <span
                key={idx}
                title={v.colorName}
                className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs inline-block"
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#F5F0E6] flex items-center justify-between gap-2">
          <div>
            {hasPromo && (
              <span className="block text-xs text-zinc-400 line-through leading-none">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="font-serif text-lg font-bold text-[#1A1A1A]">
              R$ {displayPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            onClick={() => onSelectProduct?.(product)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'gold-gradient text-white hover:brightness-105 hover:scale-[1.03]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Esgotado' : 'Escolher Modelo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
