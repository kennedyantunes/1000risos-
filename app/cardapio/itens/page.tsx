"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Plus,
  Download,
  Filter,
  X,
  DollarSign,
  Scale,
  Clock,
  Utensils,
  Apple,
  Edit,
} from "lucide-react";

// ── Tipos e Config ──
type CategoryKey = "salgado" | "doce" | "bebida" | "brinquedo" | "equipe";

interface MenuItem {
  id: number;
  name: string;
  emoji: string;
  category: CategoryKey;
  description: string;
  yield: number;          // rendimento base (unidades)
  stock: number;
  stockUnit: string;
  code: string;
  shelfLifeHours: number;
  difficulty: string;
  prepTimeMin: number;
  costPrice: number;      // custo unitário
  sellPrice: number;      // preço de venda unitário
  ingredients: Array<{
    name: string;
    qty: number;
    unit: string;
    costPerUnit: number;
  }>;
}

const CAT_COLORS: Record<CategoryKey, { badge: string; tag: string; label: string }> = {
  salgado:   { badge: "bg-red-50",   tag: "text-red-700",   label: "🥟 Salgado"   },
  doce:      { badge: "bg-amber-50", tag: "text-amber-700", label: "🍬 Doce"      },
  bebida:    { badge: "bg-blue-50",  tag: "text-blue-700",  label: "🥤 Bebida"    },
  brinquedo: { badge: "bg-purple-50",tag: "text-purple-700",label: "🎪 Brinquedo" },
  equipe:    { badge: "bg-emerald-50",tag: "text-emerald-700",label: "👥 Equipe"  },
};

const CATEGORY_LABELS = ["Todos", "Salgados", "Doces", "Bebidas", "Brinquedos", "Equipe"];

// ── Mock Data (exemplo simplificado – use seu mockMenuItems real) ──
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Coxinha Clássica",
    emoji: "🥟",
    category: "salgado",
    description: "Coxinha de frango com catupiry, empanada na farinha de rosca.",
    yield: 100,
    stock: 450,
    stockUnit: "un",
    code: "CX001",
    shelfLifeHours: 48,
    difficulty: "Média",
    prepTimeMin: 45,
    costPrice: 1.62,
    sellPrice: 4.25,
    ingredients: [
      { name: "Frango desfiado", qty: 5, unit: "kg", costPerUnit: 18.5 },
      { name: "Catupiry", qty: 2, unit: "kg", costPerUnit: 32.0 },
      { name: "Batata", qty: 10, unit: "kg", costPerUnit: 3.2 },
    ],
  },
  // ... adicione os outros itens do seu mock aqui
];

