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
  AlertCircle,
  BarChart3,
  DollarSign,
  TrendingUp,
  FileText,
  Table,
  Mail,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Briefcase,
  MapPin,
  TrendingDown,
  Wallet,
  Award,
  Gift,
  Star,
  MessageCircle,
} from "lucide-react";

// ── Tipos ──
type ReportCategory = "expiring" | "projection" | "cost" | "history" | "availability";
type PeriodKey = "current_year" | "last_year" | "next_12" | "custom";
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
  expiring: { bg: "bg-red-50", color: "text-red-700", dot: "bg-red-500" },
  projection: { bg: "bg-blue-50", color: "text-blue-700", dot: "bg-blue-500" },
  cost: { bg: "bg-emerald-50", color: "text-emerald-700", dot: "bg-emerald-500" },
  history: { bg: "bg-purple-50", color: "text-purple-700", dot: "bg-purple-500" },
  availability: { bg: "bg-amber-50", color: "text-amber-700", dot: "bg-amber-500" },
};

const reportTypes: ReportType[] = [
  { id: 0, icon: "⚠️", name: "Férias Vencidas", desc: "Períodos concessivos expirados", category: "expiring" },
  { id: 1, icon: "📅", name: "Projeção Anual", desc: "Férias programadas por mês", category: "projection" },
  { id: 2, icon: "💰", name: "Custo de Férias", desc: "Provisão e pagamentos", category: "cost" },
  { id: 3, icon: "📋", name: "Histórico por Funcionário", desc: "Todos os períodos gozados", category: "history" },
  { id: 4, icon: "📊", name: "Disponibilidade", desc: "Funcionários disponíveis por período", category: "availability" },
];

const periodOptions: { label: string; value: PeriodKey }[] = [
  { label: "Ano atual", value: "current_year" },
  { label: "Ano anterior", value: "last_year" },
  { label: "Próximos 12 meses", value: "next_12" },
  { label: "Personalizado", value: "custom" },
];

const departments = ["Todos", "Cozinha", "Atendimento", "Montagem", "Administração"];

// ── Dados de exemplo ──
const overdueEmployees = [
  { initials: "RF", name: "Roberto Freitas", role: "Montagem · Admissão: 10/03/2023", days: "30 dias vencidos" },
  { initials: "CL", name: "Carla Lima", role: "Atendimento · Admissão: 15/01/2024", days: "15 dias vencidos" },
];

const upcomingEmployees = [
  { initials: "AS", name: "Ana Souza", role: "Atendimento · Vence em 15/04/2026", days: "30 dias · 25 dias restantes" },
  { initials: "JP", name: "João Pedro", role: "Cozinha · Vence em 20/04/2026", days: "30 dias · 20 dias restantes" },
  { initials: "FM", name: "Fernanda Melo", role: "Recepção · Vence em 05/04/2026", days: "30 dias · 30 dias restantes" },
];

const tableRows = [
  { name: "Roberto Freitas", dept: "Montagem", period: "2024/2025", due: "10/03/2026", status: "overdue" },
  { name: "Carla Lima", dept: "Atendimento", period: "2024/2025", due: "15/02/2026", status: "overdue" },
  { name: "Ana Souza", dept: "Atendimento", period: "2025/2026", due: "15/04/2026", status: "warning" },
  { name: "João Pedro", dept: "Cozinha", period: "2025/2026", due: "20/04/2026", status: "warning" },
];

const projectionMonths = [
  { label: "Abril/2026", value: "3 funcionários · 75 dias" },
  { label: "Maio/2026", value: "2 funcionários · 45 dias" },
  { label: "Junho/2026", value: "4 funcionários · 90 dias" },
];

const costRows = [
  { label: "Provisão mensal", value: 4200 },
  { label: "Pago no ano", value: 12600 },
  { label: "A pagar (próximos 30d)", value: 5800 },
];

const insights = [
  { bold: "2 funcionários", rest: " com férias vencidas" },
  { bold: "Custo estimado em dobro", rest: ": R$ 8.450" },
  { bold: "3 funcionários", rest: " vencem nos próximos 30 dias" },
  { bold: "Atendimento", rest: " é o depto com mais vencimentos" },
];

const urgentActions = [
  "Regularizar férias de Roberto Freitas (urgente)",
  "Regularizar férias de Carla Lima",
  "Programar férias de 3 funcionários com vencimento em abril",
];

