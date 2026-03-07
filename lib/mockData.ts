// ── TYPES ──
export type EventStatus = 'confirmado' | 'pre' | 'pendente' | 'realizado' | 'cancelado';

export interface CalendarEvent {
  id: number;
  name: string;
  type: string;
  time: string;
  status: EventStatus;
  client: string;
  guests: number;
  venue: string;
  value: number;
  date: string; // 'YYYY-M-D'
}

export interface Quote {
  id: string;
  name: string;
  client: string;
  phone: string;
  date: string;
  guests: number;
  value: number;
  status: 'pendente' | 'aprovado' | 'recusado' | 'expirado' | 'convertido';
  expiresAt: string;
  createdAt: string;
  notes: string;
  items: { name: string; price: number }[];
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: 'salgado' | 'doce' | 'bebida' | 'brinquedo' | 'equipe';
  emoji: string;
  sellPrice: number;
  costPrice: number;
  stock: number;
  stockUnit: string;
  yield: number;
  shelfLifeHours: number;
  prepTimeMin: number;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  description: string;
  ingredients: { name: string; qty: number; unit: string; costPerUnit: number }[];
}

export interface Package {
  id: string;
  name: string;
  tag: 'basic' | 'popular' | 'premium' | 'corporate';
  label: string;
  emoji: string;
  minPax: number;
  description: string;
  active: boolean;
  tiers: { min: number; max: number; pricePerPax: number }[];
  items: { emoji: string; name: string; desc: string; qtyPerPax: string; optional: boolean; costPer100: number }[];
}

// ── EVENTS ──
export const mockEvents: Record<string, CalendarEvent[]> = {
  '2025-6-7':  [{ id:1, name:'Anivers. Lucas 7a', type:'Infantil', time:'14:00–18:00', status:'confirmado', client:'Patrícia Lima', guests:80,  venue:'Salão Azul',     value:4800,  date:'2025-6-7'  }],
  '2025-6-14': [
    { id:2, name:'Anivers. Sofia — 6a', type:'Infantil',   time:'15:00–19:00', status:'confirmado', client:'Fernanda Oliveira',  guests:120, venue:'Salão Principal', value:9200,  date:'2025-6-14' },
    { id:3, name:'Casamento Pereira',   type:'Casamento',  time:'19:00–02:00', status:'pre',        client:'Carlos & Ana Pereira', guests:160, venue:'Espaço Garden', value:18500, date:'2025-6-14' },
  ],
  '2025-6-15': [{ id:4, name:'Corporativo Tech S/A',    type:'Corporativo', time:'08:00–18:00', status:'pre',       client:'Tech Solutions',       guests:200, venue:'Salão A',        value:12000, date:'2025-6-15' }],
  '2025-6-19': [{ id:5, name:'Anivers. Roberto 40a',    type:'Adulto',      time:'20:00–00:00', status:'pendente',  client:'Roberto Mendes',       guests:60,  venue:'Salão B',        value:3200,  date:'2025-6-19' }],
  '2025-6-21': [
    { id:6, name:'Formatura Medicina USP', type:'Formatura', time:'18:00–01:00', status:'confirmado', client:'Turma Medicina USP', guests:300, venue:'Salão Principal', value:22000, date:'2025-6-21' },
    { id:7, name:'Chá de Bebê Juliana',   type:'Temático',  time:'15:00–19:00', status:'pendente',   client:'Juliana Souza',      guests:50,  venue:'Salão Rosa',      value:2800,  date:'2025-6-21' },
  ],
  '2025-6-28': [{ id:8, name:'Anivers. 50a Maria',      type:'Adulto',   time:'19:00–23:00', status:'confirmado', client:'Família Rodrigues', guests:100, venue:'Salão Garden',  value:7500,  date:'2025-6-28' }],
  '2025-6-29': [{ id:9, name:'Casamento Silva-Gomes',   type:'Casamento',time:'17:00–02:00', status:'confirmado', client:'Pedro & Luana',    guests:250, venue:'Espaço Garden', value:28000, date:'2025-6-29' }],
  '2025-6-4':  [{ id:10,name:'Chá Revelação Amanda',    type:'Revelação',time:'14:00–17:00', status:'pendente',   client:'Amanda Costa',    guests:40,  venue:'A definir',     value:1800,  date:'2025-6-4'  }],
  '2025-6-11': [{ id:11,name:'Corporativo Anual Alfa',  type:'Corporativo',time:'12:00–18:00',status:'cancelado', client:'Grupo Alfa',       guests:90,  venue:'Salão A',       value:0,     date:'2025-6-11' }],
};

