import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Check, MessageCircle, Sparkles, AlertCircle, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';

interface WhatsAppOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({ product, onClose }) => {
  const { storeConfig, createOrder, showToast } = useStore();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Set default color variation when product opens
  useEffect(() => {
    if (product && product.variations.length > 0) {
      setSelectedColor(product.variations[0].colorName);
      // Auto-select first size in stock
      const firstInStock = product.variations[0].sizes.find((s) => s.stock > 0);
      setSelectedSize(firstInStock ? firstInStock.size : 36);
    }
    setCurrentImageIndex(0);
    setNotes('');
  }, [product]);

  if (!product) return null;

  // Find active variation object
  const activeVariation = product.variations.find((v) => v.colorName === selectedColor) || product.variations[0];

  // Stock for current selected size
  const selectedSizeStockObj = activeVariation?.sizes.find((s) => s.size === selectedSize);
  const sizeStock = selectedSizeStockObj ? selectedSizeStockObj.stock : 0;

  const displayPrice = product.promotionalPrice && product.promotionalPrice < product.originalPrice
    ? product.promotionalPrice
    : product.originalPrice;

  // Format date nicely e.g. 09/08/2026 13:45
  const formattedDate = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate automated WhatsApp message format strictly as specified
  const generatedMessage = `📋 *PEDIDO - ${storeConfig.storeName}*
👠 *Produto:* ${product.name}
🎨 *Cor:* ${selectedColor || 'Não informada'}
📏 *Numeração:* ${selectedSize ? selectedSize : 'Não informada'}
👤 *Cliente:* ${clientName || 'Não informado'}
📝 *Observação:* ${notes.trim() || 'Sem observações'}
📅 *Data:* ${formattedDate}

Olá! Gostaria de finalizar a compra. 😊`;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSize) {
      showToast('Por favor, selecione a numeração do calçado.', 'error');
      return;
    }

    if (!clientName.trim()) {
      showToast('Por favor, informe seu nome para o pedido.', 'error');
      return;
    }

    if (sizeStock === 0) {
      showToast('Infelizmente essa numeração está esgotada nesta cor.', 'error');
      return;
    }

    // 1. Create order record in CRM
    createOrder({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '(11) 99999-9999',
      item: {
        productId: product.id,
        productName: product.name,
        category: product.category,
        color: selectedColor,
        size: selectedSize,
        price: displayPrice,
        image: product.images[0]
      },
      notes: notes.trim() || 'Sem observações',
      status: 'Aguardando'
    });

    // 2. Open WhatsApp link with prefilled text
    const cleanPhone = storeConfig.whatsappNumber.replace(/\D/g, '');
    const encodedText = encodeURIComponent(generatedMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-[#E8DFC8] my-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-black flex items-center justify-center shadow-md transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[88vh] overflow-y-auto">
          
          {/* Left Column: Image gallery */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#F0EAE1]">
            <div className="w-full">
              {/* Primary Selected Image */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-white shadow-md border border-[#E8DFC8] mb-3">
                <img
                  src={product.images[currentImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.isHotDeal && (
                  <span className="absolute top-3 left-3 bg-[#1A1A1A] text-[#DFBA61] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-[#DFBA61]/30">
                    <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                    Oferta Especial
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              {product.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        currentImageIndex === idx ? 'border-[#C9A84C] scale-105 shadow-2xs' : 'border-zinc-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description note */}
            <div className="w-full mt-4 p-4 rounded-xl bg-white border border-[#F0EAE1] text-xs text-zinc-600">
              <span className="font-bold text-[#1A1A1A] block mb-1">Detalhes do Produto:</span>
              <p className="line-clamp-3 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Right Column: Specifications & WhatsApp Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Product Header */}
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#C9A84C]">
                  {product.category} • {product.collection}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-0.5">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-serif text-2xl font-bold text-[#9E7D2E]">
                    R$ {displayPrice.toFixed(2).replace('.', ',')}
                  </span>
                  {product.promotionalPrice && (
                    <span className="text-xs text-zinc-400 line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Em Estoque
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  1. Selecione a Cor: <span className="text-[#C9A84C]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variations.map((v) => (
                    <button
                      key={v.colorName}
                      type="button"
                      onClick={() => {
                        setSelectedColor(v.colorName);
                        // Auto update size selection if current size out of stock
                        const currentSizeObj = v.sizes.find((s) => s.size === selectedSize);
                        if (!currentSizeObj || currentSizeObj.stock === 0) {
                          const available = v.sizes.find((s) => s.stock > 0);
                          if (available) setSelectedSize(available.size);
                        }
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedColor === v.colorName
                          ? 'border-[#C9A84C] bg-[#FAF8F5] text-[#1A1A1A] ring-2 ring-[#C9A84C]/30 shadow-2xs'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs inline-block"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector (33 to 42) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    2. Selecione a Numeração (33 ao 42):
                  </label>
                  {selectedSize && (
                    <span className={`text-[11px] font-semibold ${sizeStock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {sizeStock > 0 ? `${sizeStock} un. disponíveis` : 'Esgotado nesta cor'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {activeVariation?.sizes.map((s) => {
                    const isAvailable = s.stock > 0;
                    const isSelected = selectedSize === s.size;

                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(s.size)}
                        className={`h-10 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border cursor-pointer relative ${
                          isSelected
                            ? 'gold-gradient text-white border-[#C9A84C] shadow-md scale-105'
                            : isAvailable
                            ? 'bg-white text-zinc-800 border-zinc-200 hover:border-[#C9A84C]'
                            : 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{s.size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="pt-2 border-t border-[#F0EAE1] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Seu WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (11) 99999-8888"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Observações (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Embalar para presente, dúvida sobre frete..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Automatic Message Format Preview Box */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-[11px] text-zinc-700 font-mono space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#9E7D2E] tracking-wider mb-1 font-sans">
                  📱 Prévia da mensagem gerada para o WhatsApp:
                </div>
                <div className="whitespace-pre-wrap leading-tight text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200">
                  {generatedMessage}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!selectedSize || sizeStock === 0}
                className={`w-full py-4 rounded-full font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  !selectedSize || sizeStock === 0
                    ? 'bg-zinc-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 hover:scale-[1.01]'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Pedido pelo WhatsApp</span>
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
