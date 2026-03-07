"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
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
    department: "Admin",
    avatar: "MA",
    startDate: "15/03/2026",
    endDate: "29/03/2026",
    days: 15,
    status: "scheduled",
    statusText: "Programado",
  },
];

const departments = [
  { key: "todos", label: "Todos", count: 6 },
  { key: "Cozinha", label: "Cozinha", count: 2 },
  { key: "Atendimento", label: "Atendimento", count: 1 },
  { key: "Montagem", label: "Montagem", count: 1 },
  { key: "Administração", label: "Administração", count: 2 },
];

// Dias da semana
const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// Geração simplificada do calendário (Março 2026 - 31 dias)
const generateCalendarDays = () => {
  const days = [];
  // Começa com offset para o primeiro dia da semana (exemplo: 06/03 é uma sexta)
  const offset = 5; // Ajuste conforme o calendário real
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    const isCurrentMonth = dayNum > 0 && dayNum <= 31;
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

export default function CalendarioFeriasPage() {
  const [selectedDept, setSelectedDept] = useState("todos");
  const [selectedDate, setSelectedDate] = useState("06/03");
  const [modalScheduleOpen, setModalScheduleOpen] = useState(false);

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

  return (
    <AppShell active="gestao-funcionarios-ferias-calendario">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Gestão</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Calendário de Férias</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Relatório
          </button>
          <button
            onClick={() => setModalScheduleOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Programar Férias
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Departamentos + Legenda + Resumo */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Departamentos
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {departments.map((dept) => (
              <button
                key={dept.key}
                onClick={() => setSelectedDept(dept.key)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${selectedDept === dept.key
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span>{dept.label}</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {dept.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Legenda
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span>Em andamento</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span>Vence em breve</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span>Programado</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Resumo
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Em férias hoje:</span>
                <span className="font-medium">2 funcionários</span>
              </div>
              <div className="flex justify-between">
                <span>Próximos 30 dias:</span>
                <span className="font-medium">3 funcionários</span>
              </div>
              <div className="flex justify-between text-red-700">
                <span>Vencidas:</span>
                <span className="font-medium">1 funcionário</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Calendário */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
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
                    min-h-[120px] p-3 bg-white hover:bg-gray-50 transition cursor-pointer
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
                      className="text-xs p-1.5 mb-1.5 rounded bg-gray-50 border border-gray-200 truncate"
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

        {/* Detalhes do dia selecionado */}
        <aside className="w-96 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              {selectedDate ? `${selectedDate}/2026` : "Selecione um dia"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {vacationsToday.length} férias agendadas
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Disponibilidade */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Disponibilidade</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Funcionários disponíveis</span>
                  <span className="text-xl font-bold text-emerald-700">14/18</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
                </div>
                <div className="text-xs text-gray-500">
                  2 em férias • 2 folgas
                </div>
              </div>
            </div>

            {/* Em férias hoje */}
            {vacationsToday.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Em férias hoje
                </h4>
                <div className="space-y-4">
                  {vacationsToday.map((v) => (
                    <div
                      key={v.id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                          {v.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{v.employee}</div>
                          <div className="text-sm text-gray-600">{v.role}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="text-gray-500">Início</div>
                          <div className="font-medium">{v.startDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Fim</div>
                          <div className="font-medium">{v.endDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Dias</div>
                          <div className="font-medium">{v.days}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {v.statusText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximas férias */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Próximas férias
              </h4>
              <div className="space-y-3">
                {filteredVacations
                  .filter((v) => v.startDate > selectedDate)
                  .slice(0, 3)
                  .map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{v.employee}</div>
                        <div className="text-sm text-gray-600">{v.department}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{v.startDate}</div>
                        <div className="text-xs text-gray-500">{v.days} dias</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Alertas */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Alertas</h4>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-red-800">Férias vencidas</div>
                    <div className="text-sm text-red-700 mt-1">
                      Roberto Freitas • Período vence em 10/03
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-amber-800">Conflito detectado</div>
                    <div className="text-sm text-amber-700 mt-1">
                      2 cozinheiros de férias em abril • Revisar escala
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Programar Férias */}
      {modalScheduleOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Programar Férias</h2>
              <button
                onClick={() => setModalScheduleOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funcionário *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>Ana Souza · Atendimento (15 dias disponíveis)</option>
                  <option>Carlos Lima · Cozinha (30 dias disponíveis)</option>
                  <option>Roberto Freitas · Montagem (30 dias disponíveis)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período aquisitivo
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>2025/2026 · 30 dias disponíveis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de início *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de término *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between mb-3 text-sm font-medium">
                  <span>Dias solicitados:</span>
                  <span className="font-bold">15 dias</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Saldo restante:</span>
                  <span className="text-emerald-700 font-bold">15 dias</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-amber-800 mb-1">Conflito detectado</div>
                  <div className="text-sm text-amber-700">
                    2 funcionários do mesmo departamento já estarão de férias neste período.
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalScheduleOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                >
                  <CalendarIcon size={18} /> Programar Férias
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}