// ── QUOTES ──
export const mockQuotes: Quote[] = [
  {
    id:'ORC-2025-047', name:'Aniversário Sofia — 6 anos', client:'Fernanda Oliveira', phone:'(11) 98765-4321',
    date:'14/06/2025', guests:120, value:9200, status:'pendente', expiresAt:'21/05/2025',
    createdAt:'09/05/2025', notes:'Tema: Pequena Sereia. Sem frutos do mar. Confirmar cor dos balões (azul e verde).',
    items:[{name:'Pacote Premium Infantil',price:7200},{name:'Decoração Temática',price:1200},{name:'Pula-pula c/ atendente',price:800}],
  },
  {
    id:'ORC-2025-046', name:'Chá Revelação Amanda', client:'Amanda Costa', phone:'(11) 97654-3210',
    date:'04/06/2025', guests:40, value:1800, status:'pendente', expiresAt:'31/05/2025',
    createdAt:'07/05/2025', notes:'',
    items:[{name:'Pacote Essencial (40 pax)',price:1800}],
  },
  {
    id:'ORC-2025-044', name:'Corporativo Semestral', client:'Nexus Tecnologia', phone:'contato@nexus.com.br',
    date:'18/07/2025', guests:180, value:22500, status:'pendente', expiresAt:'27/05/2025',
    createdAt:'05/05/2025', notes:'Alto valor — considere follow-up proativo.',
    items:[{name:'Pacote Corporativo Completo (180 pax)',price:22500}],
  },
  {
    id:'ORC-2025-043', name:'Casamento Pereira', client:'Carlos & Ana Pereira', phone:'(11) 91234-5678',
    date:'14/06/2025', guests:160, value:18500, status:'aprovado', expiresAt:'',
    createdAt:'10/05/2025', notes:'',
    items:[{name:'Pacote Casamento Luxo (160 pax)',price:18500}],
  },
  {
    id:'ORC-2025-040', name:'Formatura Medicina USP', client:'Turma Medicina USP', phone:'(11) 3456-7890',
    date:'21/06/2025', guests:300, value:22000, status:'aprovado', expiresAt:'',
    createdAt:'05/05/2025', notes:'',
    items:[{name:'Pacote Formatura Premium (300 pax)',price:22000}],
  },
  {
    id:'ORC-2025-038', name:'Anivers. Lucas 7 anos', client:'Patrícia Lima', phone:'(11) 94567-8901',
    date:'07/06/2025', guests:80, value:4800, status:'convertido', expiresAt:'',
    createdAt:'28/04/2025', notes:'',
    items:[{name:'Pacote Premium Infantil (80 pax)',price:4800}],
  },
];

