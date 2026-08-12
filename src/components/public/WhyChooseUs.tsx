import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Gem, Truck, RefreshCw, MessageSquareHeart } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { storeConfig } = useStore();

  const differentials = [
    {
      icon: <Gem className="w-8 h-8 text-[#C9A84C]" />,
      title: 'Qualidade Premium',
      description: 'Couro 100% legítimo e materiais nobres selecionados com acabamento feito à mão.'
    },
    {
      icon: <Truck className="w-8 h-8 text-[#C9A84C]" />,
      title: 'Envio Rápido e Seguro',
      description: 'Pedidos despachados em até 24h com embalagem especial e código de rastreamento.'
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#C9A84C]" />,
      title: 'Troca Descomplicada',
      description: 'Garantia total de satisfação. Primeira troca inteiramente grátis em até 30 dias.'
    },
    {
      icon: <MessageSquareHeart className="w-8 h-8 text-[#C9A84C]" />,
      title: 'Consultoria de Numeração',
      description: 'Suporte exclusivo no WhatsApp para ajudar você a escolher o tamanho perfeito.'
    }
  ];

  return (
    <section className="py-16 bg-[#FFFFFF] border-y border-[#F0EAE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
            A Experiência {storeConfig.storeName}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
            Por Que Nos Escolher?
          </h2>
          <div className="w-12 h-0.5 gold-gradient mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F0EAE1] hover:border-[#C9A84C] hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#E8DFC8] flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
