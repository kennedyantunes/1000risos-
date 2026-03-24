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
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp,
  Tag,
  User,
  Building2,
  CreditCard,
  Receipt,
  Banknote,
  Maximize2,
  Minimize2,
  ChevronLeft,
  RotateCcw,
  Eye,
  Edit,
  MoreHorizontal,
  Printer,
  Share2,
  AlertTriangle,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

// ── Tipos ──
type PayableStatus = "pending" | "paid" | "overdue" | "recurring";

interface PayableItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface PayableHistory {
  date: string;
  time?: string;
  title: string;
  description: string;
  value?: number;
  icon: string;
}

interface PayableAttachment {
  name: string;
  size: string;
  date: string;
  type: string;
}

interface Payable {
  id: number;
  supplier: string;
  description: string;
  category: string;
  value: number;
  dueDate: string;
  status: PayableStatus;
  installment?: string;
  notes?: string;
  items: PayableItem[];
  history: PayableHistory[];
  attachments: PayableAttachment[];
  paymentMethod?: string;
  paymentDate?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierEmail?: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG: Record<PayableStatus, {
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
    description: "Aguardando pagamento",
  },
  paid: {
    label: "Pago",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Pagamento realizado",
  },
  overdue: {
    label: "Vencido",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "Atraso no pagamento",
  },
  recurring: {
    label: "Recorrente",
    bg: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    description: "Conta fixa mensal",
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
    notes: "Entrega realizada em 25/02. Pagamento em atraso, já foi enviado e-mail de cobrança no dia 03/03. Fornecedor informou que aceita parcelamento em até 3x sem juros a partir da próxima compra.",
    items: [
      { name: "Picanha (kg)", quantity: 3.5, unitPrice: 89.9 },
      { name: "Maminha (kg)", quantity: 5, unitPrice: 52.9 },
      { name: "Linguiça toscana (kg)", quantity: 3, unitPrice: 29.9 },
      { name: "Coxão mole (kg)", quantity: 4, unitPrice: 45.9 },
    ],
    history: [
      { date: "28/02/2026", time: "14:30", title: "Boleto gerado", description: "Boleto enviado por e-mail", value: 890, icon: "📄" },
      { date: "25/02/2026", time: "09:15", title: "Nota fiscal emitida", description: "NF 12345 emitida", icon: "🧾" },
      { date: "20/02/2026", time: "11:00", title: "Pedido criado", description: "Solicitação de compra #SC-0042", icon: "📝" },
    ],
    attachments: [
      { name: "NF_12345.pdf", size: "156 KB", date: "25/02/2026", type: "pdf" },
      { name: "Comprovante_Pix_890.pdf", size: "284 KB", date: "06/03/2026", type: "pdf" },
    ],
    supplierContact: "João Silva",
    supplierPhone: "(11) 98765-4321",
    supplierEmail: "comercial@casadasarnes.com.br",
    createdAt: "2026-02-20",
    updatedAt: "2026-02-28",
  },
  {
    id: 1,
    supplier: "Moinho Dourado",
    description: "Farinha, açúcar e derivados",
    category: "Fornecedor",
    value: 1240,
    dueDate: "10/03/2026",
    status: "pending",
    installment: "2/3 parcelas",
    notes: "Pedido #SC-0042 referente à compra de insumos para o evento Aniversário Sofia. Entrega prevista para 05/03.",
    items: [
      { name: "Farinha de trigo (kg)", quantity: 25, unitPrice: 3.5 },
      { name: "Açúcar refinado (kg)", quantity: 20, unitPrice: 2.8 },
      { name: "Fermento químico (kg)", quantity: 5, unitPrice: 4.2 },
      { name: "Sal refinado (kg)", quantity: 10, unitPrice: 1.8 },
    ],
    history: [
      { date: "05/03/2026", time: "14:00", title: "Entrega agendada", description: "Entrega prevista para 10/03", icon: "🚚" },
      { date: "01/03/2026", time: "10:30", title: "Pedido aprovado", description: "Aprovado pelo financeiro", icon: "✅" },
      { date: "28/02/2026", time: "09:00", title: "Pedido criado", description: "Solicitação de compra #SC-0042", icon: "📝" },
    ],
    attachments: [
      { name: "Pedido_SC-0042.pdf", size: "245 KB", date: "28/02/2026", type: "pdf" },
    ],
    supplierContact: "Carlos Mendes",
    supplierPhone: "(11) 3456-7890",
    supplierEmail: "vendas@moinhodourado.com.br",
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
  },
  {
    id: 2,
    supplier: "Enel",
    description: "Energia elétrica - março",
    category: "Conta fixa",
    value: 450,
    dueDate: "15/03/2026",
    status: "recurring",
    notes: "Consumo médio mensal: 420 kWh. Débito automático programado para o vencimento.",
    items: [
      { name: "Consumo de energia", quantity: 420, unitPrice: 1.07 },
      { name: "Taxa de iluminação", quantity: 1, unitPrice: 45.2 },
    ],
    history: [
      { date: "01/03/2026", time: "08:00", title: "Fatura emitida", description: "Fatura com vencimento em 15/03", value: 450, icon: "📄" },
      { date: "01/02/2026", time: "08:00", title: "Pagamento realizado", description: "Fatura anterior paga", value: 430, icon: "✅" },
    ],
    attachments: [
      { name: "Fatura_marco_2026.pdf", size: "420 KB", date: "01/03/2026", type: "pdf" },
    ],
    supplierContact: "Central de Atendimento",
    supplierPhone: "0800 123 4567",
    supplierEmail: "atendimento@enel.com.br",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
  },
  {
    id: 3,
    supplier: "João (freelancer)",
    description: "Serviço de garçom - Casamento Silva",
    category: "Freelancer",
    value: 380,
    dueDate: "12/03/2026",
    status: "pending",
    notes: "Serviço prestado no dia 07/03/2026 das 18h às 23h. Total de 8 horas trabalhadas com 4 garçons.",
    items: [
      { name: "Hora trabalhada", quantity: 8, unitPrice: 47.5 },
      { name: "Deslocamento", quantity: 1, unitPrice: 0 },
    ],
    history: [
      { date: "07/03/2026", time: "23:00", title: "Serviço concluído", description: "Evento Casamento Silva", icon: "🎉" },
      { date: "05/03/2026", time: "15:00", title: "Contratação", description: "Freelancer contratado para o evento", icon: "📝" },
    ],
    attachments: [],
    supplierContact: "João Santos",
    supplierPhone: "(11) 98765-1234",
    supplierEmail: "joao.freelancer@email.com",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-07",
  },
  {
    id: 4,
    supplier: "Sabesp",
    description: "Água - fevereiro",
    category: "Conta fixa",
    value: 320,
    dueDate: "05/03/2026",
    status: "paid",
    paymentDate: "04/03/2026",
    paymentMethod: "PIX",
    paymentReference: "PIX - 04/03/2026",
    notes: "Pagamento realizado com antecedência via PIX.",
    items: [
      { name: "Consumo de água", quantity: 25, unitPrice: 8.5 },
      { name: "Taxa de esgoto", quantity: 1, unitPrice: 85 },
    ],
    history: [
      { date: "04/03/2026", time: "10:30", title: "Pagamento realizado", description: "Pago via PIX", value: 320, icon: "💰" },
      { date: "01/03/2026", time: "08:00", title: "Fatura emitida", description: "Fatura com vencimento em 05/03", value: 320, icon: "📄" },
    ],
    attachments: [
      { name: "Comprovante_PIX.pdf", size: "156 KB", date: "04/03/2026", type: "pdf" },
      { name: "Fatura_fevereiro_2026.pdf", size: "380 KB", date: "01/03/2026", type: "pdf" },
    ],
    supplierContact: "Atendimento Sabesp",
    supplierPhone: "0800 123 4567",
    supplierEmail: "atendimento@sabesp.com.br",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-04",
  },
  {
    id: 5,
    supplier: "Granja Ouro",
    description: "Ovos e laticínios",
    category: "Fornecedor",
    value: 520,
    dueDate: "18/03/2026",
    status: "pending",
    notes: "Pedido #SC-0045 referente à compra para o evento Casamento Silva. Entrega prevista para 10/03.",
    items: [
      { name: "Ovos brancos (dúzia)", quantity: 30, unitPrice: 12 },
      { name: "Leite integral (L)", quantity: 20, unitPrice: 4.5 },
      { name: "Manteiga (kg)", quantity: 5, unitPrice: 24 },
      { name: "Queijo mussarela (kg)", quantity: 8, unitPrice: 28 },
    ],
    history: [
      { date: "08/03/2026", time: "14:00", title: "Pedido aprovado", description: "Aprovado pelo financeiro", icon: "✅" },
      { date: "05/03/2026", time: "11:00", title: "Pedido criado", description: "Solicitação de compra #SC-0045", icon: "📝" },
    ],
    attachments: [
      { name: "Pedido_SC-0045.pdf", size: "178 KB", date: "05/03/2026", type: "pdf" },
    ],
    supplierContact: "Maria Oliveira",
    supplierPhone: "(11) 98765-4321",
    supplierEmail: "vendas@granjaouro.com.br",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-08",
  },
];

