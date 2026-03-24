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
  Star,
  Upload,
  Phone,
  Mail,
  Download,
  Share2,
  Clock,
  TrendingUp,
  Gift,
  Coffee,
  Music,
  Camera,
  Cake,
  Home,
  Zap,
} from "lucide-react";

const STEPS = [
  { name: "Cliente & Data", desc: "Identificação e validade" },
  { name: "Evento & Detalhes", desc: "Tipo, convidados e observações" },
  { name: "Itens & Valores", desc: "Pacotes RISO e extras" },
  { name: "Financeiro", desc: "Condições de pagamento" },
  { name: "Revisão", desc: "Confirmação final" },
];

// Pacotes RISO completos
const PACOTES = [
  { 
    tag: "Rosa 🌸", 
    name: "Riso-Rosa", 
    desc: "Serve 50–60 pessoas · Ideal para festas menores e intimistas",
    items: [
      "1000 salgadinhos",
      "150 mini churros",
      "100 mini cachorros-quentes",
      "100 mini pizzas",
      "100 mini pães de queijo",
      "150 mini pastéis",
      "6 kg de batata frita no cone",
      "Pipoca à vontade (saindo da cozinha)",
      "1 fritadeira (com pessoa fritando os salgados)",
      "1 copeira",
      "3 garçons",
      "1 cama elástica com monitor"
    ],
    price: 2900,
    capacity: "50-60",
    capacityMin: 50,
    capacityMax: 60,
    color: "rose",
    emoji: "🌸",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    badgeColor: "bg-rose-100 text-rose-800"
  },
  { 
    tag: "Amarelo 🟡", 
    name: "Riso-Amarelo", 
    desc: "Serve 80–100 pessoas · Pacote completo com fritadeira e cama elástica",
    items: [
      "1300 salgadinhos",
      "150 mini churros",
      "100 mini cachorros-quentes",
      "100 mini pizzas",
      "100 mini pães de queijo",
      "200 mini pastéis",
      "8 kg de batata frita no cone",
      "Pipoca à vontade (saindo da cozinha)",
      "1 fritadeira (com pessoa fritando os salgados)",
      "1 copeira",
      "3 garçons",
      "1 cama elástica com monitor"
    ],
    price: 3900,
    capacity: "80-100",
    capacityMin: 80,
    capacityMax: 100,
    color: "amber",
    emoji: "🟡",
    popular: true,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-800"
  },
  { 
    tag: "Vermelho 🔴", 
    name: "Riso-Vermelho", 
    desc: "Serve 50–70 pessoas · Inclui doces, bolo e macarrão empratado",
    items: [
      "1000 salgadinhos",
      "150 mini churros",
      "100 mini cachorros-quentes",
      "100 mini pizzas",
      "100 mini pães de queijo",
      "150 mini pastéis",
      "6 kg de batata frita no cone",
      "300 doces tradicionais",
      "5 kg de bolo (copa)",
      "Empratado de macarrão ao molho bolonhesa",
      "Pipoca à vontade (saindo da cozinha)",
      "1 fritadeira (com pessoa fritando os salgados)",
      "1 copeira",
      "3 garçons",
      "1 cama elástica com monitor",
      "Bebidas não alcoólicas à vontade"
    ],
    price: 3800,
    capacity: "50-70",
    capacityMin: 50,
    capacityMax: 70,
    color: "red",
    emoji: "🔴",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-800"
  },
  { 
    tag: "Azul 🔵", 
    name: "Riso-Azul", 
    desc: "Serve 80–100 pessoas · Pacote premium com doces, bolo, hambúrguer e bebidas",
    items: [
      "1300 salgadinhos",
      "150 mini churros",
      "100 mini cachorros-quentes",
      "100 mini hambúrgueres (saindo da cozinha)",
      "100 mini pizzas",
      "100 mini pães de queijo",
      "200 mini pastéis",
      "8 kg de batata frita no cone",
      "400 doces tradicionais",
      "8 kg de bolo (copa)",
      "Empratado de macarrão ao molho bolonhesa",
      "Pipoca à vontade (saindo da cozinha)",
      "1 fritadeira (com pessoa fritando os salgados)",
      "1 copeira",
      "4 garçons",
      "1 cama elástica com monitor",
      "Bebidas não alcoólicas à vontade"
    ],
    price: 5000,
    capacity: "80-100",
    capacityMin: 80,
    capacityMax: 100,
    color: "blue",
    emoji: "🔵",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  { 
    tag: "Verde 🟢", 
    name: "Riso-Verde", 
    desc: "Serve 150 pessoas · O maior pacote para grandes eventos",
    items: [
      "1800 salgadinhos",
      "200 mini churros",
      "200 mini cachorros-quentes",
      "150 mini hambúrgueres (saindo da cozinha)",
      "150 mini pizzas",
      "200 mini pães de queijo",
      "250 mini pastéis",
      "10 kg de batata frita no cone",
      "Pipoca à vontade (saindo da cozinha)",
      "1 fritadeira (com pessoa fritando os salgados)",
      "1 copeira",
      "4 garçons",
      "1 cama elástica com monitor"
    ],
    price: 4900,
    capacity: "150",
    capacityMin: 150,
    capacityMax: 200,
    color: "green",
    emoji: "🟢",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    badgeColor: "bg-green-100 text-green-800"
  },
];

const EXTRAS = [
  { icon: "🎈", name: "Decoração Temática", desc: "Painel, balões e mesa de doces completa", price: 1200 },
  { icon: "🏠", name: "Pula-pula Inflável", desc: "4h com monitor especializado", price: 800 },
  { icon: "🎤", name: "Animador / DJ", desc: "Profissional até 5h com equipamento", price: 1500 },
  { icon: "📸", name: "Cabine de Fotos", desc: "3h com impressões na hora e adereços", price: 950 },
  { icon: "🎂", name: "Bolo Personalizado", desc: "4 andares com tema e topo personalizado", price: 680 },
  { icon: "🍔", name: "Mini Hambúrguer Extra", desc: "50 unidades com queijo e molho especial", price: 450 },
  { icon: "🍫", name: "Mesa de Doces Extra", desc: "+200 doces finos e tradicionais", price: 600 },
  { icon: "🥤", name: "Bebidas Extras", desc: "Refrigerante, suco e água por mais 2h", price: 800 },
  { icon: "🎪", name: "Fraldário", desc: "Espaço kids com trocador e monitora", price: 500 },
  { icon: "✨", name: "Efeitos Especiais", desc: "Máquina de fumaça e luzes coloridas", price: 700 },
];

// Sugestões rápidas para observações
const QUICK_NOTES = [
  "Tema infantil (princesa/herói)",
  "Sem glúten/lactose",
  "Área externa/chuvoso",
  "Mesa kids separada",
  "Vegetariano/vegano",
  "Alergias alimentares",
  "Decoração específica",
  "Horário estendido",
];

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(1); // Amarelo como padrão
  const [extrasSelected, setExtrasSelected] = useState<boolean[]>(new Array(EXTRAS.length).fill(false));
  const [guests, setGuests] = useState(80);
  const [clientSelected, setClientSelected] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // +30 dias
    return date.toISOString().split('T')[0];
  });
  const [expandedPkg, setExpandedPkg] = useState<number | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [observations, setObservations] = useState("");
  const [eventDate, setEventDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 60); // +60 dias
    return date.toISOString().split('T')[0];
  });
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percent"); // percent ou fixed
  const [paymentMethods, setPaymentMethods] = useState(["PIX", "Cartão", "Transferência"]);
  const [signalPercent, setSignalPercent] = useState(50);
  const [signalDueDate, setSignalDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  });
  const [balanceDueDate, setBalanceDueDate] = useState(() => {
    const date = new Date(eventDate);
    date.setDate(date.getDate() - 10);
    return date.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState("rascunho");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [previousEvents, setPreviousEvents] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Cliente mockado para demonstração
  const clientInfo = {
    name: "Fernanda Oliveira",
    phone: "(11) 98765-4321",
    email: "fernanda.oliveira@email.com",
    previousEvents: 3,
    lastEvent: "15/03/2025",
    totalSpent: 12500
  };

  const selectedPkg = PACOTES[selectedPackage];
  const basePrice = selectedPkg.price;
  
  // Calcular desconto
  let discountValue = 0;
  if (discount && !isNaN(parseFloat(discount))) {
    if (discountType === "percent") {
      discountValue = totalValue * (parseFloat(discount) / 100);
    } else {
      discountValue = parseFloat(discount);
    }
  }
  
  const extrasTotal = extrasSelected.reduce((sum, selected, i) => sum + (selected ? EXTRAS[i].price : 0), 0);
  const totalValue = basePrice + extrasTotal;
  const finalValue = totalValue - discountValue;
  
  const signalValue = finalValue * (signalPercent / 100);
  const balanceValue = finalValue - signalValue;

  const pct = [20, 40, 60, 80, 100][step - 1];

  // Dias restantes para validade
  const today = new Date();
  const validityDate = new Date(validUntil);
  const daysRemaining = Math.ceil((validityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Verificar compatibilidade do pacote
  const isPackageSuitable = guests >= selectedPkg.capacityMin && guests <= selectedPkg.capacityMax;

  // Sugestão de upgrade
  const suggestedUpgrade = selectedPackage < PACOTES.length - 1 && guests > selectedPkg.capacityMax 
    ? PACOTES[selectedPackage + 1] 
    : null;

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
                        { name: "Fernanda Oliveira", phone: "(11) 98765-4321", events: "3 eventos anteriores", initials: "FO" },
                        { name: "Fernando Costa", phone: "(11) 99234-5678", events: "1 evento anterior", initials: "FC" },
                      ].map((client) => (
                        <div
                          key={client.name}
                          onClick={() => {
                            setClientSelected(true);
                            setSearchClient(client.name);
                            setPreviousEvents(parseInt(client.events));
                          }}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {client.initials}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.phone}</div>
                          </div>
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {client.events}
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
                    FO
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">{searchClient}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">{clientInfo.phone}</span>
                      <span className="text-sm text-gray-600">{clientInfo.email}</span>
                    </div>
                    {previousEvents > 0 && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mt-2">
                        <Star size={12} />
                        Cliente recorrente · {previousEvents} evento{previousEvents > 1 ? 's' : ''} anterior(is)
                      </div>
                    )}
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
                <Input 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </Field>
              <Field label="Validade do orçamento" required>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className={`text-sm font-medium flex items-center gap-2 ${
                daysRemaining <= 3 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <AlertCircle size={16} className={daysRemaining <= 3 ? 'text-red-600' : 'text-amber-600'} />
                {daysRemaining > 0 
                  ? `⏰ Orçamento válido por ${daysRemaining} dias` 
                  : '⚠️ Orçamento vencido'}
              </div>
              <div className="text-xs text-gray-500">
                Recomendamos validade de 30 dias
              </div>
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
                <Input 
                  placeholder="Ex: Aniversário Sofia 6 anos" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </Field>
              <Field label="Tipo de evento" required>
                <Select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option>Aniversário Infantil</option>
                  <option>Aniversário Adulto</option>
                  <option>Casamento</option>
                  <option>Corporativo</option>
                  <option>Chá de Bebê</option>
                  <option>Formatura</option>
                  <option>Confraternização</option>
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
              <p className="text-xs text-gray-500 mt-2">
                O número de convidados determina o pacote ideal. Média de R$ {(totalValue/guests).toFixed(0)}/pessoa
              </p>
            </Field>

            {!isPackageSuitable && selectedPackage !== undefined && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-semibold">Atenção:</span> O pacote {selectedPkg.name} é recomendado para {selectedPkg.capacity} pessoas. 
                  {guests > selectedPkg.capacityMax 
                    ? ` Você pode ficar com falta de comida/bebida.` 
                    : ` Você pode ter excesso de itens.`}
                </div>
              </div>
            )}

            {suggestedUpgrade && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
                <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Gift size={16} /> Upgrade recomendado
                </h4>
                <p className="text-xs text-gray-700 mb-3">
                  Para {guests} convidados, o pacote {suggestedUpgrade.name} ({suggestedUpgrade.capacity}) é mais adequado.
                  Diferença de R$ {(suggestedUpgrade.price - selectedPkg.price).toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedPackage(PACOTES.indexOf(suggestedUpgrade))}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition"
                >
                  Trocar para {suggestedUpgrade.name}
                </button>
              </div>
            )}
          </div>

          <Field label="Observações / Necessidades especiais">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_NOTES.map(tag => (
                <button
                  key={tag}
                  onClick={() => setObservations(prev => prev + (prev ? `, ${tag}` : tag))}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition flex items-center gap-1"
                >
                  <Plus size={10} /> {tag}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Ex: Tema Pequena Sereia, sem frutos do mar, mesa kids separada, 5 crianças com alergia a amendoim..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium min-h-[120px] resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </Field>

          {/* Upload de arquivos */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Anexos
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">Arraste ou clique para anexar</p>
              <p className="text-xs text-gray-500 mt-1">Briefing, fotos de referência, contratos...</p>
            </div>
          </div>
        </div>
      </div>
    ),

    3: (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm">📋</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Itens & Valores</h2>
            <p className="text-sm text-gray-600 mt-1">Escolha o pacote RISO ideal e adicione extras</p>
          </div>
        </div>

        {/* Comparação rápida */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center justify-between w-full"
          >
            <h4 className="text-sm font-semibold text-blue-800">📊 Comparação rápida de pacotes</h4>
            <ChevronRight size={16} className={`transform transition-transform ${showComparison ? 'rotate-90' : ''}`} />
          </button>
          {showComparison && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              {PACOTES.map((pkg, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPackage(i)}
                  className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                    selectedPackage === i 
                      ? 'bg-white border-2 border-blue-500 shadow-md' 
                      : 'bg-white/80 hover:bg-white border border-transparent'
                  }`}
                >
                  <div className={`text-lg mb-1 ${pkg.textColor}`}>{pkg.emoji}</div>
                  <div className="text-xs font-bold">{pkg.name}</div>
                  <div className="text-xs text-gray-600">{pkg.capacity}</div>
                  <div className="text-xs font-bold mt-1">R$ {pkg.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Pacotes RISO — {guests} convidados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PACOTES.map((pkg, i) => {
                const isSuitable = guests >= pkg.capacityMin && guests <= pkg.capacityMax;
                
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedPackage(i)}
                    className={`
                      relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
                      ${selectedPackage === i 
                        ? `${pkg.borderColor} ${pkg.bgColor} shadow-md` 
                        : "border-gray-200 hover:border-gray-300 hover:shadow hover:bg-gray-50/20"}
                      ${!isSuitable && "opacity-70"}
                    `}
                  >
                    {selectedPackage === i && (
                      <div className={`absolute top-4 right-4 w-6 h-6 ${pkg.bgColor.replace('50', '600')} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm`}>
                        ✓
                      </div>
                    )}
                    
                    {pkg.popular && (
                      <div className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        MAIS VENDIDO
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{pkg.emoji}</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pkg.badgeColor}`}>
                        {pkg.tag}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{pkg.desc}</p>
                    
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-gray-500">Capacidade:</span>
                      <span className="ml-2 text-sm font-medium text-gray-700">{pkg.capacity} pessoas</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPkg(expandedPkg === i ? null : i);
                      }}
                      className="text-xs text-blue-600 hover:underline mb-4 inline-block"
                    >
                      {expandedPkg === i ? "Ver menos ↑" : "Ver itens do pacote ↓"}
                    </button>

                    {expandedPkg === i && (
                      <div className="mb-4 bg-white p-3 rounded-lg text-xs max-h-40 overflow-y-auto border border-gray-100">
                        {pkg.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 py-1">
                            <CheckCircle2 size={12} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 font-mono">
                          R$ {pkg.price.toLocaleString("pt-BR")}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          R$ {(pkg.price / guests).toFixed(0)}/pessoa
                        </div>
                      </div>
                      
                      {isSuitable ? (
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓ Ideal
                        </div>
                      ) : (
                        <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          ⚠ Capacidade: {pkg.capacity}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Extras & Adicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXTRAS.map((extra, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const newExtras = [...extrasSelected];
                    newExtras[i] = !newExtras[i];
                    setExtrasSelected(newExtras);
                  }}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${extrasSelected[i] 
                      ? "border-blue-500 bg-blue-50/40 shadow-sm" 
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

                  <div className="text-2xl flex-shrink-0">{extra.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{extra.name}</div>
                    <div className="text-xs text-gray-500 truncate">{extra.desc}</div>
                  </div>

                  <div className="text-base font-bold text-gray-700 font-mono whitespace-nowrap">
                    + R$ {extra.price.toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Resumo financeiro</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                <span className="text-gray-700">{selectedPkg.name} ({guests} pessoas)</span>
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
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Preço médio por pessoa</span>
                <span className="font-mono">R$ {(totalValue/guests).toFixed(2)}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Valor total">
                <Input
                  value={`R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  readOnly
                  className="font-mono font-bold text-gray-900"
                />
              </Field>
              
              <div className="grid grid-cols-2 gap-3">
                <Field label="Desconto">
                  <div className="flex">
                    <Input
                      placeholder="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="rounded-r-none font-mono"
                    />
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="px-3 border border-l-0 border-gray-200 rounded-r-lg bg-gray-50 text-sm font-medium focus:outline-none"
                    >
                      <option value="percent">%</option>
                      <option value="fixed">R$</option>
                    </select>
                  </div>
                </Field>
                <Field label="Valor final">
                  <Input
                    value={`R$ ${finalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    readOnly
                    className="font-mono font-bold text-blue-700 bg-blue-50/50"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Condições de Pagamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Percentual de entrada (sinal)">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={signalPercent}
                    onChange={(e) => setSignalPercent(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="font-mono"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </Field>
              <Field label="Vencimento do sinal">
                <Input
                  type="date"
                  value={signalDueDate}
                  onChange={(e) => setSignalDueDate(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Vencimento do saldo">
                <Input
                  type="date"
                  value={balanceDueDate}
                  onChange={(e) => setBalanceDueDate(e.target.value)}
                />
              </Field>
              <Field label="Formas de pagamento">
                <div className="flex flex-wrap gap-2">
                  {["PIX", "Cartão", "Transferência", "Dinheiro"].map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        if (paymentMethods.includes(method)) {
                          setPaymentMethods(paymentMethods.filter(m => m !== method));
                        } else {
                          setPaymentMethods([...paymentMethods, method]);
                        }
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition
                        ${paymentMethods.includes(method)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Barra de progresso financeiro */}
            <div className="mt-8 p-5 bg-white border border-gray-200 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Fluxo de pagamento</h4>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Sinal {signalPercent}%</span>
                <span className="text-gray-600">Saldo {100 - signalPercent}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${signalPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span className="font-mono">Sinal: R$ {signalValue.toLocaleString()}</span>
                <span className="font-mono">Saldo: R$ {balanceValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Resumo de pagamento */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Entrada (sinal)</div>
                <div className="text-xl font-bold text-gray-900 font-mono">
                  R$ {signalValue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Vence em {new Date(signalDueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Saldo restante</div>
                <div className="text-xl font-bold text-gray-900 font-mono">
                  R$ {balanceValue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Vence em {new Date(balanceDueDate).toLocaleDateString()}
                </div>
              </div>
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

        {/* Status do orçamento */}
        <div className="flex gap-2 mb-4">
          {["rascunho", "aguardando", "aprovado", "recusado"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                status === s
                  ? s === 'rascunho' ? 'bg-gray-600 text-white'
                    : s === 'aguardando' ? 'bg-amber-500 text-white'
                    : s === 'aprovado' ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'rascunho' ? '📝 Rascunho'
                : s === 'aguardando' ? '⏳ Aguardando aprovação'
                : s === 'aprovado' ? '✅ Aprovado'
                : '❌ Recusado'}
            </button>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-5">
          <CheckCircle2 className="text-green-600" size={32} />
          <div className="flex-1">
            <div className="font-semibold text-green-800 text-lg">Tudo pronto para envio!</div>
            <div className="text-sm text-green-700 mt-1">
              O orçamento será gerado em PDF e poderá ser enviado por e-mail ou WhatsApp.
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200">
              <Download size={18} className="text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200">
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {[
          {
            icon: "👤",
            title: "Cliente & Data",
            step: 1,
            fields: [
              ["Cliente", clientSelected ? searchClient : "Não selecionado"],
              ["Contato", clientSelected ? clientInfo.phone : "-"],
              ["E-mail", clientSelected ? clientInfo.email : "-"],
              ["Data do evento", new Date(eventDate).toLocaleDateString()],
              ["Validade", new Date(validUntil).toLocaleDateString()],
            ],
          },
          {
            icon: "🎉",
            title: "Evento & Detalhes",
            step: 2,
            fields: [
              ["Nome do evento", eventName || "Não definido"],
              ["Tipo", eventType || "Não definido"],
              ["Convidados", `${guests} pessoas`],
              ["Média por pessoa", `R$ ${(totalValue/guests).toFixed(2)}`],
              ["Observações", observations || "Sem observações"],
            ],
          },
          {
            icon: "📋",
            title: "Pacote Selecionado",
            step: 3,
            fields: [
              ["Pacote", selectedPkg.name],
              ["Capacidade", selectedPkg.capacity],
              ["Valor do pacote", `R$ ${basePrice.toLocaleString()}`],
              ["Extras", extrasSelected.filter(Boolean).length > 0 
                ? `${extrasSelected.filter(Boolean).length} itens` 
                : "Nenhum extra"],
              ["Total", `R$ ${totalValue.toLocaleString()}`],
            ],
          },
          {
            icon: "💳",
            title: "Financeiro",
            step: 4,
            fields: [
              ["Valor total", `R$ ${totalValue.toLocaleString()}`],
              ["Desconto", discount ? `${discount}${discountType === 'percent' ? '%' : ''}` : "Sem desconto"],
              ["Valor final", `R$ ${finalValue.toLocaleString()}`],
              ["Sinal", `${signalPercent}% — R$ ${signalValue.toLocaleString()}`],
              ["Venc. sinal", new Date(signalDueDate).toLocaleDateString()],
              ["Venc. saldo", new Date(balanceDueDate).toLocaleDateString()],
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
                    <div className="text-sm font-medium text-gray-900 break-words">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Itens completos do pacote */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="font-medium text-gray-700">
              📋 Itens do {selectedPkg.name}
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPkg.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Histórico de interações */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="font-medium text-gray-700">
              📞 Histórico de contato
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <div className="text-sm font-medium">Ligação em 15/06/2025</div>
                  <div className="text-xs text-gray-500">Cliente pediu orçamento para 80 pessoas, tema Pequena Sereia</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <div className="text-sm font-medium">E-mail enviado em 16/06/2025</div>
                  <div className="text-xs text-gray-500">Briefing inicial enviado com opções de pacotes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="flex gap-3">
            <button
              onClick={() => {
                alert("Orçamento salvo como rascunho!");
                router.push("/orcamentos");
              }}
              className="px-6 py-2.5 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Salvar Rascunho
            </button>
            <button
              onClick={() => {
                alert("Orçamento criado com sucesso! Redirecionando...");
                router.push("/orcamentos");
              }}
              className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Salvar e Enviar
            </button>
          </div>
        )}
      </footer>
    </AppShell>
  );
}