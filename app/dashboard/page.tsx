// app/dashboard/page.tsx
"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

type StatCard = {
  icon: string;
  iconBg: string;
  value: string;
  label: string;
  trend?: string;
  trendColor?: string;
};

type TimelineEvent = {
  time: string;
  title: string;
  subtitle: string;
  status: string;
  statusBg: string;
  statusColor: string;
};

type AlertItem = {
  type: "danger" | "warning" | "info";
  icon: string;
  title: string;
  desc: string;
  meta: string;
};

type EventItem = {
  day: string;
  month: string;
  name: string;
  client: string;
  status: string;
  statusBg: string;
  statusColor: string;
};

type StockItem = {
  name: string;
  current: number;
  max: number;
  unit: string;
  status: "critical" | "warning" | "ok";
};

const stats: StatCard[] = [
  { icon: "📅", iconBg: "var(--brand-dim)", value: "4", label: "Eventos hoje", trend: "↑ 1 vs ontem", trendColor: "var(--green)" },
  { icon: "💰", iconBg: "rgba(22,163,74,.1)", value: "R$ 32,8k", label: "Faturamento mês", trend: "↑ 12% vs fev", trendColor: "var(--green)" },
  { icon: "⚠️", iconBg: "rgba(217,119,6,.1)", value: "8", label: "Alertas ativos", trend: "3 críticos", trendColor: "var(--text2)" },
  { icon: "👥", iconBg: "rgba(124,58,237,.09)", value: "18", label: "Funcionários", trend: "2 em férias", trendColor: "var(--text2)" },
];

const timeline: TimelineEvent[] = [
  { time: "13:00", title: "Aniversário Sofia", subtitle: "80 convidados · Salão Villa Bella", status: "Em andamento", statusBg: "var(--brand-dim)", statusColor: "var(--brand-dark)" },
  { time: "18:00", title: "Coquetel Empresarial", subtitle: "50 convidados · Escritório XPTO", status: "Próximo", statusBg: "rgba(217,119,6,.1)", statusColor: "#78350f" },
  { time: "19:00", title: "Jantar Especial", subtitle: "30 convidados · Reservado", status: "Próximo", statusBg: "rgba(217,119,6,.1)", statusColor: "#78350f" },
  { time: "20:00", title: "Casamento Silva", subtitle: "120 convidados · (CANCELADO)", status: "Cancelado", statusBg: "rgba(220,38,38,.08)", statusColor: "#7f1d1d" },
];

const alerts: AlertItem[] = [
  { type: "danger", icon: "⚠️", title: "Estoque crítico", desc: "Açúcar, Farinha, Ovos abaixo do mínimo", meta: "3 itens · Comprar urgente" },
  { type: "warning", icon: "⏰", title: "Vencimento hoje", desc: "Leite, Iogurte, Manteiga", meta: "3 itens · Usar ou descartar" },
  { type: "info", icon: "📋", title: "Checklist pendente", desc: "Aniversário Sofia · 3 tarefas", meta: "Pós-evento" },
  { type: "warning", icon: "🔧", title: "Equipamento com avaria", desc: "Cama elástica · Rasgo na lona", meta: "Registrado 15:30" },
];

const nextEvents: EventItem[] = [
  { day: "07", month: "MAR", name: "Casamento Silva", client: "Sr. Silva · 120 convidados", status: "Confirmado", statusBg: "rgba(22,163,74,.1)", statusColor: "#14532d" },
  { day: "08", month: "MAR", name: "Formatura João", client: "Família Oliveira · 150 convidados", status: "Pré-reservado", statusBg: "var(--brand-dim)", statusColor: "var(--brand-dark)" },
  { day: "10", month: "MAR", name: "Aniversário Empresa", client: "XPTO Corp · 80 convidados", status: "Pendente", statusBg: "rgba(217,119,6,.1)", statusColor: "#78350f" },
  { day: "12", month: "MAR", name: "Aniversário 15 anos", client: "Sofia · 80 convidados", status: "Confirmado", statusBg: "rgba(22,163,74,.1)", statusColor: "#14532d" },
];

