import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Client } from '../../types';
import {
  Users,
  Search,
  Plus,
  Crown,
  Cake,
  Heart,
  MessageCircle,
  Award,
  Calendar,
  X,
  Tag
} from 'lucide-react';

export const ClientCRM: React.FC = () => {
  const { clients, addClient, updateClient, storeConfig } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'vip' | 'inactive' | 'birthdays'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // New Client Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [preferredSize, setPreferredSize] = useState<number>(37);
  const [favoriteColor, setFavoriteColor] = useState('Dourado');
  const [notes, setNotes] = useState('');

  // Current month for birthdays
  const currentMonthNum = new Date().getMonth() + 1;

  const filteredClients = clients.filter((c) => {
    if (activeTab === 'vip' && !c.tags.includes('VIP')) return false;
    if (activeTab === 'inactive' && !c.tags.includes('Inativo')) return false;
    if (activeTab === 'birthdays') {
      if (!c.birthDate) return false;
      const birthMonth = parseInt(c.birthDate.split('-')[1], 10);
      if (birthMonth !== currentMonthNum) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      birthDate: birthDate || undefined,
      preferredSize,
      favoriteColor,
      notes: notes.trim() || undefined,
      tags: ['Novo']
    });
    setModalOpen(false);
  };

  const handleOpenWhatsAppClient = (client: Client, messageText?: string) => {
    const cleanPhone = client.phone.replace(/\D/g, '');
    const text = messageText || `Olá ${client.name}! ✨ Temos novidades incríveis na ${storeConfig.storeName} para você!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            CRM — Base e Relacionamento com Clientes
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Cadastro automático das compras do WhatsApp, preferências de numeração e clube de fidelidade.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-full gold-gradient text-white font-bold text-xs shadow-md hover:brightness-105 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Cliente</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Subtabs */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-[#1A1A1A] text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Todas ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('vip')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vip' ? 'bg-[#C9A84C] text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Clientes VIP</span>
          </button>
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'birthdays' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-900 border border-purple-200'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Aniversariantes do Mês</span>
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'inactive' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Inativas (+30 dias)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs"
          />
        </div>

      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                    <span>{client.name}</span>
                    {client.tags.includes('VIP') && (
                      <span title="Cliente VIP"><Crown className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" /></span>
                    )}
                  </h3>
                  <span className="text-xs text-zinc-500">{client.phone}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="bg-[#FAF8F5] text-[#9E7D2E] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#E8DFC8]">
                    {client.loyaltyPoints} pts fidelidade
                  </span>
                </div>
              </div>

              {/* Preferences Badges */}
              <div className="mt-3 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-[#FAF8F5] rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-bold block">Tamanho Preferido</span>
                  <strong className="text-zinc-800">Tam {client.preferredSize || 37}</strong>
                </div>
                <div className="p-2 bg-[#FAF8F5] rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-bold block">Cor Favorita</span>
                  <strong className="text-zinc-800">{client.favoriteColor || 'Dourado'}</strong>
                </div>
              </div>

              {/* Client Notes */}
              {client.notes && (
                <p className="mt-3 text-xs text-zinc-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50 italic">
                  "{client.notes}"
                </p>
              )}
            </div>

            {/* Financial History & WhatsApp CTA */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total Gasto ({client.totalOrders} pedidos)</span>
                <strong className="font-serif font-bold text-sm text-[#1A1A1A]">
                  R$ {client.totalSpent.toFixed(2).replace('.', ',')}
                </strong>
              </div>

              <button
                onClick={() => handleOpenWhatsAppClient(client)}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Atender</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* NEW CLIENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-[#E8DFC8]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-1">
              Cadastrar Nova Cliente no CRM
            </h3>
            <p className="text-zinc-500 text-xs mb-4">
              Defina os dados de contato e preferências para atendimento personalizado.
            </p>

            <form onSubmit={handleCreateClientSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-8888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Data de Aniversário</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Tamanho de Calçado</label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white"
                  >
                    {[33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((s) => (
                      <option key={s} value={s}>
                        Tam {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Cor Preferida</label>
                  <input
                    type="text"
                    placeholder="Ex: Dourado, Nude"
                    value={favoriteColor}
                    onChange={(e) => setFavoriteColor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  placeholder="Preferências de salto, estilos favoritos..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full gold-gradient text-white font-bold text-xs shadow-md cursor-pointer mt-2"
              >
                Salvar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
