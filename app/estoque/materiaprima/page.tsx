"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Plus,
  Edit,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Truck,
  Phone,
  Mail,
  X,
  Download,
  Wrench,
} from "lucide-react";

// ── Tipos ──
type IngStatus = "good" | "low" | "expiring" | "critical";

interface Batch {
  code: string;
  qty: number;
  unit: string;
  expiry: string;
  cost: number;
}

interface IngHistory {
  date: string;
  type: "in" | "out" | "loss";
  desc: string;
  qty: string;
}

interface Ingredient {
  id: string;
  code: string;
  emoji: string;
  name: string;
  category: string;
  lot: string;
  expiry: string;
  expiryStatus: "normal" | "warning" | "critical";
  current: number;
  min: number;
  unit: string;
  costPerUnit: number;
  status: IngStatus;
  warehouse: string;
  shelf: string;
  section: string;
  supplier: string;
  supplierPhone: string;
  batches: Batch[];
  forecast: { event: string; qty: number; unit: string; date: string }[];
  history: IngHistory[];
}

// ── Mock Data (mantido igual ao seu original) ──
const ingredients: Ingredient[] = [
  {
    id: "ft001",
    code: "FT-001",
    emoji: "🌾",
    name: "Farinha de Trigo",
    category: "Farináceos",
    lot: "FT-1503",
    expiry: "20/06/26",
    expiryStatus: "normal",
    current: 24.5,
    min: 10,
    unit: "kg",
    costPerUnit: 3.2,
    status: "good",
    warehouse: "Despensa A",
    shelf: "Prateleira 2",
    section: "Farináceos",
    supplier: "Moinho Dourado",
    supplierPhone: "(11) 3456-7890",
    batches: [
      { code: "FT-1503", qty: 12, unit: "kg", expiry: "20/06/26", cost: 3.2 },
      { code: "FT-2202", qty: 8.5, unit: "kg", expiry: "15/07/26", cost: 3.4 },
      { code: "FT-0103", qty: 4, unit: "kg", expiry: "05/08/26", cost: 3.5 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 3.5, unit: "kg", date: "06/03" },
      { event: "Casamento Silva", qty: 5.2, unit: "kg", date: "07/03" },
      { event: "Formatura João", qty: 2.8, unit: "kg", date: "08/03" },
    ],
    history: [
      { date: "02/03", type: "in", desc: "Compra NF 12345", qty: "+15 kg" },
      { date: "01/03", type: "out", desc: "Aniversário João", qty: "-3,5 kg" },
      { date: "28/02", type: "out", desc: "Casamento Silva", qty: "-5 kg" },
    ],
  },
  // ... cole aqui os outros insumos do seu código original ...
  // (mantive apenas um para exemplo; adicione todos os seus)
];

// ── Categorias ──
const categories = [
  { name: "Todos", count: ingredients.length },
  { name: "Farináceos", count: ingredients.filter(i => i.category === "Farináceos").length },
  { name: "Laticínios", count: ingredients.filter(i => i.category === "Laticínios").length },
  { name: "Carnes", count: ingredients.filter(i => i.category === "Carnes").length },
  { name: "Congelados", count: ingredients.filter(i => i.category === "Congelados").length },
  { name: "Bebidas", count: ingredients.filter(i => i.category === "Bebidas").length },
  { name: "Descartáveis", count: ingredients.filter(i => i.category === "Descartáveis").length },
  { name: "Embalagens", count: ingredients.filter(i => i.category === "Embalagens").length },
  { name: "Temperos", count: ingredients.filter(i => i.category === "Temperos").length },
];

// ── Componente StatusBadge (reutilizável) ──
function StatusBadge({ status }: { status: IngStatus }) {
  const config: Record<IngStatus, { label: string; bg: string; text: string }> = {
    good:      { label: "OK",            bg: "bg-emerald-100", text: "text-emerald-800" },
    low:       { label: "Baixo",         bg: "bg-amber-100",  text: "text-amber-800"  },
    expiring:  { label: "Vencendo",      bg: "bg-orange-100", text: "text-orange-800" },
    critical:  { label: "Crítico",       bg: "bg-red-100",    text: "text-red-800"    },
  };

  const cfg = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1.5" />
      {cfg.label}
    </span>
  );
}

