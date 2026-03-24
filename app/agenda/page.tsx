"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { mockEvents, CalendarEvent, EventStatus } from "@/lib/mockData";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  CalendarCheck,
  XCircle,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Tag,
  DollarSign,
  Percent,
  Phone,
  Mail,
  User,
  FileText,
  MessageCircle,
  CreditCard,
  Calendar,
} from "lucide-react";

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DAY_HDRS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAYS_PT = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

type StatusVariant = Exclude<EventStatus, 'pre'>;

const STATUS_CONFIG: Record<StatusVariant, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  confirmado: {
    label: "Confirmado",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: "Evento confirmado com sinal pago",
  },
  pendente: {
    label: "Pendente",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5" />,
    description: "Aguardando confirmação do cliente",
  },
  realizado: {
    label: "Realizado",
    bg: "bg-violet-100",
    text: "text-violet-800",
    dot: "bg-violet-500",
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
    description: "Evento já ocorreu",
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-red-100",
    text: "text-red-800 line-through",
    dot: "bg-red-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
    description: "Evento cancelado",
  },
};

// Mock data enriquecido com mais informações
const ENRICHED_MOCK_EVENTS = {
  "2025-6-14": [
    {
      id: "1",
      name: "Casamento Ana & João",
      client: "Ana Silva",
      clientPhone: "(11) 98765-4321",
      clientEmail: "ana.silva@email.com",
      type: "Casamento",
      time: "16:00 - 00:00",
      venue: "Espaço Villa Riso",
      address: "Av. Paulista, 1000 - Bela Vista, SP",
      guests: 150,
      confirmedGuests: 142,
      status: "confirmado" as StatusVariant,
      value: 15000,
      services: ["Buffet", "Decoração", "Fotografia", "DJ"],
      paymentMethod: "Pix",
      paymentStatus: "Sinal pago (50%)",
      notes: "Noiva prefere flores em tons de rosa. Cerimônia ao ar livre.",
      createdAt: "2025-01-15",
      updatedAt: "2025-05-20",
    },
    {
      id: "2",
      name: "Aniversário de 15 anos - Sofia",
      client: "Carlos Mendes",
      clientPhone: "(11) 97654-3210",
      clientEmail: "carlos.mendes@email.com",
      type: "Aniversário",
      time: "19:00 - 23:00",
      venue: "Buffet Elegance",
      address: "Rua Augusta, 500 - Consolação, SP",
      guests: 80,
      confirmedGuests: 75,
      status: "confirmado" as StatusVariant,
      value: 8500,
      services: ["Buffet", "Decoração temática", "DJ"],
      paymentMethod: "Cartão de Crédito",
      paymentStatus: "Pago",
      notes: "Tema: Paris. Bolo personalizado com a Torre Eiffel.",
      createdAt: "2025-03-10",
      updatedAt: "2025-05-25",
    },
    {
      id: "3",
      name: "Confraternização Empresarial",
      client: "Tech Solutions Ltda",
      clientPhone: "(11) 98888-7777",
      clientEmail: "eventos@techsolutions.com",
      type: "Corporativo",
      time: "18:00 - 22:00",
      venue: "Espaço de Eventos Top Center",
      address: "Rua da Consolação, 3000 - SP",
      guests: 50,
      confirmedGuests: 48,
      status: "pendente" as StatusVariant,
      value: 6000,
      services: ["Coffee break", "Salgados", "Bebidas", "Som"],
      paymentMethod: "Boleto",
      paymentStatus: "Aguardando pagamento",
      notes: "Empresa solicitou opções sem glúten e lactose.",
      createdAt: "2025-05-01",
      updatedAt: "2025-06-01",
    },
  ],
  "2025-6-15": [
    {
      id: "4",
      name: "Casamento Pedro & Maria",
      client: "Maria Oliveira",
      clientPhone: "(11) 96543-2109",
      clientEmail: "maria.oliveira@email.com",
      type: "Casamento",
      time: "15:00 - 23:00",
      venue: "Fazenda Esperança",
      address: "Estrada dos Bandeirantes, 5000 - Cotia",
      guests: 200,
      confirmedGuests: 185,
      status: "confirmado" as StatusVariant,
      value: 25000,
      services: ["Buffet completo", "Decoração", "Fotografia", "Filmagem", "Banda"],
      paymentMethod: "Transferência",
      paymentStatus: "Sinal pago (50%)",
      notes: "Casamento ao ar livre. Previsão de chuva - plano B disponível.",
      createdAt: "2025-02-20",
      updatedAt: "2025-05-28",
    },
  ],
  "2025-6-20": [
    {
      id: "5",
      name: "Formatura Direito",
      client: "Turma 2025 - USP",
      clientPhone: "(11) 91234-5678",
      clientEmail: "formatura.direito@usp.br",
      type: "Formatura",
      time: "19:00 - 02:00",
      venue: "Clube Paineiras",
      address: "Av. Indianópolis, 1500 - SP",
      guests: 300,
      confirmedGuests: 280,
      status: "confirmado" as StatusVariant,
      value: 35000,
      services: ["Jantar", "Open bar", "Banda", "Fotografia"],
      paymentMethod: "Parcelado",
      paymentStatus: "Pago",
      notes: "Cerimônia às 19h, jantar às 21h. 50 formandos.",
      createdAt: "2024-12-10",
      updatedAt: "2025-05-15",
    },
  ],
};

