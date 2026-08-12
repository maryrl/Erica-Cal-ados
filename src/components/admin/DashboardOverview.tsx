import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Users,
  TrendingUp,
  Award,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const { orders, products, clients, storeConfig, resetToDemoData } = useStore();

  // Financial calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Aguardando' || o.status === 'Confirmado').length;

  // Calculate low stock items count (< lowStockThreshold)
  let lowStockCount = 0;
  products.forEach((p) => {
    p.variations.forEach((v) => {
      v.sizes.forEach((s) => {
        if (s.stock > 0 && s.stock <= storeConfig.lowStockThreshold) {
          lowStockCount++;
        }
      });
    });
  });

  // Sales Trend Chart Data
  const salesData = [
    { day: 'Seg', vitoria: 890 },
    { day: 'Ter', vitoria: 1240 },
    { day: 'Qua', vitoria: 1680 },
    { day: 'Qui', vitoria: 1450 },
    { day: 'Sex', vitoria: 2290 },
    { day: 'Sáb', vitoria: 3100 },
    { day: 'Dom', vitoria: 1980 }
  ];

  // Top Selling Products Chart
  const topProducts = products
    .slice()
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name.split(' ')[0] + ' ' + p.name.split(' ')[1],
      vendas: p.orderCount || 10
    }));

  const COLORS = ['#C9A84C', '#DFBA61', '#9E7D2E', '#E2C2B3', '#1A1A1A'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A1A1A] text-white p-6 rounded-3xl border border-[#C9A84C]/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#DFBA61] font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span>Resumo Executivo em Tempo Real</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            Painel Geral de Vendas & Estoque
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Métricas integradas do catálogo online e pedidos via WhatsApp.
          </p>
        </div>

        <button
          onClick={resetToDemoData}
          className="px-4 py-2 rounded-xl bg-[#2B2823] hover:bg-[#3D382F] border border-[#3D382F] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition cursor-pointer"
          title="Restaurar dados de teste para demonstração"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Restaurar Dados Demo</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#F0EAE1] shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Faturamento Total
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.5% comparado ao mês anterior</span>
          </div>
        </div>

        {/* Card 2: Open Orders */}
        <div
          onClick={() => onNavigateTab('pedidos')}
          className="bg-white p-5 rounded-2xl border border-[#F0EAE1] shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Pedidos em Aberto
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>{pendingOrdersCount} pedidos</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#C9A84C] font-semibold mt-2 group-hover:underline">
            <span>Ver quadro de gestão Kanban</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div
          onClick={() => onNavigateTab('estoque')}
          className="bg-white p-5 rounded-2xl border border-[#F0EAE1] shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Alertas de Estoque Baixo
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
            {lowStockCount} itens críticos
          </div>
          <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold mt-2 group-hover:underline">
            <span>Ajustar estoque por numeração</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Clients */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="bg-white p-5 rounded-2xl border border-[#F0EAE1] shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Base de Clientes CRM
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#C9A84C] border border-[#E8DFC8] flex items-center justify-center font-bold group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
            {clients.length} cadastradas
          </div>
          <div className="flex items-center gap-1 text-xs text-[#C9A84C] font-semibold mt-2 group-hover:underline">
            <span>Ver perfis & aniversariantes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales Trend Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                Evolução Semanal de Vendas (R$)
              </h3>
              <p className="text-zinc-500 text-xs">Acompanhamento diário das conversões via WhatsApp.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Meta Batida ✨
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip formatter={(value: any) => [`R$ ${value}`, 'Vendas']} />
                <Area type="monotone" dataKey="vitoria" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Bar Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-2xs">
          <div className="mb-6">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Calçados Mais Vendidos (Ranking)
            </h3>
            <p className="text-zinc-500 text-xs">Modelos com maior procura na vitrine.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} stroke="#444" fontSize={11} tickLine={false} />
                <Tooltip formatter={(val: any) => [`${val} pares`, 'Vendas']} />
                <Bar dataKey="vendas" radius={[0, 8, 8, 0]}>
                  {topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
