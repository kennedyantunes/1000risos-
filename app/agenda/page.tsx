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
} from "lucide-react";

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DAY_HDRS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAYS_PT = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

type StatusVariant = EventStatus;

const STATUS_CONFIG: Record<StatusVariant, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
}> = {
  confirmado: {
    label: "Confirmado",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  pre: {
    label: "Pré-reservado",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  pendente: {
    label: "Pendente",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  realizado: {
    label: "Realizado",
    bg: "bg-violet-100",
    text: "text-violet-800",
    dot: "bg-violet-500",
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-red-100",
    text: "text-red-800 line-through",
    dot: "bg-red-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

function StatusBadge({ status, size = "sm" }: { status: StatusVariant; size?: "sm" | "md" }) {
  const cfg = STATUS_CONFIG[status];
  const padding = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${cfg.bg} ${cfg.text} border-${cfg.dot.replace("bg-", "")} ${padding} ${textSize}
      `}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function EventModal({ ev, onClose }: { ev: CalendarEvent; onClose: () => void }) {
  const [tab, setTab] = useState<"dados" | "financeiro">("dados");
  const cfg = STATUS_CONFIG[ev.status];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <StatusBadge status={ev.status} size="md" />
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-2">{ev.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Cliente: {ev.client}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex border-b border-gray-200 -mb-px">
            {["dados", "financeiro"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`
                  px-5 py-3 text-sm font-medium transition-all
                  ${tab === t ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500 hover:text-gray-700"}
                `}
              >
                {t === "dados" ? "Dados Gerais" : "Financeiro"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {tab === "dados" ? (
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Status", value: <StatusBadge status={ev.status} /> },
                { label: "Tipo", value: ev.type },
                { label: "Cliente", value: ev.client },
                { label: "Horário", value: <span className="font-mono">{ev.time}</span> },
                { label: "Local", value: ev.venue },
                { label: "Convidados", value: <span className="font-mono">{ev.guests} pessoas</span> },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-gray-100">
              {[
                { label: "Valor total", value: `R$ ${ev.value.toLocaleString("pt-BR")}`, color: "text-gray-900" },
                { label: "Sinal recebido (50%)", value: `R$ ${(ev.value * 0.5).toLocaleString("pt-BR")}`, color: "text-emerald-700 font-semibold" },
                { label: "Saldo restante", value: `R$ ${(ev.value * 0.5).toLocaleString("pt-BR")}`, color: "text-amber-700 font-semibold" },
                { label: "Vencimento", value: "13/06/2025", color: "font-mono text-gray-600" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-3 first:pt-0">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Fechar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Alterar Status
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Editar Evento
          </button>
          <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition ml-2">
            Cancelar Evento
          </button>
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

  const dayEvents = mockEvents[`${year}-${month + 1}-${selectedDay}`] || [];
  const selectedDate = new Date(year, month, selectedDay);
  const dayOfWeek = selectedDate.getDay();

  const monthStats = {
    confirmado: Object.values(mockEvents).flat().filter(e => e.status === "confirmado").length,
    pre: Object.values(mockEvents).flat().filter(e => e.status === "pre").length,
    pendente: Object.values(mockEvents).flat().filter(e => e.status === "pendente").length,
    realizado: Object.values(mockEvents).flat().filter(e => e.status === "realizado").length,
  };

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
          { status: "pre" as const, count: monthStats.pre, label: "Pré-reservados" },
          { status: "pendente" as const, count: monthStats.pendente, label: "Pendentes" },
          { status: "realizado" as const, count: monthStats.realizado, label: "Realizados" },
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
      </div>

      {/* Status Filter */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por:</span>
        {["todos", "confirmado", "pre", "pendente", "realizado", "cancelado"].map((s) => {
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
              const events = !isOtherMonth ? mockEvents[dateKey] || [] : [];

              let bg = isSelected ? "bg-blue-50" : isToday ? "bg-blue-50/60" : isOtherMonth ? "bg-gray-50/60" : "bg-white";

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
                    {events.slice(0, 3).map((ev) => {
                      const st = STATUS_CONFIG[ev.status];
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
                    {events.length > 3 && (
                      <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        +{events.length - 3} mais
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
                const st = STATUS_CONFIG[ev.status];
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
                        <StatusBadge status={ev.status} />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="text-gray-700">🕒 {ev.time} · {ev.type}</div>
                        <div className="text-gray-600">👤 {ev.client}</div>
                        <div className="text-gray-600">📍 {ev.venue} · {ev.guests} pax</div>
                        {ev.value > 0 && (
                          <div className="font-semibold text-emerald-700">
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