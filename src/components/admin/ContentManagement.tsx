import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  MessageSquare
} from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const {
    siteContent,
    updateSiteContent,
    reviews,
    approveReview
  } = useStore();

  const [heroTitle, setHeroTitle] = useState(siteContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent.heroSubtitle);
  const [heroButtonText, setHeroButtonText] = useState(siteContent.heroButtonText);
  const [heroImage, setHeroImage] = useState(siteContent.heroImage);
  const [announcementBarText, setAnnouncementBarText] = useState(siteContent.announcementBarText);
  const [aboutHistory, setAboutHistory] = useState(siteContent.aboutHistory);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent({
      heroTitle,
      heroSubtitle,
      heroButtonText,
      heroImage,
      announcementBarText,
      aboutHistory
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Gestão do Conteúdo do Site (CMS)
        </h2>
        <p className="text-zinc-500 text-xs mt-0.5">
          Edite slogans, banners principais, barra de avisos e modere avaliações de clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Banners & Texts */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-6">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
            Editar Banners e Textos da Home
          </h3>

          <form onSubmit={handleSaveCMS} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Barra de Aviso no Topo (Announcement Bar)
              </label>
              <input
                type="text"
                value={announcementBarText}
                onChange={(e) => setAnnouncementBarText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Título Principal do Hero Banner
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 font-bold"
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
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Texto do Botão CTA</label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">URL Imagem do Hero</label>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>
            </div>

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
              className="w-full py-3.5 rounded-full gold-gradient text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Conteúdo</span>
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
