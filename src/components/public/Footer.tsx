import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, Mail, Instagram, Clock, Navigation, ExternalLink, Compass } from 'lucide-react';
import logoImg from '../../assets/images/donna_erica_logo_1786503502716.jpg';

interface FooterProps {
  onNavClick: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const { storeConfig } = useStore();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Rua Lavras da Mangabeira, 1339 - Seminário, Crato - CE'
  )}`;

  return (
    <footer className="bg-[#1A1A1A] text-zinc-300 pt-16 pb-8 border-t-4 gold-border-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#332F28]">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={storeConfig.logoUrl || logoImg}
                alt={storeConfig.storeName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A84C]/50 shadow-md bg-white"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                {storeConfig.storeName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Boutique especializada em calçados femininos com acabamento premium, conforto e elegância. Venha nos visitar ou faça seu pedido com atendimento humanizado no WhatsApp.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://instagram.com/${storeConfig.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2B2823] border border-[#3D382F] hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#DFBA61] uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('home')} className="hover:text-[#DFBA61] transition">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('catalogo')} className="hover:text-[#DFBA61] transition">
                  Coleção Completa
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('promocoes')} className="hover:text-[#DFBA61] transition">
                  Promoções
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('quem-somos')} className="hover:text-[#DFBA61] transition">
                  Quem Somos
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('trocas')} className="hover:text-[#DFBA61] transition">
                  Trocas & Devoluções
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('atendimento')} className="hover:text-[#DFBA61] transition">
                  Atendimento (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Nossa Loja & Horários */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#DFBA61] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              Nossa Loja
            </h4>
            
            <div className="space-y-3 text-xs text-zinc-300">
              {/* Address */}
              <div className="bg-[#24211C] p-3 rounded-xl border border-[#38332A]">
                <p className="font-semibold text-white mb-0.5">Endereço Loja Física:</p>
                <p className="text-zinc-300 leading-snug">
                  Rua Lavras da Mangabeira, 1339 - Seminário, Crato-CE
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#332B1E] text-[#E0C068] font-medium text-[11px] border border-[#52442B]">
                  📍 Próximo a Grendene
                </span>
              </div>

              {/* Hours */}
              <div className="space-y-1.5 pt-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                  Horário de Funcionamento:
                </p>
                <ul className="space-y-1 text-[11px] text-zinc-400 pl-5 list-disc">
                  <li><strong className="text-zinc-200">Seg a sexta:</strong> 09h às 12h e 14h às 18h</li>
                  <li><strong className="text-zinc-200">Sábado:</strong> 09h às 12h</li>
                </ul>
              </div>

              {/* Contacts */}
              <div className="pt-2 border-t border-[#332F28] space-y-1 text-xs">
                <p className="flex items-center gap-2 text-zinc-400">
                  <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>{storeConfig.formattedPhone}</span>
                </p>
                <p className="flex items-center gap-2 text-zinc-400">
                  <Mail className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                  <span>{storeConfig.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Demonstração do Mapa */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#DFBA61] uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9A84C]" />
              Localização no Mapa
            </h4>

            {/* Embedded Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[#3D382F] bg-[#24211C] shadow-lg group">
              <iframe
                title="Mapa da Loja Donna Érica Calçados"
                src="https://maps.google.com/maps?q=Rua+Lavras+da+Mangabeira+1339+Seminario+Crato+CE&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="150"
                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-36 rounded-t-xl"
              />

              <div className="p-3 bg-[#1F1C18] border-t border-[#38332A] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-white block">Donna Érica Calçados</span>
                  <span className="text-[10px] text-zinc-400 block">Crato-CE • Próximo a Grendene</span>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg gold-gradient text-white font-semibold text-[11px] shadow-sm hover:brightness-110 transition flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 fill-white" />
                  <span>Como Chegar</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {storeConfig.storeName} — CNPJ {storeConfig.cnpj}. Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  );
};
