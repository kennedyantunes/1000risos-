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
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle2,
  DollarSign,
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

// ── Mock Data ── (mantido igual)
const mockDailySummaries: DailySummary[] = [
  { date: "06/03/2026", label: "Hoje", balance: 7850, in: 8200, out: 350, inCount: 2, outCount: 3 },
  { date: "05/03/2026", label: "Ontem", balance: 5420, in: 5800, out: 380, inCount: 1, outCount: 2 },
  { date: "04/03/2026", balance: -350, in: 0, out: 350, inCount: 0, outCount: 1 },
  { date: "03/03/2026", balance: 2890, in: 3500, out: 610, inCount: 2, outCount: 3 },
  { date: "02/03/2026", balance: 6450, in: 6800, out: 350, inCount: 1, outCount: 2 },
  { date: "01/03/2026", balance: 3980, in: 4500, out: 520, inCount: 2, outCount: 1 },
];

const mockMovements: Movement[] = [
  { id: 0, type: "in", title: "Aniversário Sofia", value: 4500, time: "09:30", meta: "Cliente: Carla Mendes", category: "Evento" },
  { id: 1, type: "in", title: "Casamento Silva - sinal", value: 3700, time: "11:45", meta: "PIX", category: "Evento" },
  { id: 2, type: "out", title: "Casa das Carnes", value: 890, time: "14:20", meta: "Boleto pago", category: "Fornecedor" },
  { id: 3, type: "out", title: "João (freelancer)", value: 380, time: "10:15", meta: "PIX", category: "Freelancer" },
  { id: 4, type: "out", title: "Material descartável", value: 245, time: "16:30", meta: "Cartão", category: "Compra" },
];

export default function FluxoCaixaPage() {
  const [selectedDate, setSelectedDate] = useState<string>("06/03/2026");
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
  const [modalNewOpen, setModalNewOpen] = useState(false);

  const selectedDay = mockDailySummaries.find(d => d.date === selectedDate) || mockDailySummaries[0];

  const filteredMovements = mockMovements.filter(
    m => typeFilter === "all" || m.type === typeFilter
  );

  return (
    <AppShell active="financeiro-fluxo-de-caixa">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Financeiro</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Fluxo de Caixa</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Exportar
          </button>
          <button
            onClick={() => setModalNewOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Lançamento
          </button>
        </div>
      </header>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Resumo rápido no topo */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Saldo atual</div>
                <div className="text-3xl font-bold font-mono text-blue-700">
                  R$ 47.235,00
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Atualizado em 06/03/2026 14:30
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="text-sm text-emerald-700 mb-1">Entradas (mês)</div>
                <div className="text-3xl font-bold font-mono text-emerald-700">
                  R$ 32.800
                </div>
                <div className="text-sm text-gray-600 mt-2">12 movimentações</div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="text-sm text-red-700 mb-1">Saídas (mês)</div>
                <div className="text-3xl font-bold font-mono text-red-700">
                  R$ 24.565
                </div>
                <div className="text-sm text-gray-600 mt-2">18 movimentações</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e período */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3">
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
                    px-5 py-2 text-sm font-medium rounded-full transition
                    ${period === p.value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <input
                  placeholder="Buscar movimentação..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Todos os tipos</option>
                <option value="in">Apenas entradas</option>
                <option value="out">Apenas saídas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conteúdo principal – duas áreas verticais */}
        <div className="flex flex-1 overflow-hidden">
          {/* Coluna esquerda: Dias */}
          <div className="w-full md:w-96 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Dias</h2>
              <div className="space-y-3">
                {mockDailySummaries.map((day, idx) => {
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
                          <div className="font-semibold">
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

                      <div className="flex gap-6 text-sm mt-2">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <ArrowUpCircle size={16} /> +
                          {day.in.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <span className="flex items-center gap-1.5 text-red-700">
                          <ArrowDownCircle size={16} /> -
                          {day.out.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna direita: Movimentações do dia selecionado */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Movimentações • {selectedDate}{" "}
                  {selectedDay.label && `(${selectedDay.label})`}
                </h2>
              </div>

              <div className="space-y-4">
                {filteredMovements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Nenhuma movimentação encontrada para este filtro.
                  </div>
                ) : (
                  filteredMovements.map(m => (
                    <div
                      key={m.id}
                      className="flex items-start gap-5 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${
                          m.type === "in"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {m.type === "in" ? <ArrowUpCircle /> : <ArrowDownCircle />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 truncate">{m.title}</h4>
                            <div className="text-sm text-gray-600 mt-0.5">{m.meta}</div>
                          </div>
                          <div
                            className={`text-xl font-bold font-mono whitespace-nowrap ${
                              m.type === "in" ? "text-emerald-700" : "text-red-700"
                            }`}
                          >
                            {m.type === "in" ? "+" : "-"}
                            {m.value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {m.time}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {m.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Resumo do dia selecionado */}
                <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do dia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center sm:text-left">
                      <div className="text-sm text-gray-600 mb-1">Entradas</div>
                      <div className="text-2xl font-bold font-mono text-emerald-700">
                        + {selectedDay.in.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {selectedDay.inCount} recebimentos
                      </div>
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="text-sm text-gray-600 mb-1">Saídas</div>
                      <div className="text-2xl font-bold font-mono text-red-700">
                        - {selectedDay.out.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {selectedDay.outCount} pagamentos
                      </div>
                    </div>

                    <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-gray-200 pt-6 sm:pt-0 sm:pl-6">
                      <div className="text-sm text-gray-600 mb-1">Saldo do dia</div>
                      <div
                        className={`text-2xl font-bold font-mono ${
                          selectedDay.balance >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
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
          </div>
        </div>
      </div>

      {/* Modal Novo Lançamento */}
      {modalNewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Novo Lançamento</h2>
              <button
                onClick={() => setModalNewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de movimento
                  </label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="flex-1 py-3 text-center font-medium bg-emerald-50 text-emerald-700 border-r border-gray-200"
                    >
                      Entrada
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-3 text-center font-medium hover:bg-gray-50"
                    >
                      Saída
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-03-07"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição / Título
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex: Recebimento aniversário Sofia"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option>Evento</option>
                    <option>Fornecedor</option>
                    <option>Freelancer</option>
                    <option>Compra</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de pagamento/recebimento
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option>PIX</option>
                    <option>Transferência bancária</option>
                    <option>Boleto</option>
                    <option>Cartão</option>
                    <option>Dinheiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vincular a (opcional)
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>-- Nenhum --</option>
                  <option>Aniversário Sofia</option>
                  <option>Casamento Silva</option>
                  <option>Casa das Carnes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações / detalhes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Informações complementares..."
                />
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
                  <Plus size={18} /> Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}