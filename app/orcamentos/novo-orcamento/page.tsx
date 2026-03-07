"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  User,
  Calendar,
  DollarSign,
  Package,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Edit,
  AlertCircle,
  Minus,
} from "lucide-react";

const STEPS = [
  { name: "Cliente & Data", desc: "Identificação e validade" },
  { name: "Evento & Detalhes", desc: "Tipo, convidados e observações" },
  { name: "Itens & Valores", desc: "Pacotes, serviços e extras" },
  { name: "Financeiro", desc: "Condições de pagamento" },
  { name: "Revisão", desc: "Confirmação final" },
];

const PACOTES = [
  { tag: "Básico", name: "Essencial", desc: "Mesa de frios + refrigerantes + bolo simples", price: 4800 },
  { tag: "Popular", name: "Premium Infantil", desc: "Mesa completa + salgados + doces + bebidas", price: 7200, popular: true },
  { tag: "Premium", name: "Luxo Completo", desc: "Buffet quente + garçons + decoração inclusa", price: 11400 },
];

const EXTRAS = [
  { name: "Decoração Temática", desc: "Painel, balões e mesa de doces", price: 1200 },
  { name: "Pula-pula Inflável", desc: "4h com monitor", price: 800 },
  { name: "Animador / DJ", desc: "Profissional até 5h", price: 1500 },
  { name: "Cabine de Fotos", desc: "3h com impressões", price: 950 },
  { name: "Bolo Personalizado", desc: "4 andares com tema", price: 680 },
];

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [extrasSelected, setExtrasSelected] = useState<boolean[]>([false, false, false, false, false]);
  const [guests, setGuests] = useState(80);
  const [clientSelected, setClientSelected] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [validUntil, setValidUntil] = useState("2025-07-15");

  const basePrice = PACOTES[selectedPackage].price;
  const extrasTotal = extrasSelected.reduce((sum, selected, i) => sum + (selected ? EXTRAS[i].price : 0), 0);
  const totalValue = basePrice + extrasTotal;

  const pct = [20, 40, 60, 80, 100][step - 1];

  // Componentes reutilizáveis
  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
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

  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">👤</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cliente & Data</h2>
            <p className="text-sm text-gray-600 mt-1">Identifique o cliente e defina a validade do orçamento</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Cliente
            </h3>
            <Field label="Buscar ou selecionar cliente" required>
              {!clientSelected ? (
                <div className="relative">
                  <div className="relative">
                    <Input
                      placeholder="Nome, telefone ou e-mail do cliente…"
                      value={searchClient}
                      onChange={(e) => setSearchClient(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>

                  {searchClient.length > 2 && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden divide-y divide-gray-100">
                      {[
                        { name: "Fernanda Oliveira", phone: "(11) 98765-4321", events: "3 orçamentos anteriores" },
                        { name: "Fernando Costa", phone: "(11) 99234-5678", events: "1 orçamento anterior" },
                      ].map((client) => (
                        <div
                          key={client.name}
                          onClick={() => {
                            setClientSelected(true);
                            setSearchClient(client.name);
                          }}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {client.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.phone} · {client.events}</div>
                          </div>
                        </div>
                      ))}
                      <div className="px-5 py-4 text-blue-600 font-medium text-sm flex items-center gap-2 hover:bg-blue-50 cursor-pointer transition-colors">
                        <Plus size={16} /> Cadastrar novo cliente
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-5 p-5 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {searchClient.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">{searchClient}</div>
                    <div className="text-sm text-gray-600 mt-1">(11) 98765-4321 · 3 orçamentos anteriores</div>
                  </div>
                  <button
                    onClick={() => {
                      setClientSelected(false);
                      setSearchClient("");
                    }}
                    className="px-5 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                  >
                    Trocar
                  </button>
                </div>
              )}
            </Field>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Data & Validade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Data do evento" required>
                <Input type="date" defaultValue="2025-06-28" />
              </Field>
              <Field label="Validade do orçamento" required>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-5 text-sm text-gray-600 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              Orçamento válido até {validUntil}
            </div>
          </div>
        </div>
      </div>
    ),

    2: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">🎉</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Evento & Detalhes</h2>
            <p className="text-sm text-gray-600 mt-1">Defina o tipo de evento e número de convidados</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Identificação do Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome do evento" required>
                <Input placeholder="Ex: Aniversário Sofia 6 anos" />
              </Field>
              <Field label="Tipo de evento" required>
                <Select defaultValue="">
                  <option value="">Selecione...</option>
                  <option>Aniversário Infantil</option>
                  <option>Aniversário Adulto</option>
                  <option>Casamento</option>
                  <option>Corporativo</option>
                  <option>Chá de Bebê</option>
                </Select>
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Quantidade de Convidados
            </h3>
            <Field label="Número de pessoas" required>
              <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setGuests(Math.max(10, guests - 10))}
                  className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Minus size={18} />
                </button>
                <Input
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 0)}
                  className="w-24 text-center border-0 focus:ring-0 text-lg font-bold"
                />
                <button
                  onClick={() => setGuests(guests + 10)}
                  className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">O valor dos pacotes será ajustado automaticamente</p>
            </Field>
          </div>

          <Field label="Observações / Necessidades especiais">
            <textarea
              placeholder="Ex: Tema Pequena Sereia, sem frutos do mar, mesa kids..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[120px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </Field>
        </div>
      </div>
    ),

    3: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">📋</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Itens & Valores</h2>
            <p className="text-sm text-gray-600 mt-1">Escolha o pacote base e adicione extras</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Pacote base — {guests} convidados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACOTES.map((pkg, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPackage(i)}
                  className={`
                    relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
                    ${selectedPackage === i 
                      ? "border-blue-500 bg-blue-50/50 shadow-md" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow hover:bg-blue-50/20"}
                  `}
                >
                  {selectedPackage === i && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      ✓
                    </div>
                  )}
                  <div
                    className={`
                      inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                      ${pkg.popular ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}
                    `}
                  >
                    {pkg.tag}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{pkg.desc}</p>
                  <div className="text-2xl font-bold text-blue-700 font-mono">
                    R$ {pkg.price.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">para {guests} pessoas</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Extras & Adicionais
            </h3>
            <div className="space-y-4">
              {EXTRAS.map((extra, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const newExtras = [...extrasSelected];
                    newExtras[i] = !newExtras[i];
                    setExtrasSelected(newExtras);
                  }}
                  className={`
                    flex items-center gap-5 p-5 rounded-xl border cursor-pointer transition-all duration-200
                    ${extrasSelected[i] 
                      ? "border-blue-500 bg-blue-50/40" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/10"}
                  `}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-md border-2 flex items-center justify-center text-white font-bold flex-shrink-0 transition-colors
                      ${extrasSelected[i] ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-transparent"}
                    `}
                  >
                    {extrasSelected[i] && "✓"}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{extra.name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{extra.desc}</div>
                  </div>

                  <div className="text-lg font-bold text-gray-700 font-mono whitespace-nowrap">
                    + R$ {extra.price.toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resumo financeiro</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                <span className="text-gray-700">Pacote selecionado ({guests} pax)</span>
                <span className="font-semibold font-mono">R$ {basePrice.toLocaleString("pt-BR")}</span>
              </div>

              {extrasSelected.map((selected, i) =>
                selected ? (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-200 text-sm">
                    <span className="text-gray-700">{EXTRAS[i].name}</span>
                    <span className="font-semibold font-mono text-emerald-700">
                      + R$ {EXTRAS[i].price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ) : null
              )}

              <div className="flex justify-between pt-4 text-base font-bold">
                <span>Valor total do orçamento</span>
                <span className="text-blue-700 font-mono">R$ {totalValue.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    4: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">💳</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Financeiro</h2>
            <p className="text-sm text-gray-600 mt-1">Defina condições de pagamento e descontos</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Valor & Desconto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Valor total">
                <Input
                  value={`R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  readOnly
                  className="font-mono font-bold text-gray-900"
                />
              </Field>
              <Field label="Desconto">
                <Input placeholder="R$ 0,00 ou 0%" className="font-mono" />
              </Field>
              <Field label="Valor final">
                <Input
                  value={`R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  readOnly
                  className="font-mono font-bold text-blue-700 bg-blue-50/50"
                />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Condições de Pagamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="% de entrada (sinal)">
                <Input defaultValue="50" type="number" className="font-mono" />
              </Field>
              <Field label="Vencimento do sinal">
                <Input type="date" defaultValue="2025-06-10" />
              </Field>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Vencimento do saldo">
                <Input type="date" defaultValue="2025-06-25" />
              </Field>
              <Field label="Formas de pagamento aceitas">
                <div className="flex flex-wrap gap-3 mt-2">
                  {["PIX", "Cartão (até 12x)", "Transferência"].map((method) => (
                    <div
                      key={method}
                      className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>
    ),

    5: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">✅</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Revisão Final</h2>
            <p className="text-sm text-gray-600 mt-1">Confira todos os dados antes de enviar o orçamento</p>
          </div>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-5">
          <CheckCircle2 className="text-green-600" size={32} />
          <div>
            <div className="font-semibold text-green-800 text-lg">Tudo pronto para envio!</div>
            <div className="text-sm text-green-700 mt-1">
              O orçamento será gerado em PDF e poderá ser enviado por e-mail ou WhatsApp.
            </div>
          </div>
        </div>

        {[
          {
            icon: "👤",
            title: "Cliente & Data",
            step: 1,
            fields: [
              ["Cliente", "Fernanda Oliveira"],
              ["Data do evento", "28/06/2025"],
              ["Validade", validUntil],
            ],
          },
          {
            icon: "🎉",
            title: "Evento & Detalhes",
            step: 2,
            fields: [
              ["Nome", "Aniversário Sofia 6 anos"],
              ["Tipo", "Aniversário Infantil"],
              ["Convidados", `${guests} pessoas`],
            ],
          },
          {
            icon: "📋",
            title: "Itens & Valores",
            step: 3,
            fields: [
              ["Pacote", PACOTES[selectedPackage].name],
              ["Valor base", `R$ ${basePrice.toLocaleString("pt-BR")}`],
              ["Extras", extrasSelected.filter(Boolean).length > 0 ? `${extrasSelected.filter(Boolean).length} itens` : "Nenhum"],
              ["Total", `R$ ${totalValue.toLocaleString("pt-BR")}`],
            ],
          },
          {
            icon: "💳",
            title: "Financeiro",
            step: 4,
            fields: [
              ["Valor total", `R$ ${totalValue.toLocaleString("pt-BR")}`],
              ["Sinal sugerido", "50% — R$ " + (totalValue / 2).toLocaleString("pt-BR")],
              ["Venc. sinal", "10/06/2025"],
              ["Venc. saldo", "25/06/2025"],
            ],
          },
        ].map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="font-medium text-gray-700">
                {section.icon} {section.title}
              </div>
              <button
                onClick={() => setStep(section.step)}
                className="px-4 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition flex items-center gap-1.5"
              >
                <Edit size={14} /> Editar
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {label}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <AppShell>
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-8 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/orcamentos" className="text-gray-500 hover:text-gray-700 font-medium">
            Orçamentos
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Novo Orçamento</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
            <Save size={20} />
          </button>
          <Link
            href="/orcamentos"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center justify-center"
          >
            <X size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Stepper lateral */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Etapas</div>

          {STEPS.map((s, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isActive = n === step;

            return (
              <div key={i}>
                <button
                  onClick={() => setStep(n)}
                  className={`
                    w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left
                    ${isActive 
                      ? "bg-blue-50 border border-blue-200 shadow-sm" 
                      : "hover:bg-gray-50"}
                  `}
                >
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm
                      ${isDone 
                        ? "bg-green-600 text-white" 
                        : isActive 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-600 border border-gray-300"}
                    `}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${isActive ? "text-blue-700" : "text-gray-700"} truncate`}>
                      {s.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.desc}</div>
                  </div>
                </button>

                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 ml-[18px] bg-${isDone ? "green-600" : "gray-200"} rounded-full my-1`} />
                )}
              </div>
            );
          })}

          <div className="mt-auto bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Progresso</div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-700">{pct}% concluído</span>
              <span className="text-gray-500">Etapa {step} de 5</span>
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            {stepContent[step]}
          </div>
        </main>
      </div>

      {/* Footer fixo */}
      <footer className="h-16 bg-white border-t border-gray-200 flex items-center px-10 gap-6 flex-shrink-0">
        <span className="text-sm text-gray-600">
          <strong className="text-gray-900 font-semibold">Etapa {step}</strong> de 5
        </span>

        <div className="flex-1" />

        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`
            px-7 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-700
            transition-colors ${step === 1 ? "invisible" : "hover:bg-gray-50"}
          `}
        >
          ← Voltar
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep(Math.min(5, step + 1))}
            className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            Continuar <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => {
              alert("Orçamento criado com sucesso! Redirecionando...");
              router.push("/orcamentos");
            }}
            className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Salvar Orçamento
          </button>
        )}
      </footer>
    </AppShell>
  );
}