// ── Modal de Insumo (Editar/Novo) ──
function IngModal({
  ing,
  onClose,
}: {
  ing: Ingredient | null;
  onClose: () => void;
}) {
  const [batches, setBatches] = useState(
    ing?.batches.map(b => ({ ...b })) || [{ code: "", qty: 0, unit: "kg", expiry: "", cost: 0 }]
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {ing ? `Editar — ${ing.name}` : "Novo Insumo"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Nome do insumo <span className="text-blue-600">*</span>
              </label>
              <input
                defaultValue={ing?.name}
                placeholder="Ex: Farinha de Trigo"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Categoria <span className="text-blue-600">*</span>
              </label>
              <select
                defaultValue={ing?.category || "Farináceos"}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
              >
                {["Farináceos", "Laticínios", "Carnes", "Congelados", "Bebidas", "Descartáveis", "Embalagens", "Temperos"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Unidade de medida <span className="text-blue-600">*</span>
              </label>
              <select
                defaultValue={ing?.unit || "kg"}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
              >
                <option>kg</option>
                <option>litro</option>
                <option>unidade</option>
                <option>cento</option>
                <option>pacote</option>
                <option>fardo</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Estoque mínimo <span className="text-blue-600">*</span>
              </label>
              <input
                type="number"
                defaultValue={ing?.min || 10}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-10 mb-4 pb-2 border-b border-gray-200">
            Lotes em Estoque
          </h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_40px] bg-gray-50 border-b border-gray-200">
              {["Lote", "Quantidade", "Validade", "Custo unit.", ""].map(h => (
                <div key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {h}
                </div>
              ))}
            </div>
            {batches.map((b, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_40px] border-b border-gray-200">
                <input
                  defaultValue={b.code}
                  placeholder="Lote"
                  className="border-0 rounded-none px-4 py-3 text-sm font-mono focus:outline-none"
                />
                <input
                  defaultValue={b.qty}
                  type="number"
                  className="border-0 rounded-none px-4 py-3 text-sm font-mono focus:outline-none"
                />
                <input
                  type="date"
                  defaultValue={b.expiry}
                  className="border-0 rounded-none px-4 py-3 text-sm focus:outline-none"
                />
                <input
                  defaultValue={b.cost}
                  type="number"
                  className="border-0 rounded-none px-4 py-3 text-sm font-mono focus:outline-none"
                />
                <button
                  onClick={() => setBatches(prev => prev.filter((_, j) => j !== i))}
                  className="flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setBatches(prev => [...prev, { code: "", qty: 0, unit: "kg", expiry: "", cost: 0 }])}
              className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Adicionar lote
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fornecedor preferencial</label>
            <input
              defaultValue={ing?.supplier}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observações</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Informações adicionais, cuidados, etc..."
            />
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Salvar Insumo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Movimentação ──
function MovModal({ ing, onClose }: { ing: Ingredient; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Registrar Movimentação</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Tipo de movimentação <span className="text-blue-600">*</span>
            </label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none">
              <option>Entrada (compra)</option>
              <option>Consumo em evento</option>
              <option>Perda / Vencimento</option>
              <option>Descarte</option>
              <option>Devolução</option>
              <option>Ajuste de inventário</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Quantidade <span className="text-blue-600">*</span>
              </label>
              <input
                type="number"
                defaultValue="2.5"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Data <span className="text-blue-600">*</span>
              </label>
              <input
                type="date"
                defaultValue="2026-03-07"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-6">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Selecionar lote</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none">
              {ing.batches.map(b => (
                <option key={b.code}>
                  {b.code} ({b.qty} {b.unit} · R$ {b.cost.toFixed(2).replace(".", ",")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mt-6">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vincular a evento (opcional)</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none">
              <option>-- Selecione um evento --</option>
              <option>Aniversário Sofia (06/03)</option>
              <option>Casamento Silva (07/03)</option>
              <option>Formatura João (08/03)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mt-6">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observações</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Descreva o motivo..."
            />
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong className="flex items-center gap-2">
              <AlertCircle size={16} /> Atenção
            </strong>
            <p className="mt-1">
              Ao registrar consumo, o estoque será baixado automaticamente.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Registrar Movimentação
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function MateriaPrimaPage() {
  const [selectedId, setSelectedId] = useState<string>("ft001");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [modal, setModal] = useState<{ type: "ing" | "mov"; title?: string } | null>(null);

  const selectedIng = ingredients.find(i => i.id === selectedId) || ingredients[0];

  const filteredIngredients =
    selectedCategory === "Todos"
      ? ingredients
      : ingredients.filter(i => i.category === selectedCategory);

  const totalForecast = selectedIng.forecast.reduce((sum, f) => sum + f.qty, 0);
  const stockSafetyPct = Math.min(100, Math.round((selectedIng.current / Math.max(selectedIng.min * 2, selectedIng.current)) * 100));

  return (
    <AppShell active="estoque-materiaprima">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Estoque</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Matéria-Prima</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Sugestão de Compras
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Wrench size={16} /> Inventário
          </button>
          <button
            onClick={() => setModal({ type: "ing", title: "Novo Insumo" })}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Insumo
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de categorias */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorias</h3>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                placeholder="Buscar categoria..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${selectedCategory === cat.name
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span>{cat.name}</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Alertas</h4>
            <div className="space-y-3">
              {[
                { type: "critical", icon: AlertCircle, label: "Vencimento crítico", count: 3, color: "text-red-600" },
                { type: "warning", icon: Clock, label: "Estoque baixo", count: 8, color: "text-amber-600" },
                { type: "info", icon: Package, label: "Sugestão de compra", count: 5, color: "text-blue-600" },
              ].map(alert => (
                <div key={alert.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <alert.icon size={16} className={alert.color} />
                    {alert.label}
                  </div>
                  <span className={`font-medium ${alert.color}`}>{alert.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Lista de insumos */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Insumos · {filteredIngredients.length} itens
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                Sugestão de Compras
              </button>
              <button
                onClick={() => setModal({ type: "ing", title: "Novo Insumo" })}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
              >
                <Plus size={16} /> Novo Insumo
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIngredients.map(ing => {
                const pct = Math.min(100, Math.round((ing.current / Math.max(ing.min * 2, ing.current)) * 100));
                const statusColor =
                  ing.status === "good"
                    ? "text-emerald-700"
                    : ing.status === "low"
                    ? "text-amber-700"
                    : ing.status === "expiring"
                    ? "text-orange-700"
                    : "text-red-700";

                return (
                  <div
                    key={ing.id}
                    onClick={() => setSelectedId(ing.id)}
                    className={`
                      group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                      ${ing.id === selectedId ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-lg hover:border-blue-300"}
                    `}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-3xl shadow-sm">
                            {ing.emoji}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{ing.name}</h3>
                            <p className="text-sm text-gray-600">{ing.category}</p>
                          </div>
                        </div>
                        <StatusBadge status={ing.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Lote Atual</div>
                          <div className="font-mono font-medium">{ing.lot}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Validade</div>
                          <div className={`font-medium ${ing.expiryStatus === "critical" ? "text-red-600" : ing.expiryStatus === "warning" ? "text-orange-600" : ""}`}>
                            {ing.expiry}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold font-mono text-gray-900">
                          {ing.current} / {ing.min}
                        </div>
                        <div className={`text-sm font-medium ${statusColor}`}>
                          {ing.current <= ing.min ? "Crítico" : `${pct}% seguro`}
                        </div>
                      </div>

                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 70 ? "bg-emerald-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel lateral de detalhes */}
        <aside className="w-96 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedIng.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedIng.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ type: "ing", title: `Editar — ${selectedIng.name}` })}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setModal({ type: "mov" })}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                >
                  <Package size={18} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <StatusBadge status={selectedIng.status} />
              <span className="text-sm text-gray-600 font-mono">Lote: {selectedIng.lot}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Alerta de sugestão */}
            <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-800">Sugestão de Compra</h4>
              </div>
              <p className="text-sm text-blue-700">
                Baseado em eventos próximos: <strong>{(totalForecast - selectedIng.current + selectedIng.min).toFixed(1)} {selectedIng.unit}</strong> recomendados
              </p>
              <button className="mt-3 text-sm font-medium text-blue-700 hover:underline">
                Gerar solicitação de compra →
              </button>
            </div>

            {/* Estoque Atual */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Estoque Atual
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{selectedIng.current}</div>
                    <div className="text-xs text-gray-600 mt-1">Atual</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">{selectedIng.min}</div>
                    <div className="text-xs text-gray-600 mt-1">Mínimo</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-700">{selectedIng.unit}</div>
                    <div className="text-xs text-gray-600 mt-1">Unidade</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stockSafetyPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Previsão de Consumo */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                Previsão de Consumo (7 dias)
                <span className="text-blue-600 text-xs cursor-pointer hover:underline">Ver mais</span>
              </h4>
              <div className="space-y-4">
                {selectedIng.forecast.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div>
                      <div className="font-medium text-gray-900">{f.event}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {f.date} · {f.qty} {f.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{f.qty} {f.unit}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 flex justify-between text-sm font-bold">
                  <span>Total estimado</span>
                  <span className="text-blue-700">{totalForecast.toFixed(1)} {selectedIng.unit}</span>
                </div>
              </div>
            </div>

            {/* Lotes */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                Lotes em Estoque
                <span className="text-blue-600 text-xs cursor-pointer hover:underline">+ Adicionar</span>
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] bg-gray-100 border-b border-gray-200">
                  {["Lote", "Quantidade", "Validade", "Custo"].map(h => (
                    <div key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </div>
                  ))}
                </div>
                {selectedIng.batches.map(b => (
                  <div key={b.code} className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 last:border-0">
                    <div className="px-4 py-3 text-sm font-mono">{b.code}</div>
                    <div className="px-4 py-3 text-sm">{b.qty} {b.unit}</div>
                    <div className="px-4 py-3 text-sm">{b.expiry || "–"}</div>
                    <div className="px-4 py-3 text-sm font-mono">
                      R$ {b.cost.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Localização
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Depósito</span>
                  <span className="font-medium">{selectedIng.warehouse}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prateleira</span>
                  <span className="font-medium">{selectedIng.shelf}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seção</span>
                  <span className="font-medium">{selectedIng.section}</span>
                </div>
              </div>
            </div>

            {/* Fornecedor */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Fornecedor Preferencial
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="font-semibold text-gray-900">{selectedIng.supplier}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {selectedIng.supplierPhone}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modais */}
      {modal?.type === "ing" && (
        <IngModal ing={modal.title?.includes("Editar") ? selectedIng : null} onClose={() => setModal(null)} />
      )}
      {modal?.type === "mov" && <MovModal ing={selectedIng} onClose={() => setModal(null)} />}
    </AppShell>
  );
}