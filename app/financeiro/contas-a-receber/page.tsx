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
  Users,
  CalendarDays,
  Package,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

// ── Tipos ──
type ReceivableStatus = "pending" | "paid" | "overdue" | "partial";

interface Installment {
  number: number;
  dueDate: string;
  value: number;
  status: ReceivableStatus;
  paidDate?: string;
  paymentMethod?: string;
}

interface PaymentHistory {
  date: string;
  method: string;
  value: number;
  reference?: string;
  notes?: string;
}

interface Receivable {
  id: number;
  client: string;
  event: string;
  eventDate: string;
  value: number;
  dueDate: string;
  status: ReceivableStatus;
  installment: string;
  delay: string;
  clientPhone?: string;
  clientEmail?: string;
  clientDocument?: string;
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
  installments: Installment[];
  paymentHistory: PaymentHistory[];
  attachments: { name: string; size: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG: Record<ReceivableStatus, {
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
  partial: {
    label: "Parcial",
    bg: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    description: "Pagamento parcial realizado",
  },
};

// ── Mock Data ──
const mockReceivables: Receivable[] = [
  {
    id: 0,
    client: "Carlos Eduardo",
    event: "Casamento · 120 convidados",
    eventDate: "15/03/2026",
    value: 1500,
    dueDate: "28/02/2026",
    status: "overdue",
    installment: "2ª parcela · Saldo restante",
    delay: "6 dias",
    clientPhone: "(11) 98765-4321",
    clientEmail: "carlos.eduardo@email.com",
    clientDocument: "123.456.789-00",
    notes: "Cliente solicitou adiamento da 3ª parcela para após o evento devido a imprevistos financeiros. Confirmado por e-mail em 01/03/2026. Pagamento parcial já recebido via PIX.",
    installments: [
      { number: 1, dueDate: "10/01/2026", value: 1500, status: "paid", paidDate: "10/01/2026", paymentMethod: "PIX" },
      { number: 2, dueDate: "10/02/2026", value: 1500, status: "paid", paidDate: "10/02/2026", paymentMethod: "Cartão" },
      { number: 3, dueDate: "28/02/2026", value: 1500, status: "overdue", paidDate: undefined, paymentMethod: undefined },
    ],
    paymentHistory: [
      { date: "10/02/2026", method: "PIX", value: 1500, reference: "PIX - 10/02", notes: "Pagamento da 2ª parcela" },
      { date: "10/01/2026", method: "Cartão", value: 1500, reference: "Cartão - 10/01", notes: "Pagamento da 1ª parcela" },
      { date: "05/12/2025", method: "Dinheiro", value: 1500, reference: "Sinal", notes: "Sinal para reserva" },
    ],
    attachments: [
      { name: "Contrato_Casamento.pdf", size: "245 KB", date: "05/12/2025" },
      { name: "Comprovante_PIX_1500.pdf", size: "156 KB", date: "10/02/2026" },
    ],
    createdAt: "2025-12-05",
    updatedAt: "2026-02-10",
  },
  {
    id: 1,
    client: "Ana Beatriz",
    event: "Aniversário 15 anos · 80 convidados",
    eventDate: "10/03/2026",
    value: 2250,
    dueDate: "10/03/2026",
    status: "pending",
    installment: "Saldo final",
    delay: "Em dia",
    clientPhone: "(11) 98765-4322",
    clientEmail: "ana.beatriz@email.com",
    clientDocument: "123.456.789-01",
    notes: "Evento agendado para o dia 10/03. Saldo final deve ser pago até a data do evento.",
    installments: [
      { number: 1, dueDate: "10/01/2026", value: 2250, status: "paid", paidDate: "10/01/2026", paymentMethod: "PIX" },
      { number: 2, dueDate: "10/03/2026", value: 2250, status: "pending" },
    ],
    paymentHistory: [
      { date: "10/01/2026", method: "PIX", value: 2250, reference: "Sinal 50%", notes: "Sinal para reserva" },
    ],
    attachments: [
      { name: "Contrato_Aniversario.pdf", size: "189 KB", date: "05/01/2026" },
    ],
    createdAt: "2026-01-05",
    updatedAt: "2026-01-10",
  },
  {
    id: 2,
    client: "Fernanda Lima",
    event: "Formatura · 150 convidados",
    eventDate: "20/03/2026",
    value: 3800,
    dueDate: "15/03/2026",
    status: "pending",
    installment: "Única",
    delay: "Em dia",
    clientPhone: "(11) 98765-4323",
    clientEmail: "fernanda.lima@email.com",
    clientDocument: "123.456.789-02",
    notes: "Evento de formatura. Pagamento único a ser realizado até 15/03.",
    installments: [
      { number: 1, dueDate: "15/03/2026", value: 3800, status: "pending" },
    ],
    paymentHistory: [],
    attachments: [],
    createdAt: "2026-02-15",
    updatedAt: "2026-02-15",
  },
  {
    id: 3,
    client: "Roberto Alves",
    event: "Corporativo · 50 convidados",
    eventDate: "10/03/2026",
    value: 850,
    dueDate: "05/03/2026",
    status: "partial",
    installment: "2/3 · Pago: R$ 1.700,00",
    delay: "Aguardando 2ª parcela",
    clientPhone: "(11) 98765-4324",
    clientEmail: "roberto.alves@empresa.com.br",
    clientDocument: "12.345.678/0001-90",
    notes: "Evento corporativo. Pagamento parcial realizado. Aguardando 2ª parcela.",
    installments: [
      { number: 1, dueDate: "05/02/2026", value: 850, status: "paid", paidDate: "05/02/2026", paymentMethod: "Transferência" },
      { number: 2, dueDate: "05/03/2026", value: 850, status: "pending" },
      { number: 3, dueDate: "05/04/2026", value: 850, status: "pending" },
    ],
    paymentHistory: [
      { date: "05/02/2026", method: "Transferência", value: 850, reference: "Transferência - 05/02", notes: "1ª parcela" },
    ],
    attachments: [],
    createdAt: "2026-01-15",
    updatedAt: "2026-02-05",
  },
  {
    id: 4,
    client: "Patrícia Santos",
    event: "Aniversário infantil · 60 convidados",
    eventDate: "05/03/2026",
    value: 3400,
    dueDate: "01/03/2026",
    status: "paid",
    installment: "À vista",
    delay: "Confirmado",
    clientPhone: "(11) 98765-4325",
    clientEmail: "patricia.santos@email.com",
    clientDocument: "123.456.789-03",
    notes: "Pagamento realizado à vista com desconto de 5%.",
    installments: [
      { number: 1, dueDate: "01/03/2026", value: 3400, status: "paid", paidDate: "28/02/2026", paymentMethod: "PIX" },
    ],
    paymentHistory: [
      { date: "28/02/2026", method: "PIX", value: 3400, reference: "PIX - 28/02", notes: "Pagamento à vista com desconto" },
    ],
    attachments: [
      { name: "Comprovante_PIX_3400.pdf", size: "178 KB", date: "28/02/2026" },
    ],
    createdAt: "2026-01-20",
    updatedAt: "2026-02-28",
  },
  {
    id: 5,
    client: "Marcos Oliveira",
    event: "Casamento · 200 convidados",
    eventDate: "10/03/2026",
    value: 2800,
    dueDate: "25/02/2026",
    status: "overdue",
    installment: "3ª parcela",
    delay: "9 dias",
    clientPhone: "(11) 98765-4326",
    clientEmail: "marcos.oliveira@email.com",
    clientDocument: "123.456.789-04",
    notes: "Atraso na 3ª parcela. Enviado e-mail de cobrança em 01/03.",
    installments: [
      { number: 1, dueDate: "25/12/2025", value: 2800, status: "paid", paidDate: "25/12/2025", paymentMethod: "PIX" },
      { number: 2, dueDate: "25/01/2026", value: 2800, status: "paid", paidDate: "25/01/2026", paymentMethod: "Cartão" },
      { number: 3, dueDate: "25/02/2026", value: 2800, status: "overdue" },
    ],
    paymentHistory: [
      { date: "25/01/2026", method: "Cartão", value: 2800, reference: "Cartão - 25/01", notes: "2ª parcela" },
      { date: "25/12/2025", method: "PIX", value: 2800, reference: "PIX - 25/12", notes: "1ª parcela" },
    ],
    attachments: [],
    createdAt: "2025-12-01",
    updatedAt: "2026-01-25",
  },
];

// ── Categorias de Status ──
const statusCategories = [
  { status: "all", label: "Todas", count: mockReceivables.length, color: "bg-gray-500", icon: "📋" },
  { status: "pending", label: "Pendentes", count: mockReceivables.filter(r => r.status === "pending").length, color: "bg-amber-500", icon: "⏳" },
  { status: "overdue", label: "Vencidas", count: mockReceivables.filter(r => r.status === "overdue").length, color: "bg-red-500", icon: "⚠️" },
  { status: "paid", label: "Pagas", count: mockReceivables.filter(r => r.status === "paid").length, color: "bg-emerald-500", icon: "✅" },
  { status: "partial", label: "Parciais", count: mockReceivables.filter(r => r.status === "partial").length, color: "bg-purple-500", icon: "🔄" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: ReceivableStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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
      {required && <span className="text-emerald-600 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`
      w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium
      focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all
      ${props.className || ""}
    `}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`
      w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium
      focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all
      appearance-none
      ${props.className || ""}
    `}
  >
    {props.children}
  </select>
);

// ── Modal de Recebimento ──
function ReceiveModal({ receivable, onClose }: { receivable: Receivable; onClose: () => void }) {
  const [form, setForm] = useState({
    value: receivable.installments.find(i => i.status === "pending")?.value || receivable.value,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: "PIX",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recebimento registrado:", form);
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registrar Recebimento</h2>
              <p className="text-sm text-gray-600 mt-1">{receivable.client} · {receivable.event}</p>
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
            <Field label="Parcela">
              <Select>
                {receivable.installments.map((inst, i) => (
                  <option key={i} value={inst.value}>
                    {inst.number}ª parcela · R$ {inst.value.toLocaleString()} · 
                    {inst.status === "paid" ? " Pago" : " Pendente"}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Valor recebido" required>
              <Input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                className="font-mono text-lg font-bold"
              />
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Data do recebimento" required>
                <Input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                />
              </Field>
              <Field label="Forma de recebimento">
                <Select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option>PIX</option>
                  <option>Transferência</option>
                  <option>Dinheiro</option>
                  <option>Cartão</option>
                </Select>
              </Field>
            </div>

            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                placeholder="Informações adicionais sobre o recebimento..."
              />
            </Field>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong className="flex items-center gap-2">
                <AlertCircle size={16} /> Atenção
              </strong>
              <p className="mt-1">
                Ao confirmar o recebimento, esta parcela será marcada como "Paga" e o histórico será atualizado.
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
            <CheckCircle2 size={16} /> Confirmar Recebimento
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Nova Conta ──
function NewReceivableModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    client: "",
    event: "",
    eventDate: "",
    value: "",
    dueDate: "",
    installmentType: "single",
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Conta a Receber</h2>
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
            <Field label="Cliente" required>
              <Input
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="Ex: Carlos Eduardo"
              />
            </Field>

            <Field label="Evento" required>
              <Input
                value={form.event}
                onChange={(e) => setForm({ ...form, event: e.target.value })}
                placeholder="Ex: Casamento · 120 convidados"
              />
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Data do evento" required>
                <Input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
              </Field>
              <Field label="Tipo de cobrança">
                <Select
                  value={form.installmentType}
                  onChange={(e) => setForm({ ...form, installmentType: e.target.value })}
                >
                  <option value="single">Parcela única</option>
                  <option value="entrance">Entrada (sinal 50%)</option>
                  <option value="installment">Parcelado</option>
                </Select>
              </Field>
            </div>

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
              <Field label="Vencimento" required>
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
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
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
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal com toggle para sidebars ──
export default function ContasAReceberPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<ReceivableStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalReceiveOpen, setModalReceiveOpen] = useState(false);
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  const selectedReceivable = mockReceivables.find(r => r.id === selectedId) || mockReceivables[0];

  // Filtrar contas
  const filteredReceivables = mockReceivables
    .filter(r => statusFilter === "all" || r.status === statusFilter)
    .filter(r =>
      searchTerm === "" ||
      r.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.event.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Estatísticas
  const totalValue = mockReceivables.reduce((sum, r) => sum + r.value, 0);
  const pendingValue = mockReceivables.filter(r => r.status === "pending").reduce((sum, r) => sum + r.value, 0);
  const overdueValue = mockReceivables.filter(r => r.status === "overdue").reduce((sum, r) => sum + r.value, 0);
  const paidValue = mockReceivables.filter(r => r.status === "paid").reduce((sum, r) => sum + r.value, 0);
  const partialValue = mockReceivables.filter(r => r.status === "partial").reduce((sum, r) => sum + r.value, 0);

  const handleCreateReceivable = (data: any) => {
    console.log("Nova conta:", data);
  };

  return (
    <AppShell active="financeiro-contas-a-receber">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/financeiro" className="text-gray-500 hover:text-gray-700 font-medium">
            Financeiro
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Contas a Receber</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:bg-gray-100"}`}
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
              className={`p-2 rounded-md transition-all ${!showSidebar && !showDetailsPanel ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:bg-gray-100"}`}
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
            onClick={() => setModalReceiveOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Registrar Recebimento</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total a Receber"
            value={totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-gray-600"
            icon={<Wallet size={20} className="text-gray-600" />}
          />
          <StatCard
            title="Pendentes"
            value={pendingValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 8, type: "up" }}
            color="bg-amber-500"
            icon={<Clock size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Vencidas"
            value={overdueValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 5, type: "up" }}
            color="bg-red-500"
            icon={<AlertTriangle size={20} className="text-red-600" />}
          />
          <StatCard
            title="Recebidas"
            value={paidValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            change={{ value: 12, type: "down" }}
            color="bg-emerald-500"
            icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Parciais"
            value={partialValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
            placeholder="Buscar por cliente ou evento..."
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
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
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
                <span className="font-bold">{mockReceivables.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor médio</span>
                <span className="font-bold">
                  {(totalValue / mockReceivables.length).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
              Contas a Receber · {filteredReceivables.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredReceivables.length} de {mockReceivables.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Cliente</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-3"}`}>Evento</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Valor</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"}`}>Vencimento</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredReceivables.map(rec => {
                const isExpanded = expandedItems === rec.id;
                const daysUntilDue = (() => {
                  const [day, month, year] = rec.dueDate.split('/');
                  const due = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  const today = new Date();
                  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return diff;
                })();

                return (
                  <div key={rec.id}>
                    <div
                      onClick={() => setSelectedId(rec.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-emerald-50/40
                        ${rec.id === selectedId ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="font-medium text-gray-900 truncate">{rec.client}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{rec.installment}</div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-3"} flex items-center text-sm text-gray-600 truncate`}>
                        {rec.event}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <StatusBadge status={rec.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <span className="font-bold text-gray-900">
                          {rec.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-1"} flex items-center justify-between`}>
                        <div>
                          <div className="text-sm text-gray-900">{rec.dueDate}</div>
                          {rec.status === "pending" && daysUntilDue <= 3 && (
                            <div className="text-xs text-orange-600 font-medium">
                              {daysUntilDue <= 0 ? "Vence hoje" : `Vence em ${daysUntilDue} dias`}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItems(isExpanded ? null : rec.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Linha expandida com parcelas */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Parcelas ({rec.installments.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {rec.installments.map((inst, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div className="font-medium text-gray-900">{inst.number}ª parcela</div>
                                <StatusBadge status={inst.status} size="sm" />
                              </div>
                              <div className="flex justify-between mt-2 text-xs">
                                <span className="text-gray-600">Vencimento:</span>
                                <span className="font-medium">{inst.dueDate}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Valor:</span>
                                <span className="font-bold text-emerald-700">
                                  {inst.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                              </div>
                              {inst.paidDate && (
                                <div className="flex justify-between text-xs mt-1 pt-1 border-t border-gray-100">
                                  <span className="text-gray-600">Pago em:</span>
                                  <span className="font-medium">{inst.paidDate}</span>
                                </div>
                              )}
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
                <h3 className="text-xl font-bold text-gray-900">{selectedReceivable.client}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{selectedReceivable.event}</p>
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
              <StatusBadge status={selectedReceivable.status} size="md" showTooltip />
              <span className="text-xs text-gray-500">Evento: {selectedReceivable.eventDate}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cards financeiros */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Valor Total</div>
                <div className="text-2xl font-bold text-emerald-700">
                  {selectedReceivable.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Vencimento</div>
                <div className="text-xl font-bold text-blue-700">{selectedReceivable.dueDate}</div>
                {selectedReceivable.status === "overdue" && (
                  <div className="text-xs text-red-600 mt-1">{selectedReceivable.delay}</div>
                )}
              </div>
            </div>

            {/* Informações do cliente */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> Cliente
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome</span>
                  <span className="font-medium">{selectedReceivable.client}</span>
                </div>
                {selectedReceivable.clientPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone</span>
                    <span className="font-medium">{selectedReceivable.clientPhone}</span>
                  </div>
                )}
                {selectedReceivable.clientEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-mail</span>
                    <span className="font-medium text-sm">{selectedReceivable.clientEmail}</span>
                  </div>
                )}
                {selectedReceivable.clientDocument && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPF/CNPJ</span>
                    <span className="font-medium text-sm">{selectedReceivable.clientDocument}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Parcelas */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>Parcelas ({selectedReceivable.installments.length})</span>
                <button className="text-emerald-600 text-xs hover:underline">Ver todas</button>
              </h4>
              <div className="space-y-3">
                {selectedReceivable.installments.map((inst, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{inst.number}ª parcela</div>
                      <div className="text-xs text-gray-500 mt-0.5">{inst.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {inst.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <StatusBadge status={inst.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-sm font-bold">
                <span>Total recebido</span>
                <span className="text-emerald-700">
                  {selectedReceivable.paymentHistory.reduce((sum, p) => sum + p.value, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>

            {/* Histórico de pagamentos */}
            {selectedReceivable.paymentHistory.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>Histórico de Pagamentos</span>
                  <button className="text-emerald-600 text-xs hover:underline">Ver tudo</button>
                </h4>
                <div className="space-y-3">
                  {selectedReceivable.paymentHistory.slice(0, 3).map((pay, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">
                        {pay.method === "PIX" ? "💳" : pay.method === "Cartão" ? "💳" : "💰"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{pay.method}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{pay.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-700">
                          {pay.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anexos */}
            {selectedReceivable.attachments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} /> Anexos ({selectedReceivable.attachments.length})
                </h4>
                <div className="space-y-2">
                  {selectedReceivable.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      <FileText size={16} className="text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{att.name}</div>
                        <div className="text-xs text-gray-500">{att.size} • {att.date}</div>
                      </div>
                      <button className="text-emerald-600 hover:underline text-xs">Baixar</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            {selectedReceivable.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Observações</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedReceivable.notes}</p>
              </div>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            {selectedReceivable.status !== "paid" && (
              <button
                onClick={() => setModalReceiveOpen(true)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
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
      {modalReceiveOpen && (
        <ReceiveModal
          receivable={selectedReceivable}
          onClose={() => setModalReceiveOpen(false)}
        />
      )}
      {modalNewOpen && (
        <NewReceivableModal
          onClose={() => setModalNewOpen(false)}
          onSubmit={handleCreateReceivable}
        />
      )}
    </AppShell>
  );
}