// ── Componente StatCard ──
function StatCard({ title, value, sub, positive, color, icon }: { title: string; value: string; sub: string; positive?: boolean | null; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        {positive !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive === true ? "text-emerald-600" : positive === false ? "text-red-600" : "text-gray-500"}`}>
            {positive === true ? <TrendingUp size={12} /> : positive === false ? <TrendingDown size={12} /> : null}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</div>
      <div className="text-sm text-gray-600 mt-2">{sub}</div>
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
            <h2 className="text-2xl font-bold text-gray-900">Exportar Relatório de Férias</h2>
            <p className="text-sm text-gray-500 mt-1">Escolha o formato e opções de exportação</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Field label="Relatório">
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option>Férias Vencidas - 2026</option>
              <option>Projeção Anual - 2026</option>
              <option>Custo de Férias - 2026</option>
              <option>Histórico por Funcionário</option>
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
              {["Lista detalhada", "Resumo de custos", "Gráficos e projeções", "Alertas e ações urgentes"].map((item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
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
export default function RelatorioFeriasPage() {
  const [selectedReport, setSelectedReport] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("current_year");
  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  const currentReport = reportTypes[selectedReport];
  const cfg = CATEGORY_CONFIG[currentReport.category];

  // Totais
  const totalOverdue = overdueEmployees.length;
  const totalDaysOverdue = 45;
  const totalCostOverdue = 8450;
  const totalUpcoming = upcomingEmployees.length;
  const totalProvisioned = 50400;

  return (
    <AppShell active="gestao-funcionarios-relatorios-ferias">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/gestao" className="text-gray-500 hover:text-gray-700 font-medium">
            Gestão
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/gestao/funcionarios" className="text-gray-500 hover:text-gray-700 font-medium">
            Funcionários
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Relatórios de Férias</span>
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
            title="Férias vencidas"
            value={totalOverdue.toString()}
            sub="funcionários"
            positive={false}
            color="bg-red-600"
            icon={<AlertCircle size={20} className="text-red-600" />}
          />
          <StatCard
            title="Dias em dobro"
            value={totalDaysOverdue.toString()}
            sub="dias"
            positive={false}
            color="bg-amber-600"
            icon={<Calendar size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Custo estimado"
            value={totalCostOverdue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="em dobro"
            positive={false}
            color="bg-red-600"
            icon={<DollarSign size={20} className="text-red-600" />}
          />
          <StatCard
            title="A vencer (30d)"
            value={totalUpcoming.toString()}
            sub="funcionários"
            positive={null}
            color="bg-blue-600"
            icon={<TrendingUp size={20} className="text-blue-600" />}
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
            <Input type="month" defaultValue="2026-01" className="w-36" />
            <span className="text-gray-500">até</span>
            <Input type="month" defaultValue="2026-12" className="w-36" />
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Tipos de relatório */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-72" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Relatórios de Férias</h3>
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
                  {periodOptions.find(p => p.value === selectedPeriod)?.label || "Período personalizado"} • 2026
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

            {/* Funcionários com férias vencidas */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Funcionários com férias vencidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overdueEmployees.map((e, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xl">
                      {e.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{e.name}</div>
                      <div className="text-sm text-gray-600">{e.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-700 font-bold font-mono text-sm">{e.days}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* A vencer nos próximos 30 dias */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">A vencer nos próximos 30 dias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEmployees.map((e, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl">
                      {e.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{e.name}</div>
                      <div className="text-sm text-gray-600">{e.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-700 font-bold font-mono text-sm">{e.days}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de períodos */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Períodos a vencer</h3>
              </div>
              <div className="overflow-x-auto">
                <div className="bg-white border-b-2 border-gray-200 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Funcionário</div>
                  <div className="col-span-2">Departamento</div>
                  <div className="col-span-3">Período</div>
                  <div className="col-span-2">Vencimento</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {tableRows.map((row, i) => {
                    const isOverdue = row.status === "overdue";
                    return (
                      <div key={i} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50">
                        <div className="col-span-3 font-medium text-gray-900">{row.name}</div>
                        <div className="col-span-2 text-sm text-gray-600">{row.dept}</div>
                        <div className="col-span-3 text-sm text-gray-600">{row.period}</div>
                        <div className="col-span-2 text-sm text-gray-600">{row.due}</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {isOverdue ? "Vencido" : "A vencer"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Projeção por mês */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-6">Projeção por mês</h3>
              <div className="space-y-4">
                {projectionMonths.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{m.label}</span>
                    <span className="font-medium text-gray-900">{m.value}</span>
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
            <p className="text-sm text-gray-500">Exportar ou analisar relatórios</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Exportar agora */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Exportar agora</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "PDF", icon: FileText, desc: "Documento" },
                  { name: "Excel", icon: Table, desc: "Planilha" },
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
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Insights</h4>
              <div className="space-y-3">
                {insights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>{item.bold}</strong>
                      {item.rest}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo de custos */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resumo de custos</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                {costRows.map((row, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-medium font-mono">
                      {row.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total provisionado 2026:</span>
                  <span className="font-bold font-mono text-blue-700">
                    {totalProvisioned.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações urgentes */}
            <div>
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">Ações urgentes</h4>
              <div className="space-y-2">
                {urgentActions.map((action, i) => (
                  <div key={i} className="text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
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
                Agende relatórios para receber análises periódicas sobre férias vencidas e próximas.
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