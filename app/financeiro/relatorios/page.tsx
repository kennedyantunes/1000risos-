"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Filter,
  X,
  Calendar,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Mail,
  Table,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// ── Tipos ──
type ReportCategory = "finance" | "operations" | "people" | "events";
type PeriodKey = "this_month" | "last_month" | "this_year" | "last_year" | "custom";
type ExportFormat = "PDF" | "Excel" | "CSV";

interface ReportType {
  id: number;
  icon: string;
  name: string;
  desc: string;
  category: ReportCategory;
}

// ── Configurações ──
const CATEGORY_CONFIG: Record<ReportCategory, { bg: string; color: string; dot: string }> = {
  finance: { bg: "bg-emerald-50", color: "text-emerald-700", dot: "bg-emerald-500" },
  operations: { bg: "bg-cyan-50", color: "text-cyan-700", dot: "bg-cyan-500" },
  people: { bg: "bg-purple-50", color: "text-purple-700", dot: "bg-purple-500" },
  events: { bg: "bg-amber-50", color: "text-amber-700", dot: "bg-amber-500" },
};

const reportTypes: ReportType[] = [
  { id: 0, icon: "📊", name: "Faturamento", desc: "Receitas por período", category: "finance" },
  { id: 1, icon: "💰", name: "Lucratividade", desc: "Receitas x Custos", category: "finance" },
  { id: 2, icon: "🎉", name: "Custo por Evento", desc: "Detalhamento por evento", category: "events" },
  { id: 3, icon: "📉", name: "Inadimplência", desc: "Contas em atraso", category: "finance" },
  { id: 4, icon: "📦", name: "Consumo MP", desc: "Matéria-prima utilizada", category: "operations" },
  { id: 5, icon: "🪑", name: "Utilização Equip.", desc: "Taxa de ocupação", category: "operations" },
  { id: 6, icon: "👥", name: "Funcionários", desc: "Custos, férias, horas", category: "people" },
];

const periodOptions: { label: string; value: PeriodKey }[] = [
  { label: "Este mês", value: "this_month" },
  { label: "Mês passado", value: "last_month" },
  { label: "Este ano", value: "this_year" },
  { label: "Ano passado", value: "last_year" },
  { label: "Personalizado", value: "custom" },
];

// ── Dados mockados para os gráficos e relatórios ──

// 1. Dados para o gráfico de barras (faturamento diário)
const barData = [40, 65, 25, 15, 55, 75, 0, 45];
const maxBar = Math.max(...barData);

// 2. Dados para tabela de eventos
const tableRows = [
  { name: "Aniversário Sofia", date: "06/03", value: 4500, status: "paid" },
  { name: "Casamento Silva", date: "07/03", value: 8200, status: "paid" },
  { name: "Formatura João", date: "08/03", value: 3800, status: "pending" },
  { name: "Aniversário Pedro", date: "12/03", value: 2900, status: "paid" },
  { name: "Corporativo XPTO", date: "15/03", value: 5600, status: "pending" },
];

// 3. Configuração de status para tabela
const STATUS_CONFIG = {
  paid: { 
    label: "Pago", 
    color: "text-emerald-700", 
    bg: "bg-emerald-50", 
    dot: "bg-emerald-500", 
    icon: <CheckCircle2 className="w-3 h-3" /> 
  },
  pending: { 
    label: "Pendente", 
    color: "text-red-700", 
    bg: "bg-red-50", 
    dot: "bg-red-500", 
    icon: <Clock className="w-3 h-3" /> 
  },
};

// 4. Dados para totais por categoria
const categoryTotals = [
  { name: "Aniversários", events: 4, total: 13200 },
  { name: "Casamentos", events: 2, total: 14500 },
  { name: "Corporativo", events: 1, total: 5600 },
];

// 5. Dados para comparativo mensal
const comparisonMonths = [
  { label: "Janeiro", value: 28450, trend: "+8%", up: true },
  { label: "Fevereiro", value: 29300, trend: "+3%", up: true },
  { label: "Março (atual)", value: 32800, trend: "+12%", up: true },
];

