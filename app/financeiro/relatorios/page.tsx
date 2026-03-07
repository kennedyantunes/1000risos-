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
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Mail,
  Table,
} from "lucide-react";

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
const CATEGORY_CONFIG: Record<ReportCategory, { bg: string; color: string }> = {
  finance: { bg: "bg-emerald-50", color: "text-emerald-700" },
  operations: { bg: "bg-cyan-50", color: "text-cyan-700" },
  people: { bg: "bg-purple-50", color: "text-purple-700" },
  events: { bg: "bg-amber-50", color: "text-amber-700" },
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

// ── Dados de exemplo ──
const barData = [40, 65, 25, 15, 55, 75, 0, 45];
const maxBar = Math.max(...barData);

const tableRows = [
  { name: "Aniversário Sofia", date: "06/03", value: "R$ 4.500", status: "paid" },
  { name: "Casamento Silva", date: "07/03", value: "R$ 8.200", status: "paid" },
  { name: "Formatura João", date: "08/03", value: "R$ 3.800", status: "pending" },
  { name: "Aniversário Pedro", date: "12/03", value: "R$ 2.900", status: "paid" },
  { name: "Corporativo XPTO", date: "15/03", value: "R$ 5.600", status: "pending" },
];

const STATUS_CONFIG = {
  paid: { label: "Pago", color: "text-emerald-700", bg: "bg-emerald-50" },
  pending: { label: "Pendente", color: "text-red-700", bg: "bg-red-50" },
};

const categoryTotals = [
  { name: "Aniversários", events: 4, total: "R$ 13.200" },
  { name: "Casamentos", events: 2, total: "R$ 14.500" },
  { name: "Corporativo", events: 1, total: "R$ 5.600" },
];

const comparisonMonths = [
  { label: "Janeiro", value: "R$ 28.450", trend: "+8%", up: true },
  { label: "Fevereiro", value: "R$ 29.300", trend: "+3%", up: true },
  { label: "Março (atual)", value: "R$ 32.800", trend: "+12%", up: true },
];

const topClients = [
  { label: "Silva (Casamento)", value: "R$ 8.200" },
  { label: "XPTO Corporativo", value: "R$ 5.600" },
  { label: "Sofia (Aniversário)", value: "R$ 4.500" },
];

const insights = [
  "Faturamento 12% maior que fevereiro",
  "Casamentos representam 44% do faturamento",
  "Ticket médio subiu de R$ 4.450 para R$ 4.685",
  "Inadimplência aumentou 0,8% - atenção",
];

// ── Modal Exportar ──
function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [format, setFormat] = useState<ExportFormat>("PDF");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Exportar Relatório</h2>
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
              <option>Faturamento - Março 2026</option>
              <option>Lucratividade - Março 2026</option>
              <option>Custo por Evento - Março 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Formato</label>
            <div className="grid grid-cols-2 gap-4">
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
              {["Gráficos", "Tabela detalhada", "Comparativo com período anterior", "Insights e análises"].map((item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
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
export default function RelatoriosPage() {
  const [selectedReport, setSelectedReport] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("this_month");
  const [modalExportOpen, setModalExportOpen] = useState(false);

  const currentReport = reportTypes[selectedReport];
  const cfg = CATEGORY_CONFIG[currentReport.category];

  return (
    <AppShell active="financeiro-relatorios">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Financeiro</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Relatórios Gerenciais</span>
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
              Tipos de Relatório
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
                  type="date"
                  defaultValue="2026-03-01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="date"
                  defaultValue="2026-03-31"
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
                  {periodOptions.find(p => p.value === selectedPeriod)?.label || "Período personalizado"} • Março 2026
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
                { label: "Faturamento total", value: "R$ 32.800", compare: "↑ 12%", positive: true },
                { label: "Ticket médio", value: "R$ 4.685", compare: "↑ 5%", positive: true },
                { label: "Eventos realizados", value: "7", compare: "igual", positive: null },
                { label: "Inadimplência", value: "3,2%", compare: "↑ 0,8%", positive: false },
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
                      k.positive === true
                        ? "text-emerald-700"
                        : k.positive === false
                        ? "text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {k.compare}
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfico de barras simples */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Faturamento Diário</h3>
              <div className="flex items-end gap-3 h-64">
                {barData.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all"
                      style={{ height: `${(height / maxBar) * 100}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de eventos */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-12 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Eventos do Período</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Evento", "Data", "Valor", "Status"].map((h) => (
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
                    {tableRows.map((row) => {
                      const sc = STATUS_CONFIG[row.status];
                      return (
                        <tr key={row.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                          <td className="px-6 py-4 text-sm font-mono font-bold text-blue-700">
                            {row.value}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totais por categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {categoryTotals.map((cat) => (
                <div key={cat.name} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600 mb-2">{cat.name}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold font-mono text-gray-900">
                        {cat.total}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{cat.events} eventos</div>
                    </div>
                    <BarChart3 size={32} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Comparativo mensal */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparativo Mensal</h3>
              <div className="space-y-4">
                {comparisonMonths.map((m) => (
                  <div key={m.label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{m.label}</span>
                    <div className="text-right">
                      <div className="font-bold font-mono text-gray-900">{m.value}</div>
                      <div
                        className={`text-sm font-medium ${
                          m.up ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {m.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Coluna direita – Exportação rápida + Insights */}
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ações rápidas</h3>
            <p className="text-sm text-gray-500">Exportar ou agendar</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Exportar agora</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "PDF", icon: FileText },
                  { name: "Excel", icon: Table },
                  { name: "CSV", icon: Download },
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
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Insights do período</h4>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Top clientes</h4>
              <div className="space-y-3">
                {topClients.map((client, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{client.label}</span>
                    <span className="font-mono font-bold text-gray-900">{client.value}</span>
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