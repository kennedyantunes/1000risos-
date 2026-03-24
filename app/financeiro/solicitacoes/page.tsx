"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  FileText,
  X,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Package,
  Truck,
  User,
  Building2,
  CalendarDays,
  FileCheck,
  Eye,
  Edit,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  ChevronLeft,
  RotateCcw,
  Send,
  Mail,
  Phone,
  AlertTriangle,
  Printer,
  Share2,
} from "lucide-react";

// ── Tipos ──
type ReqStatus = "pending" | "approved" | "purchased" | "received" | "rejected";
type Priority = "high" | "medium" | "low";

interface ReqItem {
  name: string;
  qty: string;
  unitPrice: number;
}

interface TimelineStep {
  title: string;
  meta?: string;
  date?: string;
  done: boolean;
  current: boolean;
}

interface PurchaseRequest {
  id: string;
  title: string;
  status: ReqStatus;
  priority: Priority;
  requester: string;
  dept: string;
  date: string;
  time: string;
  type: string;
  eventLinked?: string;
  eventDate?: string;
  items: ReqItem[];
  total: number;
  justification: string;
  approvedBy?: string;
  rejectedReason?: string;
  attachments: { name: string; size: string }[];
  suppliers: { name: string; contact: string }[];
  timeline: TimelineStep[];
  createdAt: string;
  updatedAt: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG: Record<ReqStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  pending: {
    label: "Pendente",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5" />,
    description: "Aguardando aprovação",
  },
  approved: {
    label: "Aprovada",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Aprovada pelo financeiro",
  },
  purchased: {
    label: "Comprada",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    icon: <Package className="w-3.5 h-3.5" />,
    description: "Compra realizada",
  },
  received: {
    label: "Recebida",
    bg: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Materiais recebidos no estoque",
  },
  rejected: {
    label: "Reprovada",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
    description: "Solicitação reprovada",
  },
};

