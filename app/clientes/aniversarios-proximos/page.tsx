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
  AlertCircle,
  DollarSign,
  TrendingUp,
  FileText,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  MapPin,
  TrendingDown,
  Wallet,
  Gift,
  Star,
  MessageCircle,
  Clock,
  CheckCircle2,
  Users,
  Cake,
  Bell,
  RotateCcw,
  Settings,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";

// ── Tipos ──
interface BirthdayEvent {
  id: number;
  client: string;
  childName?: string;
  eventName: string;
  eventDate: string;
  eventYear: number;
  nextAnniversary: string;
  daysUntil: number;
  guests: number;
  value: number;
  status: "confirmado" | "realizado" | "pendente";
  contact: {
    phone: string;
    email: string;
  };
  lastEvent?: {
    date: string;
    package: string;
  };
}

// ── Componente StatCard ──
function StatCard({ title, value, sub, change, color, icon }: { title: string; value: string; sub?: string; change?: { value: number; type: "up" | "down" }; color: string; icon: React.ReactNode }) {
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
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

// ── Componente de Card de Aniversário ──
function BirthdayEventCard({ event, onContact }: { event: BirthdayEvent; onContact: () => void }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmado": return "bg-emerald-100 text-emerald-800";
      case "realizado": return "bg-blue-100 text-blue-800";
      default: return "bg-amber-100 text-amber-800";
    }
  };

  const getDaysUntilClass = (days: number) => {
    if (days <= 30) return "text-red-600 font-bold";
    if (days <= 60) return "text-amber-600 font-semibold";
    return "text-green-600";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-2xl">
            🎂
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{event.client}</h4>
            <p className="text-sm text-gray-500">{event.eventName}</p>
            {event.childName && (
              <p className="text-xs text-gray-400">Aniversariante: {event.childName}</p>
            )}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
          {event.status === "confirmado" ? "Confirmado" : event.status === "realizado" ? "Realizado" : "Pendente"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Próximo Aniversário</div>
          <div className="text-lg font-bold text-gray-900">{event.nextAnniversary}</div>
          <div className={`text-sm font-medium ${getDaysUntilClass(event.daysUntil)}`}>
            {event.daysUntil === 0 ? "Hoje!" : `Faltam ${event.daysUntil} dias`}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Último Evento</div>
          <div className="text-lg font-bold text-gray-900">{event.lastEvent?.date || "—"}</div>
          <div className="text-xs text-gray-500">{event.lastEvent?.package || "—"}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users size={14} />
            <span>{event.guests} convidados</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-emerald-700">
            <Wallet size={14} />
            <span>{event.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={onContact}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
          >
            <MessageCircle size={12} /> Contatar
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition">
            Ver Proposta
          </button>
        </div>
        <div className="text-xs text-gray-400">
          Evento em {event.eventDate}
        </div>
      </div>
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

// ── Modal de Contato ──
function ContactModal({ event, onClose }: { event: BirthdayEvent; onClose: () => void }) {
  const [message, setMessage] = useState("");

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contatar Cliente</h2>
              <p className="text-sm text-gray-600 mt-1">{event.client} · {event.eventName}</p>
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Informações de Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400" />
                  <span>{event.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span>{event.contact.email}</span>
                </div>
              </div>
            </div>

            <Field label="Mensagem">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Olá! Estamos entrando em contato para lembrar que o aniversário do(a) [nome] está se aproximando. Gostaria de saber se já pensou na festa deste ano? Podemos ajudar com um orçamento personalizado!"
              />
            </Field>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong className="flex items-center gap-2">
                <AlertCircle size={14} /> Dica
              </strong>
              <p className="mt-1">
                Ofereça um desconto especial para clientes recorrentes. Isso aumenta a fidelização!
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
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
            <MessageCircle size={16} /> Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dados Mockados ──
const birthdayEvents: BirthdayEvent[] = [
  {
    id: 1,
    client: "Carla Mendes",
    childName: "Pedro",
    eventName: "Aniversário 8 anos",
    eventDate: "15/06/2025",
    eventYear: 2025,
    nextAnniversary: "15/06/2026",
    daysUntil: 87,
    guests: 80,
    value: 12500,
    status: "realizado",
    contact: {
      phone: "(11) 98765-4329",
      email: "carla.mendes@email.com",
    },
    lastEvent: {
      date: "15/06/2025",
      package: "Riso-Amarelo",
    },
  },
  {
    id: 2,
    client: "Patrícia Santos",
    childName: "Sofia",
    eventName: "Aniversário 10 anos",
    eventDate: "20/09/2024",
    eventYear: 2024,
    nextAnniversary: "20/09/2026",
    daysUntil: 184,
    guests: 50,
    value: 8500,
    status: "realizado",
    contact: {
      phone: "(11) 98765-4326",
      email: "patricia.santos@email.com",
    },
    lastEvent: {
      date: "20/09/2024",
      package: "Riso-Rosa",
    },
  },
  {
    id: 3,
    client: "Fernanda Lima",
    childName: "Lucas",
    eventName: "Aniversário 12 anos",
    eventDate: "05/11/2025",
    eventYear: 2025,
    nextAnniversary: "05/11/2026",
    daysUntil: 230,
    guests: 100,
    value: 15800,
    status: "realizado",
    contact: {
      phone: "(11) 98765-4323",
      email: "fernanda.lima@email.com",
    },
    lastEvent: {
      date: "05/11/2025",
      package: "Riso-Azul",
    },
  },
  {
    id: 4,
    client: "Roberto Alves",
    childName: "Beatriz",
    eventName: "Aniversário 6 anos",
    eventDate: "10/02/2026",
    eventYear: 2026,
    nextAnniversary: "10/02/2027",
    daysUntil: 327,
    guests: 60,
    value: 9800,
    status: "confirmado",
    contact: {
      phone: "(11) 98765-4324",
      email: "roberto.alves@email.com",
    },
    lastEvent: {
      date: "10/02/2026",
      package: "Riso-Vermelho",
    },
  },
];

// ── Página principal ──
export default function CalendarioAniversariosPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 2, 1));
  const [searchTerm, setSearchTerm] = useState("");
  const [modalContact, setModalContact] = useState<BirthdayEvent | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);

  // Estatísticas
  const totalBirthdays = birthdayEvents.length;
  const upcomingIn30Days = birthdayEvents.filter(e => e.daysUntil <= 30).length;
  const upcomingIn60Days = birthdayEvents.filter(e => e.daysUntil <= 60 && e.daysUntil > 30).length;
  const totalRevenue = birthdayEvents.reduce((sum, e) => sum + e.value, 0);

  // Filtrar eventos
  const filteredEvents = birthdayEvents.filter(e =>
    searchTerm === "" ||
    e.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Meses do ano
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentMonth = months[selectedMonth.getMonth()];
  const currentYear = selectedMonth.getFullYear();

  return (
    <AppShell active="crm-calendario-aniversarios">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/crm" className="text-gray-500 hover:text-gray-700 font-medium">
            CRM
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Calendário de Aniversários</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar estatísticas" : "Mostrar estatísticas"}
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
              className={`p-2 rounded-md transition-all ${!showSidebar && !showDetailsPanel ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Modo foco (ocultar tudo)"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Clientes"
            value={totalBirthdays.toString()}
            sub="com aniversários registrados"
            color="bg-pink-600"
            icon={<Cake size={20} className="text-pink-600" />}
          />
          <StatCard
            title="Próximos 30 dias"
            value={upcomingIn30Days.toString()}
            sub="aniversários"
            color="bg-red-600"
            icon={<Bell size={20} className="text-red-600" />}
            change={{ value: 25, type: "up" }}
          />
          <StatCard
            title="Próximos 60 dias"
            value={upcomingIn60Days.toString()}
            sub="aniversários"
            color="bg-amber-600"
            icon={<Calendar size={20} className="text-amber-600" />}
          />
          <StatCard
            title="Receita Total"
            value={totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="últimos eventos"
            color="bg-emerald-600"
            icon={<Wallet size={20} className="text-emerald-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente, aniversariante ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Controles de Mês */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMonth(new Date(currentYear, selectedMonth.getMonth() - 1, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
            {currentMonth} {currentYear}
          </span>
          <button
            onClick={() => setSelectedMonth(new Date(currentYear, selectedMonth.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setSelectedMonth(new Date())}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            Hoje
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Meses */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-72" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meses</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(new Date(currentYear, index, 1))}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${selectedMonth.getMonth() === index
                    ? "bg-pink-50 text-pink-700 border border-pink-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span>{month}</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {birthdayEvents.filter(e => {
                    const [day, monthEvent, year] = e.eventDate.split('/');
                    const eventMonth = months.indexOf(monthEvent);
                    return eventMonth === index;
                  }).length}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Legenda</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Vence em até 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Vence em 31-60 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Mais de 60 dias</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar meses"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Área central - Lista de Aniversários */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Aniversários em {currentMonth} {currentYear}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredEvents.length} {filteredEvents.length === 1 ? "evento" : "eventos"}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <BirthdayEventCard
                  key={event.id}
                  event={event}
                  onContact={() => setModalContact(event)}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Cake size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum aniversário encontrado para este período</p>
              </div>
            )}
          </div>
        </div>

        {/* Botão flutuante para mostrar details panel quando oculto */}
        {!showDetailsPanel && (
          <button
            onClick={() => setShowDetailsPanel(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar estatísticas"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Painel lateral - Estatísticas e Dicas */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-pink-50 to-white">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Análise</h3>
            <p className="text-sm text-gray-500">Estatísticas de aniversários</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Resumo */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resumo</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Média por mês</span>
                  <span className="font-medium">{(totalBirthdays / 12).toFixed(1)} eventos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket médio</span>
                  <span className="font-medium">
                    {(totalRevenue / totalBirthdays).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recorrência</span>
                  <span className="font-medium text-emerald-600">100% dos clientes</span>
                </div>
              </div>
            </div>

            {/* Dicas de Ação */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Gift size={14} /> Dicas de Ação
              </h4>
              <div className="space-y-3">
                <div className="text-sm text-blue-800">
                  <strong>📞 Contato Antecipado</strong>
                  <p className="text-xs text-blue-600 mt-1">Entre em contato 60 dias antes para garantir a reserva.</p>
                </div>
                <div className="text-sm text-blue-800">
                  <strong>🎁 Oferta Especial</strong>
                  <p className="text-xs text-blue-600 mt-1">Ofereça 10% de desconto para clientes recorrentes.</p>
                </div>
                <div className="text-sm text-blue-800">
                  <strong>📸 Lembrete Visual</strong>
                  <p className="text-xs text-blue-600 mt-1">Envie fotos do evento anterior para relembrar a experiência.</p>
                </div>
              </div>
            </div>

            {/* Calendário Rápido */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Próximos Aniversários</h4>
              <div className="space-y-2">
                {birthdayEvents
                  .sort((a, b) => a.daysUntil - b.daysUntil)
                  .slice(0, 4)
                  .map(event => (
                    <div key={event.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-gray-900">{event.client}</div>
                        <div className="text-xs text-gray-500">{event.eventName}</div>
                      </div>
                      <div className={`text-xs font-bold ${event.daysUntil <= 30 ? "text-red-600" : event.daysUntil <= 60 ? "text-amber-600" : "text-green-600"}`}>
                        {event.daysUntil} dias
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Dica Final */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-pink-800 mb-2">
                <Star size={14} />
                <span className="text-xs font-semibold">Fidelização</span>
              </div>
              <p className="text-xs text-pink-700">
                Clientes que comemoram aniversários têm 3x mais chances de contratar novos eventos. Aproveite!
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <button className="w-full px-4 py-2 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition shadow-sm flex items-center justify-center gap-2">
              <Mail size={16} /> Enviar Newsletter para Todos
            </button>
          </div>
        </aside>
      </div>

      {/* Modal de Contato */}
      {modalContact && (
        <ContactModal
          event={modalContact}
          onClose={() => setModalContact(null)}
        />
      )}
    </AppShell>
  );
}