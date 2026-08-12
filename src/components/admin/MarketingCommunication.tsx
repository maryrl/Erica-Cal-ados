import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  Users,
  Cake,
  Gift,
  FileText,
  BarChart2,
  CheckCircle2
} from 'lucide-react';

export const MarketingCommunication: React.FC = () => {
  const {
    waTemplates,
    emailCampaigns,
    sendWhatsAppBroadcast,
    sendEmailCampaign,
    clients,
    storeConfig
  } = useStore();

  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');

  // WhatsApp Broadcast state
  const [targetSegment, setTargetSegment] = useState('Aniversariantes do Mês');
  const [broadcastMessage, setBroadcastMessage] = useState(
    `Olá {NOME}! 🎂✨ A equipe ${storeConfig.storeName} tem um presente especial para você neste mês de aniversário: 15% OFF + Frete Grátis na compra do seu próximo calçado! Responda essa mensagem para garantir a sua numeração. 👠`
  );

  // Email Campaign State
  const [emailTitle, setEmailTitle] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendWA = () => {
    if (!broadcastMessage.trim()) return;
    sendWhatsAppBroadcast(targetSegment, broadcastMessage);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTitle.trim() || !emailSubject.trim()) return;

    sendEmailCampaign({
      title: emailTitle.trim(),
      subject: emailSubject.trim(),
      content: emailBody.trim(),
      targetSegment: 'Todos os Clientes'
    });

    setEmailTitle('');
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Comunicação e Disparos (WhatsApp & E-mail)
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Envio de campanhas segmentadas, felicitações automáticas e e-mail marketing.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-zinc-200">
          <button
            onClick={() => setActiveChannel('whatsapp')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeChannel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:text-black'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Marketing</span>
          </button>
          <button
            onClick={() => setActiveChannel('email')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeChannel === 'email' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>E-mail Marketing</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP MARKETING SECTION */}
      {activeChannel === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
              <span>Disparo em Massa via WhatsApp</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Selecione o Grupo / Segmento:</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="Aniversariantes do Mês">🎂 Aniversariantes do Mês</option>
                  <option value="Clientes Inativas (+30 dias)">⏳ Clientes Inativas (+30 dias sem pedido)</option>
                  <option value="Clientes VIPs">👑 Clientes VIPs (Alto VGV)</option>
                  <option value="Compradoras de Salto 37">👠 Fãs de Numeração 37</option>
                  <option value="Todas as Clientes">👥 Toda a Base Cadastrada ({clients.length})</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Mensagem do Disparo:</label>
                <textarea
                  rows={5}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-sans"
                />
                <span className="text-[11px] text-zinc-400 block mt-1">
                  Variáveis automáticas disponíveis: <code>{"{NOME}"}</code>, <code>{"{TAMANHO}"}</code>, <code>{"{LOJA}"}</code>
                </span>
              </div>

              <button
                onClick={handleSendWA}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Iniciar Disparo para {targetSegment}</span>
              </button>
            </div>
          </div>

          {/* Right Templates List */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Templates de Mensagem Pré-Configurados
            </h3>

            <div className="space-y-3">
              {waTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setBroadcastMessage(tpl.templateText)}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200 hover:border-[#C9A84C] transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-serif font-bold text-xs text-[#1A1A1A] group-hover:text-[#9E7D2E]">
                      {tpl.title}
                    </strong>
                    <span className="text-[10px] text-zinc-400 font-medium">{tpl.triggerEvent}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 line-clamp-2 italic">
                    "{tpl.templateText}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* EMAIL MARKETING SECTION */}
      {activeChannel === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Campaign */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Criador de E-mail Marketing / Newsletter
            </h3>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Título Interno da Campanha *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lançamento Primavera 2026"
                  value={emailTitle}
                  onChange={(e) => setEmailTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Assunto do E-mail (Subject Line) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ✨ Descubra em primeira mão os novos modelos banhados a ouro!"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Conteúdo da Newsletter</label>
                <textarea
                  rows={6}
                  placeholder="Escreva a mensagem e a oferta da newsletter..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full gold-gradient text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Disparar Campanha de E-mail
              </button>
            </form>
          </div>

          {/* Email Campaigns Metrics */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#C9A84C]" />
              <span>Histórico & Métricas de Abertura</span>
            </h3>

            <div className="space-y-3">
              {emailCampaigns.map((camp) => (
                <div key={camp.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-serif font-bold text-xs text-[#1A1A1A]">{camp.title}</strong>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mb-2">{camp.subject}</p>

                  <div className="flex items-center gap-4 text-[10px] text-zinc-600 pt-2 border-t border-zinc-200 font-semibold">
                    <span>Aberturas: <strong className="text-emerald-700">{camp.openRate}%</strong></span>
                    <span>Cliques: <strong className="text-blue-700">{camp.clickRate}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
