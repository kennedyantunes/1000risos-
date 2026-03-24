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
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// ── Tipos ──
interface PackageItem {
  emoji: string;
  name: string;
  description: string;
  quantity: string;
}

interface Package {
  id: string;
  name: string;
  color: string;
  emoji: string;
  price: number;
  capacity: string;
  capacityMin: number;
  capacityMax: number;
  description: string;
  items: PackageItem[];
  popular?: boolean;
}

// ── Pacotes RISO ──
const packages: Package[] = [
  {
    id: "amarelo",
    name: "Riso-Amarelo",
    color: "amber",
    emoji: "🟡",
    price: 3900,
    capacity: "80–100",
    capacityMin: 80,
    capacityMax: 100,
    description: "Serve: 80–100 pessoas. Pacote completo com fritadeira e cama elástica.",
    popular: true,
    items: [
      { emoji: "🍗", name: "Salgadinhos", description: "Assortidos", quantity: "1300 un" },
      { emoji: "🥨", name: "Mini Churros", description: "Recheados", quantity: "150 un" },
      { emoji: "🌭", name: "Mini Cachorros-Quentes", description: "Com molho", quantity: "100 un" },
      { emoji: "🍕", name: "Mini Pizzas", description: "Sabores variados", quantity: "100 un" },
      { emoji: "🥖", name: "Mini Pães de Queijo", description: "Caseiros", quantity: "100 un" },
      { emoji: "🥟", name: "Mini Pastéis", description: "Carne e queijo", quantity: "200 un" },
      { emoji: "🍟", name: "Batata Frita", description: "No cone", quantity: "8 kg" },
      { emoji: "🍿", name: "Pipoca", description: "À vontade", quantity: "Saindo da cozinha" },
      { emoji: "🍳", name: "Fritadeira", description: "Com operador", quantity: "1 un" },
      { emoji: "👩‍🍳", name: "Copeira", description: "Serviço", quantity: "1 un" },
      { emoji: "👨‍🍳", name: "Garçons", description: "Atendimento", quantity: "3 un" },
      { emoji: "🏰", name: "Cama Elástica", description: "Com monitor", quantity: "1 un" },
    ],
  },
  {
    id: "azul",
    name: "Riso-Azul",
    color: "blue",
    emoji: "🔵",
    price: 5000,
    capacity: "80–100",
    capacityMin: 80,
    capacityMax: 100,
    description: "Serve: 80–100 pessoas. Pacote premium com doces, bolo, hambúrguer e bebidas.",
    items: [
      { emoji: "🍗", name: "Salgadinhos", description: "Assortidos", quantity: "1300 un" },
      { emoji: "🥨", name: "Mini Churros", description: "Recheados", quantity: "150 un" },
      { emoji: "🌭", name: "Mini Cachorros-Quentes", description: "Com molho", quantity: "100 un" },
      { emoji: "🍔", name: "Mini Hambúrgueres", description: "Saindo da cozinha", quantity: "100 un" },
      { emoji: "🍕", name: "Mini Pizzas", description: "Sabores variados", quantity: "100 un" },
      { emoji: "🥖", name: "Mini Pães de Queijo", description: "Caseiros", quantity: "100 un" },
      { emoji: "🥟", name: "Mini Pastéis", description: "Carne e queijo", quantity: "200 un" },
      { emoji: "🍟", name: "Batata Frita", description: "No cone", quantity: "8 kg" },
      { emoji: "🍬", name: "Doces Tradicionais", description: "Assortidos", quantity: "400 un" },
      { emoji: "🎂", name: "Bolo", description: "Copa", quantity: "8 kg" },
      { emoji: "🍝", name: "Macarrão", description: "Ao molho bolonhesa", quantity: "Empratado" },
      { emoji: "🍿", name: "Pipoca", description: "À vontade", quantity: "Saindo da cozinha" },
      { emoji: "🍳", name: "Fritadeira", description: "Com operador", quantity: "1 un" },
      { emoji: "👩‍🍳", name: "Copeira", description: "Serviço", quantity: "1 un" },
      { emoji: "👨‍🍳", name: "Garçons", description: "Atendimento", quantity: "4 un" },
      { emoji: "🏰", name: "Cama Elástica", description: "Com monitor", quantity: "1 un" },
      { emoji: "🥤", name: "Bebidas", description: "Não alcoólicas", quantity: "À vontade" },
    ],
  },
  {
    id: "rosa",
    name: "Riso-Rosa",
    color: "rose",
    emoji: "🩷",
    price: 2900,
    capacity: "50–60",
    capacityMin: 50,
    capacityMax: 60,
    description: "Serve: 50–60 pessoas. Ideal para festas menores e intimistas.",
    items: [
      { emoji: "🍗", name: "Salgadinhos", description: "Assortidos", quantity: "1000 un" },
      { emoji: "🥨", name: "Mini Churros", description: "Recheados", quantity: "100 un" },
      { emoji: "🌭", name: "Mini Cachorros-Quentes", description: "Com molho", quantity: "100 un" },
      { emoji: "🍕", name: "Mini Pizzas", description: "Sabores variados", quantity: "100 un" },
      { emoji: "🥖", name: "Mini Pães de Queijo", description: "Caseiros", quantity: "100 un" },
      { emoji: "🥟", name: "Mini Pastéis", description: "Carne e queijo", quantity: "150 un" },
      { emoji: "🍟", name: "Batata Frita", description: "No cone", quantity: "6 kg" },
      { emoji: "🍿", name: "Pipoca", description: "À vontade", quantity: "Saindo da cozinha" },
      { emoji: "🍳", name: "Fritadeira", description: "Com operador", quantity: "1 un" },
      { emoji: "👩‍🍳", name: "Copeira", description: "Serviço", quantity: "1 un" },
      { emoji: "👨‍🍳", name: "Garçons", description: "Atendimento", quantity: "3 un" },
      { emoji: "🏰", name: "Cama Elástica", description: "Com monitor", quantity: "1 un" },
    ],
  },
  {
    id: "verde",
    name: "Riso-Verde",
    color: "green",
    emoji: "🟢",
    price: 4900,
    capacity: "150",
    capacityMin: 150,
    capacityMax: 200,
    description: "Serve: 150 pessoas. O maior pacote para grandes eventos.",
    items: [
      { emoji: "🍗", name: "Salgadinhos", description: "Assortidos", quantity: "1800 un" },
      { emoji: "🥨", name: "Mini Churros", description: "Recheados", quantity: "200 un" },
      { emoji: "🌭", name: "Mini Cachorros-Quentes", description: "Com molho", quantity: "200 un" },
      { emoji: "🍔", name: "Mini Hambúrgueres", description: "Saindo da cozinha", quantity: "150 un" },
      { emoji: "🍕", name: "Mini Pizzas", description: "Sabores variados", quantity: "150 un" },
      { emoji: "🥖", name: "Mini Pães de Queijo", description: "Caseiros", quantity: "200 un" },
      { emoji: "🥟", name: "Mini Pastéis", description: "Carne e queijo", quantity: "250 un" },
      { emoji: "🍟", name: "Batata Frita", description: "No cone", quantity: "10 kg" },
      { emoji: "🍿", name: "Pipoca", description: "À vontade", quantity: "Saindo da cozinha" },
      { emoji: "🍳", name: "Fritadeira", description: "Com operador", quantity: "1 un" },
      { emoji: "👩‍🍳", name: "Copeira", description: "Serviço", quantity: "1 un" },
      { emoji: "👨‍🍳", name: "Garçons", description: "Atendimento", quantity: "4 un" },
      { emoji: "🏰", name: "Cama Elástica", description: "Com monitor", quantity: "1 un" },
    ],
  },
  {
    id: "vermelho",
    name: "Riso-Vermelho",
    color: "red",
    emoji: "🔴",
    price: 3800,
    capacity: "50–70",
    capacityMin: 50,
    capacityMax: 70,
    description: "Serve: 50–70 pessoas. Inclui doces, bolo e macarrão empratado.",
    items: [
      { emoji: "🍗", name: "Salgadinhos", description: "Assortidos", quantity: "1000 un" },
      { emoji: "🥨", name: "Mini Churros", description: "Recheados", quantity: "150 un" },
      { emoji: "🌭", name: "Mini Cachorros-Quentes", description: "Com molho", quantity: "100 un" },
      { emoji: "🍕", name: "Mini Pizzas", description: "Sabores variados", quantity: "100 un" },
      { emoji: "🥖", name: "Mini Pães de Queijo", description: "Caseiros", quantity: "100 un" },
      { emoji: "🥟", name: "Mini Pastéis", description: "Carne e queijo", quantity: "150 un" },
      { emoji: "🍟", name: "Batata Frita", description: "No cone", quantity: "6 kg" },
      { emoji: "🍬", name: "Doces Tradicionais", description: "Assortidos", quantity: "300 un" },
      { emoji: "🎂", name: "Bolo", description: "Copa", quantity: "5 kg" },
      { emoji: "🍝", name: "Macarrão", description: "Ao molho bolonhesa", quantity: "Empratado" },
      { emoji: "🍿", name: "Pipoca", description: "À vontade", quantity: "Saindo da cozinha" },
      { emoji: "🍳", name: "Fritadeira", description: "Com operador", quantity: "1 un" },
      { emoji: "👩‍🍳", name: "Copeira", description: "Serviço", quantity: "1 un" },
      { emoji: "👨‍🍳", name: "Garçons", description: "Atendimento", quantity: "3 un" },
      { emoji: "🏰", name: "Cama Elástica", description: "Com monitor", quantity: "1 un" },
      { emoji: "🥤", name: "Bebidas", description: "Não alcoólicas", quantity: "À vontade" },
    ],
  },
];

