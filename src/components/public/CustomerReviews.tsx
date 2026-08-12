import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, MessageSquarePlus, CheckCircle2, Quote, X } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { reviews, products, addReview, storeConfig } = useStore();

  const approvedReviews = reviews.filter((r) => r.approved);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    const prod = products.find((p) => p.id === selectedProductId);

    addReview({
      productId: selectedProductId,
      productName: prod ? prod.name : `Calçado ${storeConfig.storeName}`,
      clientName: clientName.trim(),
      rating,
      comment: comment.trim()
    });

    setClientName('');
    setComment('');
    setModalOpen(false);
  };

  return (
    <section className="py-16 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              Depoimentos Reais
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
              Avaliações das Nossas Clientes
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Veja o que quem já usa {storeConfig.storeName} diz sobre o conforto e acabamento.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-white border border-[#D8C28A] text-[#1A1A1A] hover:border-[#C9A84C] hover:text-[#C9A84C] font-semibold text-xs transition flex items-center gap-2 shadow-2xs self-start md:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#C9A84C]" />
            <span>Enviar Minha Avaliação</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[#F0EAE1] shadow-xs hover:shadow-md transition flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-[#C9A84C]/20 absolute top-4 right-4" />
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#C9A84C] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-zinc-200 fill-zinc-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5F0E6] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                    <span>{rev.clientName}</span>
                    <span title="Compradora Verificada"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></span>
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{rev.productName}</span>
                </div>
                <span className="text-[10px] text-zinc-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-[#E8DFC8]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-1">
              Avaliar um Calçado {storeConfig.storeName}
            </h3>
            <p className="text-zinc-500 text-xs mb-4">
              Sua opinião ajuda outras clientes a encontrarem o modelo perfeito!
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Qual modelo você comprou?
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-800 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Clara"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Sua Nota (1 a 5 estrelas)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Seu Comentário</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Conte-nos sobre o conforto, acabamento e entrega..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full gold-gradient text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
