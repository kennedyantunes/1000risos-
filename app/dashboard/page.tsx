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
  BarChart3,
  DollarSign,
  TrendingUp,
  FileText,
  Table,
  Mail,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Briefcase,
  MapPin,
  TrendingDown,
  Wallet,
  Award,
  Gift,
  Star,
  MessageCircle,
  Clock,
  CheckCircle2,
  Users,
  Utensils,
  Package,
  Copy,
  Trash2,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Save as SaveIcon,
  Cake,
  PartyPopper,
  Sparkles,
  Bell,
  RotateCcw,
  Settings,
} from "lucide-react";

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

// ── Componente de Aniversário Próximo ──
function BirthdayCard({ client, event, daysLeft }: { client: string; event: string; daysLeft: number }) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
          🎂
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{client}</h4>
            <div className="flex items-center gap-1 text-pink-600 font-bold text-sm">
              <Bell size={14} />
              {daysLeft === 0 ? "Hoje!" : `Faltam ${daysLeft} dias`}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{event}</p>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1.5 bg-pink-600 text-white text-xs rounded-lg hover:bg-pink-700 transition">
              Entrar em Contato
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition">
              Ver Proposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dados Mockados ──
const stats: StatCard[] = [
  { title: "Eventos da semana", value: "8", sub: "vs 6 semana passada", icon: <Calendar size={20} />, color: "bg-blue-600", change: { value: 33, type: "up" } },
  { title: "Faturamento mês", value: "R$ 32.800", sub: "vs R$ 29.300 fev", icon: <DollarSign size={20} />, color: "bg-emerald-600", change: { value: 12, type: "up" } },
  { title: "Aniversários próximos", value: "3", sub: "nos próximos 60 dias", icon: <Cake size={20} />, color: "bg-rose-600", change: { value: 50, type: "up" } },
];

const upcomingBirthdays = [
  { client: "Carla Mendes", event: "Aniversário 8 anos - Pedro", date: "15/06/2026", daysLeft: 87 },
  { client: "Patrícia Santos", event: "Aniversário 10 anos - Sofia", date: "20/09/2026", daysLeft: 184 },
  { client: "Marcos Oliveira", event: "Confraternização Anual", date: "10/12/2026", daysLeft: 265 },
];

const timeline = [
  { time: "13:00", title: "Aniversário Sofia", subtitle: "80 convidados · Salão Villa Bella", status: "Em andamento", statusBg: "bg-emerald-100", statusColor: "text-emerald-800" },
  { time: "18:00", title: "Coquetel Empresarial", subtitle: "50 convidados · Escritório XPTO", status: "Próximo", statusBg: "bg-amber-100", statusColor: "text-amber-800" },
  { time: "19:00", title: "Jantar Especial", subtitle: "30 convidados · Reservado", status: "Próximo", statusBg: "bg-amber-100", statusColor: "text-amber-800" },
];

const nextEvents = [
  { day: "07", month: "MAR", name: "Casamento Silva", client: "Sr. Silva · 120 convidados", status: "Confirmado", statusBg: "bg-emerald-100", statusColor: "text-emerald-800" },
  { day: "08", month: "MAR", name: "Formatura João", client: "Família Oliveira · 150 convidados", status: "Pré-reservado", statusBg: "bg-blue-100", statusColor: "text-blue-800" },
  { day: "10", month: "MAR", name: "Aniversário Empresa", client: "XPTO Corp · 80 convidados", status: "Pendente", statusBg: "bg-amber-100", statusColor: "text-amber-800" },
  { day: "12", month: "MAR", name: "Aniversário 15 anos", client: "Sofia · 80 convidados", status: "Confirmado", statusBg: "bg-emerald-100", statusColor: "text-emerald-800" },
];

const stock = [
  { name: "Açúcar", current: 3.2, max: 8, unit: "kg", status: "critical" },
  { name: "Farinha", current: 5, max: 10, unit: "kg", status: "warning" },
  { name: "Ovos", current: 2, max: 5, unit: "dz", status: "critical" },
  { name: "Cadeiras", current: 142, max: 200, unit: "", status: "ok" },
];

const activities = [
  { icon: "💰", text: "Pagamento recebido: Aniversário Sofia", meta: "R$ 4.500 · há 2 horas" },
  { icon: "📦", text: "Compra realizada: Moinho Dourado", meta: "R$ 1.240 · há 3 horas" },
  { icon: "🔧", text: "Avaria registrada: Cama elástica", meta: "Rasgo na lona · há 4 horas" },
  { icon: "👥", text: "Férias programadas: Marcos Andrade", meta: "15 dias a partir 15/03 · há 5 horas" },
];

const barData = [30, 45, 20, 15, 40, 60, 35, 50, 25, 30, 45, 55, 38, 42, 48, 52, 35, 28, 40, 45, 32, 38, 42, 48, 35, 40, 45, 50, 38, 42, 45];
const maxBar = Math.max(...barData);

