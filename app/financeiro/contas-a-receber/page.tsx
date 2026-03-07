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
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

// ── Tipos ──
type ReceivableStatus = "pending" | "paid" | "overdue" | "partial";

interface Receivable {
  id: number;
  client: string;
  event: string;
  value: number;
  dueDate: string;
  status: ReceivableStatus;
  statusText: string;
  installment: string;
  eventDate: string;
  delay: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG = {
  pending: {
    label: "Pendente",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-500",
  },
  paid: {
    label: "Pago",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-500",
  },
  overdue: {
    label: "Vencido",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-500",
  },
  partial: {
    label: "Parcial",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-500",
  },
};

// ── Mock Data ──
const mockReceivables: Receivable[] = [
  {
    id: 0,
    client: "Carlos Eduardo",
    event: "Casamento · 120 convidados",
    value: 1500,
    dueDate: "28/02/2026",
    status: "overdue",
    statusText: "Vencido",
    installment: "2ª parcela · Saldo restante",
    eventDate: "15/03/2026",
    delay: "6 dias",
  },
  {
    id: 1,
    client: "Ana Beatriz",
    event: "Aniversário 15 anos · 80 convidados",
    value: 2250,
    dueDate: "10/03/2026",
    status: "pending",
    statusText: "Pendente",
    installment: "Saldo final",
    eventDate: "10/03/2026",
    delay: "Em dia",
  },
  {
    id: 2,
    client: "Fernanda Lima",
    event: "Formatura · 150 convidados",
    value: 3800,
    dueDate: "15/03/2026",
    status: "pending",
    statusText: "Pendente",
    installment: "Única",
    eventDate: "20/03/2026",
    delay: "Em dia",
  },
  {
    id: 3,
    client: "Roberto Alves",
    event: "Corporativo · 50 convidados",
    value: 850,
    dueDate: "05/03/2026",
    status: "partial",
    statusText: "Parcial",
    installment: "2/3 · Pago: R$ 1.700,00",
    eventDate: "10/03/2026",
    delay: "Aguardando 2ª parcela",
  },
  {
    id: 4,
    client: "Patrícia Santos",
    event: "Aniversário infantil · 60 convidados",
    value: 3400,
    dueDate: "01/03/2026",
    status: "paid",
    statusText: "Pago",
    installment: "À vista",
    eventDate: "05/03/2026",
    delay: "Confirmado",
  },
  {
    id: 5,
    client: "Marcos Oliveira",
    event: "Casamento · 200 convidados",
    value: 2800,
    dueDate: "25/02/2026",
    status: "overdue",
    statusText: "Vencido",
    installment: "3ª parcela",
    eventDate: "10/03/2026",
    delay: "9 dias",
  },
];

export default function ContasAReceberPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<ReceivableStatus | "all">("all");
  const [modalReceiveOpen, setModalReceiveOpen] = useState(false);
  const [modalNewOpen, setModalNewOpen] = useState(false);

  const selectedReceivable = mockReceivables.find(r => r.id === selectedId) || mockReceivables[0];

  const filteredReceivables =
    statusFilter === "all"
      ? mockReceivables
      : mockReceivables.filter(r => r.status === statusFilter);