// ── MENU ITEMS ──
export const mockMenuItems: MenuItem[] = [
  {
    id:'1', code:'CF-001', name:'Coxinha de Frango', category:'salgado', emoji:'🥟',
    sellPrice:0.85, costPrice:0.32, stock:8, stockUnit:'kg',
    yield:100, shelfLifeHours:72, prepTimeMin:45, difficulty:'Média',
    description:'Salgado tradicional recheado com frango catupiry, empanado e frito na hora. Rendimento aprox. 100 unidades.',
    ingredients:[
      {name:'Massa de Coxinha',qty:5.0,unit:'kg',costPerUnit:2.80},
      {name:'Recheio de Frango',qty:2.2,unit:'kg',costPerUnit:4.50},
      {name:'Óleo de Soja',qty:1.2,unit:'L',costPerUnit:4.20},
      {name:'Farinha de Rosca',qty:0.8,unit:'kg',costPerUnit:3.20},
      {name:'Ovos',qty:4,unit:'un',costPerUnit:0.50},
    ],
  },
  {
    id:'2', code:'BG-001', name:'Brigadeiro Gourmet', category:'doce', emoji:'🍫',
    sellPrice:1.20, costPrice:0.45, stock:3, stockUnit:'kg',
    yield:50, shelfLifeHours:48, prepTimeMin:30, difficulty:'Fácil',
    description:'Brigadeiro cremoso com cobertura de granulado belga. Rendimento aprox. 50 unidades.',
    ingredients:[
      {name:'Leite condensado',qty:1.0,unit:'lata',costPerUnit:5.50},
      {name:'Chocolate em pó',qty:0.1,unit:'kg',costPerUnit:12.00},
      {name:'Manteiga',qty:0.05,unit:'kg',costPerUnit:8.00},
      {name:'Granulado',qty:0.1,unit:'kg',costPerUnit:7.50},
    ],
  },
  {
    id:'3', code:'MC-001', name:'Mini Cupcake', category:'doce', emoji:'🧁',
    sellPrice:2.50, costPrice:0.98, stock:2, stockUnit:'kg',
    yield:24, shelfLifeHours:36, prepTimeMin:60, difficulty:'Média',
    description:'Cupcake mini com cobertura de buttercream colorido. Rendimento aprox. 24 unidades.',
    ingredients:[
      {name:'Farinha de trigo',qty:0.2,unit:'kg',costPerUnit:3.50},
      {name:'Açúcar',qty:0.15,unit:'kg',costPerUnit:4.00},
      {name:'Manteiga',qty:0.1,unit:'kg',costPerUnit:8.00},
      {name:'Ovos',qty:2,unit:'un',costPerUnit:0.50},
    ],
  },
  {
    id:'4', code:'EF-001', name:'Empada de Frango', category:'salgado', emoji:'🥧',
    sellPrice:0.95, costPrice:0.38, stock:5, stockUnit:'kg',
    yield:100, shelfLifeHours:48, prepTimeMin:50, difficulty:'Média',
    description:'Empada assada recheada com frango e catupiry. Rendimento aprox. 100 unidades.',
    ingredients:[
      {name:'Massa de Empada',qty:4.0,unit:'kg',costPerUnit:3.00},
      {name:'Recheio de Frango',qty:2.0,unit:'kg',costPerUnit:4.50},
    ],
  },
  {
    id:'5', code:'RQ-001', name:'Risole de Queijo', category:'salgado', emoji:'🌯',
    sellPrice:0.90, costPrice:0.35, stock:4, stockUnit:'kg',
    yield:100, shelfLifeHours:48, prepTimeMin:40, difficulty:'Fácil',
    description:'Risole frito recheado com queijo e presunto.',
    ingredients:[
      {name:'Massa de Risole',qty:4.0,unit:'kg',costPerUnit:2.80},
      {name:'Queijo',qty:1.5,unit:'kg',costPerUnit:12.00},
    ],
  },
  {
    id:'6', code:'RF-001', name:'Refrigerante 2L', category:'bebida', emoji:'🥤',
    sellPrice:8.00, costPrice:4.50, stock:24, stockUnit:'un',
    yield:8, shelfLifeHours:720, prepTimeMin:0, difficulty:'Fácil',
    description:'Refrigerante gelado em garrafa 2L.',
    ingredients:[],
  },
  {
    id:'7', code:'SL-001', name:'Suco de Laranja 1L', category:'bebida', emoji:'🧃',
    sellPrice:6.50, costPrice:2.80, stock:12, stockUnit:'un',
    yield:4, shelfLifeHours:24, prepTimeMin:5, difficulty:'Fácil',
    description:'Suco de laranja natural 1L.',
    ingredients:[],
  },
  {
    id:'8', code:'CE-001', name:'Cama Elástica', category:'brinquedo', emoji:'🎪',
    sellPrice:350, costPrice:120, stock:3, stockUnit:'un',
    yield:1, shelfLifeHours:9999, prepTimeMin:30, difficulty:'Fácil',
    description:'Cama elástica inflável com cercado de segurança. Diária.',
    ingredients:[],
  },
];

