"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

const nav = [
  {
    label: "Dashboard",
    items: [
      { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/agenda", icon: "calendar", label: "Agenda" },
      { href: "/orcamentos", icon: "clipboard", label: "Orçamentos" },
      { href: "/cardapio/pacotes", icon: "layers", label: "Pacotes" },
    ],
  },
  {
    label: "Estoque",
    items: [
      { href: "/estoque/equipamentos", icon: "box", label: "Equipamentos" },
      { href: "/estoque/materiaprima", icon: "box", label: "Matéria-prima" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/financeiro/solicitacoes", icon: "dollar", label: "Solicitações" },
      { href: "/financeiro/contas-a-pagar", icon: "chart", label: "Contas a pagar" },
      { href: "/financeiro/contas-a-receber", icon: "chart", label: "Contas a receber" },
      { href: "/financeiro/fluxo-de-caixa", icon: "chart", label: "Fluxo de caixa" },
      { href: "/financeiro/relatorios", icon: "chart", label: "Relatórios" },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/clientes", icon: "people", label: "Clientes" },
      { href: "/clientes/aniversarios-proximos", icon: "cake", label: "Aniversários" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { 
        href: "/gestao/funcionarios", 
        icon: "users", 
        label: "Funcionários",
        sub: [
          { href: "/gestao/funcionarios", label: "Funcionários" },
          { href: "/gestao/funcionarios/ferias/calendario", label: "Calendário de Férias" },
          { href: "/gestao/funcionarios/ferias/relatorio-ferias", label: "Relatório de Férias" },
        ]
      },
    ],
  },
];

const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    dashboard: "M3 12h3v7h3v-7h3v7h3v-7h3v7h3v-7h3M3 12l9-9 9 9",
    calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
    clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6v4H9V3z",
    box: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    chart: "M22 12h-4l-3 9L9 3l-3 9H2",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    people: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 12a3 3 0 100-6 3 3 0 000 6z",
    cake: "M12 4L8 8h8l-4-4zM8 12v4M16 12v4M6 16h12M6 16v2a2 2 0 002 2h8a2 2 0 002-2v-2",
    "chevron-down": "M6 9l6 6 6-6",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18,flexShrink:0}}>
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
    <aside style={{width:260,flexShrink:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100vh"}}>
      {/* Logo */}
      <div style={{padding:"20px 18px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12}}>
        <Image 
          src={logo}
          alt="Logo" 
          width={38} 
          height={38}
          style={{borderRadius:10}}
        />
        <div>
          <div style={{fontSize:16,fontWeight:800,letterSpacing:"-.4px"}}>1000 Risos</div>
          <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>Gestão de Buffet</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 0"}}>
        {nav.map(group => (
          <div key={group.label} style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text3)",letterSpacing:".8px",textTransform:"uppercase",padding:"10px 18px 6px"}}>
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
                        display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 16px",
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
                        display:"flex",alignItems:"center",gap:10,padding:"9px 16px",margin:"0 6px",
                        borderRadius:8,fontSize:13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--brand-dark)" : "var(--text2)",
                        background: isActive ? "var(--brand-dim)" : "transparent",
                        textDecoration:"none",transition:"all .14s",
                      }}
                    >
                      <Icon name={item.icon} />
                      <span style={{flex:1}}>{item.label}</span>
                    </Link>
                  )}
                  
                  {hasSub && isOpen && (
                    <div style={{display:"flex",flexDirection:"column",gap:2,marginTop:4,marginLeft:38}}>
                      {item.sub!.map(s => (
                        <Link 
                          key={s.href} 
                          href={s.href} 
                          style={{
                            display:"flex",alignItems:"center",gap:8,padding:"6px 12px",
                            fontSize:12,fontWeight: path === s.href ? 600 : 500,
                            color: path === s.href ? "var(--brand-dark)" : "var(--text3)",
                            textDecoration:"none",borderRadius:6,
                            background: path === s.href ? "var(--brand-dim)" : "transparent",
                          }}
                        >
                          <span style={{width:16,fontSize:12}}>•</span>
                          <span style={{flex:1}}>{s.label}</span>
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
      <div style={{padding:14,borderTop:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,cursor:"pointer"}}>
          <div style={{
            width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--brand),var(--brand-deeper))",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,
            color:"white",flexShrink:0
          }}>
            MR
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700}}>Mariana Rocha</div>
            <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>Administradora</div>
          </div>
        </div>
      </div>
    </aside>
  );
}