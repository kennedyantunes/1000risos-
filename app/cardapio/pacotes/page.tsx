"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Plus,
  Edit,
  Copy,
  X,
  DollarSign,
  SlidersHorizontal,
  ChevronRight,
  BarChart3,
  Trash2,
} from "lucide-react";

// ── Tipos (mantidos exatamente iguais) ──
interface PriceTier {
  min: number;
  max: number;
  pricePerPax: number;
}

interface PackageItem {
  emoji: string;
  name: string;
  sub: string;
  qtyPer: string;
  optional: boolean;
  costPer100: number;
}

interface Package {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeClass: string;
  emoji: string;
  minPax: number;
  active: boolean;
  tiers: PriceTier[];
  items: PackageItem[];
}

// ── Mock completo (seu array original) ──
const packages: Package[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Mesa de frios, refrigerantes, bolo simples e equipe mínima. Ideal para festas menores com orçamento controlado.',
    badge: 'Básico',
    badgeClass: 'basic',
    emoji: '📋',
    minPax: 30,
    active: true,
    tiers: [
      { min: 30, max: 50, pricePerPax: 38 },
      { min: 51, max: 100, pricePerPax: 34 },
      { min: 101, max: 300, pricePerPax: 30 },
    ],
    items: [
      { emoji: '🥟', name: 'Coxinha de Frango', sub: 'Salgado · Frito', qtyPer: '5 un', optional: false, costPer100: 86.4 },
      { emoji: '🍫', name: 'Brigadeiro', sub: 'Doce · Tradicional', qtyPer: '3 un', optional: false, costPer100: 27.9 },
      { emoji: '🥤', name: 'Refrigerante 2L', sub: 'Bebida', qtyPer: '1/8 pax', optional: false, costPer100: 68.0 },
      { emoji: '👥', name: 'Equipe básica', sub: 'Serviço · Cozinha', qtyPer: '1 equipe', optional: false, costPer100: 500.0 },
    ],
  },
  {
    id: 'premium-infantil',
    name: 'Premium Infantil',
    description: 'Completo para festas infantis com buffet frio e quente, bebidas, decoração básica e equipe completa. Ideal para 50–200 convidados.',
    badge: '✦ Popular',
    badgeClass: 'popular',
    emoji: '⭐',
    minPax: 50,
    active: true,
    tiers: [
      { min: 50, max: 80, pricePerPax: 60 },
      { min: 81, max: 150, pricePerPax: 55 },
      { min: 151, max: 300, pricePerPax: 50 },
    ],
    items: [
      { emoji: '🥟', name: 'Coxinha de Frango', sub: 'Salgado · Frito', qtyPer: '8 un', optional: false, costPer100: 115.2 },
      { emoji: '🥧', name: 'Empada de Frango', sub: 'Salgado · Assado', qtyPer: '4 un', optional: false, costPer100: 57.6 },
      { emoji: '🍫', name: 'Brigadeiro Gourmet', sub: 'Doce · Tradicional', qtyPer: '5 un', optional: false, costPer100: 46.5 },
      { emoji: '🧁', name: 'Mini Cupcake', sub: 'Doce · Confeitaria', qtyPer: '2 un', optional: true, costPer100: 25.2 },
      { emoji: '🥤', name: 'Refrigerante 2L', sub: 'Bebida', qtyPer: '1/8 pax', optional: false, costPer100: 68.0 },
      { emoji: '🧃', name: 'Suco de Fruta 1L', sub: 'Bebida · Natural', qtyPer: '1/10 pax', optional: false, costPer100: 55.0 },
      { emoji: '🎂', name: 'Bolo Personalizado', sub: 'Doce · Bolo', qtyPer: '1 un', optional: false, costPer100: 354.0 },
      { emoji: '👥', name: 'Equipe completa', sub: 'Serviço · Garçons + Cozinha', qtyPer: '1 equipe', optional: false, costPer100: 800.0 },
    ],
  },
  {
    id: 'luxo-completo',
    name: 'Luxo Completo',
    description: 'Tudo do Premium mais buffet quente, garçons individuais, decoração temática inclusa e open bar. Para eventos premium.',
    badge: '◆ Premium',
    badgeClass: 'premium',
    emoji: '◆',
    minPax: 80,
    active: true,
    tiers: [
      { min: 80, max: 120, pricePerPax: 95 },
      { min: 121, max: 200, pricePerPax: 88 },
      { min: 201, max: 400, pricePerPax: 80 },
    ],
    items: [
      { emoji: '🥟', name: 'Coxinha de Frango', sub: 'Salgado · Frito', qtyPer: '10 un', optional: false, costPer100: 144.0 },
      { emoji: '🥧', name: 'Empada de Frango', sub: 'Salgado · Assado', qtyPer: '6 un', optional: false, costPer100: 86.4 },
      { emoji: '🍫', name: 'Brigadeiro Gourmet', sub: 'Doce · Tradicional', qtyPer: '8 un', optional: false, costPer100: 74.4 },
      { emoji: '🧁', name: 'Mini Cupcake', sub: 'Doce · Confeitaria', qtyPer: '4 un', optional: false, costPer100: 50.4 },
      { emoji: '🍽️', name: 'Buffet quente', sub: 'Refeição completa', qtyPer: '1 pax', optional: false, costPer100: 1200.0 },
      { emoji: '🥤', name: 'Open Bar', sub: 'Bebidas à vontade', qtyPer: 'ilimitado', optional: false, costPer100: 350.0 },
      { emoji: '🎈', name: 'Decoração Temática', sub: 'Incluso no pacote', qtyPer: '1 serviço', optional: false, costPer100: 800.0 },
      { emoji: '👥', name: 'Equipe + Garçons', sub: 'Serviço premium', qtyPer: '1 equipe', optional: false, costPer100: 1200.0 },
    ],
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    description: 'Pensado para eventos empresariais com coffee break, almoço ou jantar corporativo, equipe executiva e materiais de apoio.',
    badge: '🏢 Corporativo',
    badgeClass: 'corporate',
    emoji: '🏢',
    minPax: 50,
    active: true,
    tiers: [
      { min: 50, max: 100, pricePerPax: 75 },
      { min: 101, max: 200, pricePerPax: 68 },
      { min: 201, max: 400, pricePerPax: 60 },
    ],
    items: [
      { emoji: '☕', name: 'Coffee Break', sub: 'Bebidas quentes + frias', qtyPer: '1 pax', optional: false, costPer100: 280.0 },
      { emoji: '🥗', name: 'Almoço Executivo', sub: 'Buffet completo', qtyPer: '1 pax', optional: false, costPer100: 1400.0 },
      { emoji: '🥟', name: 'Salgados Finos', sub: 'Sortido · Assado', qtyPer: '6 un', optional: false, costPer100: 130.0 },
      { emoji: '🥤', name: 'Bebidas', sub: 'Água + Sucos + Refri', qtyPer: '1 pax', optional: false, costPer100: 120.0 },
      { emoji: '👥', name: 'Equipe Executiva', sub: 'Garçons + Coordenador', qtyPer: '1 equipe', optional: false, costPer100: 950.0 },
    ],
  },
  {
    id: 'mini-festa',
    name: 'Mini Festa',
    description: 'Pacote descontinuado para festas muito pequenas.',
    badge: 'Básico',
    badgeClass: 'basic',
    emoji: '📦',
    minPax: 10,
    active: false,
    tiers: [
      { min: 10, max: 30, pricePerPax: 28 },
    ],
    items: [],
  },
];