// ── Categorias de Status ──
const statusCategories = [
  { status: "all", label: "Todas", count: mockPayables.length, color: "bg-gray-500", icon: "📋" },
  { status: "pending", label: "Pendentes", count: mockPayables.filter(p => p.status === "pending").length, color: "bg-amber-500", icon: "⏳" },
  { status: "overdue", label: "Vencidas", count: mockPayables.filter(p => p.status === "overdue").length, color: "bg-red-500", icon: "⚠️" },
  { status: "paid", label: "Pagas", count: mockPayables.filter(p => p.status === "paid").length, color: "bg-emerald-500", icon: "✅" },
  { status: "recurring", label: "Recorrentes", count: mockPayables.filter(p => p.status === "recurring").length, color: "bg-purple-500", icon: "🔄" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: PayableStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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

// ── Modal de Nova Conta ──
function NewPayableModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    supplier: "",
    category: "Fornecedor",
    description: "",
    value: "",
    dueDate: "",
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Conta a Pagar</h2>
              <p className="text-sm text-gray-600 mt-1">Preencha os dados da conta</p>
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
            <Field label="Fornecedor" required>
              <Input
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                placeholder="Ex: Casa das Carnes"
              />
            </Field>

            <Field label="Categoria">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Fornecedor</option>
                <option>Conta fixa</option>
                <option>Freelancer</option>
                <option>Compra vinculada</option>
                <option>Outro</option>
              </Select>
            </Field>

            <Field label="Descrição" required>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Compra de carnes - NF 12345"
              />
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Valor" required>
                <Input
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="0,00"
                  className="font-mono"
                />
              </Field>
              <Field label="Data de vencimento" required>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Informações adicionais..."
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
            <Plus size={16} /> Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Pagamento ──
function PaymentModal({ payable, onClose }: { payable: Payable; onClose: () => void }) {
  const [form, setForm] = useState({
    value: payable.value,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: "PIX",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pagamento registrado:", form);
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registrar Pagamento</h2>
              <p className="text-sm text-gray-600 mt-1">{payable.supplier}</p>
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
            <Field label="Valor a pagar" required>
              <Input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                className="font-mono text-lg font-bold"
              />
            </Field>

            <Field label="Data do pagamento" required>
              <Input
                type="date"
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
              />
            </Field>

            <Field label="Forma de pagamento">
              <Select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                <option>PIX</option>
                <option>Transferência bancária</option>
                <option>Boleto</option>
                <option>Cartão de crédito</option>
                <option>Dinheiro</option>
              </Select>
            </Field>

            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Informações adicionais sobre o pagamento..."
              />
            </Field>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong className="flex items-center gap-2">
                <AlertCircle size={16} /> Atenção
              </strong>
              <p className="mt-1">
                Ao confirmar o pagamento, esta conta será marcada como "Paga" e o histórico será atualizado.
              </p>
            </div>
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
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal com toggle para sidebars ──
export default function ContasAPagarPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<PayableStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [modalPayOpen, setModalPayOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  const selectedPayable = mockPayables.find((p) => p.id === selectedId) || mockPayables[0];

  // Filtrar contas
  const filteredPayables = mockPayables
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p =>
      searchTerm === "" ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Estatísticas
  const totalValue = mockPayables.reduce((sum, p) => sum + p.value, 0);
  const pendingValue = mockPayables.filter(p => p.status === "pending").reduce((sum, p) => sum + p.value, 0);
  const overdueValue = mockPayables.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.value, 0);
  const paidValue = mockPayables.filter(p => p.status === "paid").reduce((sum, p) => sum + p.value, 0);
  const recurringValue = mockPayables.filter(p => p.status === "recurring").reduce((sum, p) => sum + p.value, 0);

  const handleCreatePayable = (data: any) => {
    console.log("Nova conta:", data);
  };

  return (
    <AppShell active="financeiro-contas-a-pagar">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/financeiro" className="text-gray-500 hover:text-gray-700 font-medium">
            Financeiro
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Contas a Pagar</span>
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
            <span className="hidden sm:inline">Relatórios</span>
          </button>
          
          <button
            onClick={() => setModalNewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nova Conta</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total a Pagar"
            value={totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-gray-600"
            icon={<Wallet size={20} className="text-gray-600" />}
          />
          <StatCard
            title="Pendentes"
            value={pendingValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 12, type: "up" }}
            color="bg-amber-500"
            icon={<Clock size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Vencidas"
            value={overdueValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 8, type: "up" }}
            color="bg-red-500"
            icon={<AlertTriangle size={20} className="text-red-600" />}
          />
          <StatCard
            title="Pagas"
            value={paidValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 15, type: "down" }}
            color="bg-emerald-500"
            icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Recorrentes"
            value={recurringValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-purple-500"
            icon={<RotateCcw size={20} className="text-purple-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por fornecedor, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Informações</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total de contas</span>
                <span className="font-bold">{mockPayables.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor médio</span>
                <span className="font-bold">
                  {(totalValue / mockPayables.length).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
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

        {/* Lista de contas - estilo tabela */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Contas a Pagar · {filteredPayables.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredPayables.length} de {mockPayables.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Fornecedor</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Categoria</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Valor</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"}`}>Vencimento</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredPayables.map(pay => {
                const isExpanded = expandedItems === pay.id;
                const daysUntilDue = (() => {
                  const [day, month, year] = pay.dueDate.split('/');
                  const due = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  const today = new Date();
                  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return diff;
                })();

                return (
                  <div key={pay.id}>
                    <div
                      onClick={() => setSelectedId(pay.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                        ${pay.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="font-medium text-gray-900 truncate">{pay.supplier}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{pay.description.substring(0, 40)}</div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center text-sm text-gray-600`}>
                        {pay.category}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <StatusBadge status={pay.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <span className="font-bold text-gray-900">
                          {pay.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"} flex items-center justify-between`}>
                        <div>
                          <div className="text-sm text-gray-900">{pay.dueDate}</div>
                          {pay.status === "pending" && daysUntilDue <= 3 && (
                            <div className="text-xs text-orange-600 font-medium">
                              {daysUntilDue <= 0 ? "Vence hoje" : `Vence em ${daysUntilDue} dias`}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItems(isExpanded ? null : pay.id);
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
                          Itens da compra ({pay.items.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {pay.items.map((item, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="flex justify-between mt-2 text-xs">
                                <span className="text-gray-600">Quantidade:</span>
                                <span className="font-medium">{item.quantity} {item.name.includes("kg") ? "kg" : "un"}</span>
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
                                  {(item.unitPrice * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {pay.installment && (
                          <div className="mt-4 text-xs text-gray-500">
                            <span className="font-medium">Parcela:</span> {pay.installment}
                          </div>
                        )}
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
                <h3 className="text-xl font-bold text-gray-900">{selectedPayable.supplier}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{selectedPayable.category}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setModalNewOpen(true)}
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
              <StatusBadge status={selectedPayable.status} size="md" showTooltip />
              {selectedPayable.installment && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {selectedPayable.installment}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cards financeiros */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Valor Total</div>
                <div className="text-2xl font-bold text-emerald-700">
                  {selectedPayable.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Vencimento</div>
                <div className="text-xl font-bold text-blue-700">{selectedPayable.dueDate}</div>
                {selectedPayable.status === "overdue" && (
                  <div className="text-xs text-red-600 mt-1">Atraso detectado</div>
                )}
              </div>
            </div>

            {/* Informações do fornecedor */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 size={14} /> Fornecedor
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome</span>
                  <span className="font-medium">{selectedPayable.supplier}</span>
                </div>
                {selectedPayable.supplierContact && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contato</span>
                    <span className="font-medium">{selectedPayable.supplierContact}</span>
                  </div>
                )}
                {selectedPayable.supplierPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone</span>
                    <span className="font-medium">{selectedPayable.supplierPhone}</span>
                  </div>
                )}
                {selectedPayable.supplierEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-mail</span>
                    <span className="font-medium text-sm">{selectedPayable.supplierEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações de pagamento (se pago) */}
            {selectedPayable.status === "paid" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} /> Pagamento
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data</span>
                    <span className="font-medium">{selectedPayable.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método</span>
                    <span className="font-medium">{selectedPayable.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referência</span>
                    <span className="font-medium text-xs">{selectedPayable.paymentReference}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Histórico */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>Histórico</span>
                <button className="text-blue-600 text-xs hover:underline">Ver tudo</button>
              </h4>
              <div className="space-y-3">
                {selectedPayable.history.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anexos */}
            {selectedPayable.attachments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} /> Anexos ({selectedPayable.attachments.length})
                </h4>
                <div className="space-y-2">
                  {selectedPayable.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      <FileText size={16} className="text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{att.name}</div>
                        <div className="text-xs text-gray-500">{att.size} • {att.date}</div>
                      </div>
                      <button className="text-blue-600 hover:underline text-xs">Baixar</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            {selectedPayable.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Observações</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedPayable.notes}</p>
              </div>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            {selectedPayable.status !== "paid" && (
              <button
                onClick={() => setModalPayOpen(true)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Registrar Pagamento
              </button>
            )}
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              Histórico
            </button>
          </div>
        </aside>
      </div>

      {/* Modais */}
      {modalNewOpen && (
        <NewPayableModal
          onClose={() => setModalNewOpen(false)}
          onSubmit={handleCreatePayable}
        />
      )}
      {modalPayOpen && (
        <PaymentModal
          payable={selectedPayable}
          onClose={() => setModalPayOpen(false)}
        />
      )}
    </AppShell>
  );
}