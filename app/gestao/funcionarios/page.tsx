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
  User,
  Briefcase,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Edit,
  MoreHorizontal,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Award,
  Gift,
  Star,
  MessageCircle,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Tipos ──
type EmployeeStatus = "active" | "vacation" | "inactive";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  admission: string;
  days: string;
  status: EmployeeStatus;
  statusText: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  salary?: number;
  documents?: { name: string; size: string; date: string }[];
  history?: { title: string; description: string; date: string; type: string }[];
}

// ── Configuração de Status ──
const STATUS_CONFIG: Record<EmployeeStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  active: {
    label: "Ativo",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Funcionário ativo na empresa",
  },
  vacation: {
    label: "Férias",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <Calendar className="w-3.5 h-3.5" />,
    description: "Funcionário em período de férias",
  },
  inactive: {
    label: "Inativo",
    bg: "bg-gray-100",
    text: "text-gray-800",
    dot: "bg-gray-500",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "Funcionário desligado da empresa",
  },
};

// ── Mock Data Expandido ──
const mockEmployees: Employee[] = [
  {
    id: 0,
    name: "Marcos Andrade",
    role: "Administrador",
    department: "Administração",
    avatar: "MA",
    admission: "15/03/2022",
    days: "12 dias",
    status: "active",
    statusText: "Ativo",
    email: "marcos.andrade@1000festas.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    birthDate: "15/03/1985",
    salary: 4500,
    documents: [
      { name: "Contrato de trabalho.pdf", size: "2.3 MB", date: "15/03/2022" },
      { name: "RG.pdf", size: "1.1 MB", date: "15/03/2022" },
      { name: "CPF.pdf", size: "0.8 MB", date: "15/03/2022" },
      { name: "Comprovante residência.pdf", size: "1.5 MB", date: "20/03/2022" },
    ],
    history: [
      { title: "Admissão", description: "Contratado como Administrador", date: "15/03/2022", type: "admission" },
      { title: "Promoção", description: "Promovido a Administrador Sênior", date: "10/01/2024", type: "promotion" },
      { title: "Férias", description: "30 dias", date: "02/01/2025 a 31/01/2025", type: "vacation" },
    ],
  },
  {
    id: 1,
    name: "Ana Souza",
    role: "Cozinheira Chefe",
    department: "Cozinha",
    avatar: "AS",
    admission: "10/01/2023",
    days: "8 dias",
    status: "active",
    statusText: "Ativo",
    email: "ana.souza@1000festas.com",
    phone: "(11) 98765-4322",
    cpf: "987.654.321-00",
    birthDate: "22/05/1988",
    salary: 3800,
  },
  {
    id: 2,
    name: "Carlos Lima",
    role: "Garçom",
    department: "Atendimento",
    avatar: "CL",
    admission: "05/06/2023",
    days: "Férias",
    status: "vacation",
    statusText: "Férias",
    email: "carlos.lima@1000festas.com",
    phone: "(11) 98765-4323",
    cpf: "456.789.123-00",
    birthDate: "10/12/1990",
    salary: 2200,
  },
  {
    id: 3,
    name: "Fernanda Melo",
    role: "Recepção",
    department: "Recepção",
    avatar: "FM",
    admission: "20/02/2024",
    days: "15 dias",
    status: "active",
    statusText: "Ativo",
    email: "fernanda.melo@1000festas.com",
    phone: "(11) 98765-4324",
    cpf: "789.123.456-00",
    birthDate: "05/08/1995",
    salary: 2500,
  },
  {
    id: 4,
    name: "João Pedro",
    role: "Montador",
    department: "Montagem",
    avatar: "JP",
    admission: "12/08/2023",
    days: "5 dias",
    status: "active",
    statusText: "Ativo",
    email: "joao.pedro@1000festas.com",
    phone: "(11) 98765-4325",
    cpf: "321.654.987-00",
    birthDate: "18/03/1992",
    salary: 2100,
  },
  {
    id: 5,
    name: "Lucia Santos",
    role: "Auxiliar Cozinha",
    department: "Cozinha",
    avatar: "LS",
    admission: "03/04/2024",
    days: "10 dias",
    status: "active",
    statusText: "Ativo",
    email: "lucia.santos@1000festas.com",
    phone: "(11) 98765-4326",
    cpf: "654.987.321-00",
    birthDate: "12/11/1993",
    salary: 1900,
  },
  {
    id: 6,
    name: "Roberto Freitas",
    role: "Motorista",
    department: "Logística",
    avatar: "RF",
    admission: "22/09/2023",
    days: "Férias",
    status: "vacation",
    statusText: "Férias",
    email: "roberto.freitas@1000festas.com",
    phone: "(11) 98765-4327",
    cpf: "147.258.369-00",
    birthDate: "30/07/1980",
    salary: 2800,
  },
];

