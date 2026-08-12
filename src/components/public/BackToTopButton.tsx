import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#1A1A1A] text-[#DFBA61] border border-[#C9A84C]/40 shadow-xl hover:bg-[#2A2A2A] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="sr-only">Voltar ao topo</span>
    </button>
  );
};
