import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, MessageCircle, Play, X, Film } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick?: () => void;
  onExploreCollection?: () => void;
  onCategorySelect?: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onExploreCollection }) => {
  const handleExplore = onExploreClick || onExploreCollection || (() => {});
  const { siteContent, storeConfig } = useStore();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleWhatsAppDirect = () => {
    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de conhecer a nova coleção de calçados da ${storeConfig.storeName}!`)}`;
    window.open(url, '_blank');
  };

  const videoUrl = siteContent.heroVideoUrl;
  const mediaType = siteContent.heroMediaType || 'both';
  const isVideoDirect = videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.startsWith('data:video') || videoUrl.startsWith('blob:'));
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
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

            {/* Call to Action Buttons - Including Video CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 flex-wrap">
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-7 py-4 rounded-full gold-gradient text-white font-semibold text-base shadow-lg shadow-[#C9A84C]/20 hover:scale-[1.02] hover:shadow-xl transition flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{siteContent.heroButtonText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Video Button Next to CTA */}
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white border border-[#D8C28A] text-[#1A1A1A] hover:bg-[#FAF5EA] hover:border-[#C9A84C] font-semibold text-base transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1A1A1A] group-hover:bg-[#C9A84C] flex items-center justify-center text-white transition">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-[#DFBA61] group-hover:text-white" />
                  </div>
                  <span>{siteContent.heroVideoTitle || 'Assistir Vídeo'}</span>
                </button>
              )}

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white border border-[#D8C28A] text-[#1A1A1A] hover:text-[#C9A84C] hover:border-[#C9A84C] font-semibold text-base transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp</span>
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

          {/* Right Column: Hero Media (Image, Video, or Hybrid) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#DFBA61] via-[#C9A84C] to-[#9E7D2E] opacity-30 blur-md transform rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                {mediaType === 'video' && videoUrl ? (
                  <div className="relative w-full h-[460px] lg:h-[520px] bg-black">
                    {isYouTube ? (
                      <iframe
                        src={getYouTubeEmbedUrl(videoUrl)}
                        title="Vídeo de Apresentação"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={siteContent.heroImage}
                      alt="Coleção Donna Érica Calçados"
                      className="w-full h-[460px] lg:h-[520px] object-cover object-center transform hover:scale-105 transition duration-700"
                    />

                    {/* Floating Video Overlay Button if Video Exists */}
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(true)}
                        className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition flex flex-col items-center justify-center gap-2 text-white p-4 cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md text-[#1A1A1A] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-white transition">
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </div>
                        <span className="bg-black/60 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-[#DFBA61]" />
                          <span>{siteContent.heroVideoTitle || 'Assistir Vídeo da Coleção'}</span>
                        </span>
                      </button>
                    )}

                    {/* Floating Product Badge overlay */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E8DFC8] shadow-lg flex items-center justify-between pointer-events-none">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">
                          Destaque da Semana
                        </span>
                        <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                          Coleção Exclusiva Donna Érica
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400">Edição Limitada</span>
                        <div className="text-base font-bold text-[#9E7D2E]">A partir de R$ 99,90</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Fullscreen/Modal Video Player */}
      {showVideoModal && videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#C9A84C]/40 shadow-2xl space-y-3 p-4 sm:p-6">
            <div className="flex items-center justify-between text-white border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#DFBA61]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#DFBA61]">
                  {siteContent.heroVideoTitle || 'Vídeo de Apresentação da Coleção'}
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              {isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoUrl)}
                  title="Vídeo de Apresentação"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-zinc-300">
              <span>Conheça os detalhes artesanais e o caimento perfeito dos calçados Donna Érica.</span>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  handleExplore();
                }}
                className="px-5 py-2.5 rounded-full gold-gradient text-white font-bold flex items-center gap-2 shadow-md cursor-pointer shrink-0"
              >
                <span>Ver Produtos no Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
