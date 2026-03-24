"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Minimize2,
} from "lucide-react";

// ── Tipos (mantidos iguais) ──
type EquipStatus = "good" | "low" | "maintenance" | "broken";

interface Equipment {
  id: string;
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
  supplierContact?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reservations: { date: string; event: string; qty: number; time: string; status?: "confirmado" | "pendente" }[];
  history: { icon: string; title: string; meta: string; type: "out" | "in" | "maintenance"; date: string }[];
  maintenanceHistory?: { date: string; description: string; cost: number; status: "pending" | "completed" }[];
}

// ── Lista de Brinquedos (mantida igual) ──
const equipments: Equipment[] = [
  {
    id: "JAC-001",
    name: "Jacaré Inflável",
    category: "Brinquedos",
    location: "Galpão C · Área 1",
    total: 5,
    available: 3,
    reserved: 2,
    status: "good",
    code: "#JAC-001",
    unit: "Unidade",
    minStock: 2,
    unitCost: 450,
    lastPurchase: "10/01/2026",
    warehouse: "Galpão C",
    shelf: "Área 1",
    section: "Infláveis Grandes",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Inflável grande, requer espaço mínimo 4x4m",
    createdAt: "2024-01-15",
    updatedAt: "2026-02-15",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "pendente" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 1 un · 15/03", type: "out", date: "15/03/2026" },
      { icon: "📥", title: "Devolução", meta: "Evento Escola · 1 un · 05/03", type: "in", date: "05/03/2026" },
    ],
  },
  {
    id: "MJ-002",
    name: "Mini Jacaré",
    category: "Brinquedos",
    location: "Galpão C · Área 2",
    total: 8,
    available: 5,
    reserved: 3,
    status: "good",
    code: "#MJ-002",
    unit: "Unidade",
    minStock: 3,
    unitCost: 350,
    lastPurchase: "15/01/2026",
    warehouse: "Galpão C",
    shelf: "Área 2",
    section: "Infláveis Médios",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 1 un · 15/03", type: "out", date: "15/03/2026" },
    ],
  },
  {
    id: "FS-003",
    name: "Futebol de Sabão",
    category: "Brinquedos",
    location: "Galpão C · Área 3",
    total: 4,
    available: 2,
    reserved: 2,
    status: "good",
    code: "#FS-003",
    unit: "Unidade",
    minStock: 2,
    unitCost: 550,
    lastPurchase: "20/12/2025",
    warehouse: "Galpão C",
    shelf: "Área 3",
    section: "Infláveis Especiais",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Requer bomba de água e espaço para escorregar",
    reservations: [
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "confirmado" },
      { date: "22/03", event: "Formatura João", qty: 1, time: "19h às 23h", status: "pendente" },
    ],
    history: [
      { icon: "🔧", title: "Manutenção", meta: "Lona rasgada - reparo", type: "maintenance", date: "01/03/2026" },
    ],
    maintenanceHistory: [
      { date: "01/03/2026", description: "Lona rasgada - reparo", cost: 80, status: "completed" },
    ],
  },
  {
    id: "PP-004",
    name: "Mesa de Ping Pong",
    category: "Brinquedos",
    location: "Galpão B · P3",
    total: 6,
    available: 4,
    reserved: 2,
    status: "good",
    code: "#PP-004",
    unit: "Unidade",
    minStock: 2,
    unitCost: 320,
    lastPurchase: "05/02/2026",
    warehouse: "Galpão B",
    shelf: "P3",
    section: "Jogos",
    supplier: "Artigos Esportivos",
    supplierPhone: "(11) 3456-7890",
    supplierEmail: "vendas@artigosesportivos.com.br",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 1 un · 15/03", type: "out", date: "15/03/2026" },
    ],
  },
  {
    id: "BE-005",
    name: "Basquete Eletrônico",
    category: "Brinquedos",
    location: "Galpão B · P4",
    total: 7,
    available: 5,
    reserved: 2,
    status: "good",
    code: "#BE-005",
    unit: "Unidade",
    minStock: 2,
    unitCost: 320,
    lastPurchase: "10/01/2026",
    warehouse: "Galpão B",
    shelf: "P4",
    section: "Jogos Eletrônicos",
    supplier: "Artigos Esportivos",
    supplierPhone: "(11) 3456-7890",
    supplierEmail: "vendas@artigosesportivos.com.br",
    notes: "Funciona com pilhas ou tomada",
    reservations: [
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Casamento Silva · 1 un · 18/03", type: "out", date: "18/03/2026" },
    ],
  },
  {
    id: "PB-006",
    name: "Piscina de Bolinha",
    category: "Brinquedos",
    location: "Galpão C · Área 2",
    total: 10,
    available: 7,
    reserved: 3,
    status: "good",
    code: "#PB-006",
    unit: "Unidade",
    minStock: 4,
    unitCost: 270,
    lastPurchase: "15/12/2025",
    warehouse: "Galpão C",
    shelf: "Área 2",
    section: "Infláveis Médios",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Inclui 500 bolinhas coloridas",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "pendente" },
    ],
    history: [
      { icon: "📥", title: "Compra", meta: "2 unidades - 15/12", type: "in", date: "15/12/2025" },
    ],
  },
  {
    id: "CE-007",
    name: "Cama Elástica",
    category: "Brinquedos",
    location: "Galpão C · Área 4",
    total: 8,
    available: 5,
    reserved: 3,
    status: "good",
    code: "#CE-007",
    unit: "Unidade",
    minStock: 3,
    unitCost: 300,
    lastPurchase: "20/01/2026",
    warehouse: "Galpão C",
    shelf: "Área 4",
    section: "Infláveis Grandes",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Com proteção lateral e rede de segurança",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
      { date: "22/03", event: "Formatura João", qty: 1, time: "19h às 23h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Formatura João · 1 un · 22/03", type: "out", date: "22/03/2026" },
    ],
  },
  {
    id: "FE-008",
    name: "Festas e Eventos",
    category: "Brinquedos",
    location: "Galpão C · Área 1",
    total: 4,
    available: 2,
    reserved: 2,
    status: "maintenance",
    code: "#FE-008",
    unit: "Unidade",
    minStock: 2,
    unitCost: 450,
    lastPurchase: "05/12/2025",
    warehouse: "Galpão C",
    shelf: "Área 1",
    section: "Infláveis Grandes",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "1 unidade em manutenção (soprador com problema)",
    reservations: [
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "confirmado" },
    ],
    history: [
      { icon: "🔧", title: "Manutenção", meta: "Soprador com problema", type: "maintenance", date: "10/03/2026" },
    ],
    maintenanceHistory: [
      { date: "10/03/2026", description: "Soprador com problema - aguardando peça", cost: 150, status: "pending" },
    ],
  },
  {
    id: "MH-009",
    name: "Multih Park",
    category: "Brinquedos",
    location: "Galpão C · Área 1",
    total: 3,
    available: 2,
    reserved: 1,
    status: "good",
    code: "#MH-009",
    unit: "Unidade",
    minStock: 1,
    unitCost: 450,
    lastPurchase: "10/02/2026",
    warehouse: "Galpão C",
    shelf: "Área 1",
    section: "Infláveis Grandes",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 1 un · 15/03", type: "out", date: "15/03/2026" },
    ],
  },
  {
    id: "CT-010",
    name: "Castelinho",
    category: "Brinquedos",
    location: "Galpão C · Área 2",
    total: 6,
    available: 4,
    reserved: 2,
    status: "good",
    code: "#CT-010",
    unit: "Unidade",
    minStock: 2,
    unitCost: 350,
    lastPurchase: "15/01/2026",
    warehouse: "Galpão C",
    shelf: "Área 2",
    section: "Infláveis Médios",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Tema castelo com escorregador",
    reservations: [
      { date: "22/03", event: "Formatura João", qty: 1, time: "19h às 23h", status: "pendente" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Evento Escola · 1 un · 01/03", type: "out", date: "01/03/2026" },
    ],
  },
  {
    id: "TL-011",
    name: "Tombo Legal",
    category: "Brinquedos",
    location: "Galpão C · Área 3",
    total: 5,
    available: 3,
    reserved: 2,
    status: "low",
    code: "#TL-011",
    unit: "Unidade",
    minStock: 3,
    unitCost: 370,
    lastPurchase: "20/02/2026",
    warehouse: "Galpão C",
    shelf: "Área 3",
    section: "Infláveis Especiais",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    notes: "Brinquedo de queda controlada",
    reservations: [
      { date: "15/03", event: "Aniversário Sofia", qty: 1, time: "13h às 18h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Aniversário Sofia · 1 un · 15/03", type: "out", date: "15/03/2026" },
    ],
  },
  {
    id: "TT-012",
    name: "Tobogã Tradicional",
    category: "Brinquedos",
    location: "Galpão C · Área 1",
    total: 4,
    available: 2,
    reserved: 2,
    status: "good",
    code: "#TT-012",
    unit: "Unidade",
    minStock: 2,
    unitCost: 430,
    lastPurchase: "05/01/2026",
    warehouse: "Galpão C",
    shelf: "Área 1",
    section: "Infláveis Grandes",
    supplier: "Brinquedos Infantis",
    supplierPhone: "(11) 3678-9012",
    supplierEmail: "comercial@brinquedosinfantis.com.br",
    reservations: [
      { date: "18/03", event: "Casamento Silva", qty: 1, time: "19h às 23h", status: "confirmado" },
    ],
    history: [
      { icon: "📤", title: "Saída para evento", meta: "Casamento Silva · 1 un · 18/03", type: "out", date: "18/03/2026" },
    ],
  },
];

