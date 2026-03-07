"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Calendar,
  MapPin,
  Phone,
  Plus,
  X,
  Download,
  Wrench,
  ChevronRight,
} from "lucide-react";

// ── Types (mantidos iguais) ──
type CheckItemStatus = "done" | "pending" | "warning";
type EquipStatus = "confirmed" | "pending" | "issue";
type TabKey = "all" | "pre" | "during" | "post";
type IncidentType = "Avaria" | "Perda" | "Falta";

type CheckItem = {
  id: number;
  title: string;
  desc: string;
  assignee: string;
  deadline: string;
  deadlineUrgent?: boolean;
  status: CheckItemStatus;
};

type CheckSection = {
  key: TabKey;
  label: string;
  total: number;
  done: number;
  items: CheckItem[];
};

type EquipItem = {
  id: number;
  icon: string;
  name: string;
  qty: string;
  location?: string;
  status: EquipStatus;
};

// ── Data (mantida igual) ──
const checkSections: CheckSection[] = [
  {
    key: "pre",
    label: "📋 Pré-evento",
    total: 8,
    done: 8,
    items: [
      { id: 1, title: "Confirmar fornecedores", desc: "Todos os fornecedores confirmados por telefone", assignee: "Marcos A.", deadline: "Concluído: 04/03", status: "done" },
      { id: 2, title: "Separar equipamentos", desc: "Louças, talheres, copos, móveis", assignee: "João P.", deadline: "Concluído: 05/03", status: "done" },
      { id: 3, title: "Checklist de cozinha", desc: "Verificar estoque de matéria-prima", assignee: "Ana S.", deadline: "Concluído: 05/03", status: "done" },
    ],
  },
  {
    key: "during",
    label: "⏳ Durante o evento",
    total: 5,
    done: 3,
    items: [
      { id: 4, title: "Montagem da estrutura", desc: "Mesas, cadeiras, decoração", assignee: "Carlos L.", deadline: "Concluído: 10:30", status: "done" },
      { id: 5, title: "Preparação dos alimentos", desc: "Coxinhas, doces, salgados", assignee: "Ana S.", deadline: "Concluído: 11:45", status: "done" },
      { id: 6, title: "Serviço de buffet", desc: "Organização das mesas de comida", assignee: "João P.", deadline: "Pendente · 13:30", status: "pending", deadlineUrgent: true },
      { id: 7, title: "Monitorar brinquedos", desc: "Cama elástica e piscina de bolinhas", assignee: "Carlos L.", deadline: "13:00 - 18:00", status: "pending" },
    ],
  },
  {
    key: "post",
    label: "✅ Pós-evento",
    total: 4,
    done: 1,
    items: [
      { id: 8, title: "Check-in dos equipamentos", desc: "Registrar devolução de todos os itens", assignee: "João P.", deadline: "Concluído: 19:30", status: "done" },
      { id: 9, title: "Relatório de avarias", desc: "Registrar danos em equipamentos", assignee: "Marcos A.", deadline: "Pendente", status: "pending" },
      { id: 10, title: "Feedback do cliente", desc: "Enviar pesquisa de satisfação", assignee: "Fernanda M.", deadline: "Atrasado · 24h", status: "warning", deadlineUrgent: true },
    ],
  },
];

const equipSections: { label: string; count: number; items: EquipItem[] }[] = [
  {
    label: "Louças",
    count: 42,
    items: [
      { id: 1, icon: "🍽️", name: "Prato Raso Branco", qty: "50 unidades", location: "Galpão A · P3", status: "confirmed" },
      { id: 2, icon: "🥣", name: "Prato Fundo", qty: "30 unidades", location: "Galpão A · P3", status: "confirmed" },
    ],
  },
  {
    label: "Talheres",
    count: 120,
    items: [
      { id: 3, icon: "🥄", name: "Garfo Inox", qty: "80 unidades", status: "confirmed" },
      { id: 4, icon: "🔪", name: "Faca Inox", qty: "40 unidades", status: "confirmed" },
    ],
  },
  {
    label: "Brinquedos",
    count: 2,
    items: [
      { id: 5, icon: "🎪", name: "Cama Elástica", qty: "1 unidade", location: "Container 2", status: "issue" },
      { id: 6, icon: "🏀", name: "Piscina de Bolinhas", qty: "1 unidade", status: "confirmed" },
    ],
  },
];

