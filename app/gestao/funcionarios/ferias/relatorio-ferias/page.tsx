"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
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
const CATEGORY_CONFIG: Record<ReportCategory, { bg: string; color: string }> = {
  expiring: { bg: "bg-red-50", color: "text-red-700" },
  projection: { bg: "bg-blue-50", color: "text-blue-700" },
  cost: { bg: "bg-emerald-50", color: "text-emerald-700" },
  history: { bg: "bg-purple-50", color: "text-purple-700" },
  availability: { bg: "bg-amber-50", color: "text-amber-700" },
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
  { label: "Provisão mensal", value: "R$ 4.200,00" },
  { label: "Pago no ano", value: "R$ 12.600,00" },
  { label: "A pagar (próximos 30d)", value: "R$ 5.800,00" },
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

// ── Modal Exportar ──
function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [format, setFormat] = useState<ExportFormat>("PDF");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Exportar Relatório de Férias</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relatório</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option>Férias Vencidas - 2026</option>
              <option>Projeção Anual - 2026</option>
              <option>Custo de Férias - 2026</option>
              <option>Histórico por Funcionário</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Formato</label>
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
                    p-4 border rounded-xl text-center transition
                    ${format === f.name
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  <f.icon className="mx-auto mb-2 text-gray-600" size={28} />
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Incluir no relatório</label>
            <div className="space-y-3">
              {["Lista detalhada", "Resumo de custos", "Gráficos e projeções", "Alertas e ações urgentes"].map((item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enviar por e-mail (opcional)</label>
            <input
              placeholder="email@exemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
            <Download size={18} /> Exportar
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

  const currentReport = reportTypes[selectedReport];
  const cfg = CATEGORY_CONFIG[currentReport.category];

  return (
    <AppShell active="gestao-funcionarios-relatorios-ferias">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Gestão</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500 font-medium">Funcionários</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Relatórios de Férias</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Agendar Relatório
          </button>
          <button
            onClick={() => setModalExportOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Tipos de relatório + Período */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Relatórios de Férias
            </h3>
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

          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Período
            </h3>
            <div className="space-y-2">
              {periodOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setSelectedPeriod(p.value)}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition
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
              <div className="mt-4 space-y-3">
                <input
                  type="month"
                  defaultValue="2026-01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="month"
                  defaultValue="2026-12"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Área central – Preview do relatório */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Cabeçalho do relatório */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {reportTypes[selectedReport].name}
                </h1>
                <p className="text-gray-600">
                  {periodOptions.find(p => p.value === selectedPeriod)?.label || "Período personalizado"} • 2026
                </p>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-700">
                  <Filter size={18} /> Filtrar
                </button>
                <button
                  onClick={() => setModalExportOpen(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  <Download size={18} /> Exportar
                </button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Férias vencidas", value: "2", sub: "funcionários", positive: false },
                { label: "Dias em dobro", value: "45", sub: "dias", positive: false },
                { label: "Custo estimado", value: "R$ 8.450", sub: "em dobro", positive: false },
                { label: "A vencer (30d)", value: "3", sub: "funcionários", positive: null },
              ].map((k, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {k.label}
                  </div>
                  <div className="text-3xl font-bold font-mono text-gray-900 mb-1">
                    {k.value}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      k.positive === false ? "text-red-700" : k.positive === true ? "text-emerald-700" : "text-gray-600"
                    }`}
                  >
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Funcionários com férias vencidas */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Funcionários com férias vencidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {overdueEmployees.map((e, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xl">
                      {e.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{e.name}</div>
                      <div className="text-sm text-gray-600">{e.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-700 font-bold font-mono">{e.days}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* A vencer nos próximos 30 dias */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">A vencer nos próximos 30 dias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEmployees.map((e, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl">
                      {e.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{e.name}</div>
                      <div className="text-sm text-gray-600">{e.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-700 font-bold font-mono">{e.days}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de períodos */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-12 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Períodos a vencer</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Funcionário", "Departamento", "Período", "Vencimento", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tableRows.map((row, i) => {
                      const isOverdue = row.status === "overdue";
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{row.dept}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{row.period}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{row.due}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isOverdue ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {isOverdue ? "Vencido" : "A vencer"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Projeção por mês */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Projeção por mês</h3>
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
        </main>

        {/* Coluna direita – Exportação + Insights */}
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ações rápidas</h3>
            <p className="text-sm text-gray-500">Exportar ou analisar</p>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Exportar agora</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "PDF", icon: FileText },
                  { name: "Excel", icon: Table },
                  { name: "E-mail", icon: Mail },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setModalExportOpen(true)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition text-center"
                  >
                    <item.icon className="mx-auto mb-2 text-gray-600" size={28} />
                    <div className="text-sm font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Insights</h4>
              <div className="space-y-3">
                {insights.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>{item.bold}</strong>
                      {item.rest}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Resumo de custos</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                {costRows.map((row, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-medium font-mono">{row.value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total provisionado 2026:</span>
                  <span className="font-bold font-mono text-blue-700">R$ 50.400,00</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-4">Ações urgentes</h4>
              <div className="space-y-2">
                {urgentActions.map((action, i) => (
                  <div key={i} className="text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Exportar */}
      <ExportModal isOpen={modalExportOpen} onClose={() => setModalExportOpen(false)} />
    </AppShell>
  );
}