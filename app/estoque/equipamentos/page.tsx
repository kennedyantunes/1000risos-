"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Plus,
  Edit,
  Package,
  Wrench,
  Download,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Truck,
  Phone,
  Mail,
  X,
} from "lucide-react";

// ── Tipos ──
type EquipStatus = "good" | "low" | "maintenance" | "broken";

interface Equipment {
  id: string;
  emoji: string;
  name: string;
  category: string;
  location: string;
  total: number;
  available: number;
  reserved: number;
  status: EquipStatus;
  code: string;
  unit: string;
  minStock: number;
  unitCost: number;
  lastPurchase: string;
  warehouse: string;
  shelf: string;
  section: string;
  supplier: string;
  supplierPhone: string;
  supplierEmail: string;
  reservations: { date: string; event: string; qty: number; time: string }[];
  history: { icon: string; title: string; meta: string; type: "out" | "in" | "maintenance" }[];
}

// ── Mock Data (mantido igual ao seu original) ──
const equipments: Equipment[] = [
  {
    id: "PR-001",
    emoji: "🍽️",
    name: "Prato Raso Branco",
    category: "Louças",
    location: "Galpão A · P3",
    total: 240,
    available: 186,
    reserved: 54,
    status: "good",
    code: "#PR-001",
    unit: "Unidade",
    minStock: 50,
    unitCost: 8.5,
    lastPurchase: "15/02/2026",
    warehouse: "Galpão A",
    shelf: "Prateleira 3",
    section: "Louças Brancas",
    supplier: "Casa das Louças",
    supplierPhone: "(11) 3456-7890",
    supplierEmail: "contato@casadasloucas.com.br",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 50, time: "13h às 18h" },
      { date: "18/03", event: "Casamento Silva", qty: 80, time: "19h às 23h" },
      { date: "22/03", event: "Formatura João", qty: 40, time: "19h às 23h" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 50 un · 05/03", type: "out" },
      { icon: "📥", title: "Devolução", meta: "Casamento Oliveira · 80 un · 02/03", type: "in" },
      { icon: "🔧", title: "Manutenção", meta: "4 unidades · trinca na borda", type: "maintenance" },
    ],
  },
  // ... adicione os outros equipamentos do seu código original aqui ...
  // (mantive apenas um para exemplo; copie todos os seus)
];

// ── Categorias ──
const categories = [
  { name: "Todos", count: equipments.length },
  { name: "Louças", count: equipments.filter(e => e.category === "Louças").length },
  { name: "Talheres", count: equipments.filter(e => e.category === "Talheres").length },
  { name: "Copos", count: equipments.filter(e => e.category === "Copos").length },
  { name: "Móveis", count: equipments.filter(e => e.category === "Móveis").length },
  { name: "Brinquedos", count: equipments.filter(e => e.category === "Brinquedos").length },
  { name: "Decoração", count: equipments.filter(e => e.category === "Decoração").length },
  { name: "Estruturas", count: equipments.filter(e => e.category === "Estruturas").length },
  { name: "Iluminação", count: equipments.filter(e => e.category === "Iluminação").length },
  { name: "Áudio", count: equipments.filter(e => e.category === "Áudio").length },
];

// ── Componente StatusBadge (reutilizável em todo o projeto) ──
function StatusBadge({ status }: { status: EquipStatus }) {
  const config: Record<EquipStatus, { label: string; bg: string; text: string }> = {
    good:       { label: "Bom",          bg: "bg-emerald-100", text: "text-emerald-800" },
    low:        { label: "Estoque baixo", bg: "bg-amber-100",  text: "text-amber-800"  },
    maintenance:{ label: "Manutenção",   bg: "bg-orange-100", text: "text-orange-800" },
    broken:     { label: "Danificado",   bg: "bg-red-100",    text: "text-red-800"    },
  };

  const cfg = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1.5" />
      {cfg.label}
    </span>
  );
}