  return (
    <AppShell active="financeiro-contas-a-receber">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Financeiro</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Contas a Receber</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Relatórios
          </button>
          <button
            onClick={() => setModalReceiveOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition"
          >
            <Plus size={16} /> Registrar Recebimento
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Filtros e Status */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</h3>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                placeholder="Buscar por cliente, evento..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {[
              { status: "all", label: "Todas", count: mockReceivables.length, color: "bg-gray-100 text-gray-700" },
              { status: "pending", label: "Pendentes", count: 12, color: "bg-amber-100 text-amber-800" },
              { status: "overdue", label: "Vencidas", count: 3, color: "bg-red-100 text-red-800" },
              { status: "paid", label: "Pagas", count: 8, color: "bg-emerald-100 text-emerald-800" },
              { status: "partial", label: "Parciais", count: 1, color: "bg-purple-100 text-purple-800" },
            ].map(s => (
              <button
                key={s.status}
                onClick={() => setStatusFilter(s.status as any)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${statusFilter === s.status
                    ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  {s.label}
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {s.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Lista de contas a receber */}
        <div className="w-[420px] border-r border-gray-200 bg-gray-50/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Contas a Receber · {filteredReceivables.length}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredReceivables.map(rec => {
              const isSelected = rec.id === selectedId;
              const cfg = STATUS_CONFIG[rec.status];

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedId(rec.id)}
                  className={`
                    p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "ring-2 ring-emerald-500 shadow-md"
                      : "hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate">{rec.client}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">{rec.event}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold font-mono text-gray-900">
                      {rec.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="text-sm text-gray-500">Venc: {rec.dueDate}</div>
                  </div>

                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
                    {rec.installment}
                  </div>

                  <div className="text-xs text-gray-500 flex justify-between pt-3 border-t border-gray-100">
                    <span>Evento: {rec.eventDate}</span>
                    <span className={rec.delay.includes("dia") ? "text-red-600 font-medium" : ""}>
                      {rec.delay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel direito – Detalhes */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-5xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedReceivable.client}</h1>
                <p className="text-gray-600">{selectedReceivable.event}</p>
                <div className="flex items-center gap-6 text-sm mt-3">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-gray-500" />
                    Evento: {selectedReceivable.eventDate}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setModalReceiveOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
                >
                  Registrar Recebimento
                </button>
                <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                  Editar
                </button>
              </div>
            </div>

            {/* Resumo financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Valor Total
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-700">
                  {selectedReceivable.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Vencimento
                </div>
                <div className="text-xl font-bold">{selectedReceivable.dueDate}</div>
                {selectedReceivable.status === "overdue" && (
                  <div className="text-sm text-red-600 mt-2 font-medium">
                    {selectedReceivable.delay}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Status
                </div>
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                    STATUS_CONFIG[selectedReceivable.status].bg
                  } ${STATUS_CONFIG[selectedReceivable.status].color}`}
                >
                  {STATUS_CONFIG[selectedReceivable.status].label}
                </span>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Cliente
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                  {selectedReceivable.client
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{selectedReceivable.client}</div>
                  <div className="text-sm text-gray-600 mt-1">(11) 98765-4321 · cliente@email.com</div>
                </div>
              </div>
            </div>

            {/* Parcelas */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Parcelas
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_2fr_1fr_1fr] bg-gray-100 border-b border-gray-200">
                  {["Parcela", "Vencimento", "Valor", "Status"].map(h => (
                    <div key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </div>
                  ))}
                </div>
                {/* Exemplo fixo – pode virar dinâmico depois */}
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-[1fr_2fr_1fr_1fr] px-6 py-4">
                    <div className="text-sm font-medium">1/3</div>
                    <div className="text-sm">10/01/2026</div>
                    <div className="text-sm font-mono font-bold text-emerald-700">
                      R$ 3.000,00
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                        Pago
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr_1fr_1fr] px-6 py-4">
                    <div className="text-sm font-medium">2/3</div>
                    <div className="text-sm">10/02/2026</div>
                    <div className="text-sm font-mono font-bold text-emerald-700">
                      R$ 3.000,00
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                        Pago
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr_1fr_1fr] px-6 py-4">
                    <div className="text-sm font-medium">3/3</div>
                    <div className="text-sm">{selectedReceivable.dueDate}</div>
                    <div className="text-sm font-mono font-bold text-emerald-700">
                      R$ 3.000,00
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${STATUS_CONFIG[selectedReceivable.status].bg} ${STATUS_CONFIG[selectedReceivable.status].color}`}
                      >
                        {STATUS_CONFIG[selectedReceivable.status].label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-5 bg-gray-100 flex justify-between text-base font-bold">
                  <span>Total recebido</span>
                  <span className="text-emerald-700">R$ 6.000,00</span>
                </div>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Histórico de Pagamentos
              </h3>
              <div className="space-y-4">
                {[
                  { date: "10/02/2026", method: "PIX", value: 3000 },
                  { date: "10/01/2026", method: "Cartão", value: 3000 },
                  { date: "05/12/2025", method: "Dinheiro", value: 1500 },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 bg-gray-50 border border-gray-200 rounded-xl p-5"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{p.method}</div>
                      <div className="text-sm text-gray-500">{p.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-700">
                        R$ {p.value.toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Observações
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                Cliente solicitou adiamento da 3ª parcela para após o evento devido a imprevistos financeiros. Confirmado por e-mail em 01/03/2026. Pagamento parcial já recebido via PIX.
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Modal: Registrar Recebimento ── */}
      {modalReceiveOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Registrar Recebimento</h2>
              <button
                onClick={() => setModalReceiveOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente / Evento
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option>Carlos Eduardo · Casamento (R$ 1.500,00)</option>
                  <option>Ana Beatriz · Aniversário (R$ 2.250,00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parcela
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                    <option>3/3 · R$ 1.500,00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor recebido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={1500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data do recebimento
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-03-07"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de recebimento
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                    <option>PIX</option>
                    <option>Transferência</option>
                    <option>Dinheiro</option>
                    <option>Cartão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
                  placeholder="Adicione detalhes do pagamento..."
                />
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalReceiveOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Confirmar Recebimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Nova Conta a Receber ── */}
      {modalNewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Nova Conta a Receber</h2>
              <button
                onClick={() => setModalNewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vincular a evento
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option>-- Selecione um evento --</option>
                  <option>Casamento Carlos & Ana</option>
                  <option>Aniversário 15 anos Beatriz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de cobrança
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option>Entrada (sinal 50%)</option>
                  <option>Parcela única</option>
                  <option>Parcelado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimento
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalNewOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition flex items-center gap-2"
                >
                  <Plus size={18} /> Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}