export default function DashboardPage() {
  const [selectedDate] = useState("06/03/2026");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  return (
    <AppShell active="dashboard">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-gray-900">Dashboard</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar painel" : "Mostrar painel"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar atividades" : "Mostrar atividades"}
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

          <div className="flex items-center gap-2">
            <span className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700">
              {selectedDate} · Hoje
            </span>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <RotateCcw size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              sub={stat.sub}
              change={stat.change}
              color={stat.color}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda - Aniversários Próximos */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Cake size={14} /> Aniversários Próximos
            </h3>
            <p className="text-sm text-gray-600 mt-1">Clientes com eventos nos próximos meses</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {upcomingBirthdays.map((birthday, i) => (
              <BirthdayCard
                key={i}
                client={birthday.client}
                event={birthday.event}
                daysLeft={birthday.daysLeft}
              />
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full px-4 py-2 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2">
              <Calendar size={16} /> Ver Calendário de Aniversários
            </button>
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar aniversários"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Área central - Conteúdo Principal */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Linha do tempo */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Linha do tempo · Hoje</h3>
                <Link href="/agenda" className="text-xs text-blue-600 hover:underline">Ver agenda</Link>
              </div>
              <div className="p-4 space-y-3">
                {timeline.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="min-w-[60px] text-sm font-bold text-blue-700">{t.time}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.subtitle}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.statusBg} ${t.statusColor}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Eventos + Estoque em Alerta */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos Eventos */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Próximos eventos</h3>
                  <Link href="/agenda" className="text-xs text-blue-600 hover:underline">Ver agenda</Link>
                </div>
                <div className="p-4 space-y-3">
                  {nextEvents.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                      <div className="min-w-[50px] text-center bg-gray-100 rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-700">{e.day}</div>
                        <div className="text-xs text-gray-500 uppercase">{e.month}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{e.name}</div>
                        <div className="text-sm text-gray-500">{e.client}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${e.statusBg} ${e.statusColor}`}>{e.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estoque em Alerta */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Estoque em alerta</h3>
                  <Link href="/estoque/equipamentos" className="text-xs text-blue-600 hover:underline">Ver estoque</Link>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {stock.map((s, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{s.name}</span>
                          <span className="text-xs font-mono text-gray-600">{s.current}/{s.max} {s.unit}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.status === "critical" ? "bg-red-500" : s.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${(s.current / s.max) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-gray-500">Mín: {s.max} {s.unit}</span>
                          <span className={s.status === "critical" ? "text-red-600 font-medium" : s.status === "warning" ? "text-amber-600" : "text-emerald-600"}>
                            {s.status === "critical" ? "Urgente" : s.status === "warning" ? "Comprar" : "OK"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo Financeiro + Férias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumo Financeiro */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Resumo Financeiro</h3>
                  <Link href="/financeiro" className="text-xs text-blue-600 hover:underline">Ver mais</Link>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">A receber (mês)</span>
                    <span className="font-bold text-emerald-700">R$ 47.890</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">A pagar (mês)</span>
                    <span className="font-bold text-red-700">R$ 15.234</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saldo atual</span>
                    <span className="font-bold text-gray-900">R$ 32.656</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Inadimplência</span>
                    <span className="font-bold text-red-700">R$ 3.240</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-lg font-bold text-blue-700">Projeção: R$ 55.795</div>
                  </div>
                </div>
              </div>

              {/* Férias */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Férias</h3>
                  <Link href="/gestao/funcionarios/ferias" className="text-xs text-blue-600 hover:underline">Ver calendário</Link>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="min-w-[60px] text-center">
                      <div className="text-lg font-bold text-amber-700">06-20</div>
                      <div className="text-xs text-gray-500">MAR</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Ana Souza</div>
                      <div className="text-sm text-gray-600">Atendimento · 15 dias</div>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Em férias</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="min-w-[60px] text-center">
                      <div className="text-lg font-bold text-amber-700">06-20</div>
                      <div className="text-xs text-gray-500">MAR</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Carlos Lima</div>
                      <div className="text-sm text-gray-600">Cozinha · 15 dias</div>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Em férias</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="min-w-[60px] text-center">
                      <div className="text-lg font-bold text-red-700">Vence</div>
                      <div className="text-xs text-gray-500">10/03</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Roberto Freitas</div>
                      <div className="text-sm text-gray-600">30 dias vencendo</div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Urgente</span>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium">Disponibilidade hoje:</span> 16/18 funcionários
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Eventos */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Eventos por dia · Março 2026</h3>
                <Link href="/relatorios" className="text-xs text-blue-600 hover:underline">Ver relatório</Link>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-1 h-48">
                  {barData.slice(0, 20).map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(height / maxBar) * 100}%`, minHeight: height > 0 ? '2px' : '0' }}
                      />
                      <div className="text-[10px] text-gray-500 mt-1">{String(i + 1).padStart(2, '0')}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-600">Total eventos: 24</span>
                  <span className="font-bold text-blue-700">Faturamento: R$ 32.800</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão flutuante para mostrar details panel quando oculto */}
        {!showDetailsPanel && (
          <button
            onClick={() => setShowDetailsPanel(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar atividades"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Coluna direita - Atividades Recentes */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Atividades Recentes</h3>
            <p className="text-sm text-gray-500">Últimas movimentações do sistema</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm">
                  {a.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{a.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2">
              <Eye size={16} /> Ver todas as atividades
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
