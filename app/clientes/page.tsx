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
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
  ChevronDown,
  ChevronUp,
  Tag,
  User,
  Building2,
  CreditCard,
  Receipt,
  Banknote,
  Maximize2,
  Minimize2,
  ChevronLeft,
  RotateCcw,
  Eye,
  Edit,
  MoreHorizontal,
  Printer,
  Share2,
  AlertTriangle,
  Mail,
  Phone,
  Users,
  CalendarDays,
  Package,
  TrendingUp,
  TrendingDown,
  Wallet,
  Star,
  MessageCircle,
  Briefcase,
  Target,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  Heart,
  Award,
  Gift,
  Coffee,
  Smile,
  ThumbsUp,
  MessageSquare,
  PhoneCall,
  Video,
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Inbox,
  Archive,
  Trash2,
  Flag,
  Settings,
  UserPlus,
  UserCheck,
  UserX,
  UsersRound,
  Handshake,
  BarChart,
  LineChart,
  Cake,
  PartyPopper,
  Sparkles,
  Bell,
  Gift as GiftIcon,
  XCircle,
} from "lucide-react";

// ── Tipos ──
type ClientStatus = "active" | "inactive" | "lead" | "lost";
type ContactType = "primary" | "secondary" | "technical" | "financial";
type OpportunityStatus = "prospecting" | "negotiation" | "proposal" | "closed_won" | "closed_lost";
type InteractionType = "call" | "email" | "meeting" | "whatsapp" | "presentation";
type EventStatus = "confirmado" | "pendente" | "realizado" | "cancelado";

interface Event {
  id: number;
  name: string;
  type: string;
  date: string;
  guests: number;
  value: number;
  status: EventStatus;
  location?: string;
  isRecurring?: boolean;
  recurrenceYear?: number;
  nextAnniversary?: string;
  daysUntilAnniversary?: number;
}

interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  type: ContactType;
  isPrimary: boolean;
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Interaction {
  id: number;
  type: InteractionType;
  date: string;
  time: string;
  subject: string;
  description: string;
  createdBy: string;
  nextAction?: string;
  nextActionDate?: string;
}

interface Opportunity {
  id: number;
  title: string;
  value: number;
  status: OpportunityStatus;
  probability: number;
  expectedCloseDate: string;
  products: { name: string; quantity: number; unitPrice: number }[];
  notes?: string;
}

interface Client {
  id: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  status: ClientStatus;
  type: string;
  segment: string;
  rating: number;
  since: string;
  lastContact: string;
  nextContact: string;
  address: Address;
  contacts: Contact[];
  opportunities: Opportunity[];
  interactions: Interaction[];
  events: Event[];
  totalSpent: number;
  totalEvents: number;
  notes?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  tags: string[];
}

// ── Configuração de Status Cliente ──
const CLIENT_STATUS_CONFIG: Record<ClientStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon?: React.ReactNode;
  description: string;
}> = {
  active: {
    label: "Ativo",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    icon: <UserCheck className="w-3.5 h-3.5" />,
    description: "Cliente com eventos ativos",
  },
  inactive: {
    label: "Inativo",
    bg: "bg-gray-100",
    text: "text-gray-800",
    dot: "bg-gray-500",
    icon: <UserX className="w-3.5 h-3.5" />,
    description: "Sem eventos há mais de 6 meses",
  },
  lead: {
    label: "Lead",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    description: "Potencial cliente em prospecção",
  },
  lost: {
    label: "Perdido",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <UserX className="w-3.5 h-3.5" />,
    description: "Cliente não convertido",
  },
};

