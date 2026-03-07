"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  FileText,
  X,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Trash2,
} from "lucide-react";

// ── Tipos ──
type ReqStatus = "pending" | "approved" | "purchased" | "received" | "rejected";
type Priority = "high" | "medium" | "low";

interface ReqItem {
  name: string;
  qty: string;
  unitPrice: number;
}

interface TimelineStep {
  title: string;
  meta?: string;
  date?: string;
  done: boolean;
  current: boolean;
}

interface PurchaseRequest {
  id: string;
  title: string;
  status: ReqStatus;
  priority: Priority;
  requester: string;
  dept: string;
  date: string;
  time: string;
  type: string;
  eventLinked?: string;
  eventDate?: string;
  items: ReqItem[];
  total: number;
  justification: string;
  approvedBy?: string;
  rejectedReason?: string;
  attachments: { name: string; size: string }[];
  suppliers: { name: string; contact: string }[];
  timeline: TimelineStep[];
}

// ── Mock Data ──
const requests: PurchaseRequest[] = [
  {
    id: "SC-2026-0042",
    title: "Compra emergencial de ingredientes",
    status: "pending",
    priority: "high",
    requester: "Marcos Andrade",
    dept: "Administração",
    date: "06/03/2026",
    time: "09:23",
    type: "Matéria-prima",
    eventLinked: "Aniversário Sofia",
    eventDate: "06/03/2026",
    items: [
      { name: "Farinha de Trigo", qty: "15 kg", unitPrice: 3.5 },
      { name: "Açúcar Refinado", qty: "10 kg", unitPrice: 2.8 },
      { name: "Ovos (dúzia)", qty: "5 dz", unitPrice: 12 },
      { name: "Leite Integral", qty: "8 L", unitPrice: 4.5 },
      { name: "Óleo de Soja", qty: "5 L", unitPrice: 4.2 },
    ],
    total: 287.5,
    justification:
      "Estoque insuficiente para o evento 'Aniversário Sofia' no dia 06/03. Necessário compra urgente para produção das 80 coxinhas e docinhos contratados.",
    attachments: [
      { name: "Lista de ingredientes.pdf", size: "245 KB" },
      { name: "Orçamento_ingredientes.jpg", size: "1.2 MB" },
    ],
    suppliers: [
      { name: "Moinho Dourado", contact: "Farinhas e derivados · (11) 3456-7890" },
      { name: "Granja Ouro", contact: "Ovos e laticínios · (11) 98765-4321" },
    ],
    timeline: [
      { title: "Solicitação criada", meta: "Marcos Andrade · Administração", date: "06/03/2026 · 09:23", done: true, current: false },
      { title: "Aguardando aprovação", meta: "Financeiro", date: "Há 2 horas", done: false, current: true },
      { title: "Compra", meta: "Aguardando aprovação", done: false, current: false },
      { title: "Recebimento", done: false, current: false },
    ],
  },
  {
    id: "SC-2026-0041",
    title: "Reposição de descartáveis",
    status: "pending",
    priority: "medium",
    requester: "Carla Santos",
    dept: "Operações",
    date: "05/03/2026",
    time: "14:10",
    type: "Descartável",
    items: [
      { name: "Pratos descartáveis", qty: "500 un", unitPrice: 0.35 },
      { name: "Copos 200ml", qty: "300 un", unitPrice: 0.18 },
      { name: "Talheres (kit)", qty: "200 un", unitPrice: 0.28 },
    ],
    total: 189,
    justification: "Reposição de estoque mínimo de descartáveis para os próximos eventos do mês.",
    attachments: [],
    suppliers: [{ name: "Descart Express", contact: "Descartáveis · (11) 2233-4455" }],
    timeline: [
      { title: "Solicitação criada", meta: "Carla Santos · Operações", date: "05/03/2026 · 14:10", done: true, current: false },
      { title: "Aguardando aprovação", meta: "Financeiro", done: false, current: true },
      { title: "Compra", done: false, current: false },
      { title: "Recebimento", done: false, current: false },
    ],
  },
  {
    id: "SC-2026-0038",
    title: "Novos equipamentos - cozinha",
    status: "approved",
    priority: "low",
    requester: "Mariana Rocha",
    dept: "Gerência",
    date: "03/03/2026",
    time: "11:45",
    type: "Equipamento",
    items: [
      { name: "Batedeira industrial", qty: "1 un", unitPrice: 1500 },
      { name: "Assadeira antiaderente", qty: "5 un", unitPrice: 78 },
    ],
    total: 1890,
    justification: "Equipamentos necessários para aumentar capacidade de produção.",
    approvedBy: "Financeiro",
    attachments: [{ name: "Cotação_equipamentos.pdf", size: "380 KB" }],
    suppliers: [{ name: "Equipamentos Gastro", contact: "(11) 5566-7788" }],
    timeline: [
      { title: "Solicitação criada", meta: "Mariana Rocha · Gerência", date: "03/03/2026 · 11:45", done: true, current: false },
      { title: "Aprovada", meta: "Financeiro", date: "04/03/2026 · 09:00", done: true, current: false },
      { title: "Aguardando compra", done: false, current: true },
      { title: "Recebimento", done: false, current: false },
    ],
  },
  {
    id: "SC-2026-0035",
    title: "Carnes para eventos do fim de semana",
    status: "purchased",
    priority: "high",
    requester: "João Pedro",
    dept: "Cozinha",
    date: "02/03/2026",
    time: "08:30",
    type: "Matéria-prima",
    items: [
      { name: "Frango desfiado", qty: "8 kg", unitPrice: 14.5 },
      { name: "Carne moída", qty: "5 kg", unitPrice: 28 },
      { name: "Linguiça", qty: "3 kg", unitPrice: 18 },
    ],
    total: 342,
    justification: "Compra de carnes para os eventos confirmados do fim de semana.",
    attachments: [{ name: "NF_12345.pdf", size: "156 KB" }],
    suppliers: [{ name: "Frigorífico Bom Gosto", contact: "(11) 5432-1098" }],
    timeline: [
      { title: "Solicitação criada", date: "02/03/2026 · 08:30", done: true, current: false },
      { title: "Aprovada", date: "02/03/2026 · 10:00", done: true, current: false },
      { title: "Compra realizada", meta: "NF 12345", date: "03/03/2026 · 09:15", done: true, current: false },
      { title: "Aguardando entrega", done: false, current: true },
    ],
  },
  {
    id: "SC-2026-0032",
    title: "Material de limpeza",
    status: "received",
    priority: "low",
    requester: "Carla Santos",
    dept: "Operações",
    date: "28/02/2026",
    time: "15:00",
    type: "Outro",
    items: [
      { name: "Detergente", qty: "5 L", unitPrice: 8.5 },
      { name: "Desinfetante", qty: "5 L", unitPrice: 9.2 },
      { name: "Luvas", qty: "10 pares", unitPrice: 4.2 },
    ],
    total: 78.5,
    justification: "Reposição de materiais de limpeza.",
    attachments: [],
    suppliers: [{ name: "Limpeza Total", contact: "(11) 3322-5544" }],
    timeline: [
      { title: "Solicitação criada", date: "28/02/2026", done: true, current: false },
      { title: "Aprovada", done: true, current: false },
      { title: "Compra realizada", done: true, current: false },
      { title: "Recebida", meta: "Recebido por: Estoque", date: "01/03/2026", done: true, current: false },
    ],
  },
  {
    id: "SC-2026-0029",
    title: "Decoração temática - Natal",
    status: "rejected",
    priority: "medium",
    requester: "Marcos Andrade",
    dept: "Operações",
    date: "25/02/2026",
    time: "10:20",
    type: "Decoração",
    items: [{ name: "Enfeites natalinos", qty: "kit", unitPrice: 450 }],
    total: 450,
    justification: "Decoração para eventos de fim de ano.",
    rejectedReason: "Fora do orçamento",
    attachments: [],
    suppliers: [],
    timeline: [
      { title: "Solicitação criada", date: "25/02/2026", done: true, current: false },
      { title: "Reprovada", meta: "Motivo: Fora do orçamento", date: "26/02/2026", done: true, current: false },
    ],
  },
];

