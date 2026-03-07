"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { mockQuotes, Quote } from "@/lib/mockData";
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  Maximize2,
  RotateCw,
  Download,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  pendente:  { label: "Pendente",  bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500", border: "border-amber-200" },
  aprovado:  { label: "Aprovado",  bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500",  border: "border-green-200" },
  recusado:  { label: "Recusado",  bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-500",    border: "border-red-200" },
  expirado:  { label: "Expirado",  bg: "bg-slate-100",  text: "text-slate-700",  dot: "bg-slate-500",  border: "border-slate-200" },
  convertido:{ label: "Convertido",bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500",   border: "border-blue-200" },
};

const GROUP_LABELS = [
  { key: "pendente",   label: "⏳ Aguardando resposta" },
  { key: "aprovado",   label: "✅ Aprovados" },
  { key: "convertido", label: "🔄 Convertidos em evento" },
];

export default function OrcamentosPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<"todos" | string>("todos");
  const [detailTab, setDetailTab] = useState<"resumo" | "itens" | "timeline">("resumo");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [isDetailMinimized, setIsDetailMinimized] = useState(false);

  const filteredQuotes = tab === "todos" ? mockQuotes : mockQuotes.filter(q => q.status === tab);
  const currentQuote = selectedIndex !== null ? mockQuotes[selectedIndex] : null;
  const status = currentQuote ? STATUS_CFG[currentQuote.status] : STATUS_CFG["pendente"];

  const kpis = [
    { icon: Clock,        count: mockQuotes.filter(q => q.status === "pendente").length,   label: "Pendentes",   color: "text-amber-700",  bg: "bg-amber-100" },
    { icon: CheckCircle2, count: mockQuotes.filter(q => q.status === "aprovado").length,   label: "Aprovados",   color: "text-green-700",  bg: "bg-green-100" },
    { icon: RotateCw,     count: mockQuotes.filter(q => q.status === "convertido").length, label: "Convertidos", color: "text-blue-700",   bg: "bg-blue-100" },
    { icon: XCircle,      count: mockQuotes.filter(q => q.status === "recusado").length,   label: "Recusados",   color: "text-red-700",    bg: "bg-red-100" },
    { icon: DollarSign,   count: "R$ 142k", label: "Em aberto (mês)", color: "text-gray-700", bg: "bg-gray-100" },
  ];

  const showDetail = selectedIndex !== null && !isDetailMinimized;

  return (
    <AppShell>
      {/* Topbar */}
     <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Orçamentos</h1>

  <div className="ml-auto flex items-center gap-3">
    {/* Busca */}
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden max-w-xs">
      <div className="px-3 text-gray-400">
        <Search size={18} />
      </div>
      <input
        placeholder="Buscar por cliente, evento…"
        className="flex-1 py-2 px-2 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>

    {/* Filtros */}
    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <Filter size={16} /> Filtros
    </button>

    {/* Opção 1: usando Link (recomendado) */}
    <Link
      href="/orcamentos/novo-orcamento" // ← AJUSTE AQUI se o caminho for diferente
      className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
    >
      <Plus size={16} /> Novo Orçamento
    </Link>

    {/* Opção 2: usando useRouter (alternativa confiável) */}
    {/* 
    <button
      onClick={() => router.push("/novo-orcamento")}
      className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
    >
      <Plus size={16} /> Novo Orçamento
    </button>
    */}
  </div>
</header>

      {/* KPI Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-8 shadow-sm">
        {kpis.map((kpi, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm ${kpi.bg}`}>
              <kpi.icon size={20} className={kpi.color.replace("text", "text")} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.count}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { key: "todos", label: "Todos", count: mockQuotes.length },
          { key: "pendente", label: "Pendentes", count: mockQuotes.filter(q => q.status === "pendente").length },
          { key: "aprovado", label: "Aprovados", count: mockQuotes.filter(q => q.status === "aprovado").length },
          { key: "convertido", label: "Convertidos", count: mockQuotes.filter(q => q.status === "convertido").length },
          { key: "recusado", label: "Recusados", count: mockQuotes.filter(q => q.status === "recusado").length },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === item.key ? "bg-white shadow-sm border border-gray-200 text-blue-700" : "text-gray-600 hover:bg-gray-100"}
            `}
          >
            {item.label}
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Lista de orçamentos – expande quando detalhe está minimizado ou não selecionado */}
        <aside 
          className={`
            border-r border-gray-200 bg-gray-50/40 overflow-y-auto transition-all duration-300 ease-in-out
            ${showDetail ? "w-96" : "flex-1"}
          `}
        >
          {GROUP_LABELS.map(({ key, label }) => {
            const group = filteredQuotes.filter(q => q.status === key);
            if (!group.length) return null;

            return (
              <div key={key}>
                <div className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100/80 sticky top-0 z-10 border-b border-gray-200">
                  {label}
                </div>

                {group.map((quote) => {
                  const globalIndex = mockQuotes.indexOf(quote);
                  const isSelected = globalIndex === selectedIndex;
                  const st = STATUS_CFG[quote.status];
                  const isExpiring = quote.status === "pendente" && quote.expiresAt;

                  return (
                    <div
                      key={quote.id}
                      onClick={() => {
                        setSelectedIndex(globalIndex);
                        setIsDetailMinimized(false);
                      }}
                      className={`
                        px-6 py-5 border-b border-gray-200 cursor-pointer transition-all duration-150
                        ${isSelected && showDetail ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-white hover:shadow-sm"}
                      `}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs font-mono text-gray-500 mb-1">#{quote.id}</div>
                          <h4 className="font-semibold text-gray-900">{quote.name}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600 mb-3">
                        <span>👤 {quote.client}</span>
                        <span>📅 {quote.date}</span>
                        <span>👥 {quote.guests} pax</span>
                      </div>

                      <div className="text-xl font-bold text-gray-900 font-mono">
                        R$ {quote.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>

                      {isExpiring && (
                        <div className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Expira em {quote.expiresAt}
                        </div>
                      )}

                      {quote.status === "convertido" && (
                        <div className="mt-2 text-xs font-medium text-blue-700">→ Evento criado</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </aside>

        {/* Painel de detalhes – só visível quando selecionado e não minimizado */}
        {showDetail && currentQuote && (
          <main className="flex-1 overflow-y-auto bg-white transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight truncate">
                  {currentQuote.name}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDetailMinimized(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                  title="Minimizar painel"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setStatusModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Clock size={16} /> Status
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <Download size={16} /> PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <Send size={16} /> Email
                </button>

                {currentQuote.status === "pendente" && (
                  <button
                    onClick={() => setConvertModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    <CheckCircle2 size={16} /> Aprovar
                  </button>
                )}

                {currentQuote.status === "aprovado" && (
                  <button
                    onClick={() => setConvertModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm"
                  >
                    <CheckCircle2 size={16} /> Converter
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo do detalhe */}
            <div className="p-8 overflow-y-auto h-[calc(100vh-14rem)]">
              {/* Banner de status */}
              {currentQuote.status === "pendente" && (
                <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl mb-8">
                  <AlertCircle className="text-amber-600" size={28} />
                  <div className="flex-1">
                    <div className="font-semibold text-amber-800 text-lg">Aguardando aprovação do cliente</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Enviado em {currentQuote.createdAt}. Expira em {currentQuote.expiresAt || "—"}.
                    </div>
                  </div>
                  <button className="px-5 py-2.5 text-sm font-medium text-amber-700 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition">
                    Registrar contato
                  </button>
                </div>
              )}

              {currentQuote.status === "aprovado" && (
                <div className="flex items-center gap-5 p-6 bg-green-50 border border-green-200 rounded-xl mb-8">
                  <CheckCircle2 className="text-green-600" size={32} />
                  <div className="flex-1">
                    <div className="font-bold text-green-800 text-xl">Orçamento aprovado!</div>
                    <div className="text-sm text-green-700 mt-2">
                      Converta em evento para adicionar à agenda e reservar equipamentos.
                    </div>
                  </div>
                  <button
                    onClick={() => setConvertModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm"
                  >
                    Converter em Evento →
                  </button>
                </div>
              )}

              {currentQuote.status === "convertido" && (
                <div className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl mb-8">
                  <RotateCw className="text-blue-600" size={28} />
                  <div>
                    <div className="font-semibold text-blue-800 text-lg">Convertido em evento</div>
                    <div className="text-sm text-blue-700 mt-1">Evento criado em {currentQuote.createdAt}.</div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8 -mx-2">
                {["resumo", "itens", "timeline"].map(t => (
                  <button
                    key={t}
                    onClick={() => setDetailTab(t as any)}
                    className={`
                      px-6 py-3 text-sm font-medium transition-all flex-1 text-center
                      ${detailTab === t ? "border-b-2 border-blue-600 text-blue-700 font-semibold" : "text-gray-600 hover:text-gray-800"}
                    `}
                  >
                    {t === "resumo" ? "Resumo" : t === "itens" ? "Itens & Valores" : "Histórico"}
                  </button>
                ))}
              </div>

              {/* Conteúdo das tabs */}
              {detailTab === "resumo" && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                      Dados do evento
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      {[
                        ["Tipo", "Aniversário Infantil"],
                        ["Data", currentQuote.date],
                        ["Convidados", `${currentQuote.guests} pessoas`],
                        ["Local", "Salão Principal"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            {label}
                          </div>
                          <div className="text-base font-medium text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                      Resumo financeiro
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      {currentQuote.items.map(item => (
                        <div key={item.name} className="flex justify-between py-3 border-b border-gray-200 last:border-0 text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium font-mono text-gray-900">
                            R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-5 text-base font-bold">
                        <span>Total</span>
                        <span className="text-blue-700 font-mono">
                          R$ {currentQuote.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentQuote.notes && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                        Observações
                      </h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
                        {currentQuote.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "itens" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item / Descrição</th>
                        <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qtd</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentQuote.items.map(item => (
                        <tr key={item.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 text-center text-gray-600 font-mono">1</td>
                          <td className="px-6 py-4 text-right font-medium font-mono text-gray-900">
                            R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === "timeline" && (
                <div className="space-y-8">
                  {[
                    { title: "Orçamento criado", sub: "Por Mariana Rocha", date: `${currentQuote.createdAt} às 14:32`, done: true },
                    { title: "PDF gerado e enviado", sub: "Enviado para email do cliente", date: `${currentQuote.createdAt} às 14:35`, done: true },
                    { title: "Aguardando resposta", sub: `Prazo: ${currentQuote.expiresAt || "—"}`, date: "Em aberto", pending: true },
                  ].map((event, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`
                            w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1.5
                            ${event.done ? "bg-green-500 border-green-500" : event.pending ? "bg-amber-500 border-amber-500" : "bg-gray-200 border-gray-300"}
                          `}
                        />
                        {i < 2 && <div className={`w-0.5 flex-1 mt-2 ${event.done ? "bg-green-200" : "bg-gray-200"} rounded-full`} />}
                      </div>
                      <div>
                        <div className={`font-semibold ${event.pending ? "text-amber-700" : event.done ? "text-green-700" : "text-gray-700"}`}>
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{event.sub}</div>
                        <div className="text-xs text-gray-500 mt-1 font-mono">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* Botão flutuante para reabrir detalhes */}
        {selectedIndex !== null && (
          <button
            onClick={() => setIsDetailMinimized(false)}
            className="fixed bottom-6 right-6 z-20 p-4 rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
            title="Abrir detalhes do orçamento selecionado"
          >
            <Maximize2 size={24} />
          </button>
        )}
      </div>

      {/* Modal Alterar Status */}
      {statusModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setStatusModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Alterar Status do Orçamento</h3>
              <button onClick={() => setStatusModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Novo status</label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {["Pendente", "Aprovado", "Recusado", "Expirado"].map(s => (
                  <button
                    key={s}
                    className="py-3 px-5 border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo / Observação</label>
              <textarea
                placeholder="Digite o motivo da alteração..."
                className="w-full h-28 px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
              />
            </div>

            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                Salvar alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Converter */}
      {convertModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setConvertModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Converter em Evento</h3>
              <button onClick={() => setConvertModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="p-5 bg-green-50 border border-green-200 rounded-xl mb-6 text-sm text-green-800">
                🎉 O evento será criado na agenda com status <strong>Pré-reservado</strong> e os dados do orçamento serão copiados automaticamente.
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status inicial</label>
                  <div className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                    🔵 Pré-reservado (sinal pendente)
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                    <option>Mariana Rocha</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setConvertModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setConvertModalOpen(false);
                  alert("✅ Evento criado com sucesso!");
                }}
                className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                Confirmar conversão
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}