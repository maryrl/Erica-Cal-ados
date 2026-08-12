import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#1A1A1A]/95 text-white border-[#C9A84C]/50 shadow-[#C9A84C]/10'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/50'
              : 'bg-zinc-900/95 text-zinc-100 border-amber-500/30'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