// ── Página principal ──
export default function SolicitacoesPage() {
  const [selectedId, setSelectedId] = useState<string>("SC-2026-0042");
  const [statusFilter, setStatusFilter] = useState<ReqStatus | "all">("pending");
  const [modalOpen, setModalOpen] = useState(false);

  // Formulário do modal
  const [form, setForm] = useState({
    title: "",
    type: "Matéria-prima",
    priority: "medium" as Priority,
    justification: "",
    items: [{ name: "", qty: "", unitPrice: "" }],
  });

  const selectedReq = requests.find((r) => r.id === selectedId) || requests[0];

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  // Funções para manipular itens no formulário
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: "", unitPrice: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: "name" | "qty" | "unitPrice",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nova solicitação criada:", form);
    // Aqui você pode:
    // 1. Enviar para API
    // 2. Adicionar na lista mock (se quiser simular)
    // 3. Mostrar toast de sucesso
    setModalOpen(false);
    // Resetar formulário (opcional)
    setForm({
      title: "",
      type: "Matéria-prima",
      priority: "medium",
      justification: "",
      items: [{ name: "", qty: "", unitPrice: "" }],
    });
  };

  return (
    <AppShell active="financeiro-solicitacoes">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Financeiro</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Solicitações de Compra</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Relatórios
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Nova Solicitação
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda – Filtros e Status */}
        <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</h3>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                placeholder="Buscar por ID, solicitante..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {[
              { status: "all", label: "Todas", count: requests.length, color: "bg-gray-100 text-gray-700" },
              { status: "pending", label: "Pendentes", count: 8, color: "bg-amber-100 text-amber-800" },
              { status: "approved", label: "Aprovadas", count: 12, color: "bg-emerald-100 text-emerald-800" },
              { status: "purchased", label: "Compras realizadas", count: 5, color: "bg-blue-100 text-blue-800" },
              { status: "received", label: "Recebidas", count: 18, color: "bg-purple-100 text-purple-800" },
              { status: "rejected", label: "Reprovadas", count: 3, color: "bg-red-100 text-red-800" },
            ].map((s) => (
              <button
                key={s.status}
                onClick={() => setStatusFilter(s.status as any)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  ${statusFilter === s.status
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  {s.label}
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {s.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Lista de solicitações */}
        <div className="w-[380px] border-r border-gray-200 bg-gray-50/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Solicitações · {filteredRequests.length}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredRequests.map((req) => {
              const isSelected = req.id === selectedId;
              const statusColor =
                req.status === "pending" ? "text-amber-700 bg-amber-50" :
                req.status === "approved" ? "text-emerald-700 bg-emerald-50" :
                req.status === "purchased" ? "text-blue-700 bg-blue-50" :
                req.status === "received" ? "text-purple-700 bg-purple-50" :
                "text-red-700 bg-red-50";

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedId(req.id)}
                  className={`
                    p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-mono text-gray-500 mb-1">#{req.id}</div>
                      <h4 className="font-semibold text-gray-900 truncate">{req.title}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {req.status === "pending" ? "Pendente" :
                       req.status === "approved" ? "Aprovada" :
                       req.status === "purchased" ? "Comprada" :
                       req.status === "received" ? "Recebida" : "Reprovada"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>{req.requester}</span>
                    <span>{req.date} {req.time}</span>
                    <span className={`
                      font-medium
                      ${req.priority === "high" ? "text-red-600" :
                        req.priority === "medium" ? "text-amber-600" : "text-emerald-600"}
                    `}>
                      {req.priority === "high" ? "Alta" : req.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>

                  <div className="text-xl font-bold font-mono text-gray-900 mb-2">
                    {req.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>

                  <div className="text-sm text-gray-600 line-clamp-2">
                    {req.justification}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel direito – Detalhes */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-5xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="text-sm text-gray-500 mb-1">#{selectedReq.id}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedReq.title}</h1>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    {selectedReq.requester} · {selectedReq.dept}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    {selectedReq.date} às {selectedReq.time}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedReq.status === "pending" && (
                  <>
                    <button className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm">
                      Aprovar
                    </button>
                    <button className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition shadow-sm">
                      Reprovar
                    </button>
                  </>
                )}
                <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                  Editar
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Fluxo da Solicitação
              </h3>
              <div className="space-y-8">
                {selectedReq.timeline.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`
                          w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1
                          ${step.done ? "bg-green-500 border-green-500" :
                            step.current ? "bg-blue-500 border-blue-500" :
                            "bg-gray-200 border-gray-300"}
                        `}
                      />
                      {i < selectedReq.timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-3 ${step.done ? "bg-green-200" : "bg-gray-200"} rounded-full`} />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className={`font-semibold text-base ${step.current ? "text-blue-700" : step.done ? "text-green-700" : "text-gray-700"}`}>
                        {step.title}
                      </div>
                      {step.meta && <div className="text-sm text-gray-600 mt-1">{step.meta}</div>}
                      {step.date && <div className="text-sm text-gray-500 mt-1 font-mono">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações básicas */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo</div>
                <div className="text-base font-medium text-gray-900">{selectedReq.type}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prioridade</div>
                <div className={`text-base font-medium ${
                  selectedReq.priority === "high" ? "text-red-700" :
                  selectedReq.priority === "medium" ? "text-amber-700" : "text-emerald-700"
                }`}>
                  {selectedReq.priority === "high" ? "Alta" : selectedReq.priority === "medium" ? "Média" : "Baixa"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Valor Total</div>
                <div className="text-2xl font-bold font-mono text-blue-700">
                  {selectedReq.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              {selectedReq.eventLinked && (
                <>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evento Vinculado</div>
                    <div className="text-base font-medium text-gray-900">{selectedReq.eventLinked}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data do Evento</div>
                    <div className="text-base font-medium text-gray-900">{selectedReq.eventDate}</div>
                  </div>
                </>
              )}
            </div>

            {/* Itens solicitados */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Itens Solicitados ({selectedReq.items.length})
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[3fr_1fr_1fr_1fr] bg-gray-100 border-b border-gray-200">
                  {["Item", "Quantidade", "Valor unitário", "Total"].map((h) => (
                    <div key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </div>
                  ))}
                </div>
                {selectedReq.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr] border-b border-gray-200 last:border-0 px-6 py-4">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-sm font-mono">{item.qty}</div>
                    <div className="text-sm font-mono">
                      {item.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="text-sm font-mono font-bold text-blue-700">
                      {(item.unitPrice * parseFloat(item.qty)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </div>
                ))}
                <div className="px-6 py-5 bg-gray-100 flex justify-between text-base font-bold">
                  <span>Total estimado</span>
                  <span className="text-blue-700">
                    {selectedReq.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Justificativa */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Justificativa
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedReq.justification}
              </div>
            </div>

            {/* Anexos e Fornecedores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {selectedReq.attachments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                    Anexos ({selectedReq.attachments.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedReq.attachments.map((a) => (
                      <div key={a.name} className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <FileText size={24} className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">{a.name}</div>
                          <div className="text-xs text-gray-500">{a.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReq.suppliers.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                    Fornecedores Sugeridos
                  </h3>
                  <div className="space-y-4">
                    {selectedReq.suppliers.map((s) => (
                      <div key={s.name} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="font-semibold text-gray-900 mb-1">{s.name}</div>
                        <div className="text-sm text-gray-600">{s.contact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL NOVA SOLICITAÇÃO ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nova Solicitação de Compra</h2>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados da solicitação</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da solicitação *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Ex: Compra de insumos para evento X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de solicitação</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Matéria-prima">Matéria-prima</option>
                    <option value="Descartável">Descartável</option>
                    <option value="Equipamento">Equipamento</option>
                    <option value="Decoração">Decoração</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Itens */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Itens solicitados</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                  >
                    <Plus size={18} /> Adicionar item
                  </button>
                </div>

                <div className="space-y-5">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-5 rounded-xl border border-gray-200"
                    >
                      <div className="md:col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do item *</label>
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          placeholder="Ex: Farinha de trigo"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade *</label>
                        <input
                          type="text"
                          required
                          value={item.qty}
                          onChange={(e) => updateItem(index, "qty", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          placeholder="Ex: 20 kg"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor unitário estimado</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                          disabled={form.items.length === 1}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Justificativa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa / Observações *
                </label>
                <textarea
                  required
                  value={form.justification}
                  onChange={(e) => setForm({ ...form, justification: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                  placeholder="Explique o motivo da solicitação, urgência, contexto do uso dos itens..."
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                >
                  <Plus size={18} /> Criar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}