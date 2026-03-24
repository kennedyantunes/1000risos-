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
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  Edit,
  MoreHorizontal,
  AlertCircle,
  PieChart,
  BarChart3,
  LineChart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// ── Tipos ──
type MovementType = "in" | "out";

interface Movement {
  id: number;
  type: MovementType;
  title: string;
  value: number;
  time: string;
  meta: string;
  category: string;
  paymentMethod?: string;
  linkedTo?: string;
  notes?: string;
}

interface DailySummary {
  date: string;
  label?: string;
  balance: number;
  in: number;
  out: number;
  inCount: number;
  outCount: number;
}

// ── Mock Data ──
const mockDailySummaries: DailySummary[] = [
  { date: "06/03/2026", label: "Hoje", balance: 7850, in: 8200, out: 350, inCount: 2, outCount: 3 },
  { date: "05/03/2026", label: "Ontem", balance: 5420, in: 5800, out: 380, inCount: 1, outCount: 2 },
  { date: "04/03/2026", balance: -350, in: 0, out: 350, inCount: 0, outCount: 1 },
  { date: "03/03/2026", balance: 2890, in: 3500, out: 610, inCount: 2, outCount: 3 },
  { date: "02/03/2026", balance: 6450, in: 6800, out: 350, inCount: 1, outCount: 2 },
  { date: "01/03/2026", balance: 3980, in: 4500, out: 520, inCount: 2, outCount: 1 },
];

const mockMovements: Movement[] = [
  { id: 0, type: "in", title: "Aniversário Sofia", value: 4500, time: "09:30", meta: "Cliente: Carla Mendes", category: "Evento", paymentMethod: "PIX", linkedTo: "Evento #123" },
  { id: 1, type: "in", title: "Casamento Silva - sinal", value: 3700, time: "11:45", meta: "PIX", category: "Evento", paymentMethod: "PIX", linkedTo: "Evento #124" },
  { id: 2, type: "out", title: "Casa das Carnes", value: 890, time: "14:20", meta: "Boleto pago", category: "Fornecedor", paymentMethod: "Boleto", linkedTo: "SC-0042" },
  { id: 3, type: "out", title: "João (freelancer)", value: 380, time: "10:15", meta: "PIX", category: "Freelancer", paymentMethod: "PIX", linkedTo: "Evento #124" },
  { id: 4, type: "out", title: "Material descartável", value: 245, time: "16:30", meta: "Cartão", category: "Compra", paymentMethod: "Cartão" },
];

