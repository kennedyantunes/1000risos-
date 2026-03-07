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
  MapPin,
  Utensils,
  DollarSign,
  CheckCircle2,
  Plus,
  Minus,
  Search,
  Trash2,
  Edit,
} from "lucide-react";

const STEPS = [
  { name: "Cliente & Data", desc: "Identificação e agendamento" },
  { name: "Evento & Local", desc: "Tipo, local e detalhes" },
  { name: "Pacotes & Serviços", desc: "Cardápio e extras" },
  { name: "Financeiro", desc: "Pagamento e sinal" },
  { name: "Revisão", desc: "Confirmar e salvar" },
];

const PKG = [
  { tag: "Básico", name: "Essencial", desc: "Mesa de frios, refrigerantes, bolo e equipe mínima", price: 4800 },
  { tag: "✦ Popular", name: "Premium Infantil", desc: "Mesa frios + salgados + doces + bebidas + equipe completa", price: 7200, pop: true },
  { tag: "◆ Premium", name: "Luxo Completo", desc: "Tudo do Premium + buffet quente + garçons + decoração", price: 11400 },
];

const EXTRAS = [
  { icon: "🎈", name: "Decoração Temática", desc: "Balões, painel e mesa de doces temática", price: 1200 },
  { icon: "🏠", name: "Pula-pula inflável", desc: "4h de uso com monitor", price: 800 },
  { icon: "🎤", name: "Animador / DJ", desc: "Profissional por até 5h", price: 1500 },
  { icon: "📸", name: "Cabine de fotos", desc: "3h de uso, fotos impressas na hora", price: 950 },
  { icon: "🎂", name: "Bolo personalizado", desc: "Bolo 4 andares com tema", price: 680 },
];