// 6. Dados para top clientes
const topClients = [
  { label: "Silva (Casamento)", value: 8200 },
  { label: "XPTO Corporativo", value: 5600 },
  { label: "Sofia (Aniversário)", value: 4500 },
];

// 7. Dados para insights
const insights = [
  "Faturamento 12% maior que fevereiro",
  "Casamentos representam 44% do faturamento",
  "Ticket médio subiu de R$ 4.450 para R$ 4.685",
  "Inadimplência aumentou 0,8% - atenção",
];

// 8. Dados para os KPIs
const totalRevenue = 32800;
const avgTicket = 4685;
const totalEvents = 7;
const defaultRate = 3.2;

// 9. Dados para gráficos adicionais
const revenueByCategory = [
  { name: "Aniversários", value: 13200, color: "#10b981" },
  { name: "Casamentos", value: 14500, color: "#3b82f6" },
  { name: "Corporativo", value: 5600, color: "#f59e0b" },
  { name: "Outros", value: 3200, color: "#8b5cf6" },
];

const monthlyRevenue = [
  { month: "Jan", value: 28450 },
  { month: "Fev", value: 29300 },
  { month: "Mar", value: 32800 },
  { month: "Abr", value: 0 },
  { month: "Mai", value: 0 },
  { month: "Jun", value: 0 },
];

const weeklyRevenue = [
  { week: "Sem 1", value: 8200 },
  { week: "Sem 2", value: 14500 },
  { week: "Sem 3", value: 5600 },
  { week: "Sem 4", value: 4500 },
];

// 10. Dados para os diferentes tipos de relatório
const reportData = {
  faturamento: {
    daily: barData,
    monthly: monthlyRevenue,
    weekly: weeklyRevenue,
    byCategory: revenueByCategory,
  },
  lucratividade: {
    revenue: 32800,
    costs: 24500,
    profit: 8300,
    margin: 25.3,
  },
  custoPorEvento: [
    { event: "Aniversário Sofia", cost: 3200, revenue: 4500, profit: 1300 },
    { event: "Casamento Silva", cost: 5800, revenue: 8200, profit: 2400 },
    { event: "Formatura João", cost: 2800, revenue: 3800, profit: 1000 },
  ],
  inadimplencia: {
    total: 12500,
    overdue: 890,
    percentage: 7.12,
    aging: [
      { days: "1-30", value: 450 },
      { days: "31-60", value: 320 },
      { days: "61-90", value: 120 },
      { days: "90+", value: 0 },
    ],
  },
  consumoMP: [
    { name: "Farinha", consumed: 245, unit: "kg", cost: 784 },
    { name: "Açúcar", consumed: 180, unit: "kg", cost: 504 },
    { name: "Ovos", consumed: 1200, unit: "un", cost: 960 },
    { name: "Leite", consumed: 150, unit: "L", cost: 675 },
  ],
  utilizacaoEquip: [
    { name: "Cama Elástica", usage: 85, total: 12, events: 10 },
    { name: "Piscina de Bolinhas", usage: 92, total: 10, events: 9 },
    { name: "Futebol de Sabão", usage: 45, total: 4, events: 2 },
    { name: "Mesa de Ping Pong", usage: 67, total: 6, events: 4 },
  ],
  funcionarios: {
    total: 12,
    active: 10,
    vacation: 2,
    totalHours: 480,
    totalCost: 18500,
    byRole: [
      { role: "Garçons", count: 6, cost: 9600 },
      { role: "Copeiros", count: 3, cost: 5400 },
      { role: "Animadores", count: 2, cost: 2800 },
      { role: "Auxiliares", count: 1, cost: 700 },
    ],
  },
};

// 11. Dados para o gráfico de linha (tendência)
const trendData = [
  { month: "Set/25", revenue: 24800, costs: 18900 },
  { month: "Out/25", revenue: 26300, costs: 19500 },
  { month: "Nov/25", revenue: 27100, costs: 20200 },
  { month: "Dez/25", revenue: 28900, costs: 21500 },
  { month: "Jan/26", revenue: 28450, costs: 21100 },
  { month: "Fev/26", revenue: 29300, costs: 21800 },
  { month: "Mar/26", revenue: 32800, costs: 24500 },
];