// ── Componente StatCard ──
function StatCard({ title, value, change, color, icon }: { title: string; value: string; change?: { value: number; type: "up" | "down" }; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${change.type === "up" ? "text-emerald-600" : "text-red-600"}`}>
            {change.type === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change.value}%
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

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`
      w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium
      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all
      appearance-none
      ${props.className || ""}
    `}
  >
    {props.children}
  </select>
);

// ── Modal de Novo Lançamento ──
function NewMovementModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    type: "in" as MovementType,
    title: "",
    value: "",
    date: new Date().toISOString().split('T')[0],
    category: "Evento",
    paymentMethod: "PIX",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Novo Lançamento</h2>
              <p className="text-sm text-gray-600 mt-1">Registre uma entrada ou saída</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Field label="Tipo de movimento" required>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "in" })}
                    className={`flex-1 py-3 text-center font-medium transition-all ${
                      form.type === "in"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "out" })}
                    className={`flex-1 py-3 text-center font-medium transition-all ${
                      form.type === "out"
                        ? "bg-red-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Saída
                  </button>
                </div>
              </Field>

              <Field label="Data" required>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Valor" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="pl-10 font-mono"
                  placeholder="0,00"
                />
              </div>
            </Field>

            <Field label="Descrição / Título" required>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Recebimento aniversário Sofia"
              />
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Categoria">
                <Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Evento</option>
                  <option>Fornecedor</option>
                  <option>Freelancer</option>
                  <option>Compra</option>
                  <option>Outros</option>
                </Select>
              </Field>
              <Field label="Forma de pagamento">
                <Select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option>PIX</option>
                  <option>Transferência</option>
                  <option>Boleto</option>
                  <option>Cartão</option>
                  <option>Dinheiro</option>
                </Select>
              </Field>
            </div>

            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Informações complementares..."
              />
            </Field>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Salvar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function FluxoCaixaPage() {
  const [selectedDate, setSelectedDate] = useState<string>("06/03/2026");
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  const selectedDay = mockDailySummaries.find(d => d.date === selectedDate) || mockDailySummaries[0];

  // Estatísticas mensais
  const monthlyIn = mockMovements.filter(m => m.type === "in").reduce((sum, m) => sum + m.value, 0);
  const monthlyOut = mockMovements.filter(m => m.type === "out").reduce((sum, m) => sum + m.value, 0);
  const currentBalance = monthlyIn - monthlyOut;

  // Filtrar movimentações
  const filteredMovements = mockMovements
    .filter(m => typeFilter === "all" || m.type === typeFilter)
    .filter(m =>
      searchTerm === "" ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.meta.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCreateMovement = (data: any) => {
    console.log("Novo lançamento:", data);
  };

  return (
    <AppShell active="financeiro-fluxo-de-caixa">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/financeiro" className="text-gray-500 hover:text-gray-700 font-medium">
            Financeiro
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Fluxo de Caixa</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar detalhes" : "Mostrar detalhes"}
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
            <span className="hidden sm:inline">Exportar</span>
          </button>
          
          <button
            onClick={() => setModalNewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo Lançamento</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Saldo Atual"
            value={currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 12, type: "up" }}
            color="bg-blue-600"
            icon={<Wallet size={20} className="text-blue-600" />}
          />
          <StatCard
            title="Entradas (mês)"
            value={monthlyIn.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-emerald-600"
            icon={<TrendingUp size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Saídas (mês)"
            value={monthlyOut.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-red-600"
            icon={<TrendingDown size={20} className="text-red-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar movimentação por título, categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={14} /> Filtros
          </button>
          
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">Todos os tipos</option>
            <option value="in">Apenas entradas</option>
            <option value="out">Apenas saídas</option>
          </select>
        </div>
      </div>

      {/* Botões de período */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-2">
        {[
          { value: "day", label: "Dia" },
          { value: "week", label: "Semana" },
          { value: "month", label: "Mês" },
          { value: "year", label: "Ano" },
        ].map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value as any)}
            className={`
              px-4 py-1.5 text-sm font-medium rounded-full transition
              ${period === p.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}
            `}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda - Dias */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Período</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockDailySummaries.map((day) => {
              const isSelected = day.date === selectedDate;
              const positive = day.balance >= 0;

              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    p-4 bg-white border rounded-xl cursor-pointer transition-all
                    ${isSelected
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow"}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {day.date} {day.label && `· ${day.label}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {day.inCount} entradas • {day.outCount} saídas
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold font-mono ${
                        positive ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {positive ? "+" : "-"}
                      {Math.abs(day.balance).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm mt-2">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <ArrowUpCircle size={14} /> +
                      {day.in.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                    <span className="flex items-center gap-1.5 text-red-700">
                      <ArrowDownCircle size={14} /> -
                      {day.out.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar dias"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Área principal - Movimentações */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Movimentações · {selectedDate}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredMovements.length} lançamentos
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-4" : "col-span-5"}`}>Movimentação</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Categoria</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Valor</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Horário</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"}`}>Tipo</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredMovements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhuma movimentação encontrada
                </div>
              ) : (
                filteredMovements.map(mov => {
                  const isExpanded = expandedItems === mov.id;
                  
                  return (
                    <div key={mov.id}>
                      <div className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition">
                        <div className={`${showDetailsPanel ? "col-span-4" : "col-span-5"}`}>
                          <div className="font-medium text-gray-900">{mov.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{mov.meta}</div>
                        </div>
                        <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center text-sm text-gray-600`}>
                          {mov.category}
                        </div>
                        <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                          <span className={`font-bold ${mov.type === "in" ? "text-emerald-700" : "text-red-700"}`}>
                            {mov.type === "in" ? "+" : "-"}
                            {mov.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                        </div>
                        <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center text-sm text-gray-600`}>
                          {mov.time}
                        </div>
                        <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"} flex items-center justify-between`}>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mov.type === "in" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {mov.type === "in" ? "Entrada" : "Saída"}
                          </div>
                          <button
                            onClick={() => setExpandedItems(isExpanded ? null : mov.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Linha expandida com detalhes */}
                      {isExpanded && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mov.paymentMethod && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase">Forma de pagamento</div>
                                <div className="text-sm font-medium text-gray-900 mt-1">{mov.paymentMethod}</div>
                              </div>
                            )}
                            {mov.linkedTo && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase">Vinculado a</div>
                                <div className="text-sm font-medium text-gray-900 mt-1">{mov.linkedTo}</div>
                              </div>
                            )}
                            <div className="col-span-2">
                              <div className="text-xs font-semibold text-gray-500 uppercase">Observações</div>
                              <div className="text-sm text-gray-600 mt-1">{mov.notes || "Sem observações adicionais"}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Resumo do dia */}
            <div className="bg-white border-t border-gray-200 p-6 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resumo do dia {selectedDate}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="text-sm text-emerald-700 mb-1">Entradas</div>
                  <div className="text-2xl font-bold font-mono text-emerald-700">
                    + {selectedDay.in.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {selectedDay.inCount} recebimentos
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <div className="text-sm text-red-700 mb-1">Saídas</div>
                  <div className="text-2xl font-bold font-mono text-red-700">
                    - {selectedDay.out.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {selectedDay.outCount} pagamentos
                  </div>
                </div>

                <div className={`rounded-xl p-5 ${selectedDay.balance >= 0 ? "bg-blue-50 border border-blue-200" : "bg-orange-50 border border-orange-200"}`}>
                  <div className="text-sm text-gray-600 mb-1">Saldo do dia</div>
                  <div className={`text-2xl font-bold font-mono ${selectedDay.balance >= 0 ? "text-blue-700" : "text-orange-700"}`}>
                    {selectedDay.balance >= 0 ? "+" : "-"}
                    {Math.abs(selectedDay.balance).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão flutuante para mostrar details panel quando oculto */}
        {!showDetailsPanel && (
          <button
            onClick={() => setShowDetailsPanel(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar detalhes"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Painel lateral direito - Resumo rápido */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-xl font-bold text-gray-900">Resumo do Período</h3>
            <p className="text-sm text-gray-500 mt-1">Análise rápida do fluxo de caixa</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Métricas */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-2">Ticket médio</div>
                <div className="text-xl font-bold text-gray-900">
                  R$ {((monthlyIn + monthlyOut) / (mockMovements.length || 1)).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-2">Movimentações</div>
                <div className="text-xl font-bold text-gray-900">{mockMovements.length}</div>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-emerald-600">Entradas: {mockMovements.filter(m => m.type === "in").length}</span>
                  <span className="text-red-600">Saídas: {mockMovements.filter(m => m.type === "out").length}</span>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Por Categoria</h4>
              <div className="space-y-3">
                {["Evento", "Fornecedor", "Freelancer", "Compra"].map(cat => {
                  const total = mockMovements.filter(m => m.category === cat).reduce((sum, m) => sum + m.value, 0);
                  const inTotal = mockMovements.filter(m => m.category === cat && m.type === "in").reduce((sum, m) => sum + m.value, 0);
                  const outTotal = mockMovements.filter(m => m.category === cat && m.type === "out").reduce((sum, m) => sum + m.value, 0);
                  
                  return (
                    <div key={cat} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{cat}</span>
                        <span className="font-bold text-gray-900">
                          {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className="text-emerald-600">+ {inTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        <span className="text-red-600">- {outTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dica */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle size={16} />
                <span className="text-xs font-semibold">Dica</span>
              </div>
              <p className="text-xs text-blue-700">
                Mantenha o fluxo de caixa sempre atualizado para melhor controle financeiro do seu negócio.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Novo Lançamento */}
      {modalNewOpen && (
        <NewMovementModal
          onClose={() => setModalNewOpen(false)}
          onSubmit={handleCreateMovement}
        />
      )}
    </AppShell>
  );
}