function StatusBadge({ status, size = "sm", showTooltip = false }: { status: StatusVariant; size?: "sm" | "md"; showTooltip?: boolean }) {
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

function EventModal({ ev, onClose }: { ev: CalendarEvent & {
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  confirmedGuests?: number;
  services?: string[];
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}; onClose: () => void }) {
  const [tab, setTab] = useState<"dados" | "financeiro" | "contato" | "servicos">("dados");
  const cfg = STATUS_CONFIG[ev.status as StatusVariant];

  const paymentProgress = ev.paymentStatus?.includes("50%") ? 50 : 
                         ev.paymentStatus === "Pago" ? 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={ev.status as StatusVariant} size="md" showTooltip />
                <span className="text-xs text-gray-500">
                  Criado em: {new Date(ev.createdAt || "").toLocaleDateString("pt-BR")}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{ev.name}</h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <User size={14} /> {ev.client}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex border-b border-gray-200 -mb-px">
            {[
              { id: "dados", label: "Dados Gerais", icon: <FileText size={14} /> },
              { id: "contato", label: "Contato", icon: <Phone size={14} /> },
              { id: "servicos", label: "Serviços", icon: <Tag size={14} /> },
              { id: "financeiro", label: "Financeiro", icon: <DollarSign size={14} /> },
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

        <div className="p-6 overflow-y-auto">
          {tab === "dados" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Tag size={16} />, label: "Tipo de Evento", value: ev.type },
                  { icon: <Users size={16} />, label: "Convidados", value: `${ev.confirmedGuests || ev.guests}/${ev.guests} confirmados` },
                  { icon: <MapPin size={16} />, label: "Local", value: ev.venue },
                  { icon: <Calendar size={16} />, label: "Horário", value: ev.time },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      {item.icon}
                      <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                    {item.label === "Local" && ev.address && (
                      <div className="text-xs text-gray-500 mt-1">{ev.address}</div>
                    )}
                  </div>
                ))}
              </div>

              {ev.notes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <MessageCircle size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Observações</span>
                  </div>
                  <p className="text-sm text-gray-700">{ev.notes}</p>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                <span>Última atualização: {new Date(ev.updatedAt || "").toLocaleDateString("pt-BR")}</span>
                <span>ID: {ev.id}</span>
              </div>
            </div>
          )}

          {tab === "contato" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Informações de Contato</h4>
                <div className="space-y-3">
                  {[
                    { icon: <User size={16} />, label: "Nome", value: ev.client },
                    { icon: <Phone size={16} />, label: "Telefone", value: ev.clientPhone || "(11) 99999-9999" },
                    { icon: <Mail size={16} />, label: "E-mail", value: ev.clientEmail || "cliente@email.com" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-gray-400">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm font-medium text-gray-900">{item.value}</div>
                      </div>
                      {item.label === "Telefone" && (
                        <button className="text-blue-600 text-xs font-medium hover:underline">Ligar</button>
                      )}
                      {item.label === "E-mail" && (
                        <button className="text-blue-600 text-xs font-medium hover:underline">Enviar</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "servicos" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Serviços Contratados</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(ev.services || ["Buffet", "Decoração", "Fotografia"]).map((service, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "financeiro" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">Valor Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {ev.value.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sinal (50%)</span>
                    <span className="font-medium text-gray-900">
                      R$ {(ev.value * 0.5).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saldo restante</span>
                    <span className="font-medium text-amber-600">
                      R$ {(ev.value * 0.5).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso do pagamento</span>
                    <span className="font-medium text-gray-900">{paymentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all" 
                      style={{ width: `${paymentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Método de pagamento", value: ev.paymentMethod || "Pix", icon: <CreditCard size={14} /> },
                  { label: "Status do pagamento", value: ev.paymentStatus || "Sinal pago (50%)", icon: <Percent size={14} /> },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Fechar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition">
            Alterar Status
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Editar Evento
          </button>
          {ev.status !== "cancelado" && (
            <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition ml-2">
              Cancelar Evento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgendaPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1));
  const [selectedDay, setSelectedDay] = useState(14);
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<"todos" | StatusVariant>("todos");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; isOtherMonth: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isOtherMonth: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, isOtherMonth: false });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - firstWeekday + 1, isOtherMonth: true });
  }

  const dayEvents = ENRICHED_MOCK_EVENTS[`${year}-${month + 1}-${selectedDay}` as keyof typeof ENRICHED_MOCK_EVENTS] || [];
  const selectedDate = new Date(year, month, selectedDay);
  const dayOfWeek = selectedDate.getDay();

  const monthStats = {
    confirmado: Object.values(ENRICHED_MOCK_EVENTS).flat().filter(e => e.status === "confirmado").length,
    pendente: Object.values(ENRICHED_MOCK_EVENTS).flat().filter(e => e.status === "pendente").length,
    realizado: Object.values(ENRICHED_MOCK_EVENTS).flat().filter(e => e.status === "realizado").length,
    cancelado: Object.values(ENRICHED_MOCK_EVENTS).flat().filter(e => e.status === "cancelado").length,
  };

  const totalRevenue = Object.values(ENRICHED_MOCK_EVENTS).flat().reduce((sum, e) => sum + e.value, 0);
  const totalGuests = Object.values(ENRICHED_MOCK_EVENTS).flat().reduce((sum, e) => sum + e.guests, 0);

  return (
    <AppShell>
      {modalEvent && <EventModal ev={modalEvent} onClose={() => setModalEvent(null)} />}

      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Agenda</h1>
          <p className="text-xs text-gray-500">Gerencie seus eventos e reservas</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          {["Mês", "Semana", "Dia"].map((view, i) => (
            <button
              key={view}
              className={`
                px-4 py-1.5 text-xs font-semibold
                ${i === 0 ? "bg-white shadow-sm text-blue-700" : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              {view}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => {
              const now = new Date();
              setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              setSelectedDay(now.getDate());
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Hoje
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={16} /> Filtros
          </button>
          <Link
            href="/novo-evento"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Evento
          </Link>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-10 shadow-sm">
        {[
          { status: "confirmado" as const, count: monthStats.confirmado, label: "Confirmados" },
          { status: "pendente" as const, count: monthStats.pendente, label: "Pendentes" },
          { status: "realizado" as const, count: monthStats.realizado, label: "Realizados" },
          { status: "cancelado" as const, count: monthStats.cancelado, label: "Cancelados" },
        ].map((item) => {
          const cfg = STATUS_CONFIG[item.status];
          return (
            <div key={item.label} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <div>
                <div className={`text-3xl font-extrabold ${cfg.text}`}>{item.count}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</div>
              </div>
            </div>
          );
        })}
        
        {/* Additional stats */}
        <div className="border-l border-gray-200 pl-6 ml-2">
          <div className="text-3xl font-extrabold text-gray-900">
            R$ {(totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Receita total</div>
        </div>
      </div>

      {/* Status Filter - Updated without "pre" */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por:</span>
        {["todos", "confirmado", "pendente", "realizado", "cancelado"].map((s) => {
          const isActive = activeStatusFilter === s;
          const cfg = s === "todos" ? null : STATUS_CONFIG[s as StatusVariant];

          return (
            <button
              key={s}
              onClick={() => setActiveStatusFilter(s as any)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${isActive
                  ? "bg-white shadow-sm border border-gray-300 text-gray-900"
                  : s === "todos"
                  ? "text-gray-600 hover:bg-gray-100"
                  : `${cfg?.bg} ${cfg?.text} border-${cfg?.dot.replace("bg-", "")} hover:shadow`}
              `}
            >
              {cfg?.icon}
              {s === "todos" ? "Todos" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* Main content - Calendar + Side Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 overflow-y-auto bg-gray-50/40">
          <div className="grid grid-cols-7 bg-white border-b-2 border-gray-200 sticky top-0 z-10">
            {DAY_HDRS.map((day, i) => (
              <div
                key={day}
                className={`py-3 text-center text-xs font-bold uppercase tracking-wider
                  ${i === 0 || i === 6 ? "text-blue-700" : "text-gray-500"}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map(({ day, isOtherMonth }, idx) => {
              const weekday = idx % 7;
              const isWeekend = weekday === 0 || weekday === 6;
              const isToday =
                !isOtherMonth &&
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;
              const isSelected = !isOtherMonth && day === selectedDay;

              const dateKey = `${year}-${month + 1}-${day}`;
              const events = !isOtherMonth ? ENRICHED_MOCK_EVENTS[dateKey as keyof typeof ENRICHED_MOCK_EVENTS] || [] : [];

              let bg = isSelected ? "bg-blue-50" : isToday ? "bg-blue-50/60" : isOtherMonth ? "bg-gray-50/60" : "bg-white";

              // Filter events based on active status filter
              const filteredEvents = activeStatusFilter === "todos" 
                ? events 
                : events.filter(e => e.status === activeStatusFilter);

              return (
                <div
                  key={idx}
                  onClick={() => !isOtherMonth && setSelectedDay(day)}
                  className={`
                    min-h-[110px] border-r border-b border-gray-200 p-2 cursor-pointer transition-colors
                    ${isOtherMonth ? "opacity-60" : ""}
                    hover:bg-blue-50/40
                  `}
                  style={{ background: bg }}
                >
                  <div
                    className={`
                      w-7 h-7 flex items-center justify-center rounded-md text-sm font-bold
                      ${isToday
                        ? "bg-blue-600 text-white shadow-sm"
                        : isSelected
                        ? "bg-blue-100 text-blue-800"
                        : isWeekend && !isOtherMonth
                        ? "text-blue-700"
                        : isOtherMonth
                        ? "text-gray-400"
                        : "text-gray-700"}
                    `}
                  >
                    {day}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {filteredEvents.slice(0, 3).map((ev) => {
                      const st = STATUS_CONFIG[ev.status as StatusVariant];
                      return (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalEvent(ev);
                          }}
                          className={`
                            flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium cursor-pointer truncate
                            ${st.bg} ${st.text}
                          `}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {ev.name}
                        </div>
                      );
                    })}
                    {filteredEvents.length > 3 && (
                      <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        +{filteredEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Eventos do dia
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedDay} de {MONTHS[month]}
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {DAYS_PT[dayOfWeek].charAt(0).toUpperCase() + DAYS_PT[dayOfWeek].slice(1)} · {year}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {dayEvents.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                <CalendarIcon size={48} strokeWidth={1.2} className="opacity-30 mb-4" />
                <p className="text-sm font-medium">Nenhum evento agendado</p>
                <Link href="/novo-evento" className="text-xs text-blue-600 hover:underline mt-2">
                  Criar novo evento
                </Link>
              </div>
            ) : (
              dayEvents.map((ev) => {
                const st = STATUS_CONFIG[ev.status as StatusVariant];
                return (
                  <div
                    key={ev.id}
                    onClick={() => setModalEvent(ev)}
                    className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-150 cursor-pointer"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${st.dot}`} />

                    <div className="pl-3">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h4 className="font-semibold text-gray-900">{ev.name}</h4>
                        <StatusBadge status={ev.status as StatusVariant} />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="text-gray-700 flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          {ev.time} · {ev.type}
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <User size={14} className="text-gray-400" />
                          {ev.client}
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {ev.venue}
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <Users size={14} className="text-gray-400" />
                          {ev.guests} pessoas
                        </div>
                        {ev.value > 0 && (
                          <div className="font-semibold text-emerald-700 flex items-center gap-1">
                            <DollarSign size={14} />
                            R$ {ev.value.toLocaleString("pt-BR")}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalEvent(ev);
                          }}
                          className="flex-1 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          Ver detalhes
                        </button>
                        <button className="flex-1 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 grid grid-cols-3 divide-x divide-gray-200">
            {[
              { value: dayEvents.length || "—", label: "Eventos", color: "text-blue-700" },
              {
                value: dayEvents.reduce((sum, e) => sum + e.guests, 0) || "—",
                label: "Pessoas",
                color: "text-gray-900",
              },
              {
                value: dayEvents.length
                  ? `R$ ${(dayEvents.reduce((s, e) => s + e.value, 0) / 1000).toFixed(0)}k`
                  : "—",
                label: "Receita",
                color: "text-emerald-700",
              },
            ].map((item) => (
              <div key={item.label} className="py-4 text-center">
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}