// ── Configuração de Status ──
const STATUS_CONFIG: Record<EquipStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  good: {
    label: "Bom estado",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Equipamento em perfeitas condições",
  },
  low: {
    label: "Estoque baixo",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    description: "Abaixo do estoque mínimo recomendado",
  },
  maintenance: {
    label: "Em manutenção",
    bg: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
    icon: <Wrench className="w-3.5 h-3.5" />,
    description: "Equipamento em reparo",
  },
  broken: {
    label: "Danificado",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "Equipamento com avaria, fora de uso",
  },
};

// ── Categorias ──
const categories = [
  { name: "Todos", count: equipments.length, icon: "🎪" },
  { name: "Brinquedos", count: equipments.length, icon: "🧸" },
  { name: "Infláveis Grandes", count: equipments.filter(e => e.section === "Infláveis Grandes").length, icon: "🏰" },
  { name: "Infláveis Médios", count: equipments.filter(e => e.section === "Infláveis Médios").length, icon: "🎈" },
  { name: "Infláveis Especiais", count: equipments.filter(e => e.section === "Infláveis Especiais").length, icon: "⭐" },
  { name: "Jogos", count: equipments.filter(e => e.section === "Jogos").length, icon: "🎯" },
  { name: "Jogos Eletrônicos", count: equipments.filter(e => e.section === "Jogos Eletrônicos").length, icon: "🎮" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: EquipStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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

// ── Modal de Equipamento ──
function EquipModal({
  equip,
  onClose,
}: {
  equip: Equipment | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"dados" | "estoque" | "fornecedor" | "historico">("dados");

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
                <StatusBadge status={equip?.status || "good"} size="md" showTooltip />
                <span className="text-xs text-gray-500">
                  Criado em: {equip?.createdAt ? new Date(equip.createdAt).toLocaleDateString("pt-BR") : "Agora"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {equip ? equip.name : "Novo Brinquedo"}
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <Tag size={14} /> Código: {equip?.code || "Novo"}
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
              { id: "estoque", label: "Estoque", icon: <Box size={14} /> },
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
                <Field label="Nome do brinquedo" required>
                  <Input defaultValue={equip?.name} placeholder="Ex: Jacaré Inflável" />
                </Field>
                <Field label="Categoria" required>
                  <Select defaultValue={equip?.category || "Brinquedos"}>
                    <option>Brinquedos</option>
                  </Select>
                </Field>
                <Field label="Código / SKU">
                  <Input defaultValue={equip?.code} placeholder="Ex: JAC-001" />
                </Field>
                <Field label="Unidade">
                  <Select defaultValue={equip?.unit || "Unidade"}>
                    <option>Unidade</option>
                    <option>Conjunto</option>
                  </Select>
                </Field>
              </div>

              <Field label="Observações / Notas">
                <textarea
                  defaultValue={equip?.notes}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Informações adicionais, cuidados especiais, etc..."
                />
              </Field>
            </div>
          )}

          {tab === "estoque" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Quantidade total">
                  <Input type="number" defaultValue={equip?.total || 0} className="font-mono" />
                </Field>
                <Field label="Disponível">
                  <Input type="number" defaultValue={equip?.available || 0} className="font-mono bg-gray-50" readOnly />
                </Field>
                <Field label="Reservado">
                  <Input type="number" defaultValue={equip?.reserved || 0} className="font-mono bg-gray-50" readOnly />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Estoque mínimo">
                  <Input type="number" defaultValue={equip?.minStock || 0} className="font-mono" />
                </Field>
                <Field label="Estado atual">
                  <Select defaultValue={equip?.status || "good"}>
                    <option value="good">Bom estado</option>
                    <option value="low">Estoque baixo</option>
                    <option value="maintenance">Em manutenção</option>
                    <option value="broken">Danificado</option>
                  </Select>
                </Field>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <MapPin size={16} /> Localização no Depósito
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field label="Galpão">
                    <Input defaultValue={equip?.warehouse} placeholder="Ex: Galpão C" />
                  </Field>
                  <Field label="Prateleira">
                    <Input defaultValue={equip?.shelf} placeholder="Ex: Área 1" />
                  </Field>
                  <Field label="Seção">
                    <Input defaultValue={equip?.section} placeholder="Ex: Infláveis Grandes" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {tab === "fornecedor" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Fornecedor">
                  <Input defaultValue={equip?.supplier} placeholder="Nome do fornecedor" />
                </Field>
                <Field label="Contato">
                  <Input defaultValue={equip?.supplierContact} placeholder="Nome do contato" />
                </Field>
                <Field label="Telefone">
                  <Input defaultValue={equip?.supplierPhone} placeholder="(11) 99999-9999" />
                </Field>
                <Field label="E-mail">
                  <Input defaultValue={equip?.supplierEmail} placeholder="fornecedor@email.com" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Valor unitário (custo)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      defaultValue={equip?.unitCost?.toFixed(2).replace(".", ",")}
                      className="pl-10 font-mono"
                      placeholder="0,00"
                    />
                  </div>
                </Field>
                <Field label="Última compra">
                  <Input type="date" defaultValue={equip?.lastPurchase?.split('/').reverse().join('-')} />
                </Field>
              </div>
            </div>
          )}

          {tab === "historico" && equip && (
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                  Últimas movimentações
                </h4>
                <div className="space-y-4">
                  {equip.history.map((entry, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        {entry.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{entry.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{entry.meta}</div>
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
            Salvar Brinquedo
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

        <div className="p-6 space-y-6">
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

          <div className="grid grid-cols-2 gap-6">
            <Field label="Quantidade" required>
              <Input type="number" defaultValue="1" className="font-mono" />
            </Field>
            <Field label="Data" required>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </Field>
          </div>

          <Field label="Vincular a evento (opcional)">
            <Select>
              <option>-- Selecione um evento --</option>
              <option>Aniversário Sofia (15/03)</option>
              <option>Casamento Silva (18/03)</option>
              <option>Formatura João (22/03)</option>
            </Select>
          </Field>

          <Field label="Observações">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Descreva o motivo, avarias, etc..."
            />
          </Field>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong className="flex items-center gap-2">
              <AlertCircle size={16} /> Atenção
            </strong>
            <p className="mt-1">
              Ao registrar saída, os itens ficarão indisponíveis para outros eventos na data selecionada.
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
export default function EquipamentosPage() {
  const [selectedId, setSelectedId] = useState<string>("JAC-001");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<{ type: "equip" | "mov"; title?: string } | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  const selectedEquip = equipments.find(e => e.id === selectedId) || equipments[0];

  // Filtrar equipamentos
  const filteredEquipments = equipments
    .filter(e => selectedCategory === "Todos" || 
                 selectedCategory === "Brinquedos" || 
                 e.section === selectedCategory)
    .filter(e => 
      searchTerm === "" || 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Estatísticas
  const totalItems = equipments.reduce((sum, e) => sum + e.total, 0);
  const totalAvailable = equipments.reduce((sum, e) => sum + e.available, 0);
  const totalReserved = equipments.reduce((sum, e) => sum + e.reserved, 0);
  const lowStockItems = equipments.filter(e => e.status === "low" || e.status === "maintenance").length;

  return (
    <AppShell active="estoque-equipamentos">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/estoque" className="text-gray-500 hover:text-gray-700 font-medium">
            Estoque
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Brinquedos</span>
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
          <button
            onClick={() => setModal({ type: "mov" })}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RotateCcw size={16} /> Movimentar
          </button>
          <button
            onClick={() => setModal({ type: "equip", title: "Novo Brinquedo" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Brinquedo
          </button>
        </div>
      </header>

      {/* Stats Strip - agora com toggle para ocultar */}
      <div className={`bg-white border-b border-gray-200 px-6 py-4 flex gap-10 shadow-sm transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div>
          <div className="text-3xl font-extrabold text-gray-900">{totalItems}</div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total de itens</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-emerald-600">{totalAvailable}</div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Disponíveis</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-amber-600">{totalReserved}</div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Reservados</div>
        </div>

        {lowStockItems > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <div className="text-xl font-bold text-amber-700">{lowStockItems}</div>
              <div className="text-xs text-gray-500">Itens críticos</div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome ou código..."
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Status</h4>
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

        {/* Lista de brinquedos - estilo tabela (expande quando sidebars ocultas) */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Brinquedos · {filteredEquipments.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredEquipments.length} de {equipments.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-4" : "col-span-5"}`}>Brinquedo</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Código</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Disponível</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"}`}>Localização</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredEquipments.map(equip => {
                const isLow = equip.available < equip.minStock;
                
                return (
                  <div
                    key={equip.id}
                    onClick={() => setSelectedId(equip.id)}
                    className={`
                      grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                      ${equip.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                    `}
                  >
                    <div className={`${showDetailsPanel ? "col-span-4" : "col-span-5"}`}>
                      <div className="font-medium text-gray-900">{equip.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{equip.section}</div>
                    </div>
                    <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center font-mono text-sm text-gray-600`}>
                      {equip.code}
                    </div>
                    <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                      <StatusBadge status={equip.status} />
                    </div>
                    <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{equip.available}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">{equip.total}</span>
                        {isLow && (
                          <AlertTriangle size={14} className="text-amber-500 ml-2" />
                        )}
                      </div>
                    </div>
                    <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"} flex items-center text-sm text-gray-600 truncate`}>
                      {equip.location}
                    </div>
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
                <h3 className="text-xl font-bold text-gray-900">{selectedEquip.name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{selectedEquip.code}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setModal({ type: "equip", title: `Editar — ${selectedEquip.name}` })}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                >
                  <Edit size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <StatusBadge status={selectedEquip.status} size="md" showTooltip />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cards de disponibilidade */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-700">{selectedEquip.available}</div>
                <div className="text-xs text-gray-600 mt-1">Disponível</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-700">{selectedEquip.reserved}</div>
                <div className="text-xs text-gray-600 mt-1">Reservado</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">{selectedEquip.total}</div>
                <div className="text-xs text-gray-600 mt-1">Total</div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} /> Localização
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Galpão</span>
                  <span className="font-medium">{selectedEquip.warehouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prateleira</span>
                  <span className="font-medium">{selectedEquip.shelf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seção</span>
                  <span className="font-medium">{selectedEquip.section}</span>
                </div>
              </div>
            </div>

            {/* Reservas ativas */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>Reservas ativas ({selectedEquip.reservations.length})</span>
                <button className="text-blue-600 text-xs hover:underline">Ver todas</button>
              </h4>
              <div className="space-y-3">
                {selectedEquip.reservations.slice(0, 3).map((res, i) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{res.event}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{res.date} · {res.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{res.qty} un</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        res.status === "confirmado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {res.status === "confirmado" ? "Confirmado" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fornecedor */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck size={14} /> Fornecedor
              </h4>
              <div className="space-y-3">
                <div className="font-semibold text-gray-900">{selectedEquip.supplier}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} /> {selectedEquip.supplierPhone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} /> {selectedEquip.supplierEmail}
                </div>
              </div>
            </div>

            {/* Histórico rápido */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>Últimas movimentações</span>
                <button className="text-blue-600 text-xs hover:underline">Ver tudo</button>
              </h4>
              <div className="space-y-3">
                {selectedEquip.history.slice(0, 3).map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {entry.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{entry.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações */}
            {selectedEquip.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Observações</h4>
                <p className="text-sm text-gray-700">{selectedEquip.notes}</p>
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
      {modal?.type === "equip" && (
        <EquipModal equip={modal.title?.includes("Editar") ? selectedEquip : null} onClose={() => setModal(null)} />
      )}
      {modal?.type === "mov" && <MovimentModal onClose={() => setModal(null)} />}
    </AppShell>
  );
}