const EQUIP_STATUS_CFG: Record<EquipStatus, { bg: string; border: string; badgeBg: string; badgeColor: string; label: string }> = {
  confirmed: { bg: "rgba(22,163,74,.1)", border: "#16a34a", badgeBg: "rgba(22,163,74,.1)", badgeColor: "#14532d", label: "OK" },
  pending: { bg: "var(--surface2)", border: "var(--border)", badgeBg: "var(--surface3)", badgeColor: "var(--text2)", label: "Pendente" },
  issue: { bg: "rgba(220,38,38,.08)", border: "#dc2626", badgeBg: "rgba(220,38,38,.08)", badgeColor: "#7f1d1d", label: "Avaria" },
};

// ── Modal Registrar Ocorrência (mantido, mas com estilo atualizado) ──
function IncidentModal({ onClose }: { onClose: () => void }) {
  const [incType, setIncType] = useState<"Avaria" | "Perda" | "Falta">("Avaria");

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Registrar Ocorrência</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Tipo de ocorrência
          </label>
          <div className="flex gap-3 mb-6">
            {["Avaria", "Perda", "Falta"].map((t) => (
              <button
                key={t}
                onClick={() => setIncType(t as any)}
                className={`
                  flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all
                  ${incType === t
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                `}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Item afetado
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none mb-6">
            <option>Cama Elástica</option>
            <option>Piscina de Bolinhas</option>
            <option>Mesa Plástica</option>
            <option>Cadeira Dobrável</option>
          </select>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Quantidade
              </label>
              <input
                defaultValue="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Responsável
              </label>
              <input
                defaultValue="João P."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Descrição
          </label>
          <textarea
            placeholder="Descreva o ocorrido em detalhes..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-6"
          />

          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Fotos (opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 text-sm cursor-pointer hover:border-blue-400 transition">
            + Adicionar imagens
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Registrar Ocorrência
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function ChecklistEventoPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pre" | "during" | "post">("all");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(
    new Set(checkSections.flatMap((s) => s.items.filter((i) => i.status === "done").map((i) => i.id)))
  );
  const [modalIncident, setModalIncident] = useState(false);

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleSections =
    activeTab === "all" ? checkSections : checkSections.filter((s) => s.key === activeTab);

  const tabs = [
    { key: "all", label: "Todos" },
    { key: "pre", label: "Pré-evento" },
    { key: "during", label: "Durante" },
    { key: "post", label: "Pós-evento" },
  ];

  const overallProgress = Math.round(
    (checkSections.reduce((sum, s) => sum + s.done, 0) / checkSections.reduce((sum, s) => sum + s.total, 0)) * 100
  );

  return (
    <AppShell>
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Operação</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500 font-medium">Agenda</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Checklist do Evento</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Imprimir
          </button>
          <button
            onClick={() => setModalIncident(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Registrar Ocorrência
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda – Informações do Evento */}
        <aside className="w-80 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Aniversário Sofia</h2>
            <p className="text-sm text-gray-600">Aniversário 15 anos · 80 convidados</p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {[
                { label: "Data", value: "06/03/2026" },
                { label: "Horário", value: "13h às 18h" },
                { label: "Local", value: "Salão Villa Bella" },
                { label: "Status", value: "Confirmado", color: "text-green-600 font-semibold" },
              ].map((info) => (
                <div key={info.label}>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{info.label}</div>
                  <div className={`text-base font-medium ${info.color || "text-gray-900"}`}>{info.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="font-semibold text-gray-900 mb-1">Carla Mendes</div>
              <div className="text-sm text-gray-600 mb-1">carla.mendes@email.com</div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                (11) 98765-4321
              </div>
            </div>
          </div>

          {/* Progresso */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Progresso do Checklist</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${overallProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                />
              </div>
              <div className="text-center text-sm font-bold text-blue-700">{overallProgress}% concluído</div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: "Pré-evento", pct: 100, color: "bg-green-500" },
                { label: "Durante", pct: 60, color: "bg-blue-500" },
                { label: "Pós-evento", pct: 25, color: "bg-amber-500" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{p.label}</span>
                    <span className="font-medium">{p.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipe */}
          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Equipe Designada</h3>
            <div className="space-y-4">
              {[
                { initials: "AS", name: "Ana Souza", role: "Cozinheira Chefe" },
                { initials: "JP", name: "João Pedro", role: "Garçom" },
                { initials: "CL", name: "Carlos Lima", role: "Montador" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {m.initials}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.role}</div>
                  </div>
                  <span className="ml-auto px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Confirmado
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Área central – Checklist + Equipamentos */}
        <main className="flex-1 overflow-y-auto bg-gray-50/40 p-6">
          {/* Tabs do checklist */}
          <div className="flex gap-3 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`
                  px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeTab === t.key
                    ? "bg-white shadow-sm border border-gray-200 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Checklist */}
          <div className="space-y-8">
            {visibleSections.map((section) => {
              const doneCount = section.items.filter((i) => checkedItems.has(i.id)).length;
              return (
                <div key={section.key}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{section.label}</h3>
                    <span className="text-sm text-gray-600">
                      {doneCount}/{section.total} concluídas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item) => {
                      const isDone = checkedItems.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`
                            group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl transition-all duration-200
                            hover:shadow-md hover:border-blue-300
                            ${isDone ? "bg-green-50/50 border-green-200" : ""}
                          `}
                        >
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className={`
                              w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1
                              ${isDone
                                ? "bg-green-600 border-green-600 text-white"
                                : "border-gray-300 hover:border-blue-500"}
                            `}
                          >
                            {isDone && <CheckCircle2 size={16} />}
                          </button>

                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                            <div className="text-sm text-gray-600 mb-3">{item.desc}</div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">{item.assignee}</span>
                              <span
                                className={`font-medium ${
                                  item.deadlineUrgent ? "text-red-600" : "text-gray-500"
                                }`}
                              >
                                {item.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Equipamentos */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Equipamentos no Evento</h2>
              <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                Confirmar Todos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipSections.flatMap((section) =>
                section.items.map((eq) => {
                  const cfg = EQUIP_STATUS_CFG[eq.status];
                  return (
                    <div
                      key={eq.id}
                      className={`
                        bg-white border border-gray-200 rounded-xl p-5 transition-all duration-200
                        hover:shadow-lg hover:border-blue-300
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-3xl">
                          {eq.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{eq.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{eq.qty}</p>
                          {eq.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={14} /> {eq.location}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium`}
                          style={{
                            background: cfg.badgeBg,
                            color: cfg.badgeColor,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Resumo e Ocorrências */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do Evento</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de itens</span>
                  <span className="font-medium">164</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conferidos</span>
                  <span className="font-medium text-green-600">158 (96%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Com avaria</span>
                  <span className="font-medium text-red-600">1</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between text-sm font-bold">
                  <span>Pendentes</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            {/* Ocorrências */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Ocorrências Registradas</h3>
                <button
                  onClick={() => setModalIncident(true)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Nova
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 mt-0.5" size={18} />
                    <div>
                      <div className="font-medium text-amber-800">Cama elástica com rasgo</div>
                      <div className="text-sm text-amber-700 mt-1">
                        Lona lateral rasgada durante uso
                      </div>
                      <div className="text-xs text-amber-600 mt-2">
                        Registrado por João P. · 15:30
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Botão flutuante para registrar ocorrência */}
      <button
        onClick={() => setModalIncident(true)}
        className="fixed bottom-6 right-6 z-20 p-4 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition transform hover:scale-105 flex items-center justify-center"
        title="Registrar ocorrência"
      >
        <AlertCircle size={24} />
      </button>

      {modalIncident && <IncidentModal onClose={() => setModalIncident(false)} />}
    </AppShell>
  );
}