// ── Modal de Equipamento (Editar/Novo) ──
function EquipModal({
  equip,
  onClose,
}: {
  equip: Equipment | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {equip ? `Editar — ${equip.name}` : "Novo Equipamento"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nome do equipamento" required>
              <Input defaultValue={equip?.name} placeholder="Ex: Prato Raso Branco" />
            </Field>
            <Field label="Categoria" required>
              <Select defaultValue={equip?.category || "Louças"}>
                {["Louças", "Talheres", "Copos", "Móveis", "Brinquedos", "Decoração", "Estruturas", "Iluminação", "Áudio"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Código / SKU">
              <Input defaultValue={equip?.code} placeholder="Ex: PR-001" />
            </Field>
            <Field label="Unidade">
              <Select defaultValue={equip?.unit || "Unidade"}>
                <option>Unidade</option>
                <option>Par</option>
                <option>Jogo (12 un)</option>
                <option>Jogo (24 un)</option>
                <option>Metro quadrado</option>
              </Select>
            </Field>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-10 mb-4 pb-2 border-b border-gray-200">
            Estoque
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Quantidade total">
              <Input type="number" defaultValue={equip?.total || 0} className="font-mono" />
            </Field>
            <Field label="Estoque mínimo">
              <Input type="number" defaultValue={equip?.minStock || 0} className="font-mono" />
            </Field>
            <Field label="Estado atual">
              <Select defaultValue={equip?.status || "good"}>
                <option value="good">Bom</option>
                <option value="low">Estoque baixo</option>
                <option value="maintenance">Manutenção</option>
                <option value="broken">Danificado</option>
              </Select>
            </Field>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-10 mb-4 pb-2 border-b border-gray-200">
            Localização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Galpão">
              <Input defaultValue={equip?.warehouse} />
            </Field>
            <Field label="Prateleira">
              <Input defaultValue={equip?.shelf} />
            </Field>
            <Field label="Seção">
              <Input defaultValue={equip?.section} />
            </Field>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-10 mb-4 pb-2 border-b border-gray-200">
            Custo e Fornecedor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Valor unitário (custo)">
              <Input
                defaultValue={equip?.unitCost?.toFixed(2).replace(".", ",")}
                className="font-mono"
                placeholder="R$ 0,00"
              />
            </Field>
            <Field label="Fornecedor">
              <Input defaultValue={equip?.supplier} />
            </Field>
          </div>

          <Field label="Observações" className="mt-6">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Informações adicionais, cuidados especiais, etc..."
              defaultValue=""
            />
          </Field>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Salvar Equipamento
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Movimentação ──
function MovimentModal({ onClose }: { onClose: () => void }) {
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
          <Field label="Tipo de movimentação" required>
            <Select>
              <option>Saída para evento</option>
              <option>Devolução de evento</option>
              <option>Entrada (nova compra)</option>
              <option>Manutenção</option>
              <option>Retorno de manutenção</option>
              <option>Perda / Descartado</option>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Field label="Quantidade" required>
              <Input type="number" defaultValue="10" className="font-mono" />
            </Field>
            <Field label="Data" required>
              <Input type="date" defaultValue="2026-03-07" />
            </Field>
          </div>

          <Field label="Vincular a evento (opcional)" className="mt-6">
            <Select>
              <option>-- Selecione um evento --</option>
              <option>Aniversário Sofia (06/03)</option>
              <option>Casamento Silva (07/03)</option>
              <option>Formatura João (08/03)</option>
            </Select>
          </Field>

          <Field label="Observações" className="mt-6">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Descreva o motivo, avarias, etc..."
            />
          </Field>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong className="flex items-center gap-2">
              <AlertCircle size={16} /> Atenção
            </strong>
            <p className="mt-1">
              Ao registrar saída, os itens ficarão indisponíveis para outros eventos na data selecionada.
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

// ── Componentes auxiliares (Field, Input, Select) ──
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
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

// ── Página principal ──
export default function EquipamentosPage() {
  const [selectedId, setSelectedId] = useState<string>("PR-001");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [modal, setModal] = useState<{ type: "equip" | "mov"; title?: string } | null>(null);

  const selectedEquip = equipments.find(e => e.id === selectedId) || equipments[0];

  const filteredEquipments =
    selectedCategory === "Todos"
      ? equipments
      : equipments.filter(e => e.category === selectedCategory);

  return (
    <AppShell active="estoque-equipamentos">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Estoque</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Equipamentos</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Wrench size={16} /> Ajustar estoque
          </button>
          <button
            onClick={() => setModal({ type: "equip", title: "Novo Equipamento" })}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Equipamento
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
              <Input placeholder="Buscar categoria..." className="pl-10" />
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Status</h4>
            <div className="space-y-3">
              {[
                { color: "bg-emerald-500", label: "Bom estado" },
                { color: "bg-amber-500", label: "Estoque baixo" },
                { color: "bg-orange-500", label: "Manutenção" },
                { color: "bg-red-500", label: "Danificado" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Lista de equipamentos */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Equipamentos · {filteredEquipments.length} itens
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Download size={16} /> Exportar
              </button>
              <button
                onClick={() => setModal({ type: "equip", title: "Novo Equipamento" })}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
              >
                <Plus size={16} /> Novo Equipamento
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map(equip => {
                const pct = Math.round((equip.available / equip.total) * 100);
                const statusColor =
                  equip.status === "good"
                    ? "text-emerald-700"
                    : equip.status === "low"
                    ? "text-amber-700"
                    : equip.status === "maintenance"
                    ? "text-orange-700"
                    : "text-red-700";

                return (
                  <div
                    key={equip.id}
                    onClick={() => setSelectedId(equip.id)}
                    className={`
                      group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                      ${equip.id === selectedId ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-lg hover:border-blue-300"}
                    `}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-3xl shadow-sm">
                            {equip.emoji}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{equip.name}</h3>
                            <p className="text-sm text-gray-600">{equip.category}</p>
                          </div>
                        </div>
                        <StatusBadge status={equip.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Localização</div>
                          <div className="font-medium truncate">{equip.location}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Código</div>
                          <div className="font-mono font-medium">{equip.code}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold font-mono text-gray-900">
                          {equip.available} / {equip.total}
                        </div>
                        <div className={`text-sm font-medium ${statusColor}`}>
                          {equip.available === 0 ? "Indisponível" : `${pct}% disponível`}
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
                <h3 className="text-xl font-bold text-gray-900">{selectedEquip.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedEquip.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ type: "equip", title: `Editar — ${selectedEquip.name}` })}
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
              <StatusBadge status={selectedEquip.status} />
              <span className="text-sm text-gray-600 font-mono">Cód: {selectedEquip.code}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Disponibilidade */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Disponibilidade
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{selectedEquip.available}</div>
                    <div className="text-xs text-gray-600 mt-1">Disponível</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">{selectedEquip.reserved}</div>
                    <div className="text-xs text-gray-600 mt-1">Reservado</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-700">{selectedEquip.total}</div>
                    <div className="text-xs text-gray-600 mt-1">Total</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(selectedEquip.available / selectedEquip.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Localização
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Galpão</span>
                  <span className="font-medium">{selectedEquip.warehouse}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prateleira</span>
                  <span className="font-medium">{selectedEquip.shelf}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seção</span>
                  <span className="font-medium">{selectedEquip.section}</span>
                </div>
              </div>
            </div>

            {/* Custo */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Custo
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor unitário</span>
                  <span className="font-bold font-mono">
                    R$ {selectedEquip.unitCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última compra</span>
                  <span className="font-medium">{selectedEquip.lastPurchase}</span>
                </div>
              </div>
            </div>

            {/* Reservas Ativas */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                Reservas Ativas ({selectedEquip.reservations.length})
                <span className="text-blue-600 text-xs cursor-pointer hover:underline">Ver todas</span>
              </h4>
              <div className="space-y-4">
                {selectedEquip.reservations.map((res, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{res.event}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {res.date} · {res.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{res.qty} un</div>
                        <div className="text-xs text-gray-500">Reservado</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                Últimas Movimentações
                <span className="text-blue-600 text-xs cursor-pointer hover:underline">Ver tudo</span>
              </h4>
              <div className="space-y-4">
                {selectedEquip.history.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {entry.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{entry.title}</div>
                      <div className="text-sm text-gray-600 mt-0.5">{entry.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fornecedor */}
            <div className="mt-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                Fornecedor Preferencial
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
                <div className="font-semibold text-gray-900">{selectedEquip.supplier}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone size={14} /> {selectedEquip.supplierPhone}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail size={14} /> {selectedEquip.supplierEmail}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modais */}
      {modal?.type === "equip" && (
        <EquipModal equip={modal.title?.includes("Editar") ? selectedEquip : null} onClose={() => setModal(null)} />
      )}
      {modal?.type === "mov" && <MovimentModal onClose={() => setModal(null)} />}
    </AppShell>
  );
}