const stock: StockItem[] = [
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

export default function DashboardPage() {
  const [selectedDate] = useState("06/03/2026");

  return (
    <AppShell>
      {/* Topbar */}
      <div style={{height:54,flexShrink:0,background:"var(--surface)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 22px",gap:12}}>
        <span style={{fontSize:15,fontWeight:800,letterSpacing:"-.4px"}}>Dashboard</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <span style={{background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:30,padding:"6px 16px",fontSize:12,fontWeight:600}}>
            {selectedDate} · Hoje
          </span>
          <button style={{width:36,height:36,borderRadius:8,border:"1.5px solid var(--border)",background:"var(--surface2)",cursor:"pointer"}}>↻</button>
          <button style={{width:36,height:36,borderRadius:8,border:"1.5px solid var(--border)",background:"var(--surface2)",cursor:"pointer"}}>⚙️</button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{flex:1,overflowY:"auto",padding:24}}>
        {/* Stats Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:24}}>
          {stats.map(s => (
            <div key={s.label} style={{background:"var(--surface)",borderRadius:16,padding:20,border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:48,height:48,borderRadius:14,background:s.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:"var(--text2)",marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:28,fontWeight:800,marginBottom:2}}>{s.value}</div>
                <div style={{fontSize:12,display:"flex",alignItems:"center",gap:4,color:s.trendColor}}>{s.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Timeline + Alerts */}
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,marginBottom:24}}>
          {/* Timeline */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Linha do tempo · Hoje</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver agenda</div>
            </div>
            <div style={{padding:16}}>
              {timeline.map(t => (
                <div key={t.title} style={{display:"flex",alignItems:"center",gap:16,padding:12,borderRadius:12,background:"var(--surface2)",border:"1px solid var(--border)",marginBottom:8}}>
                  <div style={{minWidth:60,fontSize:12,fontWeight:700,color:"var(--brand-dark)"}}>{t.time}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{t.title}</div>
                    <div style={{fontSize:12,color:"var(--text2)"}}>{t.subtitle}</div>
                  </div>
                  <span style={{padding:"4px 12px",borderRadius:30,fontSize:11,fontWeight:600,background:t.statusBg,color:t.statusColor}}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Alertas e Ocorrências</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver todos</div>
            </div>
            <div style={{padding:16}}>
              {alerts.map(a => (
                <div key={a.title} style={{
                  display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,
                  borderLeft:"4px solid",
                  borderLeftColor: a.type === "danger" ? "var(--red)" : a.type === "warning" ? "var(--amber)" : "var(--brand)",
                  background: a.type === "danger" ? "rgba(220,38,38,.08)" : a.type === "warning" ? "rgba(217,119,6,.1)" : "var(--brand-dim)",
                  marginBottom:8
                }}>
                  <div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{a.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{a.title}</div>
                    <div style={{fontSize:12,color:"var(--text2)"}}>{a.desc}</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Próximos Eventos + Estoque */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
          {/* Próximos Eventos */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Próximos eventos</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver agenda</div>
            </div>
            <div style={{padding:16}}>
              {nextEvents.map(e => (
                <div key={e.name} style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,border:"1px solid var(--border)",marginBottom:8,cursor:"pointer"}}>
                  <div style={{minWidth:50,textAlign:"center",background:"var(--surface2)",borderRadius:8,padding:6}}>
                    <div style={{fontSize:16,fontWeight:800,color:"var(--brand-dark)",lineHeight:1}}>{e.day}</div>
                    <div style={{fontSize:10,color:"var(--text2)",textTransform:"uppercase"}}>{e.month}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{e.name}</div>
                    <div style={{fontSize:12,color:"var(--text2)"}}>{e.client}</div>
                  </div>
                  <span style={{padding:"4px 10px",borderRadius:30,fontSize:11,fontWeight:600,background:e.statusBg,color:e.statusColor}}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estoque em Alerta */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Estoque em alerta</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver estoque</div>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {stock.map(s => (
                  <div key={s.name} style={{padding:12,background:"var(--surface2)",borderRadius:12,border:"1px solid var(--border)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:600}}>{s.name}</span>
                      <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{s.current} / {s.max} {s.unit}</span>
                    </div>
                    <div style={{height:6,background:"var(--surface3)",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                      <div style={{
                        height:"100%",borderRadius:3,
                        background: s.status === "critical" ? "var(--red)" : s.status === "warning" ? "var(--amber)" : "var(--brand)",
                        width: `${(s.current/s.max)*100}%`
                      }} />
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--text3)"}}>
                      <span>Mín: {s.max} {s.unit}</span>
                      <span>{s.status === "critical" ? "Urgente" : s.status === "warning" ? "Comprar" : "OK"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Financeiro + Férias + Atividades */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:24}}>
          {/* Resumo Financeiro */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Resumo Financeiro</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver mais</div>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--text2)"}}>A receber (mês)</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--green)"}}>R$ 47.890</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--text2)"}}>A pagar (mês)</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--red)"}}>R$ 15.234</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--text2)"}}>Saldo atual</span>
                <span style={{fontSize:15,fontWeight:700}}>R$ 32.656</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0"}}>
                <span style={{fontSize:13,color:"var(--text2)"}}>Inadimplência</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--red)"}}>R$ 3.240</span>
              </div>
              <div style={{marginTop:12,fontSize:18,fontWeight:800,color:"var(--brand-dark)"}}>Projeção: R$ 55.795</div>
            </div>
          </div>

          {/* Férias */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:14,fontWeight:800}}>Férias</div>
              <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver calendário</div>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px dashed var(--border)"}}>
                <div style={{minWidth:50,textAlign:"center",background:"rgba(217,119,6,.1)",borderRadius:8,padding:6}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#78350f",lineHeight:1}}>06-20</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>MAR</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>Ana Souza</div>
                  <div style={{fontSize:11,color:"var(--text2)"}}>Atendimento · 15 dias</div>
                </div>
                <span style={{padding:"2px 8px",borderRadius:20,background:"rgba(217,119,6,.1)",color:"#78350f",fontSize:10}}>Em férias</span>
              </div>
              
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px dashed var(--border)"}}>
                <div style={{minWidth:50,textAlign:"center",background:"rgba(217,119,6,.1)",borderRadius:8,padding:6}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#78350f",lineHeight:1}}>06-20</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>MAR</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>Carlos Lima</div>
                  <div style={{fontSize:11,color:"var(--text2)"}}>Cozinha · 15 dias</div>
                </div>
                <span style={{padding:"2px 8px",borderRadius:20,background:"rgba(217,119,6,.1)",color:"#78350f",fontSize:10}}>Em férias</span>
              </div>
              
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0"}}>
                <div style={{minWidth:50,textAlign:"center",background:"rgba(220,38,38,.08)",borderRadius:8,padding:6}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#7f1d1d",lineHeight:1}}>Vence</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>10/03</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>Roberto Freitas</div>
                  <div style={{fontSize:11,color:"var(--text2)"}}>30 dias vencendo</div>
                </div>
                <span style={{padding:"2px 8px",borderRadius:20,background:"rgba(220,38,38,.08)",color:"#7f1d1d",fontSize:10}}>Urgente</span>
              </div>
              
              <div style={{marginTop:12,padding:8,background:"var(--surface2)",borderRadius:8,fontSize:12}}>
                <span style={{fontWeight:600}}>Disponibilidade hoje:</span> 16/18 funcionários
              </div>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontSize:14,fontWeight:800}}>Atividades Recentes</div>
            </div>
            <div style={{padding:16}}>
              {activities.map((a,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i < activities.length-1 ? "1px dashed var(--border)" : "none"}}>
                  <div style={{width:30,height:30,borderRadius:8,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{a.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12}}>{a.text}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Gráfico de Eventos */}
        <div style={{background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden"}}>
          <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:14,fontWeight:800}}>Eventos por dia · Março 2026</div>
            <div style={{fontSize:12,color:"var(--brand)",cursor:"pointer"}}>Ver relatório</div>
          </div>
          <div style={{padding:16}}>
            <div style={{display:"flex",alignItems:"flex-end",height:120,gap:6,marginBottom:12}}>
              {[30,45,20,15,40,60,35,50,25,30].map((h,i) => (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:"100%",background:"var(--brand)",borderRadius:"4px 4px 0 0",height:h}} />
                  <div style={{fontSize:10,color:"var(--text3)",marginTop:4}}>{String(i+1).padStart(2,'0')}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"var(--text2)"}}>
              <span>Total eventos: 24</span>
              <span>Faturamento: R$ 32.800</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}