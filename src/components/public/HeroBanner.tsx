import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, MessageCircle } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick?: () => void;
  onExploreCollection?: () => void;
  onCategorySelect?: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onExploreCollection, onCategorySelect }) => {
  const handleExplore = onExploreClick || onExploreCollection || (() => {});
  const { siteContent, storeConfig } = useStore();

  const handleWhatsAppDirect = () => {
    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de conhecer a nova coleção de calçados da ${storeConfig.storeName}!`)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] py-12 lg:py-20 border-b border-[#F0EAE1]">
      {/* Decorative Gold Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C9A84C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8DFC8] shadow-xs text-xs font-semibold text-[#8C6D21]">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span className="uppercase tracking-wider">Coleção Exclusiva Primavera/Verão</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
              {siteContent.heroTitle.split(' ').map((word, idx) => (
                <span key={idx}>
                  {word.toLowerCase().includes('elegância') || word.toLowerCase().includes('conforto') ? (
                    <span className="gold-gradient-text italic font-normal"> {word} </span>
                  ) : (
                    ` ${word}`
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {siteContent.heroSubtitle}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-8 py-4 rounded-full gold-gradient text-white font-semibold text-base shadow-lg shadow-[#C9A84C]/20 hover:scale-[1.02] hover:shadow-xl transition flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{siteContent.heroButtonText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white border border-[#D8C28A] text-[#1A1A1A] hover:text-[#C9A84C] hover:border-[#C9A84C] font-semibold text-base transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Atendimento no WhatsApp</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-8 border-t border-[#EFE8DA] grid grid-cols-3 gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif font-bold text-xl text-[#1A1A1A]">100%</span>
                <span className="text-xs text-zinc-500 font-medium">Couro Nobre</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-[#EFE8DA] px-2">
                <span className="font-serif font-bold text-xl text-[#C9A84C]">+10.000</span>
                <span className="text-xs text-zinc-500 font-medium">Clientes Felizes</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif font-bold text-xl text-[#1A1A1A]">24h</span>
                <span className="text-xs text-zinc-500 font-medium">Postagem Rápida</span>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#DFBA61] via-[#C9A84C] to-[#9E7D2E] opacity-30 blur-md transform rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src={siteContent.heroImage}
                  alt="Coleção Aurélia Calçados"
                  className="w-full h-[460px] lg:h-[520px] object-cover object-center transform hover:scale-105 transition duration-700"
                />

                {/* Floating Badge overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E8DFC8] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">
                      Destaque da Semana
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                      Scarpin Dourado Salto Fino
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 line-through">R$ 389,90</span>
                    <div className="text-base font-bold text-[#9E7D2E]">R$ 299,90</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