// ── Página ──
export default function CardapioItensPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [catFilter, setCatFilter] = useState<string>("Todos");
  const [yieldQty, setYieldQty] = useState<number>(250);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedItem = mockMenuItems.find(item => item.id === selectedId) || mockMenuItems[0];

  const filteredItems =
    catFilter === "Todos"
      ? mockMenuItems
      : mockMenuItems.filter(item => {
          const catLabel = CAT_COLORS[item.category]?.label.replace(/[^a-z]/gi, "").toLowerCase();
          return catLabel.includes(catFilter.toLowerCase().replace(/s$/, ""));
        });

  const multiplier = yieldQty / 100;
  const totalCost = selectedItem.costPrice * yieldQty;
  const totalRevenue = selectedItem.sellPrice * yieldQty;
  const marginPercent = Math.round((1 - selectedItem.costPrice / selectedItem.sellPrice) * 100);

  const catCfg = CAT_COLORS[selectedItem.category];

  return (
    <AppShell active="gestao-cardapio-itens">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Cardápio</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Itens & Receitas</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <DollarSign size={16} /> Custos
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Item
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Filtro por Categoria */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Categorias
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {CATEGORY_LABELS.map((cat) => {
              const count =
                cat === "Todos"
                  ? mockMenuItems.length
                  : mockMenuItems.filter(i => {
                      const label = CAT_COLORS[i.category as CategoryKey]?.label
                        .replace(/[^a-z]/gi, "")
                        .toLowerCase();
                      return label.includes(cat.toLowerCase().replace(/s$/, ""));
                    }).length;

              return (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${catFilter === cat
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  <span>{cat}</span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Lista de Itens */}
        <div className="w-[420px] border-r border-gray-200 bg-gray-50/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Itens do Cardápio · {filteredItems.length}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedId;
              const catCfgItem = CAT_COLORS[item.category];

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`
                    p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${catCfgItem.badge}`}
                      >
                        {item.emoji}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <div className="text-sm text-gray-600">{item.role || item.department}</div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${catCfgItem.badge} ${catCfgItem.tag}`}
                    >
                      {catCfgItem.label.replace(/[^a-zA-Z\s]/g, "").trim()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                    <div>
                      <span className="font-medium">Rend.:</span> {item.yield} un
                    </div>
                    <div>
                      <span className="font-medium">Estoque:</span>{" "}
                      {item.stock}
                      {item.stockUnit}
                    </div>
                    <div className="col-span-2 font-mono font-bold text-blue-700">
                      R$ {item.sellPrice.toFixed(2)} <span className="text-gray-500 text-sm">/un</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes do Item Selecionado */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-5xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-6">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${catCfg.badge}`}
                >
                  {selectedItem.emoji}
                </div>
                <div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-3 ${catCfg.badge} ${catCfg.tag}`}>
                    {catCfg.label}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedItem.name}
                  </h1>
                  <p className="text-gray-600 max-w-2xl">{selectedItem.description}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-700">
                  <Download size={18} /> Duplicar
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  <Edit size={18} /> Editar Item
                </button>
              </div>
            </div>

            {/* Cards de informação básica */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Código", value: `#${selectedItem.code}`, sub: "SKU interno" },
                { label: "Rendimento base", value: `${selectedItem.yield} un`, sub: "receita padrão" },
                { label: "Validade", value: `${selectedItem.shelfLifeHours}h`, sub: "refrigerado" },
                { label: "Dificuldade", value: selectedItem.difficulty, sub: `${selectedItem.prepTimeMin} min` },
              ].map((info, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {info.label}
                  </div>
                  <div className="text-2xl font-bold font-mono text-gray-900 mb-1">
                    {info.value}
                  </div>
                  <div className="text-sm text-gray-600">{info.sub}</div>
                </div>
              ))}
            </div>

            {/* Simulador de rendimento */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-8 mb-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Scale size={24} className="text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Simulador de Rendimento</h3>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>Quantidade desejada</span>
                  <span className="font-mono font-bold text-blue-700">{yieldQty} unidades</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={yieldQty}
                  onChange={(e) => setYieldQty(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-600 mb-1">Unidades</div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{yieldQty}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-600 mb-1">Multiplicador</div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{multiplier.toFixed(1)}×</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-600 mb-1">Custo total</div>
                  <div className="text-2xl font-bold font-mono text-red-700">
                    R$ {totalCost.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-600 mb-1">Receita estimada</div>
                  <div className="text-2xl font-bold font-mono text-emerald-700">
                    R$ {totalRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            {selectedItem.ingredients.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-12 shadow-sm">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ingredientes (para {selectedItem.yield} unidades)
                  </h3>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm font-medium">
                    <Plus size={16} /> Adicionar ingrediente
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Ingrediente", "Quantidade", "Unidade", "Custo unit.", "Custo total"].map((h) => (
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
                      {selectedItem.ingredients.map((ing, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{ing.name}</td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-700">{ing.qty}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{ing.unit}</td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-700">
                            R$ {ing.costPerUnit.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold font-mono text-blue-700">
                            R$ {(ing.qty * ing.costPerUnit).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between text-sm font-medium">
                  <span>Custo total da receita base ({selectedItem.yield} un)</span>
                  <span className="font-mono font-bold text-red-700">
                    R$ {(selectedItem.costPrice * selectedItem.yield).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Informação nutricional */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informação Nutricional (por unidade)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Calorias", value: "85 kcal" },
                  { label: "Carboidratos", value: "8,2 g" },
                  { label: "Proteínas", value: "3,5 g" },
                  { label: "Gorduras", value: "4,2 g" },
                ].map((nut, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">{nut.label}</div>
                    <div className="text-2xl font-bold font-mono text-gray-900">{nut.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Novo/Editar Item */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Editar Item — {selectedItem.name}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do item *
                  </label>
                  <input
                    defaultValue={selectedItem.name}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    defaultValue={selectedItem.category}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="salgado">Salgado</option>
                    <option value="doce">Doce</option>
                    <option value="bebida">Bebida</option>
                    <option value="brinquedo">Brinquedo</option>
                    <option value="equipe">Equipe</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    defaultValue={selectedItem.description}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código / SKU
                  </label>
                  <input
                    defaultValue={selectedItem.code}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento base (un)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedItem.yield}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo de preparo (min)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedItem.prepTimeMin}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validade refrigerada (horas)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedItem.shelfLifeHours}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                >
                  <Edit size={18} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}