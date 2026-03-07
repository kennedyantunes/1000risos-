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
  Trash2,
  FileText,
} from "lucide-react";

// ── Tipos ──
type PayableStatus = "pending" | "paid" | "overdue" | "recurring";

interface Payable {
  id: number;
  supplier: string;
  description: string;
  category: string;
  value: number;
  dueDate: string;
  status: PayableStatus;
  statusText: string;
  installment?: string;
  footerLeft: string;
  footerRight: string;
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
  recurring: {
    label: "Recorrente",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-500",
  },
};

// ── Mock Data ──
const mockPayables: Payable[] = [
  {
    id: 0,
    supplier: "Casa das Carnes",
    description: "Compra de carnes - NF 12345",
    category: "Fornecedor",
    value: 890,
    dueDate: "28/02/2026",
    status: "overdue",
    statusText: "Vencido",
    footerLeft: "Atraso: 6 dias",
    footerRight: "Compra vinculada",
  },
  {
    id: 1,
    supplier: "Moinho Dourado",
    description: "Farinha, açúcar e derivados",
    category: "Fornecedor",
    value: 1240,
    dueDate: "10/03/2026",
    status: "pending",
    statusText: "Pendente",
    installment: "2/3 parcelas",
    footerLeft: "Pedido #SC-0042",
    footerRight: "Em dia",
  },
  {
    id: 2,
    supplier: "Enel",
    description: "Energia elétrica - março",
    category: "Conta fixa",
    value: 450,
    dueDate: "15/03/2026",
    status: "recurring",
    statusText: "Recorrente",
    footerLeft: "Consumo médio: 420 kWh",
    footerRight: "Débito automático",
  },
  {
    id: 3,
    supplier: "João (freelancer)",
    description: "Serviço de garçom - Casamento Silva",
    category: "Freelancer",
    value: 380,
    dueDate: "12/03/2026",
    status: "pending",
    statusText: "Pendente",
    footerLeft: "Evento: 07/03/2026",
    footerRight: "8 horas",
  },
  {
    id: 4,
    supplier: "Sabesp",
    description: "Água - fevereiro",
    category: "Conta fixa",
    value: 320,
    dueDate: "05/03/2026",
    status: "paid",
    statusText: "Pago",
    footerLeft: "Pago via PIX",
    footerRight: "Comprovante anexado",
  },
  {
    id: 5,
    supplier: "Granja Ouro",
    description: "Ovos e laticínios",
    category: "Fornecedor",
    value: 520,
    dueDate: "18/03/2026",
    status: "pending",
    statusText: "Pendente",
    footerLeft: "Pedido #SC-0045",
    footerRight: "Entrega: 10/03",
  },
];