// ── Utilitários ──
function getPricePerPax(pkg: Package, pax: number): number {
  if (!pkg.tiers?.length) return 0;
  for (const tier of pkg.tiers) {
    if (pax >= tier.min && pax <= tier.max) return tier.pricePerPax;
  }
  return pkg.tiers[pkg.tiers.length - 1].pricePerPax;
}

function fmtBRL(val: number): string {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Página principal ──
export default function PacotesPage() {
  const [selectedId, setSelectedId] = useState("premium-infantil");
  const [guestCount, setGuestCount] = useState(120);
  const [eventType, setEventType] = useState("Infantil");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPkg, setModalPkg] = useState<Package | null>(null);
  const [modalTitle, setModalTitle] = useState("");

  const selected = packages.find((p) => p.id === selectedId) ?? packages[0];
  const pricePerPax = getPricePerPax(selected, guestCount);
  const total = guestCount * pricePerPax;
  const margin = Math.round(58 + (pricePerPax - 50) * 0.1);
  const marginVal = Math.round(total * margin / 100);

  const activePkgs = packages.filter((p) => p.active);
  const inactivePkgs = packages.filter((p) => !p.active);

  const openModal = (title: string, pkg: Package | null = null) => {
    setModalTitle(title);
    setModalPkg(pkg);
    setModalOpen(true);
  };

  return (
    <AppShell active="cardapio-pacotes">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Cardápio</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-bold text-gray-900">Pacotes</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <SlidersHorizontal size={16} /> Comparar pacotes
          </button>
          <button
            onClick={() => openModal("Novo Pacote")}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Pacote
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Lista de Pacotes */}
        <aside className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pacotes
            </h3>
            <p className="text-sm text-gray-600 mt-1">{activePkgs.length} ativos</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {activePkgs.map((pkg) => {
              const isSelected = pkg.id === selectedId;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedId(pkg.id)}
                  className={`
                    px-4 py-3 rounded-lg cursor-pointer transition-all text-sm
                    ${isSelected
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                        {pkg.emoji}
                      </div>
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-xs text-gray-500">
                          a partir de {pkg.minPax} pax
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-blue-700 font-medium">
                      R${pkg.tiers[0]?.pricePerPax ?? "—"}
                    </div>
                  </div>
                </div>
              );
            })}

            {inactivePkgs.length > 0 && (
              <>
                <div className="h-px bg-gray-200 my-5 mx-4" />
                <div className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">
                  Inativos
                </div>
                {inactivePkgs.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedId(pkg.id)}
                    className={`px-4 py-3 rounded-lg cursor-pointer text-sm opacity-70 hover:opacity-100 transition ${
                      selectedId === pkg.id ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center text-xl">
                        {pkg.emoji}
                      </div>
                      <div className="font-medium text-gray-600">{pkg.name}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header do pacote */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
                  {selected.emoji}
                </div>
                <div>
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-2">
                    {selected.badge}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{selected.name}</h1>
                  <p className="text-gray-600 mt-1.5 max-w-2xl">{selected.description}</p>
                </div>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => openModal(`Duplicar Pacote — ${selected.name}`, selected)}
                  className="px-5 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-2"
                >
                  <Copy size={16} /> Duplicar
                </button>
                <button
                  onClick={() => openModal(`Editar Pacote — ${selected.name}`, selected)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium flex items-center gap-2"
                >
                  <Edit size={16} /> Editar
                </button>
              </div>
            </div>

            {/* Simulador de Preço */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <DollarSign size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Simulador de Preço</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de convidados
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={selected.tiers[0]?.min ?? 30}
                      max={selected.tiers.at(-1)?.max ?? 400}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="flex-1 accent-blue-600 h-2 rounded-full"
                    />
                    <span className="font-mono font-bold text-blue-700 min-w-[80px] text-right">
                      {guestCount} pax
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500">Convidados</div>
                    <div className="text-xl font-bold mt-1">{guestCount}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500">Preço/pax</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">
                      {fmtBRL(pricePerPax)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium">Total</div>
                    <div className="text-2xl font-bold text-blue-800 mt-1">
                      {fmtBRL(total)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500">Margem est.</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">
                      {margin}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itens Incluídos */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Itens Incluídos</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5">
                  <Plus size={16} /> Adicionar item
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {selected.items.map((item, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 flex items-center gap-5 hover:bg-gray-50 transition"
                  >
                    <div className="text-3xl w-10 flex-shrink-0">{item.emoji}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.sub}</div>
                    </div>
                    <div className="font-mono text-sm text-gray-700 min-w-24 text-center">
                      {item.qtyPer}
                    </div>
                    <div className="min-w-28 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item.optional
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {item.optional ? "Opcional" : "Incluso"}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-gray-700 min-w-32 text-right">
                      {fmtBRL(item.costPer100)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Aside direita – Comparativo + Resumo */}
        <aside className="w-96 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Comparativo</h3>
            <p className="text-sm text-gray-500 mt-1">
              Diferenças entre os principais pacotes
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Feature</th>
                    <th className="text-center py-3 font-medium text-blue-700">Essencial</th>
                    <th className="text-center py-3 font-medium text-blue-700">Premium Infantil</th>
                    <th className="text-center py-3 font-medium text-purple-700">Luxo Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Salgados", "5 un/pax", "8 un/pax", "10 un/pax"],
                    ["Doces", "3 un/pax", "5 un/pax", "8 un/pax"],
                    ["Bebidas", "✓", "✓", "Open bar"],
                    ["Bolo incluso", "—", "✓", "✓"],
                    ["Buffet quente", "—", "—", "✓"],
                    ["Decoração", "—", "Básica", "Temática"],
                    ["Equipe", "Básica", "Completa", "Completa + garçons"],
                  ].map(([feature, ess, prem, luxo], i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-3">{feature}</td>
                      <td className="text-center">{ess}</td>
                      <td className="text-center font-medium">{prem}</td>
                      <td className="text-center font-medium">{luxo}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 font-medium">Preço base</td>
                    <td className="text-center font-bold">R$38</td>
                    <td className="text-center font-bold text-blue-700">R$60</td>
                    <td className="text-center font-bold text-purple-700">R$95</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Resumo atual</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Preço por pessoa:</span>
                  <span className="font-medium text-blue-700">{fmtBRL(pricePerPax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total ({guestCount} pax):</span>
                  <span className="font-bold text-blue-800">{fmtBRL(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margem estimada:</span>
                  <span className="font-bold text-emerald-700">{margin}%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Identificação */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Identificação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do pacote *
                    </label>
                    <input
                      defaultValue={modalPkg?.name ?? ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Ex: Premium Infantil"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classificação
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {["📋 Básico", "⭐ Popular", "◆ Premium", "🏢 Corp."].map((opt) => {
                        const isActive = modalPkg?.badgeClass === opt.split(" ")[1]?.toLowerCase();
                        return (
                          <button
                            key={opt}
                            className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
                              isActive
                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      defaultValue={modalPkg?.description ?? ""}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                      placeholder="Descreva o que está incluído…"
                    />
                  </div>
                </div>
              </div>

              {/* Itens do Pacote */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">Itens do Pacote</h4>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
                    <Plus size={16} /> Adicionar item
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1fr_100px_100px_40px] bg-gray-50 border-b">
                    <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Item</div>
                    <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Qtd/pax</div>
                    <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Opcional?</div>
                    <div></div>
                  </div>
                  {/* Linhas de exemplo – você pode tornar dinâmico */}
                  {[
                    { item: "Coxinha de Frango", qty: "8", optional: "Não" },
                    { item: "Brigadeiro Gourmet", qty: "5", optional: "Não" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_100px_40px] border-b last:border-b-0">
                      <div className="px-4 py-3">
                        <select defaultValue={row.item} className="w-full bg-transparent">
                          <option>Coxinha de Frango</option>
                          <option>Empada</option>
                          <option>Risole</option>
                          <option>Brigadeiro</option>
                          <option>Mini Cupcake</option>
                          <option>Refrigerante 2L</option>
                          <option>Bolo Personalizado</option>
                        </select>
                      </div>
                      <div className="px-4 py-3">
                        <input
                          defaultValue={row.qty}
                          className="w-full bg-transparent font-mono"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <select defaultValue={row.optional} className="w-full bg-transparent">
                          <option>Não</option>
                          <option>Sim</option>
                        </select>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-center">
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faixas de Preço */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">Faixas de Preço</h4>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
                    <Plus size={16} /> Adicionar faixa
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { min: "50", max: "80", price: "60" },
                    // Adicione mais dinamicamente se quiser
                  ].map((tier, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">De (pax)</label>
                        <input
                          defaultValue={tier.min}
                          className="w-full px-3 py-2 border rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Até (pax)</label>
                        <input
                          defaultValue={tier.max}
                          className="w-full px-3 py-2 border rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">R$/pax</label>
                        <input
                          defaultValue={tier.price}
                          className="w-full px-3 py-2 border rounded-lg font-mono"
                        />
                      </div>
                      <button className="text-red-500 hover:text-red-700 self-end pb-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition">
                  Salvar Pacote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}