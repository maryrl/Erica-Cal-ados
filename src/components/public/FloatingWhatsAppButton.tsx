import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const FloatingWhatsAppButton: React.FC = () => {
  const { storeConfig } = useStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleOpenWhatsApp = (msgText?: string) => {
    const textToSend = msgText || customMsg || 'Olá! Gostaria de ajuda para escolher um calçado.';
    const cleanPhone = storeConfig.whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setChatOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Quick Chat Popup */}
      {chatOpen && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1A1A1A] p-4 text-white flex items-center justify-between border-b border-[#C9A84C]/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={storeConfig.logoUrl || logoImg}
                  alt={storeConfig.storeName}
                  className="w-10 h-10 rounded-full object-cover border border-[#C9A84C] bg-white"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1A1A1A]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Consultoria {storeConfig.storeName}</h4>
                <span className="text-[10px] text-emerald-400 font-medium">Online no WhatsApp</span>
              </div>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF8F5] space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs border border-zinc-200 text-xs text-zinc-700">
              Olá! 👋 Como posso te ajudar a escolher o calçado ideal hoje?
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => handleOpenWhatsApp('Olá! Gostaria de saber sobre a numeração dos calçados.')}
                className="w-full text-left text-xs p-2 rounded-xl bg-white hover:bg-[#F5EFE4] border border-zinc-200 text-zinc-700 transition"
              >
                📏 Dúvida sobre numeração
              </button>
              <button
                onClick={() => handleOpenWhatsApp('Olá! Gostaria de saber sobre o prazo de entrega.')}
                className="w-full text-left text-xs p-2 rounded-xl bg-white hover:bg-[#F5EFE4] border border-zinc-200 text-zinc-700 transition"
              >
                🚚 Consultar prazo de entrega
              </button>
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenWhatsApp()}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:border-[#C9A84C]"
              />
              <button
                onClick={() => handleOpenWhatsApp()}
                className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulsating Trigger Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-2xl hover:bg-emerald-700 hover:scale-105 transition cursor-pointer"
        aria-label="Atendimento WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
        <MessageCircle className="w-6 h-6 shrink-0" />
        <span className="hidden sm:inline">Atendimento WhatsApp</span>
      </button>

    </div>
  );
};