// ── Componente StatCard ──
function StatCard({ title, value, sub, color, icon }: { title: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{sub}</div>
    </div>
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

// ── Modal Novo/Editar Pacote ──
function PackageModal({ pkg, onClose }: { pkg: Package | null; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {pkg ? `Editar Pacote — ${pkg.name}` : "Novo Pacote"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Configure os detalhes do pacote</p>
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome do pacote" required>
                <Input defaultValue={pkg?.name} placeholder="Ex: Riso-Amarelo" />
              </Field>
              <Field label="Emoji / Ícone">
                <Input defaultValue={pkg?.emoji} placeholder="Ex: 🟡" />
              </Field>
              <Field label="Preço" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    type="number"
                    defaultValue={pkg?.price}
                    className="pl-10 font-mono"
                    placeholder="0,00"
                  />
                </div>
              </Field>
              <Field label="Capacidade">
                <Input defaultValue={pkg?.capacity} placeholder="Ex: 80–100" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Mínimo de pessoas">
                  <Input type="number" defaultValue={pkg?.capacityMin} className="font-mono" />
                </Field>
                <Field label="Máximo de pessoas">
                  <Input type="number" defaultValue={pkg?.capacityMax} className="font-mono" />
                </Field>
              </div>
              <Field label="Cor">
                <select defaultValue={pkg?.color} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium">
                  <option value="amber">Amarelo</option>
                  <option value="blue">Azul</option>
                  <option value="rose">Rosa</option>
                  <option value="green">Verde</option>
                  <option value="red">Vermelho</option>
                </select>
              </Field>
            </div>

            <Field label="Descrição">
              <textarea
                defaultValue={pkg?.description}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="Descrição do pacote..."
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Itens do Pacote</h4>
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
                  <Plus size={16} /> Adicionar item
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_40px] bg-gray-50 border-b border-gray-200">
                  <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Item</div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Descrição</div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Quantidade</div>
                  <div></div>
                </div>
                {(pkg?.items || []).map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_40px] border-b last:border-b-0">
                    <div className="px-4 py-3">
                      <input defaultValue={item.name} className="w-full bg-transparent text-sm" />
                    </div>
                    <div className="px-4 py-3">
                      <input defaultValue={item.description} className="w-full bg-transparent text-sm" />
                    </div>
                    <div className="px-4 py-3">
                      <input defaultValue={item.quantity} className="w-full bg-transparent text-sm font-mono" />
                    </div>
                    <div className="px-4 py-3 flex items-center justify-center">
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            <Save size={16} className="inline mr-2" />
            Salvar Pacote
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──
export default function PacotesPage() {
  const [selectedId, setSelectedId] = useState("amarelo");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPkg, setModalPkg] = useState<Package | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string | null>(null);

  const selected = packages.find(p => p.id === selectedId) || packages[0];

  const filteredPackages = packages.filter(p =>
    searchTerm === "" ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas
  const totalPackages = packages.length;
  const avgPrice = packages.reduce((sum, p) => sum + p.price, 0) / totalPackages;

  return (
    <AppShell active="cardapio-pacotes">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/cardapio" className="text-gray-500 hover:text-gray-700 font-medium">
            Cardápio
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Pacotes</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Botões de toggle das sidebars */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md transition-all ${showSidebar ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={showSidebar ? "Ocultar lista" : "Mostrar lista"}
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
            onClick={() => {
              setModalPkg(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo Pacote</span>
          </button>
        </div>
      </header>

      {/* Stats Strip - Cards Profissionais */}
      <div className={`bg-gray-50 border-b border-gray-200 px-6 py-6 transition-all duration-300 ${!showSidebar && !showDetailsPanel ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Pacotes"
            value={totalPackages.toString()}
            sub="ativos"
            color="bg-blue-600"
            icon={<Package size={20} className="text-blue-600" />}
          />
          <StatCard
            title="Ticket Médio"
            value={avgPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="por pacote"
            color="bg-emerald-600"
            icon={<DollarSign size={20} className="text-emerald-600" />}
          />
          <StatCard
            title="Menor Valor"
            value={Math.min(...packages.map(p => p.price)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            sub="pacote Rosa"
            color="bg-rose-600"
            icon={<TrendingDown size={20} className="text-rose-600" />}
          />
          <StatCard
            title="Maior Capacidade"
            value="150 pax"
            sub="pacote Verde"
            color="bg-green-600"
            icon={<Users size={20} className="text-green-600" />}
          />
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Lista de Pacotes */}
        <aside className={`border-r border-gray-200 bg-white flex flex-col transition-all duration-300 overflow-hidden ${showSidebar ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pacotes</h3>
            <p className="text-sm text-gray-600 mt-1">{filteredPackages.length} pacotes</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredPackages.map((pkg) => {
              const isSelected = pkg.id === selectedId;
              const colorClasses = {
                amber: "border-amber-200 bg-amber-50",
                blue: "border-blue-200 bg-blue-50",
                rose: "border-rose-200 bg-rose-50",
                green: "border-green-200 bg-green-50",
                red: "border-red-200 bg-red-50",
              };
              const bgClass = isSelected ? colorClasses[pkg.color as keyof typeof colorClasses] : "";

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedId(pkg.id)}
                  className={`
                    px-4 py-3 rounded-xl cursor-pointer transition-all border
                    ${isSelected
                      ? `${bgClass} border-2 shadow-sm`
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                        {pkg.emoji}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{pkg.name}</div>
                        <div className="text-xs text-gray-500">
                          {pkg.capacity} pessoas
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-blue-700">
                        {pkg.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      {pkg.popular && (
                        <div className="text-xs text-amber-600 font-medium">Mais vendido</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Botão flutuante para mostrar sidebar quando oculta */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition z-10"
            title="Mostrar pacotes"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Área central – Detalhes do Pacote */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300`}>
          <div className="max-w-4xl mx-auto">
            {/* Cabeçalho do pacote */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
                    {selected.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">{selected.name}</h1>
                      {selected.popular && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          ★ Mais vendido
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1 max-w-2xl">{selected.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setModalPkg(selected);
                      setModalOpen(true);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-2"
                  >
                    <Copy size={16} /> Duplicar
                  </button>
                  <button
                    onClick={() => {
                      setModalPkg(selected);
                      setModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium flex items-center gap-2"
                  >
                    <Edit size={16} /> Editar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Capacidade</div>
                  <div className="text-xl font-bold text-gray-900">{selected.capacity} pessoas</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Valor total</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {selected.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Valor por pessoa</div>
                  <div className="text-xl font-bold text-gray-900">
                    {Math.round(selected.price / (selected.capacityMax || 100)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Itens do Pacote */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Itens Incluídos</h3>
                <span className="text-xs text-gray-500">{selected.items.length} itens</span>
              </div>
              <div className="divide-y divide-gray-100">
                {selected.items.map((item, i) => {
                  const isExpanded = expandedItems === `${selected.id}-${i}`;
                  return (
                    <div key={i}>
                      <div
                        className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => setExpandedItems(isExpanded ? null : `${selected.id}-${i}`)}
                      >
                        <div className="text-3xl w-12 flex-shrink-0">{item.emoji}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <div className="font-mono text-sm text-gray-700 min-w-28 text-right">
                          {item.quantity}
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            Detalhes adicionais do item podem ser configurados aqui.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

        {/* Painel lateral - Resumo (sem comparativo) */}
        <aside className={`border-l border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${showDetailsPanel ? "w-80" : "w-0"}`}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-lg font-bold text-gray-900">Resumo</h3>
            <p className="text-sm text-gray-500 mt-1">Informações do pacote selecionado</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Valores</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor total</span>
                  <span className="font-bold text-blue-700">
                    {selected.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço por pessoa</span>
                  <span className="font-medium">
                    {Math.round(selected.price / (selected.capacityMax || 100)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacidade</span>
                  <span className="font-medium">{selected.capacity} pessoas</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resumo de Itens</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de itens</span>
                  <span className="font-medium">{selected.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categorias</span>
                  <span className="font-medium">Salgados, Doces, Bebidas, Serviços</span>
                </div>
              </div>
            </div>

            {/* Dica */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">Dica</span>
              </div>
              <p className="text-xs text-blue-700">
                Personalize este pacote adicionando ou removendo itens conforme a necessidade do cliente.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2">
              <Edit size={16} /> Personalizar Pacote
            </button>
          </div>
        </aside>
      </div>

      {/* Modal */}
      {modalOpen && (
        <PackageModal
          pkg={modalPkg}
          onClose={() => setModalOpen(false)}
        />
      )}
    </AppShell>
  );
}


function Save(props: any) {
  return <Save {...props} />;
}