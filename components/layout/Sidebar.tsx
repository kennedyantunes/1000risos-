"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image"; // ← Isso aqui é OBRIGATÓRIO
import logo from "@/app/assets/logo.png";

const nav = [
  {
    label: "Dashboard",
    items: [
      { href: "/dashboard", icon: "calendar", label: "Dashboard", badge: "8" },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/agenda", icon: "calendar", label: "Agenda", badge: "8" },
      { href: "/orcamentos", icon: "clipboard", label: "Orçamentos", badge: "3", badgeAmber: true },
      { 
        href: "/estoque", 
        icon: "box", 
        label: "Estoque",
        sub: [
          { href: "/estoque/equipamentos", label: "Equipamentos" },
          { href: "/estoque/materiaprima", label: "Matéria-prima", badge: "12" },
        ]
      },
      { 
        href: "/agenda/checklist", 
        icon: "layers2", 
        label: "Checklist", 
        badge: "12" 
      },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/financeiro/solicitacoes", icon: "dollar", label: "Solicitações", badge: "12" },
      { href: "/financeiro/contas-a-pagar", icon: "chart", label: "Contas a pagar" },
      { href: "/financeiro/contas-a-receber", icon: "chart", label: "Contas a receber" },
      { href: "/financeiro/fluxo-de-caixa", icon: "chart", label: "Fluxo de caixa" },
      { href: "/financeiro/relatorios", icon: "chart", label: "Relatórios" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/gestao/funcionarios", icon: "users", label: "Funcionários" },
      { 
        href: "/gestao/funcionarios/ferias", 
        icon: "users", 
        label: "Férias",
        sub: [
          { href: "/gestao/funcionarios/ferias/calendario", label: "Calendário" },
          { href: "/gestao/funcionarios/ferias/relatorio-ferias", label: "Relatório" },
        ]
      },
      { 
        href: "/cardapio", 
        icon: "layers", 
        label: "Cardápio",
        sub: [
          { href: "/cardapio/itens", label: "Itens & Receitas" },
          { href: "/cardapio/pacotes", label: "Pacotes" },
        ]
      },
    ],
  },
];

const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
    clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6v4H9V3z",
    box: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
    shopping: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    chart: "M22 12h-4l-3 9L9 3l-3 9H2",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    layers2: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    "chevron-down": "M6 9l6 6 6-6",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15,flexShrink:0}}>
      {icons[name]?.split("M").filter(Boolean).map((d,i) => (
        <path key={i} d={"M"+d} />
      ))}
    </svg>
  );
};

export default function Sidebar() {
  const path = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isMenuOpen = (item: any) => {
    if (item.sub) {
      return openMenus[item.label] ?? item.sub.some((s: any) => path.startsWith(s.href));
    }
    return false;
  };

  return (
    <aside style={{width:240,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100vh"}}>
      {/* Logo */}
      <div style={{padding:"18px 16px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        {/* ← 3. Substitua o div do emoji por isso: */}
        <Image 
          src={logo}
          alt="Logo" 
          width={34} 
          height={34}
          style={{borderRadius:9}}
        />
        <div>
          <div style={{fontSize:14,fontWeight:800,letterSpacing:"-.4px"}}>1000 Risos</div>
          <div style={{fontSize:10,color:"var(--text3)",marginTop:1}}>Gestão de Buffet</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {nav.map(group => (
          <div key={group.label} style={{marginBottom:8}}>
            <div style={{fontSize:9.5,fontWeight:700,color:"var(--text3)",letterSpacing:".9px",textTransform:"uppercase",padding:"8px 16px 4px"}}>
              {group.label}
            </div>
            {group.items.map(item => {
              const hasSub = item.sub && item.sub.length > 0;
              const isActive = !hasSub && path === item.href;
              const isOpen = isMenuOpen(item);

              return (
                <div key={item.label} style={{marginBottom:2}}>
                  {hasSub ? (
                    <button
                      onClick={() => toggleMenu(item.label)}
                      style={{
                        display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 12px",
                        border:"none",background:"transparent",fontSize:13,cursor:"pointer",
                        color: isOpen ? "var(--brand-dark)" : "var(--text2)",
                        fontWeight: isOpen ? 600 : 500,
                      }}
                    >
                      <Icon name={item.icon} />
                      <span style={{flex:1,textAlign:"left"}}>{item.label}</span>
                      <Icon name="chevron-down" />
                    </button>
                  ) : (
                    <Link 
                      href={item.href} 
                      style={{
                        display:"flex",alignItems:"center",gap:8,padding:"7px 12px",margin:"0 4px",
                        borderRadius:6,fontSize:13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--brand-dark)" : "var(--text2)",
                        background: isActive ? "var(--brand-dim)" : "transparent",
                        textDecoration:"none",transition:"all .14s",
                      }}
                    >
                      <Icon name={item.icon} />
                      <span style={{flex:1}}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,
                          background:item.badgeAmber ? "var(--pendente)" : "var(--brand)",
                          color:"white",marginLeft:"auto"
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                  
                  {hasSub && isOpen && (
                    <div style={{display:"flex",flexDirection:"column",gap:1,marginTop:2,marginLeft:28}}>
                      {item.sub!.map(s => (
                        <Link 
                          key={s.href} 
                          href={s.href} 
                          style={{
                            display:"flex",alignItems:"center",gap:8,padding:"5px 12px",
                            fontSize:12,fontWeight: path === s.href ? 600 : 500,
                            color: path === s.href ? "var(--brand-dark)" : "var(--text3)",
                            textDecoration:"none",borderRadius:4,
                            background: path === s.href ? "var(--brand-dim)" : "transparent",
                          }}
                        >
                          <span style={{width:15}}>•</span>
                          <span style={{flex:1}}>{s.label}</span>
                          {s.badge && (
                            <span style={{
                              fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,
                              background:"var(--brand)",color:"white"
                            }}>
                              {s.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{padding:12,borderTop:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"7px 9px",borderRadius:9,cursor:"pointer"}}>
          <div style={{
            width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,var(--brand),var(--brand-deeper))",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,
            color:"white",flexShrink:0
          }}>
            MR
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700}}>Mariana Rocha</div>
            <div style={{fontSize:10,color:"var(--text3)",marginTop:1}}>Administradora</div>
          </div>
        </div>
      </div>
    </aside>
  );
}