export default function ContasAPagarPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<PayableStatus | "all">("all");
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [modalPayOpen, setModalPayOpen] = useState(false);

  const selectedPayable = mockPayables.find((p) => p.id === selectedId) || mockPayables[0];

  const filteredPayables =
    statusFilter === "all"
      ? mockPayables
      : mockPayables.filter((p) => p.status === statusFilter);

  return (
    <AppShell active="financeiro-contas-a-pagar">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Financeiro</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Contas a Pagar</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Relatórios
          </button>
          <button
            onClick={() => setModalNewOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Nova Conta
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
                placeholder="Buscar por fornecedor, descrição..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {[
              { status: "all", label: "Todas", count: mockPayables.length, color: "bg-gray-100 text-gray-700" },
              { status: "pending", label: "Pendentes", count: 12, color: "bg-amber-100 text-amber-800" },
              { status: "overdue", label: "Vencidas", count: 4, color: "bg-red-100 text-red-800" },
              { status: "paid", label: "Pagas", count: 8, color: "bg-emerald-100 text-emerald-800" },
              { status: "recurring", label: "Recorrentes", count: 5, color: "bg-purple-100 text-purple-800" },
            ].map((s) => (
              <button
                key={s.status}
                onClick={() => setStatusFilter(s.status as any)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${statusFilter === s.status
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
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

        {/* Lista de contas */}
        <div className="w-[420px] border-r border-gray-200 bg-gray-50/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Contas a Pagar · {filteredPayables.length}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredPayables.map((pay) => {
              const isSelected = pay.id === selectedId;
              const cfg = STATUS_CONFIG[pay.status];

              return (
                <div
                  key={pay.id}
                  onClick={() => setSelectedId(pay.id)}
                  className={`
                    p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate">{pay.supplier}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">{pay.category}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {pay.description}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold font-mono text-gray-900">
                      {pay.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="text-sm text-gray-500">Venc: {pay.dueDate}</div>
                  </div>

                  {pay.installment && (
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
                      {pay.installment}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 flex justify-between pt-3 border-t border-gray-100">
                    <span>{pay.footerLeft}</span>
                    <span>{pay.footerRight}</span>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPayable.supplier}</h1>
        <p className="text-gray-600">{selectedPayable.description}</p>
        <div className="flex items-center gap-6 text-sm mt-3">
          <span className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-gray-500" />
            Vencimento: {selectedPayable.dueDate}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setModalPayOpen(true)}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          Registrar Pagamento
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
        <div className="text-3xl font-bold font-mono text-blue-700">
          {selectedPayable.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Vencimento
        </div>
        <div className="text-xl font-bold">{selectedPayable.dueDate}</div>
        {selectedPayable.status === "overdue" && (
          <div className="text-sm text-red-600 mt-2 font-medium">Atraso detectado</div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Status
        </div>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
            STATUS_CONFIG[selectedPayable.status].bg
          } ${STATUS_CONFIG[selectedPayable.status].color}`}
        >
          {STATUS_CONFIG[selectedPayable.status].label}
        </span>
      </div>
    </div>

    {/* ── Itens da compra (tabela) ── */}
    <div className="mb-12">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
        Itens da Compra
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr] bg-gray-100 border-b border-gray-200">
          {["Item", "Quantidade", "Valor unitário", "Total"].map((h) => (
            <div
              key={h}
              className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-200">
          {/* Exemplo fixo – você pode tornar dinâmico depois */}
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-4">
            <div className="text-sm font-medium">Picanha (kg)</div>
            <div className="text-sm font-mono">3,5</div>
            <div className="text-sm font-mono">
              {89.9.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div className="text-sm font-mono font-bold text-blue-700">
              {(89.9 * 3.5).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-4">
            <div className="text-sm font-medium">Maminha (kg)</div>
            <div className="text-sm font-mono">5</div>
            <div className="text-sm font-mono">
              {52.9.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div className="text-sm font-mono font-bold text-blue-700">
              {(52.9 * 5).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-4">
            <div className="text-sm font-medium">Linguiça toscana (kg)</div>
            <div className="text-sm font-mono">3</div>
            <div className="text-sm font-mono">
              {29.9.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div className="text-sm font-mono font-bold text-blue-700">
              {(29.9 * 3).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-gray-100 flex justify-between text-base font-bold">
          <span>Total</span>
          <span className="text-blue-700">
            R$ 736,45
          </span>
        </div>
      </div>
    </div>

    {/* ── Histórico de movimentações ── */}
    <div className="mb-12">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
        Histórico de Movimentações
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Boleto gerado</div>
            <div className="text-sm text-gray-500">28/02/2026 às 14:30</div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-red-600">R$ 890,00</div>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FileText size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Nota fiscal emitida</div>
            <div className="text-sm text-gray-500">25/02/2026 às 09:15</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">NF 12345</div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Anexos / comprovantes ── */}
    <div className="mb-12">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
        Anexos / Comprovantes ({2})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <FileText size={24} className="text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">NF_12345.pdf</div>
            <div className="text-xs text-gray-500">156 KB • 25/02/2026</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <FileText size={24} className="text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">Comprovante_Pix_890.pdf</div>
            <div className="text-xs text-gray-500">284 KB • 06/03/2026</div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Observações ── */}
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
        Observações
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
        Entrega realizada em 25/02. Pagamento em atraso, já foi enviado e-mail de cobrança no dia 03/03. Fornecedor informou que aceita parcelamento em até 3x sem juros a partir da próxima compra.
      </div>
    </div>
  </div>
</main>
      </div>

      {/* ── Modal: Nova Conta a Pagar ── */}
      {modalNewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Nova Conta a Pagar</h2>
              <button
                onClick={() => setModalNewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor *</label>
                <input
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Ex: Casa das Carnes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>Fornecedor</option>
                  <option>Conta fixa</option>
                  <option>Freelancer</option>
                  <option>Compra vinculada</option>
                  <option>Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex: Energia elétrica março/2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de vencimento *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                >
                  <Plus size={18} /> Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Registrar Pagamento ── */}
      {modalPayOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Registrar Pagamento</h2>
              <button
                onClick={() => setModalPayOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor a pagar</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={selectedPayable.value}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data do pagamento</label>
                <input
                  type="date"
                  defaultValue="2026-03-07"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de pagamento</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>PIX</option>
                  <option>Transferência bancária</option>
                  <option>Boleto</option>
                  <option>Cartão de crédito</option>
                  <option>Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Informações adicionais sobre o pagamento..."
                />
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalPayOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}