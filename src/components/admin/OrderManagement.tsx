import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  LayoutGrid,
  List,
  Search,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Filter,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, storeConfig, showToast } = useStore();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const statuses: OrderStatus[] = [
    'Aguardando',
    'Confirmado',
    'Em separação',
    'Enviado',
    'Entregue',
    'Cancelado'
  ];

  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case 'Aguardando':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Confirmado':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Em separação':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Enviado':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Entregue':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelado':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter !== 'Todos' && o.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.item.productName.toLowerCase().includes(q) ||
        o.clientPhone.includes(q)
      );
    }
    return true;
  });

  const handleNotifyCustomerWA = (order: Order, newStatus: OrderStatus) => {
    const cleanPhone = order.clientPhone.replace(/\D/g, '');
    const msg = `Olá ${order.clientName}! ✨ Atualização do seu pedido #${order.orderNumber} na ${storeConfig.storeName}:
Status atualizado para: *${newStatus.toUpperCase()}* 👠
Produto: ${order.item.productName} (Cor: ${order.item.color}, Tam: ${order.item.size})

Obrigado por escolher a ${storeConfig.storeName}! 💕`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = 'Numero,Cliente,Telefone,Produto,Cor,Tamanho,Valor,Status,Data\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.clientName}","${o.clientPhone}","${o.item.productName}","${o.item.color}",${o.item.size},"${o.total}","${o.status}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_vendas_aurelia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório de Vendas exportado com sucesso (CSV)!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Gestão de Pedidos e Vendas (CRM)
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Acompanhe pedidos do WhatsApp em quadro Kanban ou lista tabular com atualizações de cliente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1.5 rounded-2xl border border-zinc-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Quadro Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela Detalhada</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-full gold-gradient text-white text-xs font-bold shadow-xs hover:brightness-105 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Vendas</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, pedido, calçado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">Status:</span>
          <button
            onClick={() => setSelectedStatusFilter('Todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedStatusFilter === 'Todos' ? 'bg-[#1A1A1A] text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Todos ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedStatusFilter === st ? 'bg-[#C9A84C] text-white' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
          {statuses.map((st) => {
            const columnOrders = filteredOrders.filter((o) => o.status === st);

            return (
              <div
                key={st}
                className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8DFC8] flex flex-col min-w-[260px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                    {st}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Orders Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                  {columnOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderDetails(ord);
                        setTrackingInput(ord.trackingCode || '');
                      }}
                      className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs hover:shadow-md transition cursor-pointer hover:border-[#C9A84C] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#9E7D2E]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <img
                          src={ord.item.image || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'}
                          alt=""
                          className="w-10 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
                        />
                        <div>
                          <strong className="font-bold text-xs text-[#1A1A1A] block line-clamp-1">
                            {ord.clientName}
                          </strong>
                          <span className="text-[10px] text-zinc-500 block line-clamp-1">
                            {ord.item.productName}
                          </span>
                          <span className="text-[10px] text-[#8C6D21] font-semibold">
                            Cor: {ord.item.color} | Tam {ord.item.size}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                          R$ {ord.total.toFixed(2).replace('.', ',')}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotifyCustomerWA(ord, ord.status);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            title="Notificar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnOrders.length === 0 && (
                    <div className="text-center py-8 text-xs text-zinc-400 italic">
                      Nenhum pedido nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="p-4 pl-6">Nº Pedido</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Produto / Especificações</th>
                  <th className="p-4">Valor Total</th>
                  <th className="p-4">Status Atual</th>
                  <th className="p-4">Data/Hora</th>
                  <th className="p-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5]/80 transition">
                    <td className="p-4 pl-6 font-serif font-bold text-sm text-[#9E7D2E]">
                      #{ord.orderNumber}
                    </td>

                    <td className="p-4">
                      <strong className="font-bold text-zinc-800 block">{ord.clientName}</strong>
                      <span className="text-[11px] text-zinc-500">{ord.clientPhone}</span>
                    </td>

                    <td className="p-4">
                      <strong className="font-bold text-zinc-800 block">{ord.item.productName}</strong>
                      <span className="text-[11px] text-[#8C6D21] font-medium">
                        Cor: {ord.item.color} | Tam {ord.item.size}
                      </span>
                    </td>

                    <td className="p-4 font-serif font-bold text-sm text-[#1A1A1A]">
                      R$ {ord.total.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleString('pt-BR')}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderDetails(ord);
                            setTrackingInput(ord.trackingCode || '');
                          }}
                          className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition"
                          title="Detalhes do pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleNotifyCustomerWA(ord, ord.status)}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          title="Enviar atualização no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDER DETAILS & STATUS UPDATE MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-[#E8DFC8]">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              ✕
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C9A84C]">
                  Detalhes do Pedido
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#1A1A1A]">
                  #{selectedOrderDetails.orderNumber}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrderDetails.status)}`}>
                {selectedOrderDetails.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] space-y-2">
                <p><strong>Cliente:</strong> {selectedOrderDetails.clientName}</p>
                <p><strong>WhatsApp:</strong> {selectedOrderDetails.clientPhone}</p>
                <p><strong>Produto:</strong> {selectedOrderDetails.item.productName}</p>
                <p><strong>Especificações:</strong> Cor {selectedOrderDetails.item.color} | Tamanho {selectedOrderDetails.item.size}</p>
                <p><strong>Observações:</strong> {selectedOrderDetails.notes || 'Nenhuma'}</p>
                <p><strong>Data:</strong> {new Date(selectedOrderDetails.createdAt).toLocaleString('pt-BR')}</p>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Alterar Status do Pedido:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrderDetails.id, st, trackingInput);
                        setSelectedOrderDetails({ ...selectedOrderDetails, status: st });
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition border cursor-pointer ${
                        selectedOrderDetails.status === st
                          ? 'gold-gradient text-white border-[#C9A84C] shadow-xs'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Code Input */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Código de Rastreamento Correios/Envio:</label>
                <input
                  type="text"
                  placeholder="Ex: BR987654321SP"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              {/* Notify Customer WA */}
              <button
                onClick={() => handleNotifyCustomerWA(selectedOrderDetails, selectedOrderDetails.status)}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notificar Cliente no WhatsApp com este Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
