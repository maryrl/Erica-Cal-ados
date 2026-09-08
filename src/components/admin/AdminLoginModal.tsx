import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, KeyRound, ShieldCheck, X, Sparkles, Loader2 } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { supabase } from '../../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, setCurrentView, storeConfig } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await loginAdmin(email, password);
    setIsLoading(false);
    if (success) {
      setCurrentView('admin');
      onClose();
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
      redirectTo: window.location.origin + '/admin',
    });
    setIsLoading(false);

    if (!error) {
      setRecoverySent(true);
    } else {
      alert('Erro ao enviar e-mail: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] text-white w-full max-w-md rounded-3xl p-8 shadow-2xl border-2 border-[#C9A84C]/40 relative animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <img
            src={storeConfig.logoUrl || logoImg}
            alt={storeConfig.storeName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A84C] bg-white mx-auto mb-3 shadow-lg"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Painel Administrativo CRM
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Acesso restrito para gestão da loja {storeConfig.storeName}
          </p>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C9A84C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2B2823] border border-[#3D382F] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#C9A84C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2B2823] border border-[#3D382F] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('recovery');
                  setRecoverySent(false);
                }}
                className="text-[#DFBA61] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full gold-gradient text-white font-bold text-xs shadow-lg shadow-[#C9A84C]/20 hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isLoading ? 'Verificando...' : 'Entrar no Painel CRM'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecoverySubmit} className="space-y-4">
            {recoverySent ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center text-xs text-emerald-200 space-y-2">
                <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold">E-mail de recuperação enviado!</p>
                <p>Verifique a caixa de entrada de {recoveryEmail} para redefinir sua senha.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="mt-2 text-xs text-[#DFBA61] font-bold underline"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-400">
                  Informe seu e-mail cadastrado no Supabase Auth.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Seu E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2B2823] border border-[#3D382F] text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full gold-gradient text-white font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-zinc-400 hover:text-white underline"
                  >
                    Voltar para o Login
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};