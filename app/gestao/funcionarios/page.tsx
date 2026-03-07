"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Plus,
  Download,
  Filter,
  X,
  Calendar,
  User,
  Briefcase,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ── Tipos ──
type EmployeeStatus = "active" | "vacation" | "inactive";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  admission: string;
  days: string;
  status: EmployeeStatus;
  statusText: string;
}

// ── Configuração de Status ──
const STATUS_CONFIG = {
  active: {
    label: "Ativo",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-500",
  },
  vacation: {
    label: "Férias",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-500",
  },
  inactive: {
    label: "Inativo",
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-300",
  },
};

// ── Mock Data ──
const mockEmployees: Employee[] = [
  { id: 0, name: "Marcos Andrade", role: "Administrador", department: "Administração", avatar: "MA", admission: "15/03/2022", days: "12 dias", status: "active", statusText: "Ativo" },
  { id: 1, name: "Ana Souza", role: "Cozinheira Chefe", department: "Cozinha", avatar: "AS", admission: "10/01/2023", days: "8 dias", status: "active", statusText: "Ativo" },
  { id: 2, name: "Carlos Lima", role: "Garçom", department: "Atendimento", avatar: "CL", admission: "05/06/2023", days: "Férias", status: "vacation", statusText: "Férias" },
  { id: 3, name: "Fernanda Melo", role: "Recepção", department: "Recepção", avatar: "FM", admission: "20/02/2024", days: "15 dias", status: "active", statusText: "Ativo" },
  { id: 4, name: "João Pedro", role: "Montador", department: "Montagem", avatar: "JP", admission: "12/08/2023", days: "5 dias", status: "active", statusText: "Ativo" },
  { id: 5, name: "Lucia Santos", role: "Auxiliar Cozinha", department: "Cozinha", avatar: "LS", admission: "03/04/2024", days: "10 dias", status: "active", statusText: "Ativo" },
  { id: 6, name: "Roberto Freitas", role: "Motorista", department: "Logística", avatar: "RF", admission: "22/09/2023", days: "Férias", status: "vacation", statusText: "Férias" },
];

const departments = [
  { key: "todos", label: "Todos", count: 18 },
  { key: "Cozinha", label: "Cozinha", count: 5 },
  { key: "Atendimento", label: "Atendimento", count: 4 },
  { key: "Montagem", label: "Montagem", count: 3 },
  { key: "Administração", label: "Administração", count: 3 },
  { key: "Recepção", label: "Recepção", count: 2 },
  { key: "Logística", label: "Logística", count: 1 },
];

