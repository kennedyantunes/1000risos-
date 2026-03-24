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
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  Users,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Award,
  Gift,
  Star,
  MessageCircle,
} from "lucide-react";

// ── Tipos ──
type VacationStatus = "ongoing" | "scheduled" | "expiring";

interface Vacation {
  id: number;
  employee: string;
  role: string;
  department: string;
  avatar: string;
  startDate: string;
  endDate: string;
  days: number;
  status: VacationStatus;
  statusText: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG: Record<VacationStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  ongoing: {
    label: "Em andamento",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Férias em curso",
  },
  scheduled: {
    label: "Programado",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    icon: <CalendarIcon className="w-3.5 h-3.5" />,
    description: "Férias agendadas",
  },
  expiring: {
    label: "Vence em breve",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    description: "Férias prestes a vencer",
  },
};

// ── Mock Data ──
const mockVacations: Vacation[] = [
  {
    id: 0,
    employee: "Ana Souza",
    role: "Atendimento",
    department: "Atendimento",
    avatar: "AS",
    startDate: "01/03/2026",
    endDate: "15/03/2026",
    days: 15,
    status: "ongoing",
    statusText: "Em andamento",
  },
  {
    id: 1,
    employee: "Carlos Lima",
    role: "Cozinha",
    department: "Cozinha",
    avatar: "CL",
    startDate: "06/03/2026",
    endDate: "20/03/2026",
    days: 15,
    status: "ongoing",
    statusText: "Inicia hoje",
  },
  {
    id: 2,
    employee: "Roberto Freitas",
    role: "Montagem",
    department: "Montagem",
    avatar: "RF",
    startDate: "10/03/2026",
    endDate: "24/03/2026",
    days: 15,
    status: "expiring",
    statusText: "Vence em breve",
  },
  {
    id: 3,
    employee: "Marcos Andrade",
    role: "Administração",
    department: "Administração",
    avatar: "MA",
    startDate: "15/03/2026",
    endDate: "29/03/2026",
    days: 15,
    status: "scheduled",
    statusText: "Programado",
  },
];

// ── Departamentos ──
const departments = [
  { key: "todos", label: "Todos", count: mockVacations.length, icon: "👥" },
  { key: "Cozinha", label: "Cozinha", count: mockVacations.filter(v => v.department === "Cozinha").length, icon: "🍳" },
  { key: "Atendimento", label: "Atendimento", count: mockVacations.filter(v => v.department === "Atendimento").length, icon: "🍽️" },
  { key: "Montagem", label: "Montagem", count: mockVacations.filter(v => v.department === "Montagem").length, icon: "🪑" },
  { key: "Administração", label: "Administração", count: mockVacations.filter(v => v.department === "Administração").length, icon: "📋" },
];

// Dias da semana
const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// Geração simplificada do calendário (Março 2026 - 31 dias)
const generateCalendarDays = () => {
  const days = [];
  // Março de 2026 começa no domingo (ajuste conforme necessário)
  const firstDayOfMonth = 0; // 0 = domingo
  const daysInMonth = 31;
  
  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDayOfMonth + 1;
    const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
    const dateStr = isCurrentMonth ? `${dayNum.toString().padStart(2, "0")}/03` : null;

    const vacationsOnDay = mockVacations.filter(v => {
      if (!dateStr) return false;
      const [d] = dateStr.split("/");
      const dayNumStr = parseInt(d, 10);
      const startDay = parseInt(v.startDate.split("/")[0], 10);
      const endDay = parseInt(v.endDate.split("/")[0], 10);
      return dayNumStr >= startDay && dayNumStr <= endDay;
    });

    days.push({
      day: dayNum,
      date: dateStr,
      isCurrentMonth,
      isToday: dateStr === "06/03",
      vacations: vacationsOnDay,
    });
  }
  return days;
};

