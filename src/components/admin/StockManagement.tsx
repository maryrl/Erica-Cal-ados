import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, StockLog } from '../../types';
import {
  AlertCircle,
  Plus,
  Minus,
  History,
  TrendingUp,
  AlertTriangle,
  Search,
  PackageCheck,
  PackageX
} from 'lucide-react';

export const StockManagement: React.FC = () => {
  const { products, updateVariationStock, stockLogs, storeConfig } = useStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'logs' | 'reports'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  // Flatten matrix for filtering
  const stockMatrix = products.flatMap((p) =>
    p.variations.flatMap((v) =>
      v.sizes.map((s) => ({
        productId: p.id,
        productName: p.name,
        category: p.category,
        colorName: v.colorName,
        colorHex: v.colorHex,
        size: s.size,
        stock: s.stock,
        isCritical: s.stock > 0 && s.stock <= storeConfig.lowStockThreshold,
        isOut: s.stock === 0
      }))
    )
  );

  const filteredMatrix = stockMatrix.filter((item) => {
    if (showCriticalOnly && !item.isCritical && !item.isOut) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(q) ||
        item.colorName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Reports
  const topSellers = products
    .slice()
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));

  const slowMovers = products
    .slice()
    .sort((a, b) => (a.orderCount || 0) - (b.orderCount || 0));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Gestão e Controle de Estoque
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            Monitoramento de unidades por numeração, alerta automático de estoque baixo e auditoria.
          </p>
        </div>

        {/* Subtabs Navigation */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'matrix' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
            }`}
          >
            Matriz de Estoque
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
            }`}
          >
            Histórico (Logs)
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'reports' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-zinc-600 hover:text-black'
            }`}
          >
            Relatórios de Giro
          </button>
        </div>
      </div>

      {/* TAB 1: MATRIX & QUICK STOCK CONTROLS */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por calçado, cor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs"
              />
            </div>

            <button
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                showCriticalOnly
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Ver Apenas Estoque Crítico (&le; {storeConfig.lowStockThreshold} un)</span>
            </button>
          </div>

          {/* Matrix Grid / Table */}
          <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#F0EAE1] text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="p-4 pl-6">Calçado</th>
                    <th className="p-4">Cor</th>
                    <th className="p-4 text-center">Numeração</th>
                    <th className="p-4 text-center">Estoque Atual</th>
                    <th className="p-4 text-center">Status Alerta</th>
                    <th className="p-4 pr-6 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {filteredMatrix.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#FAF8F5]/80 transition ${
                        item.isCritical ? 'bg-amber-50/50' : item.isOut ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="p-4 pl-6 font-serif font-bold text-sm text-[#1A1A1A]">
                        {item.productName}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="font-semibold text-zinc-700">{item.colorName}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className="font-bold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-md">
                          Tam {item.size}
                        </span>
                      </td>

                      <td className="p-4 text-center font-bold text-sm text-[#1A1A1A]">
                        {item.stock} un.
                      </td>

                      <td className="p-4 text-center">
                        {item.isOut ? (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            Esgotado (0 un)
                          </span>
                        ) : item.isCritical ? (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Crítico (&le; {storeConfig.lowStockThreshold} un)
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            Normal
                          </span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateVariationStock(
                                item.productId,
                                item.colorName,
                                item.size,
                                item.stock - 1,
                                'Ajuste Manual'
                              )
                            }
                            disabled={item.stock === 0}
                            className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold transition disabled:opacity-40 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold">{item.stock}</span>
                          <button
                            onClick={() =>
                              updateVariationStock(
                                item.productId,
                                item.colorName,
                                item.size,
                                item.stock + 1,
                                'Ajuste Manual'
                              )
                            }
                            className="w-7 h-7 rounded-lg gold-gradient text-white flex items-center justify-center font-bold shadow-2xs hover:brightness-105 transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
            <History className="w-5 h-5 text-[#C9A84C]" />
            <span>Histórico de Movimentação de Estoque</span>
          </h3>

          <div className="divide-y divide-zinc-100 text-xs">
            {stockLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#1A1A1A] block">
                    {log.productName} ({log.color} - Tam {log.size})
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    Motivo: <strong>{log.changeType}</strong> • Responsável: {log.user}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold text-sm ${
                      log.quantityChanged > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged} un.
                  </span>
                  <span className="block text-[10px] text-zinc-400">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS (TOP SELLERS & SLOW MOVERS) */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Top Sellers */}
          <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold font-serif text-lg">
              <PackageCheck className="w-5 h-5" />
              <span>Mais Vendidos (Maior Giro)</span>
            </div>

            <div className="space-y-3">
              {topSellers.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-[#C9A84C]">#{idx + 1}</span>
                    <div>
                      <strong className="font-serif font-bold text-sm text-[#1A1A1A] block">{p.name}</strong>
                      <span className="text-[10px] text-zinc-500">{p.category}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    {p.orderCount || 0} pares vendidos
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Slow Movers */}
          <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold font-serif text-lg">
              <PackageX className="w-5 h-5" />
              <span>Produtos Encalhados / Baixo Giro</span>
            </div>

            <div className="space-y-3">
              {slowMovers.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-rose-500">#{idx + 1}</span>
                    <div>
                      <strong className="font-serif font-bold text-sm text-[#1A1A1A] block">{p.name}</strong>
                      <span className="text-[10px] text-zinc-500">{p.category}</span>
                    </div>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                    {p.orderCount || 0} vendas acumuladas
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