// ── PACKAGES ──
export const mockPackages: Package[] = [
  {
    id:'1', name:'Essencial', tag:'basic', label:'📋 Básico', emoji:'📋', minPax:30, active:true,
    description:'Mesa de frios, refrigerantes, bolo e equipe mínima.',
    tiers:[{min:30,max:50,pricePerPax:38},{min:51,max:100,pricePerPax:34},{min:101,max:300,pricePerPax:30}],
    items:[
      {emoji:'🥟',name:'Salgados Mix',desc:'Coxinha, empada, risole',qtyPerPax:'5 un',optional:false,costPer100:80},
      {emoji:'🍬',name:'Doces Mix',desc:'Brigadeiro, beijinho',qtyPerPax:'3 un',optional:false,costPer100:45},
      {emoji:'🥤',name:'Bebidas',desc:'Refrigerante e suco',qtyPerPax:'1/8 garrafa',optional:false,costPer100:68},
    ],
  },
  {
    id:'2', name:'Premium Infantil', tag:'popular', label:'⭐ Mais Vendido', emoji:'⭐', minPax:50, active:true,
    description:'Completo para festas infantis com buffet frio e quente, bebidas, decoração básica e equipe completa.',
    tiers:[{min:50,max:80,pricePerPax:60},{min:81,max:150,pricePerPax:55},{min:151,max:300,pricePerPax:50}],
    items:[
      {emoji:'🥟',name:'Coxinha de Frango',desc:'Salgado · Frito',qtyPerPax:'8 un',optional:false,costPer100:115.20},
      {emoji:'🥧',name:'Empada de Frango',desc:'Salgado · Assado',qtyPerPax:'4 un',optional:false,costPer100:57.60},
      {emoji:'🍫',name:'Brigadeiro Gourmet',desc:'Doce · Tradicional',qtyPerPax:'5 un',optional:false,costPer100:46.50},
      {emoji:'🧁',name:'Mini Cupcake',desc:'Doce · Confeitaria',qtyPerPax:'2 un',optional:true,costPer100:25.20},
      {emoji:'🥤',name:'Refrigerante 2L',desc:'Bebida',qtyPerPax:'1/8 pax',optional:false,costPer100:68.00},
      {emoji:'🧃',name:'Suco de Fruta 1L',desc:'Bebida · Natural',qtyPerPax:'1/10 pax',optional:false,costPer100:55.00},
      {emoji:'🎂',name:'Bolo Personalizado',desc:'Doce · Bolo',qtyPerPax:'1 un',optional:false,costPer100:354.00},
      {emoji:'👥',name:'Equipe completa',desc:'Garçons + Cozinha',qtyPerPax:'1 equipe',optional:false,costPer100:800.00},
    ],
  },
  {
    id:'3', name:'Luxo Completo', tag:'premium', label:'◆ Premium', emoji:'◆', minPax:80, active:true,
    description:'Tudo do Premium + buffet quente, garçons e decoração temática.',
    tiers:[{min:80,max:120,pricePerPax:95},{min:121,max:200,pricePerPax:88},{min:201,max:400,pricePerPax:80}],
    items:[
      {emoji:'🥟',name:'Salgados Premium',desc:'Mix frito + assado',qtyPerPax:'10 un',optional:false,costPer100:140},
      {emoji:'🍬',name:'Doces Gourmet',desc:'Brigadeiro, cupcake, docinhos',qtyPerPax:'8 un',optional:false,costPer100:90},
      {emoji:'🍽️',name:'Buffet Quente',desc:'Frango, arroz, saladas',qtyPerPax:'1 porção',optional:false,costPer100:350},
      {emoji:'🥂',name:'Open Bar',desc:'Refrigerante, suco, água, espumante',qtyPerPax:'livre',optional:false,costPer100:120},
      {emoji:'🎈',name:'Decoração Temática',desc:'Balões, painel, mesa',qtyPerPax:'1 kit',optional:false,costPer100:200},
      {emoji:'👥',name:'Equipe + Garçons',desc:'Serviço completo',qtyPerPax:'1 equipe',optional:false,costPer100:1200},
    ],
  },
  {
    id:'4', name:'Corporativo', tag:'corporate', label:'🏢 Corporativo', emoji:'🏢', minPax:50, active:true,
    description:'Ideal para eventos empresariais: coffee break, almoço executivo e equipe profissional.',
    tiers:[{min:50,max:100,pricePerPax:75},{min:101,max:200,pricePerPax:68},{min:201,max:400,pricePerPax:60}],
    items:[
      {emoji:'☕',name:'Coffee Break',desc:'Café, chá, suco',qtyPerPax:'ilimitado',optional:false,costPer100:80},
      {emoji:'🥪',name:'Sanduíches Executivos',desc:'Frios finos',qtyPerPax:'3 un',optional:false,costPer100:95},
      {emoji:'🍽️',name:'Buffet Executivo',desc:'Prato quente completo',qtyPerPax:'1 porção',optional:false,costPer100:320},
      {emoji:'👥',name:'Equipe Profissional',desc:'Garçons uniformizados',qtyPerPax:'1 equipe',optional:false,costPer100:900},
    ],
  },
  {
    id:'5', name:'Mini Festa', tag:'basic', label:'📦 Básico', emoji:'📦', minPax:20, active:false,
    description:'Pacote descontinuado para eventos pequenos.',
    tiers:[{min:20,max:50,pricePerPax:28}],
    items:[],
  },
];