// ── Componente StatusBadge ──
function StatusBadge({ status, size = "sm", showTooltip = false }: { status: VacationStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
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

// ── Modal Programar Férias ──
function ScheduleVacationModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    employee: "",
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Programar Férias</h2>
              <p className="text-sm text-gray-600 mt-1">Agende o período de férias do funcionário</p>
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
            <Field label="Funcionário" required>
              <Select
                value={form.employee}
                onChange={(e) => setForm({ ...form, employee: e.target.value })}
              >
                <option value="">Selecione um funcionário</option>
                <option>Ana Souza · Atendimento (15 dias disponíveis)</option>
                <option>Carlos Lima · Cozinha (30 dias disponíveis)</option>
                <option>Roberto Freitas · Montagem (30 dias disponíveis)</option>
                <option>Marcos Andrade · Administração (20 dias disponíveis)</option>
              </Select>
            </Field>

            <Field label="Período aquisitivo">
              <Select>
                <option>2025/2026 · 30 dias disponíveis</option>
                <option>2024/2025 · 15 dias disponíveis</option>
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

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-amber-800 text-sm">Conflito detectado</div>
                <div className="text-xs text-amber-700 mt-1">
                  2 funcionários do mesmo departamento já estarão de férias neste período.
                </div>
              </div>
            </div>

            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Observações adicionais..."
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
            <CalendarIcon size={16} /> Programar Férias
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function CalendarioFeriasPage() {
  const [selectedDept, setSelectedDept] = useState("todos");
  const [selectedDate, setSelectedDate] = useState("06/03");
  const [modalScheduleOpen, setModalScheduleOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Março 2026
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  const calendarDays = generateCalendarDays();

  // Filtra férias pelo departamento selecionado
  const filteredVacations = mockVacations.filter(
    v => selectedDept === "todos" || v.department === selectedDept
  );

  // Férias do dia selecionado
  const vacationsToday = filteredVacations.filter(v => {
    const [startDay] = v.startDate.split("/");
    const [endDay] = v.endDate.split("/");
    const selectedDayNum = parseInt(selectedDate.split("/")[0], 10);
    return selectedDayNum >= parseInt(startDay, 10) && selectedDayNum <= parseInt(endDay, 10);
  });

  // Estatísticas
  const totalVacations = mockVacations.length;
  const ongoingVacations = mockVacations.filter(v => v.status === "ongoing").length;
  const scheduledVacations = mockVacations.filter(v => v.status === "scheduled").length;
  const expiringVacations = mockVacations.filter(v => v.status === "expiring").length;
  const employeesOnVacationToday = vacationsToday.length;

  const handleScheduleVacation = (data: any) => {
    console.log("Férias programadas:", data);
  };

  return (
    <AppShell active="gestao-funcionarios-ferias-calendario">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/gestao" className="text-gray-500 hover:text-gray-700 font-medium">
            Gestão
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/gestao/funcionarios" className="text-gray-500 hover:text-gray-700 font-medium">
            Funcionários
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Calendário de Férias</span>
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
            <span className="hidden sm:inline">Relatório</span>
          </button>
          
          <button
            onClick={() => setModalScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Programar Férias</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Férias"
            value={totalVacations.toString()}
            color="bg-blue-600"
            icon={<CalendarIcon size={20} className="text-blue-600" />}
          />
          <StatCard
            title="Em andamento"
            value={ongoingVacations.toString()}
            change={{ value: 12, type: "up" }}
            color="bg-emerald-600"
            icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Programadas"
            value={scheduledVacations.toString()}
            color="bg-amber-600"
            icon={<Clock size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Vencem em breve"
            value={expiringVacations.toString()}
            change={{ value: 8, type: "up" }}
            color="bg-red-600"
            icon={<AlertCircle size={20} className="text-red-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar funcionário..."
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
                onClick={() => setSelectedDept(dept.key)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${selectedDept === dept.key
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Legenda</h4>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <span className="text-gray-700">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resumo</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Em férias hoje:</span>
                <span className="font-medium text-emerald-700">{employeesOnVacationToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Próximos 30 dias:</span>
                <span className="font-medium text-amber-600">3 funcionários</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vencidas:</span>
                <span className="font-medium text-red-600">1 funcionário</span>
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

        {/* Calendário */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-gray-50 transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Calendário de Férias</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  <CalendarIcon size={20} />
                </button>
                <span className="text-lg font-semibold">Março 2026</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  ←
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 bg-white border-b border-gray-200">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 overflow-y-auto">
            {calendarDays.map((d, idx) => {
              const isToday = d.isToday;
              const hasVacations = d.vacations.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => d.date && setSelectedDate(d.date)}
                  className={`
                    min-h-[120px] p-3 bg-white hover:bg-blue-50/40 transition cursor-pointer
                    ${!d.isCurrentMonth ? "opacity-40 bg-gray-50" : ""}
                    ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}
                    ${hasVacations ? "border-l-4 border-blue-500" : ""}
                  `}
                >
                  <div className="text-right text-sm font-medium text-gray-700 mb-2">
                    {d.day > 0 ? d.day : ""}
                  </div>

                  {d.vacations.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      className="text-xs p-1.5 mb-1.5 rounded bg-gray-50 border border-gray-200 truncate hover:bg-blue-50 transition"
                      title={`${v.employee} - ${v.department}`}
                    >
                      <span className="font-medium">{v.employee}</span>
                      <span className="text-gray-500"> ({v.department})</span>
                    </div>
                  ))}

                  {d.vacations.length > 3 && (
                    <div className="text-xs text-gray-500 mt-1">
                      +{d.vacations.length - 3} mais
                    </div>
                  )}
                </div>
              );
            })}
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
            <h3 className="text-xl font-bold text-gray-900">
              {selectedDate ? `${selectedDate}/2026` : "Selecione um dia"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {vacationsToday.length} {vacationsToday.length === 1 ? "funcionário de férias" : "funcionários de férias"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Disponibilidade */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Disponibilidade</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Funcionários disponíveis</span>
                  <span className="text-xl font-bold text-emerald-700">14/18</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
                </div>
                <div className="text-xs text-gray-500">
                  {vacationsToday.length} em férias • 2 folgas
                </div>
              </div>
            </div>

            {/* Em férias hoje */}
            {vacationsToday.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Em férias hoje</h4>
                <div className="space-y-4">
                  {vacationsToday.map((v) => {
                    const isExpanded = expandedItems === v.id;
                    return (
                      <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                            {v.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{v.employee}</div>
                                <div className="text-sm text-gray-600">{v.role}</div>
                              </div>
                              <StatusBadge status={v.status} size="sm" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                              <div>
                                <div className="text-xs text-gray-500">Início</div>
                                <div className="font-medium">{v.startDate}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Fim</div>
                                <div className="font-medium">{v.endDate}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Dias</div>
                                <div className="font-medium">{v.days}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedItems(isExpanded ? null : v.id)}
                              className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {isExpanded ? "Ver menos" : "Ver detalhes"}
                            </button>
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500">Substituto:</div>
                                <div className="text-sm font-medium mt-1">João Silva</div>
                                <div className="text-xs text-gray-500 mt-2">Observações:</div>
                                <div className="text-sm text-gray-600 mt-1">Período de férias aprovado em 15/02/2026</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Próximas férias */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Próximas férias</h4>
              <div className="space-y-3">
                {filteredVacations
                  .filter((v) => {
                    const [startDay] = v.startDate.split("/");
                    const selectedDayNum = parseInt(selectedDate.split("/")[0], 10);
                    return parseInt(startDay, 10) > selectedDayNum;
                  })
                  .slice(0, 3)
                  .map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
                      <div>
                        <div className="font-medium text-gray-900">{v.employee}</div>
                        <div className="text-sm text-gray-600">{v.department}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">{v.startDate}</div>
                        <div className="text-xs text-gray-500">{v.days} dias</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Alertas */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Alertas</h4>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-red-800 text-sm">Férias vencendo</div>
                    <div className="text-sm text-red-700 mt-1">
                      Roberto Freitas • Período vence em 10/03
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-amber-800 text-sm">Conflito detectado</div>
                    <div className="text-sm text-amber-700 mt-1">
                      2 cozinheiros de férias em abril • Revisar escala
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <button
              onClick={() => setModalScheduleOpen(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Programar Férias
            </button>
          </div>
        </aside>
      </div>

      {/* Modal Programar Férias */}
      {modalScheduleOpen && (
        <ScheduleVacationModal
          onClose={() => setModalScheduleOpen(false)}
          onSubmit={handleScheduleVacation}
        />
      )}
    </AppShell>
  );
}