// ── Departamentos com contagens ──
const departments = [
  { key: "todos", label: "Todos", count: mockEmployees.length, icon: "👥" },
  { key: "Cozinha", label: "Cozinha", count: mockEmployees.filter(e => e.department === "Cozinha").length, icon: "🍳" },
  { key: "Atendimento", label: "Atendimento", count: mockEmployees.filter(e => e.department === "Atendimento").length, icon: "🍽️" },
  { key: "Montagem", label: "Montagem", count: mockEmployees.filter(e => e.department === "Montagem").length, icon: "🪑" },
  { key: "Administração", label: "Administração", count: mockEmployees.filter(e => e.department === "Administração").length, icon: "📋" },
  { key: "Recepção", label: "Recepção", count: mockEmployees.filter(e => e.department === "Recepção").length, icon: "🚪" },
  { key: "Logística", label: "Logística", count: mockEmployees.filter(e => e.department === "Logística").length, icon: "🚚" },
];

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: EmployeeStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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

// ── Modal Novo Funcionário ──
function NewEmployeeModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "Cozinha",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    admission: "",
    salary: "",
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Novo Funcionário</h2>
              <p className="text-sm text-gray-600 mt-1">Preencha os dados do funcionário</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome completo" required>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </Field>
              <Field label="CPF" required>
                <Input
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  placeholder="123.456.789-00"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Data de nascimento">
                <Input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                />
              </Field>
              <Field label="Telefone">
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </Field>
            </div>

            <Field label="E-mail">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </Field>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Dados Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Cargo" required>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Ex: Cozinheiro"
                  />
                </Field>
                <Field label="Departamento">
                  <Select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  >
                    {departments.filter(d => d.key !== "todos").map(d => (
                      <option key={d.key}>{d.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Data de admissão">
                  <Input
                    type="date"
                    value={form.admission}
                    onChange={(e) => setForm({ ...form, admission: e.target.value })}
                  />
                </Field>
                <Field label="Salário (R$)">
                  <Input
                    type="number"
                    step="0.01"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder="0,00"
                    className="font-mono"
                  />
                </Field>
              </div>
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
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Salvar Funcionário
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Solicitar Férias ──
function VacationModal({ employee, onClose, onSubmit }: { employee: Employee; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Solicitar Férias</h2>
              <p className="text-sm text-gray-600 mt-1">{employee.name}</p>
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
            <Field label="Período aquisitivo">
              <Select>
                <option>2025/2026 · 30 dias disponíveis</option>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Data de início" required>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="Data de término" required>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Dias solicitados:</span>
                <span className="font-bold">15 dias</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saldo restante:</span>
                <span className="text-emerald-700 font-bold">15 dias</span>
              </div>
            </div>

            <Field label="Observações / justificativa">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Motivo da solicitação ou observações..."
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
            <Calendar size={16} /> Enviar Solicitação
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function FuncionariosPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [deptFilter, setDeptFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [modalVacationOpen, setModalVacationOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "history">("info");

  const selectedEmployee = mockEmployees.find(e => e.id === selectedId) || mockEmployees[0];

  // Filtrar funcionários
  const filteredEmployees = mockEmployees.filter(e => {
    if (deptFilter !== "todos" && e.department !== deptFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (searchTerm !== "" && !e.name.toLowerCase().includes(searchTerm.toLowerCase()) && !e.role.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Estatísticas
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(e => e.status === "active").length;
  const vacationEmployees = mockEmployees.filter(e => e.status === "vacation").length;
  const totalSalary = mockEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);

  const handleCreateEmployee = (data: any) => {
    console.log("Novo funcionário:", data);
  };

  const handleVacationRequest = (data: any) => {
    console.log("Solicitação de férias:", data);
  };

  return (
    <AppShell active="gestao-funcionarios">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/gestao" className="text-gray-500 hover:text-gray-700 font-medium">
            Gestão
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Funcionários</span>
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
            <span className="hidden sm:inline">Novo Funcionário</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Funcionários"
            value={totalEmployees.toString()}
            color="bg-blue-600"
            icon={<Users size={20} className="text-blue-600" />}
          />
          <StatCard
            title="Ativos"
            value={activeEmployees.toString()}
            change={{ value: 8, type: "up" }}
            color="bg-emerald-600"
            icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Em Férias"
            value={vacationEmployees.toString()}
            color="bg-amber-600"
            icon={<Calendar size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Folha Salarial"
            value={totalSalary.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            color="bg-purple-600"
            icon={<DollarSign size={20} className="text-purple-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome, cargo ou departamento..."
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Departamentos</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {departments.map((dept) => (
              <button
                key={dept.key}
                onClick={() => setDeptFilter(dept.key)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${deptFilter === dept.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span className="flex items-center gap-3">
                  <span>{dept.icon}</span>
                  <span>{dept.label}</span>
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {dept.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Status</h4>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key as any)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${statusFilter === key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span>{cfg.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {mockEmployees.filter(e => e.status === key).length}
                  </span>
                </button>
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

        {/* Lista de funcionários - estilo tabela */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Funcionários · {filteredEmployees.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredEmployees.length} de {mockEmployees.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Funcionário</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Cargo</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Departamento</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"}`}>Admissão</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredEmployees.map(emp => {
                const isExpanded = expandedItems === emp.id;
                
                return (
                  <div key={emp.id}>
                    <div
                      onClick={() => setSelectedId(emp.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                        ${emp.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                            {emp.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{emp.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{emp.role}</div>
                          </div>
                        </div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center text-sm text-gray-600`}>
                        {emp.role}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center text-sm text-gray-600`}>
                        {emp.department}
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <StatusBadge status={emp.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"} flex items-center justify-between`}>
                        <div>
                          <div className="text-sm text-gray-900">{emp.admission}</div>
                          <div className="text-xs text-gray-500">Férias: {emp.days}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItems(isExpanded ? null : emp.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Linha expandida com informações adicionais */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">E-mail:</span>
                            <span className="ml-2 text-gray-700">{emp.email || "Não informado"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Telefone:</span>
                            <span className="ml-2 text-gray-700">{emp.phone || "Não informado"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">CPF:</span>
                            <span className="ml-2 text-gray-700">{emp.cpf || "Não informado"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Data de Nascimento:</span>
                            <span className="ml-2 text-gray-700">{emp.birthDate || "Não informado"}</span>
                          </div>
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
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{selectedEmployee.role}</p>
                </div>
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
              <StatusBadge status={selectedEmployee.status} size="md" showTooltip />
              <span className="text-xs text-gray-500">Admissão: {selectedEmployee.admission}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {[
              { id: "info", label: "Informações", icon: <User size={14} /> },
              { id: "documents", label: "Documentos", icon: <FileText size={14} /> },
              { id: "history", label: "Histórico", icon: <Clock size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 -mb-px
                  ${activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tab: Informações */}
            {activeTab === "info" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Salário</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {selectedEmployee.salary?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00"}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Férias disponíveis</div>
                    <div className="text-2xl font-bold text-blue-700">{selectedEmployee.days}</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User size={14} /> Informações Pessoais
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">CPF</span>
                      <span className="font-medium">{selectedEmployee.cpf || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data de nascimento</span>
                      <span className="font-medium">{selectedEmployee.birthDate || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone</span>
                      <span className="font-medium">{selectedEmployee.phone || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">E-mail</span>
                      <span className="font-medium">{selectedEmployee.email || "Não informado"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Briefcase size={14} /> Informações Profissionais
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cargo</span>
                      <span className="font-medium">{selectedEmployee.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departamento</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data de admissão</span>
                      <span className="font-medium">{selectedEmployee.admission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo de empresa</span>
                      <span className="font-medium">4 anos</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tab: Documentos */}
            {activeTab === "documents" && (
              <>
                <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <Plus size={16} /> Adicionar Documento
                </button>
                <div className="space-y-3">
                  {(selectedEmployee.documents || [
                    { name: "Contrato de trabalho.pdf", size: "2.3 MB", date: "15/03/2022" },
                    { name: "RG.pdf", size: "1.1 MB", date: "15/03/2022" },
                    { name: "CPF.pdf", size: "0.8 MB", date: "15/03/2022" },
                  ]).map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <FileText size={20} className="text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size} • {doc.date}</div>
                      </div>
                      <button className="text-blue-600 hover:underline text-xs">Baixar</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tab: Histórico */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {(selectedEmployee.history || [
                  { title: "Admissão", description: "Contratado como Administrador", date: "15/03/2022", type: "admission" },
                  { title: "Promoção", description: "Promovido a Administrador Sênior", date: "10/01/2024", type: "promotion" },
                  { title: "Férias", description: "30 dias", date: "02/01/2025 a 31/01/2025", type: "vacation" },
                ]).map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                      event.type === "admission" ? "bg-emerald-100 text-emerald-600" :
                      event.type === "promotion" ? "bg-purple-100 text-purple-600" :
                      "bg-amber-100 text-amber-600"
                    }`}>
                      {event.type === "admission" ? "📋" : event.type === "promotion" ? "⭐" : "🌴"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{event.description}</div>
                    </div>
                    <div className="text-xs text-gray-400">{event.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            {selectedEmployee.status !== "vacation" && (
              <button
                onClick={() => setModalVacationOpen(true)}
                className="flex-1 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Calendar size={16} /> Solicitar Férias
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
        <NewEmployeeModal
          onClose={() => setModalNewOpen(false)}
          onSubmit={handleCreateEmployee}
        />
      )}
      {modalVacationOpen && (
        <VacationModal
          employee={selectedEmployee}
          onClose={() => setModalVacationOpen(false)}
          onSubmit={handleVacationRequest}
        />
      )}
    </AppShell>
  );
}

