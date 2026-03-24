"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
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
  Filter,
  Save,
  RotateCcw,
  Tag,
  Home,
  Box,
  Layers,
  FileText,
  Upload,
  Trash2,
  Eye,
  Share2,
  Star,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  ArrowUpDown,
  MoreHorizontal,
  Settings,
  Grid3x3,
  List,
  ChevronDown,
  ChevronUp,
  MapPin,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Minimize2,
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
  supplierEmail: string;
  batches: Batch[];
  forecast: { event: string; qty: number; unit: string; date: string }[];
  history: IngHistory[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Mock Data completo com todos os insumos ──
const ingredients: Ingredient[] = [
  {
    id: "ft001",
    code: "FT-001",
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
    supplierEmail: "vendas@moinhodourado.com.br",
    notes: "Manter em local seco e arejado",
    createdAt: "2024-01-15",
    updatedAt: "2026-02-20",
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
  {
    id: "ac001",
    code: "AC-001",
    name: "Açúcar Cristal",
    category: "Farináceos",
    lot: "AC-1003",
    expiry: "15/08/26",
    expiryStatus: "normal",
    current: 32,
    min: 15,
    unit: "kg",
    costPerUnit: 2.8,
    status: "good",
    warehouse: "Despensa A",
    shelf: "Prateleira 1",
    section: "Farináceos",
    supplier: "Distribuidora Doçura",
    supplierPhone: "(11) 3456-7891",
    supplierEmail: "vendas@docura.com.br",
    batches: [
      { code: "AC-1003", qty: 20, unit: "kg", expiry: "15/08/26", cost: 2.8 },
      { code: "AC-2202", qty: 12, unit: "kg", expiry: "10/09/26", cost: 2.9 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 4, unit: "kg", date: "06/03" },
      { event: "Casamento Silva", qty: 6, unit: "kg", date: "07/03" },
    ],
    history: [
      { date: "01/03", type: "out", desc: "Aniversário João", qty: "-3 kg" },
      { date: "28/02", type: "in", desc: "Compra NF 12346", qty: "+20 kg" },
    ],
  },
  {
    id: "ov001",
    code: "OV-001",
    name: "Ovos Brancos",
    category: "Laticínios",
    lot: "OV-0503",
    expiry: "10/03/26",
    expiryStatus: "warning",
    current: 180,
    min: 60,
    unit: "un",
    costPerUnit: 0.8,
    status: "expiring",
    warehouse: "Câmara Fria",
    shelf: "Prateleira 1",
    section: "Ovos",
    supplier: "Granja São José",
    supplierPhone: "(11) 3456-7892",
    supplierEmail: "comercial@granjasaojose.com.br",
    notes: "Consumir preferencialmente até 15/03",
    batches: [
      { code: "OV-0503", qty: 120, unit: "un", expiry: "10/03/26", cost: 0.8 },
      { code: "OV-2802", qty: 60, unit: "un", expiry: "08/03/26", cost: 0.75 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 48, unit: "un", date: "06/03" },
      { event: "Casamento Silva", qty: 60, unit: "un", date: "07/03" },
    ],
    history: [
      { date: "02/03", type: "out", desc: "Aniversário Sofia", qty: "-48 un" },
      { date: "28/02", type: "in", desc: "Compra NF 12347", qty: "+120 un" },
    ],
  },
  {
    id: "le001",
    code: "LE-001",
    name: "Leite Integral",
    category: "Laticínios",
    lot: "LE-0403",
    expiry: "12/03/26",
    expiryStatus: "warning",
    current: 25,
    min: 20,
    unit: "litro",
    costPerUnit: 4.2,
    status: "low",
    warehouse: "Câmara Fria",
    shelf: "Prateleira 2",
    section: "Laticínios",
    supplier: "Laticínios Vale Verde",
    supplierPhone: "(11) 3456-7893",
    supplierEmail: "vendas@valeverde.com.br",
    batches: [
      { code: "LE-0403", qty: 15, unit: "litro", expiry: "12/03/26", cost: 4.2 },
      { code: "LE-2802", qty: 10, unit: "litro", expiry: "10/03/26", cost: 4.0 },
    ],
    forecast: [
      { event: "Casamento Silva", qty: 12, unit: "litro", date: "07/03" },
      { event: "Formatura João", qty: 8, unit: "litro", date: "08/03" },
    ],
    history: [
      { date: "01/03", type: "out", desc: "Casamento Silva", qty: "-12 litros" },
      { date: "28/02", type: "in", desc: "Compra NF 12348", qty: "+20 litros" },
    ],
  },
  {
    id: "fr001",
    code: "FR-001",
    name: "Frango Congelado",
    category: "Carnes",
    lot: "FR-0103",
    expiry: "20/04/26",
    expiryStatus: "normal",
    current: 18.5,
    min: 15,
    unit: "kg",
    costPerUnit: 12.5,
    status: "good",
    warehouse: "Freezer 1",
    shelf: "Prateleira 3",
    section: "Carnes",
    supplier: "Avícola São Paulo",
    supplierPhone: "(11) 3456-7894",
    supplierEmail: "comercial@avicolasp.com.br",
    batches: [
      { code: "FR-0103", qty: 12.5, unit: "kg", expiry: "20/04/26", cost: 12.5 },
      { code: "FR-2202", qty: 6, unit: "kg", expiry: "15/04/26", cost: 12.0 },
    ],
    forecast: [
      { event: "Casamento Silva", qty: 5, unit: "kg", date: "07/03" },
      { event: "Formatura João", qty: 4, unit: "kg", date: "08/03" },
    ],
    history: [
      { date: "02/03", type: "out", desc: "Casamento Silva", qty: "-5 kg" },
      { date: "28/02", type: "in", desc: "Compra NF 12349", qty: "+15 kg" },
    ],
  },
  {
    id: "cb001",
    code: "CB-001",
    name: "Coca-Cola 2L",
    category: "Bebidas",
    lot: "CB-1503",
    expiry: "15/05/26",
    expiryStatus: "normal",
    current: 48,
    min: 24,
    unit: "un",
    costPerUnit: 6.5,
    status: "good",
    warehouse: "Depósito B",
    shelf: "Prateleira 5",
    section: "Refrigerantes",
    supplier: "Distribuidora Bebidas",
    supplierPhone: "(11) 3456-7895",
    supplierEmail: "vendas@bebidas.com.br",
    batches: [
      { code: "CB-1503", qty: 48, unit: "un", expiry: "15/05/26", cost: 6.5 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 12, unit: "un", date: "06/03" },
      { event: "Casamento Silva", qty: 24, unit: "un", date: "07/03" },
      { event: "Formatura João", qty: 12, unit: "un", date: "08/03" },
    ],
    history: [
      { date: "01/03", type: "out", desc: "Aniversário Sofia", qty: "-12 un" },
      { date: "28/02", type: "in", desc: "Compra NF 12350", qty: "+48 un" },
    ],
  },
  {
    id: "dp001",
    code: "DP-001",
    name: "Prato Descartável",
    category: "Descartáveis",
    lot: "DP-1002",
    expiry: "10/12/26",
    expiryStatus: "normal",
    current: 1250,
    min: 500,
    unit: "un",
    costPerUnit: 0.35,
    status: "good",
    warehouse: "Depósito B",
    shelf: "Prateleira 8",
    section: "Descartáveis",
    supplier: "Embalagens Express",
    supplierPhone: "(11) 3456-7896",
    supplierEmail: "vendas@embalagensexpress.com.br",
    batches: [
      { code: "DP-1002", qty: 1250, unit: "un", expiry: "10/12/26", cost: 0.35 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 150, unit: "un", date: "06/03" },
      { event: "Casamento Silva", qty: 200, unit: "un", date: "07/03" },
      { event: "Formatura João", qty: 180, unit: "un", date: "08/03" },
    ],
    history: [
      { date: "28/02", type: "in", desc: "Compra NF 12351", qty: "+1500 un" },
    ],
  },
  {
    id: "sa001",
    code: "SA-001",
    name: "Sal Refinado",
    category: "Temperos",
    lot: "SA-0503",
    expiry: "05/09/26",
    expiryStatus: "normal",
    current: 8.2,
    min: 5,
    unit: "kg",
    costPerUnit: 1.8,
    status: "good",
    warehouse: "Despensa A",
    shelf: "Prateleira 5",
    section: "Temperos",
    supplier: "Temperos & Cia",
    supplierPhone: "(11) 3456-7897",
    supplierEmail: "vendas@temperosecia.com.br",
    batches: [
      { code: "SA-0503", qty: 5.2, unit: "kg", expiry: "05/09/26", cost: 1.8 },
      { code: "SA-2202", qty: 3, unit: "kg", expiry: "15/08/26", cost: 1.7 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 0.8, unit: "kg", date: "06/03" },
      { event: "Casamento Silva", qty: 1.2, unit: "kg", date: "07/03" },
    ],
    history: [
      { date: "28/02", type: "in", desc: "Compra NF 12352", qty: "+5 kg" },
    ],
  },
  {
    id: "ch001",
    code: "CH-001",
    name: "Chocolate em Pó",
    category: "Farináceos",
    lot: "CH-0103",
    expiry: "10/07/26",
    expiryStatus: "normal",
    current: 6.5,
    min: 8,
    unit: "kg",
    costPerUnit: 12.0,
    status: "low",
    warehouse: "Despensa A",
    shelf: "Prateleira 3",
    section: "Farináceos",
    supplier: "Cacau Show",
    supplierPhone: "(11) 3456-7898",
    supplierEmail: "comercial@cacaushow.com.br",
    notes: "Abaixo do estoque mínimo - comprar urgente",
    batches: [
      { code: "CH-0103", qty: 4.5, unit: "kg", expiry: "10/07/26", cost: 12.0 },
      { code: "CH-1502", qty: 2, unit: "kg", expiry: "05/06/26", cost: 11.5 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 1.2, unit: "kg", date: "06/03" },
      { event: "Casamento Silva", qty: 2, unit: "kg", date: "07/03" },
      { event: "Formatura João", qty: 1.5, unit: "kg", date: "08/03" },
    ],
    history: [
      { date: "01/03", type: "out", desc: "Aniversário Sofia", qty: "-1.2 kg" },
      { date: "15/02", type: "in", desc: "Compra NF 12250", qty: "+5 kg" },
    ],
  },
  {
    id: "ma001",
    code: "MA-001",
    name: "Manteiga",
    category: "Laticínios",
    lot: "MA-0203",
    expiry: "05/03/26",
    expiryStatus: "critical",
    current: 3.2,
    min: 4,
    unit: "kg",
    costPerUnit: 24.0,
    status: "critical",
    warehouse: "Câmara Fria",
    shelf: "Prateleira 1",
    section: "Laticínios",
    supplier: "Laticínios Vale Verde",
    supplierPhone: "(11) 3456-7893",
    supplierEmail: "vendas@valeverde.com.br",
    notes: "Vencimento próximo - usar em eventos urgentes",
    batches: [
      { code: "MA-0203", qty: 2.2, unit: "kg", expiry: "05/03/26", cost: 24.0 },
      { code: "MA-2002", qty: 1, unit: "kg", expiry: "02/03/26", cost: 23.5 },
    ],
    forecast: [
      { event: "Aniversário Sofia", qty: 1, unit: "kg", date: "06/03" },
      { event: "Casamento Silva", qty: 1.5, unit: "kg", date: "07/03" },
    ],
    history: [
      { date: "28/02", type: "loss", desc: "Perda por vencimento", qty: "-0.5 kg" },
      { date: "20/02", type: "in", desc: "Compra NF 12280", qty: "+3 kg" },
    ],
  },
];

// ── Configuração de Status ──
const STATUS_CONFIG: Record<IngStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  good: {
    label: "OK",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Estoque dentro do normal",
  },
  low: {
    label: "Baixo",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    description: "Abaixo do estoque mínimo",
  },
  expiring: {
    label: "Vencendo",
    bg: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
    icon: <Clock className="w-3.5 h-3.5" />,
    description: "Próximo ao vencimento",
  },
  critical: {
    label: "Crítico",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "Vencido ou estoque crítico",
  },
};

// ── Categorias ──
const categories = [
  { name: "Todos", count: ingredients.length, icon: "📦" },
  { name: "Farináceos", count: ingredients.filter(i => i.category === "Farináceos").length, icon: "🌾" },
  { name: "Laticínios", count: ingredients.filter(i => i.category === "Laticínios").length, icon: "🥛" },
  { name: "Carnes", count: ingredients.filter(i => i.category === "Carnes").length, icon: "🍗" },
  { name: "Bebidas", count: ingredients.filter(i => i.category === "Bebidas").length, icon: "🥤" },
  { name: "Descartáveis", count: ingredients.filter(i => i.category === "Descartáveis").length, icon: "🥡" },
  { name: "Temperos", count: ingredients.filter(i => i.category === "Temperos").length, icon: "🧂" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: IngStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
  const cfg = STATUS_CONFIG[status];
  const padding = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${cfg.bg} ${cfg.text} border-${cfg.dot.replace("bg-", "")} ${padding} ${textSize}
        ${showTooltip ? 'cursor-help relative group' : ''}
      `}
      title={showTooltip ? cfg.description : undefined}
    >
      {cfg.icon}
      {cfg.label}
    </span>
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

// ── Modal de Insumo ──
function IngModal({
  ing,
  onClose,
}: {
  ing: Ingredient | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"dados" | "lotes" | "fornecedor" | "historico">("dados");
  const [batches, setBatches] = useState(
    ing?.batches.map(b => ({ ...b })) || [{ code: "", qty: 0, unit: "kg", expiry: "", cost: 0 }]
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={ing?.status || "good"} size="md" showTooltip />
                <span className="text-xs text-gray-500">
                  Criado em: {ing?.createdAt ? new Date(ing.createdAt).toLocaleDateString("pt-BR") : "Agora"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {ing ? ing.name : "Novo Insumo"}
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <Tag size={14} /> Código: {ing?.code || "Novo"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-gray-200 -mb-px">
            {[
              { id: "dados", label: "Dados Gerais", icon: <FileText size={14} /> },
              { id: "lotes", label: "Lotes", icon: <Box size={14} /> },
              { id: "fornecedor", label: "Fornecedor", icon: <Truck size={14} /> },
              { id: "historico", label: "Histórico", icon: <RotateCcw size={14} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`
                  px-5 py-3 text-sm font-medium transition-all flex items-center gap-2
                  ${tab === t.id ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500 hover:text-gray-700"}
                `}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {tab === "dados" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nome do insumo" required>
                  <Input defaultValue={ing?.name} placeholder="Ex: Farinha de Trigo" />
                </Field>
                <Field label="Categoria" required>
                  <Select defaultValue={ing?.category || "Farináceos"}>
                    {["Farináceos", "Laticínios", "Carnes", "Bebidas", "Descartáveis", "Temperos"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Código / SKU">
                  <Input defaultValue={ing?.code} placeholder="Ex: FT-001" />
                </Field>
                <Field label="Unidade de medida">
                  <Select defaultValue={ing?.unit || "kg"}>
                    <option>kg</option>
                    <option>litro</option>
                    <option>unidade</option>
                    <option>cento</option>
                    <option>pacote</option>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Estoque mínimo">
                  <Input type="number" defaultValue={ing?.min || 0} className="font-mono" />
                </Field>
                <Field label="Estado atual">
                  <Select defaultValue={ing?.status || "good"}>
                    <option value="good">OK</option>
                    <option value="low">Estoque baixo</option>
                    <option value="expiring">Vencendo</option>
                    <option value="critical">Crítico</option>
                  </Select>
                </Field>
              </div>

              <Field label="Observações / Notas">
                <textarea
                  defaultValue={ing?.notes}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Informações adicionais, cuidados especiais, etc..."
                />
              </Field>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <MapPin size={16} /> Localização no Depósito
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field label="Depósito">
                    <Input defaultValue={ing?.warehouse} placeholder="Ex: Despensa A" />
                  </Field>
                  <Field label="Prateleira">
                    <Input defaultValue={ing?.shelf} placeholder="Ex: P2" />
                  </Field>
                  <Field label="Seção">
                    <Input defaultValue={ing?.section} placeholder="Ex: Farináceos" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {tab === "lotes" && (
            <div className="space-y-8">
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
                      placeholder="Ex: LOTE-001"
                      className="border-0 rounded-none px-4 py-3 text-sm font-mono focus:outline-none"
                    />
                    <input
                      defaultValue={b.qty}
                      type="number"
                      step="0.1"
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
                      step="0.01"
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

              {ing && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Resumo de lotes</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total em estoque:</span>
                      <span className="ml-2 font-bold">{ing.current} {ing.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lotes ativos:</span>
                      <span className="ml-2 font-bold">{ing.batches.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor médio:</span>
                      <span className="ml-2 font-bold">R$ {ing.costPerUnit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "fornecedor" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Fornecedor">
                  <Input defaultValue={ing?.supplier} placeholder="Nome do fornecedor" />
                </Field>
                <Field label="Telefone">
                  <Input defaultValue={ing?.supplierPhone} placeholder="(11) 99999-9999" />
                </Field>
                <Field label="E-mail">
                  <Input defaultValue={ing?.supplierEmail} placeholder="fornecedor@email.com" />
                </Field>
              </div>
            </div>
          )}

          {tab === "historico" && ing && (
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                  Últimas movimentações
                </h4>
                <div className="space-y-4">
                  {ing.history.map((entry, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        {entry.type === "in" ? "📥" : entry.type === "out" ? "📤" : "⚠️"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{entry.desc}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{entry.qty}</div>
                      </div>
                      <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            <Save size={16} className="inline mr-2" />
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

        <div className="p-6 space-y-6">
          <Field label="Tipo de movimentação" required>
            <Select>
              <option>Entrada (compra)</option>
              <option>Consumo em evento</option>
              <option>Perda / Vencimento</option>
              <option>Descarte</option>
              <option>Devolução</option>
              <option>Ajuste de inventário</option>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Quantidade" required>
              <Input type="number" step="0.1" defaultValue="1" className="font-mono" />
            </Field>
            <Field label="Data" required>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </Field>
          </div>

          <Field label="Selecionar lote">
            <Select>
              {ing.batches.map(b => (
                <option key={b.code}>
                  {b.code} ({b.qty} {b.unit} · R$ {b.cost.toFixed(2)})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Vincular a evento (opcional)">
            <Select>
              <option>-- Selecione um evento --</option>
              <option>Aniversário Sofia (06/03)</option>
              <option>Casamento Silva (07/03)</option>
              <option>Formatura João (08/03)</option>
            </Select>
          </Field>

          <Field label="Observações">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Descreva o motivo..."
            />
          </Field>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong className="flex items-center gap-2">
              <AlertCircle size={16} /> Atenção
            </strong>
            <p className="mt-1">
              Ao registrar consumo, o estoque será baixado automaticamente.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Registrar Movimentação
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal com toggle para sidebars ──
export default function MateriaPrimaPage() {
  const [selectedId, setSelectedId] = useState<string>("ft001");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<{ type: "ing" | "mov"; title?: string } | null>(null);
  const [showBatches, setShowBatches] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  const selectedIng = ingredients.find(i => i.id === selectedId) || ingredients[0];

  // Filtrar ingredientes
  const filteredIngredients = ingredients
    .filter(i => selectedCategory === "Todos" || i.category === selectedCategory)
    .filter(i => 
      searchTerm === "" || 
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Estatísticas
  const totalItems = ingredients.reduce((sum, i) => sum + i.current, 0);
  const totalValue = ingredients.reduce((sum, i) => sum + (i.current * i.costPerUnit), 0);
  const criticalItems = ingredients.filter(i => i.status === "critical" || i.status === "expiring").length;
  const lowStockItems = ingredients.filter(i => i.status === "low").length;

  const totalForecast = selectedIng.forecast.reduce((sum, f) => sum + f.qty, 0);
  const stockSafetyPct = Math.min(100, Math.round((selectedIng.current / Math.max(selectedIng.min * 2, selectedIng.current)) * 100));

  return (
    <AppShell active="estoque-materiaprima">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/estoque" className="text-gray-500 hover:text-gray-700 font-medium">
            Estoque
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Matéria-Prima</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-1.5 rounded transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <Filter size={16} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-1.5 rounded transition-all ${showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar detalhes" : "Mostrar detalhes"}
            >
              <FileText size={16} />
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
              className={`p-1.5 rounded transition-all ${!showSidebar && !showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Modo foco (ocultar tudo)"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={16} /> Exportar
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <TrendingUp size={16} /> Sugestão de Compras
          </button>
          <button
            onClick={() => setModal({ type: "ing", title: "Novo Insumo" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Insumo
          </button>
        </div>
      </header>

      {/* Stats Strip - agora com toggle para ocultar */}
      <div className={`bg-white border-b border-gray-200 px-6 py-4 flex gap-10 shadow-sm transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div>
          <div className="text-3xl font-extrabold text-gray-900">{totalItems.toFixed(1)}</div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total em estoque</div>
        </div>
        <div className="border-l border-gray-200 pl-6">
          <div className="text-3xl font-extrabold text-gray-900">
            R$ {totalValue.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Valor em estoque</div>
        </div>
        {criticalItems > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div>
              <div className="text-xl font-bold text-red-700">{criticalItems}</div>
              <div className="text-xs text-gray-500">Vencimento crítico</div>
            </div>
          </div>
        )}
        {lowStockItems > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <div className="text-xl font-bold text-amber-700">{lowStockItems}</div>
              <div className="text-xs text-gray-500">Estoque baixo</div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome, código ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter size={14} /> Filtros
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de categorias - com toggle */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-72" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorias</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${selectedCategory === cat.name
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Alertas</h4>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar filtros"
          >
            <ChevronRightIcon size={16} />
          </button>
        )}

        {/* Lista de insumos - estilo tabela com efeito de expandir */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Insumos · {filteredIngredients.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredIngredients.length} de {ingredients.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Insumo</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Código</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Estoque</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"}`}>Validade</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredIngredients.map(ing => {
                const isLow = ing.current < ing.min;
                const isExpiring = ing.expiryStatus === "warning" || ing.expiryStatus === "critical";
                const showDetails = showBatches === ing.id;
                
                return (
                  <div key={ing.id}>
                    <div
                      onClick={() => setSelectedId(ing.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                        ${ing.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="font-medium text-gray-900">{ing.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{ing.category}</div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center font-mono text-sm text-gray-600`}>
                        {ing.code}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <StatusBadge status={ing.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLow ? "text-amber-600" : "text-gray-900"}`}>
                            {ing.current}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-600">{ing.min}</span>
                          <span className="text-xs text-gray-500 ml-1">{ing.unit}</span>
                          {isLow && (
                            <AlertTriangle size={14} className="text-amber-500 ml-1" />
                          )}
                        </div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"} flex items-center justify-between`}>
                        <span className={`text-sm ${
                          ing.expiryStatus === "critical" ? "text-red-600 font-bold" :
                          ing.expiryStatus === "warning" ? "text-orange-600" : "text-gray-600"
                        }`}>
                          {ing.expiry}
                          {isExpiring && (
                            <Clock size={14} className="inline ml-2" />
                          )}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBatches(showDetails ? null : ing.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Linha expandida com lotes */}
                    {showDetails && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Lotes em estoque
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {ing.batches.map((batch, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="font-mono text-sm font-bold">{batch.code}</div>
                              <div className="flex justify-between mt-2 text-xs">
                                <span className="text-gray-600">Quantidade:</span>
                                <span className="font-medium">{batch.qty} {batch.unit}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Validade:</span>
                                <span className={`font-medium ${
                                  batch.expiry.includes("03/26") ? "text-orange-600" : ""
                                }`}>
                                  {batch.expiry}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Custo:</span>
                                <span className="font-medium">R$ {batch.cost.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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

        {/* Painel lateral de detalhes - com toggle */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-96" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedIng.name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{selectedIng.code}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setModal({ type: "ing", title: `Editar — ${selectedIng.name}` })}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setModal({ type: "mov" })}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                >
                  <Package size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <StatusBadge status={selectedIng.status} size="md" showTooltip />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Alerta de sugestão de compra */}
            {selectedIng.current < selectedIng.min * 1.5 && (
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="text-blue-600" size={20} />
                  <h4 className="font-semibold text-blue-800">Sugestão de Compra</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Baseado em eventos próximos: <strong>
                    {(totalForecast - selectedIng.current + selectedIng.min).toFixed(1)} {selectedIng.unit}
                  </strong> recomendados
                </p>
                <button className="mt-3 text-sm font-medium text-blue-700 hover:underline">
                  Gerar solicitação de compra →
                </button>
              </div>
            )}

            {/* Cards de estoque */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-700">{selectedIng.current}</div>
                <div className="text-xs text-gray-600 mt-1">Atual</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-700">{selectedIng.min}</div>
                <div className="text-xs text-gray-600 mt-1">Mínimo</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">{selectedIng.unit}</div>
                <div className="text-xs text-gray-600 mt-1">Unidade</div>
              </div>
            </div>

            {/* Barra de segurança */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Nível de segurança</span>
                <span className={`font-mono ${stockSafetyPct < 50 ? "text-red-600" : stockSafetyPct < 70 ? "text-amber-600" : "text-emerald-600"}`}>
                  {stockSafetyPct}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stockSafetyPct >= 70 ? "bg-emerald-500" : stockSafetyPct >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${stockSafetyPct}%` }}
                />
              </div>
            </div>

            {/* Previsão de Consumo */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>Previsão de Consumo (7 dias)</span>
                <button className="text-blue-600 text-xs hover:underline">Ver mais</button>
              </h4>
              <div className="space-y-3">
                {selectedIng.forecast.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{f.event}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{f.date}</div>
                    </div>
                    <div className="font-bold text-gray-900">{f.qty} {f.unit}</div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-bold">
                  <span>Total estimado</span>
                  <span className="text-blue-700">{totalForecast.toFixed(1)} {selectedIng.unit}</span>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} /> Localização
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Depósito</span>
                  <span className="font-medium">{selectedIng.warehouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prateleira</span>
                  <span className="font-medium">{selectedIng.shelf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seção</span>
                  <span className="font-medium">{selectedIng.section}</span>
                </div>
              </div>
            </div>

            {/* Fornecedor */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck size={14} /> Fornecedor
              </h4>
              <div className="space-y-3">
                <div className="font-semibold text-gray-900">{selectedIng.supplier}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} /> {selectedIng.supplierPhone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} /> {selectedIng.supplierEmail}
                </div>
              </div>
            </div>

            {/* Observações */}
            {selectedIng.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Observações</h4>
                <p className="text-sm text-gray-700">{selectedIng.notes}</p>
              </div>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            <button
              onClick={() => setModal({ type: "mov" })}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Movimentar
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              Histórico
            </button>
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