// ── Configuração de Prioridade ──
const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}> = {
  high: {
    label: "Alta",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  medium: {
    label: "Média",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  low: {
    label: "Baixa",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

// ── Mock Data ──
const requests: PurchaseRequest[] = [
  {
    id: "SC-2026-0042",
    title: "Compra emergencial de ingredientes",
    status: "pending",
    priority: "high",
    requester: "Marcos Andrade",
    dept: "Administração",
    date: "06/03/2026",
    time: "09:23",
    type: "Matéria-prima",
    eventLinked: "Aniversário Sofia",
    eventDate: "06/03/2026",
    items: [
      { name: "Farinha de Trigo", qty: "15 kg", unitPrice: 3.5 },
      { name: "Açúcar Refinado", qty: "10 kg", unitPrice: 2.8 },
      { name: "Ovos (dúzia)", qty: "5 dz", unitPrice: 12 },
      { name: "Leite Integral", qty: "8 L", unitPrice: 4.5 },
      { name: "Óleo de Soja", qty: "5 L", unitPrice: 4.2 },
    ],
    total: 287.5,
    justification:
      "Estoque insuficiente para o evento 'Aniversário Sofia' no dia 06/03. Necessário compra urgente para produção das 80 coxinhas e docinhos contratados.",
    attachments: [
      { name: "Lista de ingredientes.pdf", size: "245 KB" },
      { name: "Orçamento_ingredientes.jpg", size: "1.2 MB" },
    ],
    suppliers: [
      { name: "Moinho Dourado", contact: "Farinhas e derivados · (11) 3456-7890" },
      { name: "Granja Ouro", contact: "Ovos e laticínios · (11) 98765-4321" },
    ],
    timeline: [
      { title: "Solicitação criada", meta: "Marcos Andrade · Administração", date: "06/03/2026 · 09:23", done: true, current: false },
      { title: "Aguardando aprovação", meta: "Financeiro", date: "Há 2 horas", done: false, current: true },
      { title: "Compra", meta: "Aguardando aprovação", done: false, current: false },
      { title: "Recebimento", done: false, current: false },
    ],
    createdAt: "2026-03-06",
    updatedAt: "2026-03-06",
  },
  {
    id: "SC-2026-0041",
    title: "Reposição de descartáveis",
    status: "pending",
    priority: "medium",
    requester: "Carla Santos",
    dept: "Operações",
    date: "05/03/2026",
    time: "14:10",
    type: "Descartável",
    items: [
      { name: "Pratos descartáveis", qty: "500 un", unitPrice: 0.35 },
      { name: "Copos 200ml", qty: "300 un", unitPrice: 0.18 },
      { name: "Talheres (kit)", qty: "200 un", unitPrice: 0.28 },
    ],
    total: 189,
    justification: "Reposição de estoque mínimo de descartáveis para os próximos eventos do mês.",
    attachments: [],
    suppliers: [{ name: "Descart Express", contact: "Descartáveis · (11) 2233-4455" }],
    timeline: [
      { title: "Solicitação criada", meta: "Carla Santos · Operações", date: "05/03/2026 · 14:10", done: true, current: false },
      { title: "Aguardando aprovação", meta: "Financeiro", done: false, current: true },
      { title: "Compra", done: false, current: false },
      { title: "Recebimento", done: false, current: false },
    ],
    createdAt: "2026-03-05",
    updatedAt: "2026-03-05",
  },
  {
    id: "SC-2026-0038",
    title: "Novos equipamentos - cozinha",
    status: "approved",
    priority: "low",
    requester: "Mariana Rocha",
    dept: "Gerência",
    date: "03/03/2026",
    time: "11:45",
    type: "Equipamento",
    items: [
      { name: "Batedeira industrial", qty: "1 un", unitPrice: 1500 },
      { name: "Assadeira antiaderente", qty: "5 un", unitPrice: 78 },
    ],
    total: 1890,
    justification: "Equipamentos necessários para aumentar capacidade de produção.",
    approvedBy: "Financeiro",
    attachments: [{ name: "Cotação_equipamentos.pdf", size: "380 KB" }],
    suppliers: [{ name: "Equipamentos Gastro", contact: "(11) 5566-7788" }],
    timeline: [
      { title: "Solicitação criada", meta: "Mariana Rocha · Gerência", date: "03/03/2026 · 11:45", done: true, current: false },
      { title: "Aprovada", meta: "Financeiro", date: "04/03/2026 · 09:00", done: true, current: false },
      { title: "Aguardando compra", done: false, current: true },
      { title: "Recebimento", done: false, current: false },
    ],
    createdAt: "2026-03-03",
    updatedAt: "2026-03-04",
  },
  {
    id: "SC-2026-0035",
    title: "Carnes para eventos do fim de semana",
    status: "purchased",
    priority: "high",
    requester: "João Pedro",
    dept: "Cozinha",
    date: "02/03/2026",
    time: "08:30",
    type: "Matéria-prima",
    items: [
      { name: "Frango desfiado", qty: "8 kg", unitPrice: 14.5 },
      { name: "Carne moída", qty: "5 kg", unitPrice: 28 },
      { name: "Linguiça", qty: "3 kg", unitPrice: 18 },
    ],
    total: 342,
    justification: "Compra de carnes para os eventos confirmados do fim de semana.",
    attachments: [{ name: "NF_12345.pdf", size: "156 KB" }],
    suppliers: [{ name: "Frigorífico Bom Gosto", contact: "(11) 5432-1098" }],
    timeline: [
      { title: "Solicitação criada", date: "02/03/2026 · 08:30", done: true, current: false },
      { title: "Aprovada", date: "02/03/2026 · 10:00", done: true, current: false },
      { title: "Compra realizada", meta: "NF 12345", date: "03/03/2026 · 09:15", done: true, current: false },
      { title: "Aguardando entrega", done: false, current: true },
    ],
    createdAt: "2026-03-02",
    updatedAt: "2026-03-03",
  },
  {
    id: "SC-2026-0032",
    title: "Material de limpeza",
    status: "received",
    priority: "low",
    requester: "Carla Santos",
    dept: "Operações",
    date: "28/02/2026",
    time: "15:00",
    type: "Outro",
    items: [
      { name: "Detergente", qty: "5 L", unitPrice: 8.5 },
      { name: "Desinfetante", qty: "5 L", unitPrice: 9.2 },
      { name: "Luvas", qty: "10 pares", unitPrice: 4.2 },
    ],
    total: 78.5,
    justification: "Reposição de materiais de limpeza.",
    attachments: [],
    suppliers: [{ name: "Limpeza Total", contact: "(11) 3322-5544" }],
    timeline: [
      { title: "Solicitação criada", date: "28/02/2026", done: true, current: false },
      { title: "Aprovada", done: true, current: false },
      { title: "Compra realizada", done: true, current: false },
      { title: "Recebida", meta: "Recebido por: Estoque", date: "01/03/2026", done: true, current: false },
    ],
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
  },
  {
    id: "SC-2026-0029",
    title: "Decoração temática - Natal",
    status: "rejected",
    priority: "medium",
    requester: "Marcos Andrade",
    dept: "Operações",
    date: "25/02/2026",
    time: "10:20",
    type: "Decoração",
    items: [{ name: "Enfeites natalinos", qty: "kit", unitPrice: 450 }],
    total: 450,
    justification: "Decoração para eventos de fim de ano.",
    rejectedReason: "Fora do orçamento",
    attachments: [],
    suppliers: [],
    timeline: [
      { title: "Solicitação criada", date: "25/02/2026", done: true, current: false },
      { title: "Reprovada", meta: "Motivo: Fora do orçamento", date: "26/02/2026", done: true, current: false },
    ],
    createdAt: "2026-02-25",
    updatedAt: "2026-02-26",
  },
];

// ── Categorias de Status ──
const statusCategories = [
  { status: "all", label: "Todas", count: requests.length, color: "bg-gray-500", icon: "📋" },
  { status: "pending", label: "Pendentes", count: requests.filter(r => r.status === "pending").length, color: "bg-amber-500", icon: "⏳" },
  { status: "approved", label: "Aprovadas", count: requests.filter(r => r.status === "approved").length, color: "bg-emerald-500", icon: "✅" },
  { status: "purchased", label: "Compradas", count: requests.filter(r => r.status === "purchased").length, color: "bg-blue-500", icon: "📦" },
  { status: "received", label: "Recebidas", count: requests.filter(r => r.status === "received").length, color: "bg-purple-500", icon: "🎁" },
  { status: "rejected", label: "Reprovadas", count: requests.filter(r => r.status === "rejected").length, color: "bg-red-500", icon: "❌" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: ReqStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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

// ── Componente PriorityBadge ──
function PriorityBadge({ priority, size = "sm" }: { priority: Priority; size?: "sm" | "md" }) {
  const cfg = PRIORITY_CONFIG[priority];
  const padding = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.bg} ${cfg.color} ${padding} ${textSize}`}>
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

// ── Modal de Nova Solicitação ──
function NewRequestModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    title: "",
    type: "Matéria-prima",
    priority: "medium" as Priority,
    justification: "",
    items: [{ name: "", qty: "", unitPrice: "" }],
  });

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: "", unitPrice: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: "name" | "qty" | "unitPrice", value: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Solicitação de Compra</h2>
              <p className="text-sm text-gray-600 mt-1">Preencha os dados da solicitação</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Field label="Título da solicitação" required>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Compra de insumos para evento X"
                />
              </Field>
            </div>
            <Field label="Prioridade">
              <Select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
              >
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </Select>
            </Field>
            <Field label="Tipo de solicitação">
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Matéria-prima">Matéria-prima</option>
                <option value="Descartável">Descartável</option>
                <option value="Equipamento">Equipamento</option>
                <option value="Decoração">Decoração</option>
                <option value="Outro">Outro</option>
              </Select>
            </Field>
          </div>

          {/* Itens */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Itens solicitados</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                <Plus size={16} /> Adicionar item
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="md:col-span-5">
                    <Field label="Nome do item" required>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        placeholder="Ex: Farinha de trigo"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-3">
                    <Field label="Quantidade" required>
                      <Input
                        value={item.qty}
                        onChange={(e) => updateItem(index, "qty", e.target.value)}
                        placeholder="Ex: 20 kg"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-3">
                    <Field label="Valor unitário estimado">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      disabled={form.items.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Justificativa */}
          <div className="mt-8">
            <Field label="Justificativa / Observações" required>
              <textarea
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Explique o motivo da solicitação, urgência, contexto do uso dos itens..."
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
            <Plus size={16} /> Criar Solicitação
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Movimentação/Ação ──
function ActionModal({ onClose, title, action }: { onClose: () => void; title: string; action: string }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Field label="Observações / Justificativa">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder={`Descreva o motivo da ${action.toLowerCase()}...`}
            />
          </Field>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong className="flex items-center gap-2">
              <AlertCircle size={16} /> Atenção
            </strong>
            <p className="mt-1">
              Esta ação será registrada no histórico da solicitação.
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
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal com toggle para sidebars ──
export default function SolicitacoesPage() {
  const [selectedId, setSelectedId] = useState<string>("SC-2026-0042");
  const [statusFilter, setStatusFilter] = useState<ReqStatus | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject" | "purchase" | "receive" } | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string | null>(null);

  const selectedReq = requests.find((r) => r.id === selectedId) || requests[0];

  // Filtrar solicitações
  const filteredRequests = requests
    .filter(r => statusFilter === "all" || r.status === statusFilter)
    .filter(r => 
      searchTerm === "" || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requester.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Estatísticas
  const totalRequests = requests.length;
  const totalPending = requests.filter(r => r.status === "pending").length;
  const totalApproved = requests.filter(r => r.status === "approved").length;
  const totalPurchased = requests.filter(r => r.status === "purchased").length;
  const totalReceived = requests.filter(r => r.status === "received").length;
  const totalRejected = requests.filter(r => r.status === "rejected").length;

  const handleCreateRequest = (data: any) => {
    console.log("Nova solicitação:", data);
    // Aqui você implementaria a lógica para salvar
  };

  return (
    <AppShell active="financeiro-solicitacoes">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/financeiro" className="text-gray-500 hover:text-gray-700 font-medium">
            Financeiro
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Solicitações de Compra</span>
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
            <Download size={16} /> Relatórios
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Nova Solicitação
          </button>
        </div>
      </header>


      {/* Barra de pesquisa e filtros */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por ID, título ou solicitante..."
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {statusCategories.map(cat => (
              <button
                key={cat.status}
                onClick={() => setStatusFilter(cat.status as any)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${statusFilter === cat.status
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Prioridades</h4>
            <div className="space-y-3">
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className={`w-3 h-3 rounded-full ${key === "high" ? "bg-red-500" : key === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
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
            <ChevronRight size={16} />
          </button>
        )}

        {/* Lista de solicitações - estilo tabela */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Solicitações · {filteredRequests.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredRequests.length} de {requests.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Solicitação</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>ID</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Valor</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"}`}>Solicitante</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredRequests.map(req => {
                const isExpanded = expandedItems === req.id;
                
                return (
                  <div key={req.id}>
                    <div
                      onClick={() => setSelectedId(req.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                        ${req.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="font-medium text-gray-900 truncate">{req.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{req.type}</div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center font-mono text-sm text-gray-600`}>
                        {req.id}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {req.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                        </div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"} flex items-center justify-between`}>
                        <div>
                          <div className="text-sm text-gray-900">{req.requester}</div>
                          <div className="text-xs text-gray-500">{req.dept}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItems(isExpanded ? null : req.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Linha expandida com itens */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Itens solicitados ({req.items.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {req.items.map((item, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="flex justify-between mt-2 text-xs">
                                <span className="text-gray-600">Quantidade:</span>
                                <span className="font-medium">{item.qty}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Valor unitário:</span>
                                <span className="font-medium">
                                  {item.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs font-bold mt-1 pt-1 border-t border-gray-100">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-blue-700">
                                  {(item.unitPrice * parseFloat(item.qty)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
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
                <div className="text-xs text-gray-500 font-mono mb-1">#{selectedReq.id}</div>
                <h3 className="text-xl font-bold text-gray-900">{selectedReq.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setModalOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <StatusBadge status={selectedReq.status} size="md" showTooltip />
              <PriorityBadge priority={selectedReq.priority} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Informações básicas */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> Solicitante
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome</span>
                  <span className="font-medium">{selectedReq.requester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departamento</span>
                  <span className="font-medium">{selectedReq.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data</span>
                  <span className="font-medium">{selectedReq.date} às {selectedReq.time}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={14} /> Fluxo da Solicitação
              </h4>
              <div className="space-y-4">
                {selectedReq.timeline.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`
                          w-3 h-3 rounded-full flex-shrink-0 mt-1.5
                          ${step.done ? "bg-green-500" :
                            step.current ? "bg-blue-500 animate-pulse" :
                            "bg-gray-300"}
                        `}
                      />
                      {i < selectedReq.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-green-200" : "bg-gray-200"} rounded-full`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className={`font-medium text-sm ${step.current ? "text-blue-700" : step.done ? "text-green-700" : "text-gray-700"}`}>
                        {step.title}
                      </div>
                      {step.meta && <div className="text-xs text-gray-500 mt-0.5">{step.meta}</div>}
                      {step.date && <div className="text-xs text-gray-400 mt-0.5">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valor total */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign size={14} /> Resumo Financeiro
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de itens</span>
                  <span className="font-medium">{selectedReq.items.length} itens</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="font-semibold">Valor total</span>
                  <span className="text-xl font-bold text-blue-700">
                    {selectedReq.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Justificativa */}
            {selectedReq.justification && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Justificativa</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedReq.justification}</p>
              </div>
            )}

            {/* Fornecedores */}
            {selectedReq.suppliers.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Truck size={14} /> Fornecedores Sugeridos
                </h4>
                <div className="space-y-3">
                  {selectedReq.suppliers.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{s.contact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anexos */}
            {selectedReq.attachments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} /> Anexos ({selectedReq.attachments.length})
                </h4>
                <div className="space-y-2">
                  {selectedReq.attachments.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      <FileText size={16} className="text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs text-gray-500">{a.size}</div>
                      </div>
                      <button className="text-blue-600 hover:underline text-xs">Baixar</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivo de rejeição (se aplicável) */}
            {selectedReq.status === "rejected" && selectedReq.rejectedReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Motivo da Reprovação</h4>
                <p className="text-sm text-red-700">{selectedReq.rejectedReason}</p>
              </div>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            {selectedReq.status === "pending" && (
              <>
                <button
                  onClick={() => setActionModal({ type: "approve" })}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Aprovar
                </button>
                <button
                  onClick={() => setActionModal({ type: "reject" })}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Reprovar
                </button>
              </>
            )}
            {selectedReq.status === "approved" && (
              <button
                onClick={() => setActionModal({ type: "purchase" })}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Package size={16} /> Registrar Compra
              </button>
            )}
            {selectedReq.status === "purchased" && (
              <button
                onClick={() => setActionModal({ type: "receive" })}
                className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Registrar Recebimento
              </button>
            )}
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              Histórico
            </button>
          </div>
        </aside>
      </div>

      {/* Modais */}
      {modalOpen && (
        <NewRequestModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}
      {actionModal && (
        <ActionModal
          onClose={() => setActionModal(null)}
          title={actionModal.type === "approve" ? "Aprovar Solicitação" : 
                 actionModal.type === "reject" ? "Reprovar Solicitação" :
                 actionModal.type === "purchase" ? "Registrar Compra" :
                 "Registrar Recebimento"}
          action={actionModal.type === "approve" ? "aprovação" : 
                 actionModal.type === "reject" ? "reprovação" :
                 actionModal.type === "purchase" ? "compra" :
                 "recebimento"}
        />
      )}
    </AppShell>
  );
}