// 12. Dados para projeção de faturamento
const projectionData = [
  { month: "Abr/26", projected: 33500, optimistic: 35200, pessimistic: 31800 },
  { month: "Mai/26", projected: 34200, optimistic: 35900, pessimistic: 32500 },
  { month: "Jun/26", projected: 35800, optimistic: 37600, pessimistic: 34000 },
  { month: "Jul/26", projected: 36500, optimistic: 38300, pessimistic: 34700 },
];

// 13. Dados para ranking de serviços mais contratados
const topServices = [
  { name: "Buffet Completo", count: 12, revenue: 156000 },
  { name: "Decoração Temática", count: 10, revenue: 12000 },
  { name: "Fotografia", count: 8, revenue: 24000 },
  { name: "Cama Elástica", count: 7, revenue: 2100 },
  { name: "Piscina de Bolinhas", count: 6, revenue: 1620 },
];

// 14. Dados para sazonalidade
const seasonalityData = [
  { month: "Jan", events: 5, revenue: 28450 },
  { month: "Fev", events: 6, revenue: 29300 },
  { month: "Mar", events: 7, revenue: 32800 },
  { month: "Abr", events: 4, revenue: 18500 },
  { month: "Mai", events: 5, revenue: 21500 },
  { month: "Jun", events: 8, revenue: 35400 },
  { month: "Jul", events: 7, revenue: 31200 },
  { month: "Ago", events: 6, revenue: 27800 },
  { month: "Set", events: 5, revenue: 24800 },
  { month: "Out", events: 6, revenue: 26300 },
  { month: "Nov", events: 7, revenue: 27100 },
  { month: "Dez", events: 9, revenue: 28900 },
];

// 15. Dados para métricas de desempenho
const performanceMetrics = {
  conversionRate: 68.5,
  averageLeadTime: 45,
  repeatCustomers: 23,
  customerSatisfaction: 4.8,
  eventCancellationRate: 2.1,
  averageEventDuration: 5.2,
};

// 16. Função para formatar moeda
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// 17. Função para gerar dados de gráfico baseado no relatório selecionado
const getChartData = (reportId: number) => {
  switch(reportId) {
    case 0: // Faturamento
      return { type: "bar", data: barData, labels: Array.from({ length: barData.length }, (_, i) => `${i+1}`) };
    case 1: // Lucratividade
      return { type: "pie", data: [
        { name: "Receitas", value: reportData.lucratividade.revenue },
        { name: "Custos", value: reportData.lucratividade.costs },
      ]};
    case 2: // Custo por Evento
      return { type: "bar", data: reportData.custoPorEvento.map(e => e.cost), labels: reportData.custoPorEvento.map(e => e.event) };
    case 3: // Inadimplência
      return { type: "pie", data: reportData.inadimplencia.aging };
    case 4: // Consumo MP
      return { type: "bar", data: reportData.consumoMP.map(m => m.consumed), labels: reportData.consumoMP.map(m => m.name) };
    case 5: // Utilização Equip.
      return { type: "bar", data: reportData.utilizacaoEquip.map(e => e.usage), labels: reportData.utilizacaoEquip.map(e => e.name) };
    case 6: // Funcionários
      return { type: "pie", data: reportData.funcionarios.byRole.map(r => ({ name: r.role, value: r.cost })) };
    default:
      return { type: "bar", data: barData, labels: Array.from({ length: barData.length }, (_, i) => `${i+1}`) };
  }
};