export default function FuncionariosPage() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [deptFilter, setDeptFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">("all");
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [modalVacationOpen, setModalVacationOpen] = useState(false);

  const selectedEmployee = mockEmployees.find(e => e.id === selectedId) || mockEmployees[0];

  const filteredEmployees = mockEmployees.filter(e => {
    if (deptFilter !== "todos" && e.department !== deptFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  const cfg = STATUS_CONFIG[selectedEmployee.status];

  return (
    <AppShell active="gestao-funcionarios">
      {/* Topbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Gestão</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-900">Funcionários</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Download size={16} /> Relatórios
          </button>
          <button
            onClick={() => setModalNewOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Novo Funcionário
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Departamentos + Filtros */}
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
                onClick={() => setDeptFilter(dept.key)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${deptFilter === dept.key
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
              Status
            </h3>
            <div className="space-y-2">
              {[
                { key: "all", label: "Todos", count: mockEmployees.length, color: "bg-gray-100 text-gray-700" },
                { key: "active", label: "Ativos", count: 14, color: "bg-emerald-100 text-emerald-800" },
                { key: "vacation", label: "Em férias", count: 3, color: "bg-amber-100 text-amber-800" },
                { key: "inactive", label: "Inativos", count: 1, color: "bg-gray-100 text-gray-600" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key as any)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${statusFilter === s.key
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
          </div>
        </aside>

        {/* Lista de funcionários */}
        <div className="w-[420px] border-r border-gray-200 bg-gray-50/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Funcionários · {filteredEmployees.length}
            </h2>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredEmployees.map((emp) => {
              const isSelected = emp.id === selectedId;
              const cfg = STATUS_CONFIG[emp.status];

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedId(emp.id)}
                  className={`
                    p-5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? "ring-2 ring-blue-500 shadow-md"
                      : "hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {emp.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{emp.name}</h4>
                        <div className="text-sm text-gray-600">{emp.role}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 flex flex-col gap-1 mt-2">
                    <span>Departamento: {emp.department}</span>
                    <span>Admissão: {emp.admission}</span>
                    <span>Férias disponíveis: {emp.days}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes do funcionário */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <div className="max-w-5xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEmployee.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">{selectedEmployee.role}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{selectedEmployee.department}</span>
                  </div>
                  <span
                    className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setModalNewOpen(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => setModalVacationOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
                >
                  Solicitar Férias
                </button>
              </div>
            </div>

            {/* Informações pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Informações Pessoais
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500">CPF</div>
                    <div className="text-base font-medium text-gray-900">123.456.789-00</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Data de nascimento</div>
                    <div className="text-base font-medium text-gray-900">15/03/1985</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Telefone</div>
                    <div className="text-base font-medium text-gray-900">(11) 98765-4321</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">E-mail</div>
                    <div className="text-base font-medium text-gray-900">marcos@1000festas.com</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Informações Profissionais
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500">Data de admissão</div>
                    <div className="text-base font-medium text-gray-900">{selectedEmployee.admission}</div>
                    <div className="text-sm text-gray-600 mt-1">4 anos de empresa</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Cargo</div>
                    <div className="text-base font-medium text-gray-900">{selectedEmployee.role}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Departamento</div>
                    <div className="text-base font-medium text-gray-900">{selectedEmployee.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Salário</div>
                    <div className="text-base font-bold font-mono text-blue-700">R$ 4.500,00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Férias */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Férias
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Período aquisitivo 2025/2026</div>
                    <div className="text-2xl font-bold text-gray-900">30 dias</div>
                    <div className="text-sm text-gray-600 mt-2">Disponíveis: 30 dias</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="inline-block px-6 py-3 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      Disponível para solicitação
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
                  Documentos
                </h3>
                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1.5">
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Contrato de trabalho.pdf", "RG.pdf", "CPF.pdf", "Comprovante residência.pdf"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition"
                  >
                    <FileText size={24} className="text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{doc}</div>
                      <div className="text-xs text-gray-500">2.3 MB • 15/03/2022</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico / Timeline */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b border-gray-200">
                Histórico
              </h3>
              <div className="space-y-8">
                {[
                  { title: "Admissão", sub: "Contratado como Administrador", date: "15/03/2022", color: "bg-emerald-100 text-emerald-700" },
                  { title: "Promoção", sub: "Promovido a Administrador Sênior", date: "10/01/2024", color: "bg-purple-100 text-purple-700" },
                  { title: "Férias", sub: "30 dias • Janeiro/2025", date: "02/01/2025 a 31/01/2025", color: "bg-amber-100 text-amber-700" },
                ].map((event, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.color}`}>
                        <CheckCircle2 size={20} />
                      </div>
                      {i < 2 && (
                        <div className="w-0.5 flex-1 mt-2 bg-gray-200 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="font-semibold text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{event.sub}</div>
                      <div className="text-sm text-gray-500 mt-1 font-mono">{event.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Novo/Editar Funcionário */}
      {modalNewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Novo Funcionário</h2>
              <button
                onClick={() => setModalNewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
                    <input
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Ex: Cozinheiro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option>Cozinha</option>
                      <option>Atendimento</option>
                      <option>Montagem</option>
                      <option>Administração</option>
                      <option>Recepção</option>
                      <option>Logística</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de admissão</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalNewOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                >
                  <Plus size={18} /> Salvar Funcionário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Solicitar Férias */}
      {modalVacationOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Solicitar Férias</h2>
              <button
                onClick={() => setModalVacationOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funcionário</label>
                <input
                  value={selectedEmployee.name}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-medium"
                />
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
                    Data de início
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de término
                  </label>
                  <input
                    type="date"
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
                  <span>Saldo restante após solicitação:</span>
                  <span className="text-emerald-700 font-bold">15 dias</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações / justificativa
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Motivo da solicitação ou observações..."
                />
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalVacationOpen(false)}
                  className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition flex items-center gap-2"
                >
                  <Calendar size={18} /> Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}