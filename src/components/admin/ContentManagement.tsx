import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  MessageSquare,
  Upload,
  Video,
  Play,
  Film,
  Trash2,
  Tv,
  Layers
} from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const {
    siteContent,
    updateSiteContent,
    reviews,
    approveReview,
    showToast
  } = useStore();

  const [heroTitle, setHeroTitle] = useState(siteContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent.heroSubtitle);
  const [heroButtonText, setHeroButtonText] = useState(siteContent.heroButtonText);
  const [heroImage, setHeroImage] = useState(siteContent.heroImage);
  const [heroVideoUrl, setHeroVideoUrl] = useState(siteContent.heroVideoUrl || '');
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video' | 'both'>(siteContent.heroMediaType || 'both');
  const [heroVideoTitle, setHeroVideoTitle] = useState(siteContent.heroVideoTitle || 'Assistir Vídeo da Coleção');
  const [announcementBarText, setAnnouncementBarText] = useState(siteContent.announcementBarText);
  const [aboutHistory, setAboutHistory] = useState(siteContent.aboutHistory);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle Image File Upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 10MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHeroImage(reader.result);
          showToast('Imagem carregada com sucesso!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Video File Upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        showToast('O vídeo deve ter no máximo 50MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHeroVideoUrl(reader.result);
          showToast('Vídeo enviado com sucesso!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent({
      heroTitle,
      heroSubtitle,
      heroButtonText,
      heroImage,
      heroVideoUrl,
      heroMediaType,
      heroVideoTitle,
      announcementBarText,
      aboutHistory
    });
    showToast('Conteúdo do site e mídias salvos com sucesso!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Gestão do Conteúdo e Mídias do Site (CMS)
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Personalize slogans, imagens e vídeos da tela inicial (Hero Banner) e modere avaliações de clientes.
          </p>
        </div>
        <div className="px-[#3.5] px-3.5 py-1.5 rounded-full bg-[#FAF5EA] border border-[#E8DFC8] text-xs font-bold text-[#9E7D2E] flex items-center gap-2">
          <Film className="w-4 h-4 text-[#C9A84C]" />
          <span>Suporte a Imagens & Vídeos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Banners, Images & Videos */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-6">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#C9A84C]" />
            <span>Editar Banners, Mídias e Textos da Home</span>
          </h3>

          <form onSubmit={handleSaveCMS} className="space-y-5 text-xs">
            
            {/* Announcement Bar */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Barra de Aviso no Topo (Announcement Bar)
              </label>
              <input
                type="text"
                value={announcementBarText}
                onChange={(e) => setAnnouncementBarText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-[#C9A84C] outline-none"
              />
            </div>

            {/* Hero Title & Subtitle */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
              <h4 className="font-bold text-[#C9A84C] text-xs uppercase tracking-wider">
                Textos do Hero Banner
              </h4>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Título Principal do Hero Banner
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 font-bold text-zinc-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Subtítulo do Hero Banner
                </label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Texto do Botão Principal (CTA)</label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white"
                />
              </div>
            </div>

            {/* Hero Image Management */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#C9A84C] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C9A84C]" />
                  <span>Imagem da Tela Inicial (Hero)</span>
                </label>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#C9A84C] transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagem do Dispositivo</span>
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 font-medium">Ou cole a URL da Imagem:</label>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white text-xs"
                />
              </div>

              {heroImage && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-300 shrink-0 bg-white shadow-xs">
                    <img src={heroImage} alt="Preview da Imagem" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    <p className="font-bold text-zinc-800">Preview da Imagem Carregada</p>
                    <p className="truncate max-w-xs">{heroImage.startsWith('data:') ? 'Imagem carregada via upload local' : heroImage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Video Management */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF5EA] border border-[#D8C28A]">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#8C6D21] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#C9A84C]" />
                  <span>Vídeo da Tela Inicial (Próximo ao CTA)</span>
                </label>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#8C6D21] text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#C9A84C] transition cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Vídeo do Dispositivo</span>
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Modo de Exibição das Mídias:</label>
                  <select
                    value={heroMediaType}
                    onChange={(e) => setHeroMediaType(e.target.value as 'image' | 'video' | 'both')}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C28A] bg-white text-xs font-bold text-zinc-800"
                  >
                    <option value="both">Imagem + Botão de Vídeo na CTA (Recomendado)</option>
                    <option value="video">Exibir Vídeo Diretamente no Banner</option>
                    <option value="image">Exibir Apenas Imagem Estática</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Título do Botão do Vídeo:</label>
                  <input
                    type="text"
                    value={heroVideoTitle}
                    onChange={(e) => setHeroVideoTitle(e.target.value)}
                    placeholder="Ex: Assistir Vídeo da Coleção"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C28A] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 font-medium">Ou cole a URL do Vídeo (MP4, WebM ou link do YouTube):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={heroVideoUrl}
                    onChange={(e) => setHeroVideoUrl(e.target.value)}
                    placeholder="https://exemplo.com/video.mp4 ou https://youtube.com/watch?v=..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#D8C28A] bg-white text-xs"
                  />
                  {heroVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setHeroVideoUrl('')}
                      className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition"
                      title="Remover vídeo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Videos Shortcut */}
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-500 font-medium">Exemplos Prontos:</span>
                <button
                  type="button"
                  onClick={() => {
                    setHeroVideoUrl('https://cdn.coverr.co/videos/coverr-fashion-model-walking-on-runway-5884/1080p.mp4');
                    showToast('Vídeo de demonstração de moda selecionado!', 'info');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 text-[10px] hover:border-[#C9A84C] font-semibold"
                >
                  Vídeo Moda 1 (MP4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroVideoUrl('');
                    showToast('Selecione um arquivo de vídeo do computador', 'info');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 text-[10px] hover:border-[#C9A84C] font-semibold"
                >
                  Limpar / Enviar Próprio
                </button>
              </div>

              {/* Video Live Preview Player */}
              {heroVideoUrl && (
                <div className="mt-2 p-3 rounded-xl bg-black/90 text-white space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#DFBA61] font-bold">
                    <span className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview do Vídeo Selecionado</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Pronto para a Home</span>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-zinc-800">
                    {heroVideoUrl.includes('youtube.com') || heroVideoUrl.includes('youtu.be') ? (
                      <iframe
                        src={heroVideoUrl}
                        className="w-full h-full border-0"
                        title="Preview YouTube"
                      />
                    ) : (
                      <video
                        src={heroVideoUrl}
                        controls
                        muted
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quem Somos */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Nossa História ("Quem Somos")</label>
              <textarea
                rows={4}
                value={aboutHistory}
                onChange={(e) => setAboutHistory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full gold-gradient text-white font-bold text-xs shadow-lg shadow-[#C9A84C]/20 hover:scale-[1.01] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações de Conteúdo, Imagem e Vídeo</span>
            </button>
          </form>
        </div>

        {/* Right Moderation: Reviews Approval */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C9A84C]" />
            <span>Moderação de Avaliações de Clientes</span>
          </h3>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-zinc-800">{rev.clientName}</strong>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rev.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.approved ? 'Aprovada' : 'Aguardando Moderador'}
                  </span>
                </div>

                <p className="text-zinc-600 italic">"{rev.comment}"</p>

                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{rev.productName}</span>
                  <div className="flex items-center gap-2">
                    {!rev.approved ? (
                      <button
                        onClick={() => approveReview(rev.id, true)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition"
                      >
                        Aprovar
                      </button>
                    ) : (
                      <button
                        onClick={() => approveReview(rev.id, false)}
                        className="px-3 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold text-[10px] hover:bg-rose-200 transition"
                      >
                        Ocultar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