// ── Configuração de Status Evento ──
const EVENT_STATUS_CONFIG: Record<EventStatus, {
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
  pendente: {
    label: "Pendente",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  realizado: {
    label: "Realizado",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

// ── Mock Data com Eventos e Aniversários ──
const mockClients: Client[] = [
  {
    id: 1,
    name: "Ana Beatriz Souza",
    document: "123.456.789-00",
    email: "ana.beatriz@email.com",
    phone: "(11) 98765-4321",
    status: "active",
    type: "Pessoa Física",
    segment: "Casamentos",
    rating: 5,
    since: "15/01/2025",
    lastContact: "10/03/2026",
    nextContact: "25/03/2026",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    contacts: [
      {
        id: 1,
        name: "Ana Beatriz Souza",
        role: "Noiva",
        email: "ana.beatriz@email.com",
        phone: "(11) 98765-4321",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [
      {
        id: 1,
        name: "Casamento Ana & João",
        type: "Casamento",
        date: "15/03/2026",
        guests: 120,
        value: 25000,
        status: "confirmado",
        location: "Espaço Villa Riso",
      },
    ],
    totalSpent: 25000,
    totalEvents: 1,
    notes: "Cliente muito exigente com decoração. Prefere flores naturais.",
    tags: ["Casamento", "Alto valor", "Indicação"],
  },
  {
    id: 2,
    name: "Fernanda Lima",
    document: "987.654.321-00",
    email: "fernanda.lima@email.com",
    phone: "(11) 98765-4323",
    status: "lead",
    type: "Pessoa Física",
    segment: "Aniversários",
    rating: 3,
    since: "20/02/2026",
    lastContact: "05/03/2026",
    nextContact: "20/03/2026",
    address: {
      street: "Avenida Paulista",
      number: "1000",
      complement: "Sala 501",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
    contacts: [
      {
        id: 1,
        name: "Fernanda Lima",
        role: "Cliente",
        email: "fernanda.lima@email.com",
        phone: "(11) 98765-4323",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [],
    totalSpent: 0,
    totalEvents: 0,
    notes: "Interessada no pacote Premium Infantil.",
    tags: ["Aniversário", "Lead"],
  },
  {
    id: 3,
    name: "Marcos Oliveira",
    document: "456.789.123-00",
    email: "marcos.oliveira@empresa.com",
    phone: "(11) 98765-4324",
    status: "active",
    type: "Pessoa Jurídica",
    segment: "Corporativo",
    rating: 4,
    since: "10/12/2024",
    lastContact: "12/03/2026",
    nextContact: "26/03/2026",
    address: {
      street: "Rua Funchal",
      number: "500",
      neighborhood: "Vila Olímpia",
      city: "São Paulo",
      state: "SP",
      zipCode: "04551-060",
    },
    contacts: [
      {
        id: 1,
        name: "Marcos Oliveira",
        role: "Diretor",
        email: "marcos.oliveira@empresa.com",
        phone: "(11) 98765-4324",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [
      {
        id: 2,
        name: "Confraternização Anual",
        type: "Corporativo",
        date: "10/12/2025",
        guests: 200,
        value: 45000,
        status: "realizado",
        location: "Centro de Convenções",
        isRecurring: true,
        recurrenceYear: 2025,
        nextAnniversary: "10/12/2026",
        daysUntilAnniversary: 265,
      },
    ],
    totalSpent: 45000,
    totalEvents: 1,
    notes: "Cliente corporativo, eventos anuais.",
    tags: ["Corporativo", "Evento anual", "VIP"],
  },
  {
    id: 4,
    name: "Patrícia Santos",
    document: "789.123.456-00",
    email: "patricia.santos@email.com",
    phone: "(11) 98765-4326",
    status: "inactive",
    type: "Pessoa Física",
    segment: "Aniversários",
    rating: 2,
    since: "10/08/2024",
    lastContact: "15/12/2025",
    nextContact: "15/03/2026",
    address: {
      street: "Rua Augusta",
      number: "200",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    contacts: [
      {
        id: 1,
        name: "Patrícia Santos",
        role: "Cliente",
        email: "patricia.santos@email.com",
        phone: "(11) 98765-4326",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [
      {
        id: 3,
        name: "Aniversário 10 anos - Sofia",
        type: "Aniversário Infantil",
        date: "20/09/2024",
        guests: 50,
        value: 8500,
        status: "realizado",
        location: "Buffet Elegance",
        isRecurring: true,
        recurrenceYear: 2024,
        nextAnniversary: "20/09/2026",
        daysUntilAnniversary: 184,
      },
    ],
    totalSpent: 8500,
    totalEvents: 1,
    tags: ["Inativo", "Evento único"],
  },
  {
    id: 5,
    name: "Roberto Alves",
    document: "321.654.987-00",
    email: "roberto.alves@email.com",
    phone: "(11) 98765-4327",
    status: "lead",
    type: "Pessoa Física",
    segment: "Casamentos",
    rating: 4,
    since: "01/03/2026",
    lastContact: "01/03/2026",
    nextContact: "15/03/2026",
    address: {
      street: "Rua Oscar Freire",
      number: "1500",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-001",
    },
    contacts: [
      {
        id: 1,
        name: "Roberto Alves",
        role: "Noivo",
        email: "roberto.alves@email.com",
        phone: "(11) 98765-4327",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [],
    totalSpent: 0,
    totalEvents: 0,
    notes: "Interessado em data para agosto de 2026.",
    tags: ["Casamento", "Lead qualificado"],
  },
  {
    id: 6,
    name: "Carla Mendes",
    document: "555.666.777-88",
    email: "carla.mendes@email.com",
    phone: "(11) 98765-4329",
    status: "active",
    type: "Pessoa Física",
    segment: "Aniversários",
    rating: 5,
    since: "05/05/2024",
    lastContact: "20/02/2026",
    nextContact: "10/04/2026",
    address: {
      street: "Alameda Santos",
      number: "800",
      neighborhood: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01419-001",
    },
    contacts: [
      {
        id: 1,
        name: "Carla Mendes",
        role: "Mãe",
        email: "carla.mendes@email.com",
        phone: "(11) 98765-4329",
        type: "primary",
        isPrimary: true,
      },
    ],
    opportunities: [],
    interactions: [],
    events: [
      {
        id: 4,
        name: "Aniversário 8 anos - Pedro",
        type: "Aniversário Infantil",
        date: "15/06/2025",
        guests: 80,
        value: 12500,
        status: "realizado",
        location: "Espaço Kids",
        isRecurring: true,
        recurrenceYear: 2025,
        nextAnniversary: "15/06/2026",
        daysUntilAnniversary: 87,
      },
    ],
    totalSpent: 12500,
    totalEvents: 1,
    notes: "Cliente já confirmou festa para 2026. Aguardando definição de data.",
    tags: ["Aniversário", "Recorrente", "Fidelizado"],
  },
];

// Função para calcular aniversários próximos (2 meses)
const getUpcomingBirthdays = (clients: Client[]) => {
  const upcoming: { client: Client; event: Event; daysLeft: number }[] = [];
  const today = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);

  clients.forEach(client => {
    client.events.forEach(event => {
      if (event.type.includes("Aniversário") && event.isRecurring && event.nextAnniversary) {
        const [day, month, year] = event.nextAnniversary.split('/');
        const anniversaryDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const daysLeft = Math.ceil((anniversaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft > 0 && daysLeft <= 60) {
          upcoming.push({ client, event, daysLeft });
        }
      }
    });
  });
  
  return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
};

// ── Componente StatusBadge Cliente ──
function ClientStatusBadge({ status, size = "sm", showTooltip = false }: { status: ClientStatus; size?: "sm" | "md"; showTooltip?: boolean }) {
  const cfg = CLIENT_STATUS_CONFIG[status];
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

// ── Componente EventStatusBadge ──
function EventStatusBadge({ status, size = "sm" }: { status: EventStatus; size?: "sm" | "md" }) {
  const cfg = EVENT_STATUS_CONFIG[status];
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

// ── Componente Field ──
const Field = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col gap-1.5 ${className || ""}`}>
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

// ── Componente de Card de Aniversário Próximo ──
function UpcomingBirthdayCard({ client, event, daysLeft }: { client: Client; event: Event; daysLeft: number }) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
          🎂
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{client.name}</h4>
            <div className="flex items-center gap-1 text-pink-600 font-bold text-sm">
              <Bell size={14} />
              {daysLeft === 0 ? "Hoje!" : `Faltam ${daysLeft} dias`}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{event.name}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarIcon size={12} /> {event.nextAnniversary}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {event.guests} convidados
            </span>
          </div>
          <div className="mt-3 flex gap-2">
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

// ── Modal de Nova Interação ──
function NewInteractionModal({ client, onClose, onSubmit }: { client: Client; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    type: "call" as InteractionType,
    subject: "",
    description: "",
    nextAction: "",
    nextActionDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Interação</h2>
              <p className="text-sm text-gray-600 mt-1">{client.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <Field label="Tipo de interação">
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="call">Ligação</option>
                <option value="email">E-mail</option>
                <option value="meeting">Reunião</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="presentation">Apresentação</option>
              </select>
            </Field>

            <Field label="Assunto" required>
              <Input placeholder="Ex: Apresentação de orçamento" />
            </Field>

            <Field label="Descrição" required>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Detalhes da interação..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-6">
              <Field label="Próxima ação">
                <Input placeholder="Ex: Enviar proposta" />
              </Field>
              <Field label="Data da próxima ação">
                <Input type="date" />
              </Field>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <MessageCircle size={16} /> Registrar Interação
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal do CRM ──
export default function CRMPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalInteractionOpen, setModalInteractionOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "info" | "contacts" | "interactions">("events");

  const selectedClient = mockClients.find(c => c.id === selectedId) || mockClients[0];
  const upcomingBirthdays = getUpcomingBirthdays(mockClients);

  // Filtrar clientes
  const filteredClients = mockClients.filter(c =>
    searchTerm === "" ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleCreateInteraction = (data: any) => {
    console.log("Nova interação:", data);
  };

  return (
    <AppShell active="crm">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-gray-900">CRM</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Clientes</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`p-2 rounded-md transition-all ${showDetailsPanel ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showDetailsPanel ? "Ocultar detalhes" : "Mostrar detalhes"}
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

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo Cliente</span>
          </button>
        </div>
      </header>

      {/* Aniversários Próximos - Destaque */}
      {upcomingBirthdays.length > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200 px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <GiftIcon size={20} className="text-pink-600" />
            <h3 className="text-sm font-semibold text-pink-800">Aniversários Próximos</h3>
            <span className="text-xs text-pink-600">({upcomingBirthdays.length} eventos nos próximos 60 dias)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBirthdays.map((item, idx) => (
              <UpcomingBirthdayCard key={idx} client={item.client} event={item.event} daysLeft={item.daysLeft} />
            ))}
          </div>
        </div>
      )}

      {/* Barra de pesquisa */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de categorias - com toggle */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-72" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Segmentos</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {[
              { segment: "Todos", count: mockClients.length, icon: "👥" },
              { segment: "Casamentos", count: mockClients.filter(c => c.segment === "Casamentos").length, icon: "💍" },
              { segment: "Aniversários", count: mockClients.filter(c => c.segment === "Aniversários").length, icon: "🎂" },
              { segment: "Corporativo", count: mockClients.filter(c => c.segment === "Corporativo").length, icon: "🏢" },
            ].map(cat => (
              <button
                key={cat.segment}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                  text-gray-700 hover:bg-gray-50
                `}
              >
                <span className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.segment}</span>
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tags Populares</h4>
            <div className="flex flex-wrap gap-2">
              {["Casamento", "Aniversário", "Corporativo", "VIP", "Recorrente", "Lead"].map(tag => (
                <span key={tag} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar filtros"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Lista de clientes - estilo tabela */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Clientes · {filteredClients.length} itens
            </h2>
            <div className="text-sm text-gray-500">
              Mostrando {filteredClients.length} de {mockClients.length} itens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>Cliente</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Contato</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Status</div>
              <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"}`}>Total Gasto</div>
              <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"}`}>Último Contato</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredClients.map(client => {
                const isExpanded = expandedItems === client.id;
                
                return (
                  <div key={client.id}>
                    <div
                      onClick={() => setSelectedId(client.id)}
                      className={`
                        grid grid-cols-12 px-6 py-4 cursor-pointer transition-all hover:bg-blue-50/40
                        ${client.id === selectedId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                      `}
                    >
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-4"}`}>
                        <div className="font-medium text-gray-900 truncate">{client.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          {Array.from({ length: client.rating }).map((_, i) => (
                            <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs ml-1">{client.segment}</span>
                        </div>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex flex-col text-sm`}>
                        <span className="font-medium">{client.phone}</span>
                        <span className="text-xs text-gray-500 truncate">{client.email}</span>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <ClientStatusBadge status={client.status} />
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-2" : "col-span-2"} flex items-center`}>
                        <span className="font-bold text-gray-900">
                          {client.totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      <div className={`${showDetailsPanel ? "col-span-3" : "col-span-2"} flex items-center justify-between`}>
                        <div>
                          <div className="text-sm text-gray-900">{client.lastContact}</div>
                          {client.nextContact && (
                            <div className="text-xs text-blue-600">
                              Próximo: {client.nextContact}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItems(isExpanded ? null : client.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Linha expandida com tags e eventos rápidos */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {client.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {client.events.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium text-gray-500 mb-2">Últimos eventos:</div>
                            <div className="flex flex-wrap gap-2">
                              {client.events.slice(0, 2).map(event => (
                                <span key={event.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                  {event.name} - {event.date}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botão flutuante para mostrar details panel quando oculto */}
        {!showDetailsPanel && (
          <button
            onClick={() => setShowDetailsPanel(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar detalhes"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Painel lateral de detalhes - com toggle */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-96" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                  <ClientStatusBadge status={selectedClient.status} size="sm" />
                </div>
                <p className="text-sm text-gray-600">{selectedClient.email} • {selectedClient.phone}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  <Edit size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < selectedClient.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
              ))}
              <span className="text-xs text-gray-500 ml-2">Desde {selectedClient.since}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {[
              { id: "events", label: "Eventos", icon: <CalendarIcon size={14} /> },
              { id: "info", label: "Informações", icon: <User size={14} /> },
              { id: "contacts", label: "Contatos", icon: <Users size={14} /> },
              { id: "interactions", label: "Interações", icon: <MessageCircle size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 -mb-px
                  ${activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tab: Eventos */}
            {activeTab === "events" && (
              <>
                {selectedClient.events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Nenhum evento encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedClient.events.map(event => {
                      const isUpcomingBirthday = event.type.includes("Aniversário") && event.isRecurring && event.daysUntilAnniversary && event.daysUntilAnniversary <= 60;
                      
                      return (
                        <div key={event.id} className={`bg-white border rounded-xl p-4 ${isUpcomingBirthday ? "border-pink-300 shadow-md" : "border-gray-200"}`}>
                          {isUpcomingBirthday && (
                            <div className="mb-3 flex items-center gap-2 text-pink-600 text-xs font-medium">
                              <GiftIcon size={14} />
                              <span>Aniversário se aproxima! Faltam {event.daysUntilAnniversary} dias</span>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{event.name}</h4>
                              <div className="text-sm text-gray-600 mt-1">{event.type}</div>
                            </div>
                            <EventStatusBadge status={event.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={14} className="text-gray-400" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-gray-400" />
                              <span>{event.guests} convidados</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-gray-400" />
                              <span>{event.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                          {event.isRecurring && event.nextAnniversary && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-blue-600">
                              <span className="flex items-center gap-1">
                                <RotateCcw size={12} />
                                Próximo evento: {event.nextAnniversary}
                              </span>
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
                              Ver Detalhes
                            </button>
                            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition">
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Tab: Informações */}
            {activeTab === "info" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Total Gasto</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {selectedClient.totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Eventos Realizados</div>
                    <div className="text-2xl font-bold text-blue-700">{selectedClient.totalEvents}</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin size={14} /> Endereço
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedClient.address.street}, {selectedClient.address.number}</p>
                    {selectedClient.address.complement && <p>Complemento: {selectedClient.address.complement}</p>}
                    <p>{selectedClient.address.neighborhood}</p>
                    <p>{selectedClient.address.city} - {selectedClient.address.state}</p>
                    <p>CEP: {selectedClient.address.zipCode}</p>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Observações</h4>
                    <p className="text-sm text-gray-700">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tab: Contatos */}
            {activeTab === "contacts" && (
              <div className="space-y-4">
                {selectedClient.contacts.map(contact => (
                  <div key={contact.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{contact.name}</span>
                          {contact.isPrimary && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Principal</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{contact.role}</div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded-lg text-blue-600">
                          <MessageCircle size={16} />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg text-green-600">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Interações */}
            {activeTab === "interactions" && (
              <>
                <button
                  onClick={() => setModalInteractionOpen(true)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Nova Interação
                </button>
                <div className="space-y-4">
                  {selectedClient.interactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>Nenhuma interação registrada</p>
                    </div>
                  ) : (
                    selectedClient.interactions.map(interaction => (
                      <div key={interaction.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Phone size={14} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">{interaction.subject}</div>
                              <div className="text-xs text-gray-500">{interaction.date} • {interaction.time}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{interaction.description}</div>
                            <div className="mt-2 text-xs text-gray-500">
                              Por: {interaction.createdBy}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Botões de ação no rodapé */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
            <button
              onClick={() => setModalInteractionOpen(true)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} /> Nova Interação
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              Histórico
            </button>
          </div>
        </aside>
      </div>

      {/* Modal de Nova Interação */}
      {modalInteractionOpen && (
        <NewInteractionModal
          client={selectedClient}
          onClose={() => setModalInteractionOpen(false)}
          onSubmit={handleCreateInteraction}
        />
      )}
    </AppShell>
  );
}

// Componentes adicionais necessários
function CalendarCheck(props: any) {
  return <Calendar {...props} />;
}