// ── Componente StatCard ──
function StatCard({ title, value, compare, positive, icon, color }: { title: string; value: string; compare?: string; positive?: boolean | null; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        {compare && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive === true ? "text-emerald-600" : positive === false ? "text-red-600" : "text-gray-500"}`}>
            {positive === true ? <TrendingUp size={12} /> : positive === false ? <TrendingDown size={12} /> : null}
            {compare}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</div>
    </div>
  );
}

// ── Componente Field ──
const Field = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col gap-1.5 ${className || ""}`}>
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}
      {required && <span className="text-blue-600 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`
      w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium
      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all
      ${props.className || ""}
    `}
  />
);

// ── Modal Exportar ──
function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [format, setFormat] = useState<ExportFormat>("PDF");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 pt-6 pb-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exportar Relatório</h2>
            <p className="text-sm text-gray-500 mt-1">Escolha o formato e opções de exportação</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Field label="Relatório">
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option>Faturamento - Março 2026</option>
              <option>Lucratividade - Março 2026</option>
              <option>Custo por Evento - Março 2026</option>
            </select>
          </Field>

          <Field label="Formato">
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "PDF", icon: FileText, desc: "Documento formatado" },
                { name: "Excel", icon: Table, desc: "Dados para análise" },
                { name: "CSV", icon: Download, desc: "Dados brutos" },
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFormat(f.name as ExportFormat)}
                  className={`
                    p-4 border rounded-xl text-center transition-all
                    ${format === f.name
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  <f.icon className="mx-auto mb-2 text-gray-600" size={28} />
                  <div className="font-medium text-sm">{f.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Incluir no relatório">
            <div className="space-y-3">
              {["Gráficos", "Tabela detalhada", "Comparativo com período anterior", "Insights e análises"].map((item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Enviar por e-mail (opcional)">
            <Input placeholder="email@exemplo.com" />
          </Field>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Cancelar
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function RelatoriosPage() {
  const [selectedReport, setSelectedReport] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("this_month");
  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  const currentReport = reportTypes[selectedReport];
  const cfg = CATEGORY_CONFIG[currentReport.category];

  return (
    <AppShell active="financeiro-relatorios">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/financeiro" className="text-gray-500 hover:text-gray-700 font-medium">
            Financeiro
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Relatórios Gerenciais</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar tipos" : "Mostrar tipos"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar ações" : "Mostrar ações"}
            >
              <FileText size={18} />
            </button>
            <button
              onClick={() => {
                if (!showSidebar && !showDetailsPanel) {
                  setShowSidebar(true);
                  setShowDetailsPanel(true);
                } else {
                  setShowSidebar(false);
                  setShowDetailsPanel(false);
                }
              }}
              className={`p-2 rounded-md transition-all ${!showSidebar && !showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Modo foco (ocultar tudo)"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} />
            <span className="hidden sm:inline">Agendar</span>
          </button>
          
          <button
            onClick={() => setModalExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - KPIs */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Faturamento total"
            value={totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            compare="+12%"
            positive={true}
            color="bg-emerald-600"
            icon={<TrendingUp size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Ticket médio"
            value={avgTicket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            compare="+5%"
            positive={true}
            color="bg-blue-600"
            icon={<Wallet size={20} className="text-blue-600" />}
          />
          <StatCard
            title="Eventos realizados"
            value={totalEvents.toString()}
            compare="igual"
            positive={null}
            color="bg-purple-600"
            icon={<Calendar size={20} className="text-purple-600" />}
          />
          <StatCard
            title="Inadimplência"
            value={`${defaultRate}%`}
            compare="+0,8%"
            positive={false}
            color="bg-red-600"
            icon={<AlertCircle size={20} className="text-red-600" />}
          />
        </div>
      </div>

      {/* Barra de período */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Período:</span>
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPeriod(p.value)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-full transition
                ${selectedPeriod === p.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
        {selectedPeriod === "custom" && (
          <div className="flex gap-2 ml-auto">
            <Input type="date" defaultValue="2026-03-01" className="w-36" />
            <span className="text-gray-500">até</span>
            <Input type="date" defaultValue="2026-03-31" className="w-36" />
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Tipos de relatório */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-72" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipos de Relatório</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {reportTypes.map((report) => {
              const isSelected = report.id === selectedReport;
              const catCfg = CATEGORY_CONFIG[report.category];

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all
                    ${isSelected
                      ? "bg-blue-50 border border-blue-200 shadow-sm"
                      : "hover:bg-gray-50 border border-transparent"}
                  `}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${catCfg.bg} ${catCfg.color}`}>
                    {report.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{report.name}</div>
                    <div className="text-xs text-gray-500">{report.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar tipos de relatório"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Área central – Preview do relatório */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300`}>
          <div className="max-w-6xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-2xl ${cfg.color}`}>{currentReport.icon}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{currentReport.name}</h1>
                </div>
                <p className="text-gray-500">
                  {periodOptions.find(p => p.value === selectedPeriod)?.label || "Período personalizado"} • Março 2026
                </p>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter size={16} /> Filtrar
                </button>
                <button
                  onClick={() => setModalExportOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 text-sm font-semibold"
                >
                  <Download size={16} /> Exportar
                </button>
              </div>
            </div>

{/* Gráfico de barras com Recharts */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
  <h3 className="text-sm font-semibold text-gray-900 mb-6">Faturamento Diário</h3>
  {barData && barData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={barData.map((value, index) => ({
          dia: String(index + 1).padStart(2, "0"),
          valor: value
        }))}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="dia" stroke="#6b7280" />
        <YAxis 
          stroke="#6b7280"
          tickFormatter={(value) => `R$ ${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Faturamento"]}
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Nenhum dado disponível para o período selecionado
    </div>
  )}
</div>

{/* Gráfico de pizza para categorias */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
  <h3 className="text-sm font-semibold text-gray-900 mb-6">Faturamento por Categoria</h3>
  {revenueByCategory && revenueByCategory.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={revenueByCategory}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {revenueByCategory.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Faturamento"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Nenhum dado disponível
    </div>
  )}
</div>

{/* Gráfico de linha para tendência */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
  <h3 className="text-sm font-semibold text-gray-900 mb-6">Tendência de Faturamento</h3>
  {trendData && trendData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={trendData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis 
          stroke="#6b7280"
          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Faturamento"]}
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Receita" />
        <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Custos" />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Nenhum dado disponível
    </div>
  )}
</div>

            {/* Tabela de eventos */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Eventos do Período</h3>
              </div>
              <div className="overflow-x-auto">
                <div className="bg-white border-b-2 border-gray-200 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">Evento</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-3">Valor</div>
                  <div className="col-span-3">Status</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {tableRows.map((row) => {
                    const sc = STATUS_CONFIG[row.status];
                    return (
                      <div key={row.name} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50">
                        <div className="col-span-4 font-medium text-gray-900">{row.name}</div>
                        <div className="col-span-2 text-sm text-gray-500">{row.date}</div>
                        <div className="col-span-3 font-mono font-bold text-blue-700">
                          {row.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                        <div className="col-span-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                            {sc.icon}
                            {sc.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Totais por categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {categoryTotals.map((cat) => (
                <div key={cat.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">{cat.name}</div>
                    <BarChart3 size={20} className="text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-gray-900">
                    {cat.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{cat.events} eventos</div>
                </div>
              ))}
            </div>

            {/* Comparativo mensal */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-6">Comparativo Mensal</h3>
              <div className="space-y-4">
                {comparisonMonths.map((m) => (
                  <div key={m.label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{m.label}</span>
                    <div className="text-right">
                      <div className="font-bold font-mono text-gray-900">
                        {m.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <div className={`text-sm font-medium ${m.up ? "text-emerald-700" : "text-red-700"}`}>
                        {m.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão flutuante para mostrar details panel quando oculto */}
        {!showDetailsPanel && (
          <button
            onClick={() => setShowDetailsPanel(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar ações"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Coluna direita – Ações rápidas + Insights */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ações rápidas</h3>
            <p className="text-sm text-gray-500">Exportar ou agendar relatórios</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Exportar agora */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Exportar agora</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "PDF", icon: FileText, desc: "Documento" },
                  { name: "Excel", icon: Table, desc: "Planilha" },
                  { name: "CSV", icon: Download, desc: "Dados brutos" },
                  { name: "E-mail", icon: Mail, desc: "Enviar" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setModalExportOpen(true)}
                    className="p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition text-center"
                  >
                    <item.icon className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Insights do período</h4>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top clientes */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Top clientes</h4>
              <div className="space-y-3">
                {topClients.map((client, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{client.label}</span>
                    <span className="font-mono font-bold text-gray-900">
                      {client.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dica */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">Dica</span>
              </div>
              <p className="text-xs text-blue-700">
                Agende relatórios para receber análises periódicas diretamente no seu e-mail.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Exportar */}
      <ExportModal isOpen={modalExportOpen} onClose={() => setModalExportOpen(false)} />
    </AppShell>
  );
}