export default function NovoEventoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selPkg, setSelPkg] = useState(1);
  const [extras, setExtras] = useState<boolean[]>([true, true, false, false, false]);
  const [guests, setGuests] = useState(120);
  const [clientSelected, setClientSelected] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [ddOpen, setDdOpen] = useState(false);
  const [payOpts, setPayOpts] = useState([true, true, false]);

  const pct = [20, 40, 60, 80, 100][step - 1];

  const basePrice = PKG[selPkg].price;
  const extrasTotal = extras.reduce((sum, on, i) => sum + (on ? EXTRAS[i].price : 0), 0);
  const total = basePrice + extrasTotal;

  // ─── Campos reutilizáveis ────────────────────────────────────────────────
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

  // ─── Conteúdo por etapa ──────────────────────────────────────────────────
  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">👤</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cliente & Data</h2>
            <p className="text-sm text-gray-600 mt-1">Identifique o cliente e defina a data do evento</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Cliente
            </h3>
            <Field label="Buscar cliente" required>
              {!clientSelected ? (
                <div className="relative">
                  <div className="relative">
                    <Input
                      placeholder="Nome ou telefone do cliente…"
                      value={searchVal}
                      onChange={(e) => {
                        setSearchVal(e.target.value);
                        setDdOpen(e.target.value.length > 0);
                      }}
                      onFocus={() => searchVal && setDdOpen(true)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>

                  {ddOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden divide-y divide-gray-100">
                      {[
                        ["Fernanda Oliveira", "(11) 98765-4321", "3 eventos", "FO"],
                        ["Fernando Costa", "(11) 99234-5678", "1 evento", "FC"],
                      ].map(([name, phone, events, initials]) => (
                        <div
                          key={name as string}
                          onClick={() => {
                            setClientSelected(true);
                            setDdOpen(false);
                            setSearchVal(name as string);
                          }}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {phone} · {events}
                            </div>
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
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0">
                    FO
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">Fernanda Oliveira</div>
                    <div className="text-sm text-gray-600 mt-1">(11) 98765-4321 · 3 eventos anteriores</div>
                  </div>
                  <button
                    onClick={() => {
                      setClientSelected(false);
                      setSearchVal("");
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
              Data & Horário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Data do evento" required>
                <Input type="date" defaultValue="2025-06-21" />
              </Field>
              <Field label="Início" required>
                <Input type="time" defaultValue="14:00" />
              </Field>
              <Field label="Término" required>
                <Input type="time" defaultValue="18:00" />
              </Field>
            </div>
            <div className="mt-5 inline-flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-800">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 shadow-sm" />
              Data disponível — nenhum conflito de equipamentos detectado
            </div>
          </div>
        </div>
      </div>
    ),

    2: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">🎪</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Evento & Local</h2>
            <p className="text-sm text-gray-600 mt-1">Defina o tipo de evento, local e número de convidados</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Identificação do Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome do evento" required>
                <Input defaultValue="Aniversário Sofia — 6 anos" />
              </Field>
              <Field label="Tipo de evento" required>
                <Select defaultValue="Aniversário Infantil">
                  <option>Aniversário Infantil</option>
                  <option>Aniversário Adulto</option>
                  <option>Casamento</option>
                  <option>Corporativo</option>
                  <option>Formatura</option>
                  <option>Chá de Bebê / Revelação</option>
                </Select>
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Local & Estrutura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Salão / Local" required>
                <Select defaultValue="Salão Principal">
                  <option>Salão Principal</option>
                  <option>Salão Azul</option>
                  <option>Salão B</option>
                  <option>Espaço Garden</option>
                </Select>
              </Field>
              <Field label="Endereço (se externo)">
                <Input placeholder="Rua, número, bairro…" />
              </Field>
            </div>

            <Field label="Nº de convidados" required>
              <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 10))}
                  className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Minus size={18} />
                </button>
                <Input
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 0)}
                  className="w-20 text-center border-0 focus:ring-0"
                />
                <button
                  onClick={() => setGuests(guests + 10)}
                  className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">O número de convidados afeta o cálculo dos pacotes</p>
            </Field>

            <div className="mt-6">
              <Field label="Tema / Observações">
                <textarea
                  defaultValue="Tema: Pequena Sereia. Sem frutos do mar."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[100px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    ),

    3: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">🍽️</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pacotes & Serviços</h2>
            <p className="text-sm text-gray-600 mt-1">Selecione o pacote base e adicione itens avulsos</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Pacote base — {guests} convidados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PKG.map((pkg, i) => (
                <div
                  key={i}
                  onClick={() => setSelPkg(i)}
                  className={`
                    relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
                    ${selPkg === i 
                      ? "border-blue-500 bg-blue-50/40 shadow-md" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow hover:bg-blue-50/20"}
                  `}
                >
                  {selPkg === i && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      ✓
                    </div>
                  )}
                  <div
                    className={`
                      inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                      ${pkg.pop ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}
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
              {EXTRAS.map((ex, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const newExtras = [...extras];
                    newExtras[i] = !newExtras[i];
                    setExtras(newExtras);
                  }}
                  className={`
                    flex items-center gap-5 p-5 rounded-xl border cursor-pointer transition-all duration-200
                    ${extras[i] 
                      ? "border-blue-500 bg-blue-50/40" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/10"}
                  `}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-md border-2 flex items-center justify-center text-white font-bold flex-shrink-0 transition-colors
                      ${extras[i] ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-transparent"}
                    `}
                  >
                    {extras[i] && "✓"}
                  </div>

                  <div className="text-3xl flex-shrink-0">{ex.icon}</div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{ex.name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{ex.desc}</div>
                  </div>

                  <div className="text-lg font-bold text-gray-700 font-mono whitespace-nowrap">
                    + R$ {ex.price.toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resumo do pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                <span className="text-gray-700">Pacote selecionado ({guests} pax)</span>
                <span className="font-semibold font-mono">R$ {basePrice.toLocaleString("pt-BR")}</span>
              </div>

              {extras.map((on, i) =>
                on ? (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-200 text-sm">
                    <span className="text-gray-700">{EXTRAS[i].name}</span>
                    <span className="font-semibold font-mono text-emerald-700">
                      + R$ {EXTRAS[i].price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ) : null
              )}

              <div className="flex justify-between pt-4 text-base font-bold">
                <span>Total do evento</span>
                <span className="text-blue-700 font-mono">R$ {total.toLocaleString("pt-BR")}</span>
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
            <p className="text-sm text-gray-600 mt-1">Configure pagamento, sinal e condições comerciais</p>
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
                  value={`R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  readOnly
                  className="font-mono font-bold text-gray-900"
                />
              </Field>
              <Field label="Desconto">
                <Input placeholder="R$ 0,00 ou 0%" className="font-mono" />
              </Field>
              <Field label="Valor final">
                <Input
                  value={`R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  readOnly
                  className="font-mono font-bold text-blue-700 bg-blue-50/50"
                />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Sinal (entrada)
            </h3>
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-amber-800 text-lg">
                    Sinal de 50% — R$ {(total / 2).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-amber-700 mt-1">Necessário para confirmar como Pré-reservado</div>
                </div>
                <div className="text-2xl font-bold text-amber-800 font-mono">
                  R$ {(total / 2 / 1000).toFixed(1)}k
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="% do sinal">
                <Input defaultValue="50" type="number" className="font-mono" />
              </Field>
              <Field label="Vencimento do sinal">
                <Input type="date" defaultValue="2025-05-28" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Vencimento do saldo">
                <Input type="date" defaultValue="2025-06-14" />
              </Field>
              <Field label="Validade do orçamento">
                <Input type="date" defaultValue="2025-05-21" />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Formas de pagamento aceitas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "💸", name: "PIX", desc: "Aprovação imediata" },
                { icon: "💳", name: "Cartão de Crédito", desc: "Até 12x" },
                { icon: "🏦", name: "Transferência", desc: "TED/DOC" },
              ].map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const newOpts = [...payOpts];
                    newOpts[i] = !newOpts[i];
                    setPayOpts(newOpts);
                  }}
                  className={`
                    p-6 border-2 rounded-xl text-center cursor-pointer transition-all duration-200
                    ${payOpts[i] 
                      ? "border-blue-500 bg-blue-50/40 shadow-md" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow hover:bg-blue-50/20"}
                  `}
                >
                  <div className="text-4xl mb-4">{opt.icon}</div>
                  <div className="font-semibold text-gray-900">{opt.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </div>
              ))}
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
            <p className="text-sm text-gray-600 mt-1">Confirme os dados antes de salvar o evento</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="text-green-600" size={32} />
          <div>
            <div className="font-semibold text-green-800 text-lg">Tudo pronto para salvar!</div>
            <div className="text-sm text-green-700 mt-1">
              O evento será criado com status Pré-reservado e o contrato será gerado automaticamente.
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
              ["Contato", "(11) 98765-4321"],
              ["Data", "21 de junho de 2025"],
              ["Horário", "15:00 – 19:00"],
            ],
          },
          {
            icon: "📍",
            title: "Evento & Local",
            step: 2,
            fields: [
              ["Nome", "Aniversário Sofia — 6 anos"],
              ["Tipo", "Aniversário Infantil"],
              ["Local", "Salão Principal"],
              ["Convidados", `${guests} pessoas`],
            ],
          },
          {
            icon: "🍽️",
            title: "Pacotes & Serviços",
            step: 3,
            fields: [
              ["Pacote", `${PKG[selPkg].name} — R$ ${PKG[selPkg].price.toLocaleString("pt-BR")}`],
              [
                "Extras",
                extras
                  .map((on, i) => (on ? EXTRAS[i].name : ""))
                  .filter(Boolean)
                  .join(", ") || "Nenhum",
              ],
            ],
          },
          {
            icon: "💳",
            title: "Financeiro",
            step: 4,
            fields: [
              ["Total", `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
              ["Sinal (50%)", `R$ ${(total / 2).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
              ["Venc. sinal", "28/05/2025"],
              ["Venc. saldo", "14/06/2025"],
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
          <Link href="/agenda" className="text-gray-500 hover:text-gray-700 font-medium">
            Agenda
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Novo Evento</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
            <Save size={20} />
          </button>
          <Link
            href="/agenda"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center justify-center"
          >
            <X size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Step Rail */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">Etapas</div>

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
              alert("Evento criado com sucesso! Redirecionando...");
              router.push("/agenda");
            }}
            className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Salvar Evento
          </button>
        )}
      </footer>
    </AppShell>
  );
}