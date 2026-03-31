export type LeadStatus = "novo" | "atendimento" | "proposta" | "fechado";
export type LeadTag = "quente" | "frio" | "cliente";
export type Channel = "whatsapp" | "instagram";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  tag: LeadTag;
  notes: string;
  createdAt: string;
  value: number;
}

export interface Message {
  id: string;
  leadId: string;
  content: string;
  sender: "lead" | "agent" | "ai";
  channel: Channel;
  timestamp: string;
}

export interface Conversation {
  id: string;
  lead: Lead;
  channel: Channel;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

export const leads: Lead[] = [
  { id: "1", name: "Ana Silva", phone: "(11) 99887-6543", email: "ana@email.com", status: "novo", tag: "quente", notes: "Reserva Airbnb - check-in 02/04, 3 noites, Apto 301", createdAt: "2026-03-25T10:00:00", value: 2500 },
  { id: "2", name: "Carlos Souza", phone: "(21) 98765-4321", email: "carlos@email.com", status: "atendimento", tag: "quente", notes: "Reserva Booking.com - aguardando documentos", createdAt: "2026-03-24T14:30:00", value: 4800 },
  { id: "3", name: "Maria Oliveira", phone: "(31) 97654-3210", email: "maria@email.com", status: "proposta", tag: "cliente", notes: "Hóspede frequente - check-in amanhã", createdAt: "2026-03-23T09:15:00", value: 7200 },
  { id: "4", name: "João Santos", phone: "(41) 96543-2109", email: "joao@email.com", status: "fechado", tag: "cliente", notes: "Checkout realizado - NPS enviado", createdAt: "2026-03-22T16:45:00", value: 3600 },
  { id: "5", name: "Beatriz Lima", phone: "(51) 95432-1098", email: "bia@email.com", status: "novo", tag: "frio", notes: "Consulta via WhatsApp - interesse em reserva de fim de semana", createdAt: "2026-03-26T08:00:00", value: 1200 },
  { id: "6", name: "Ricardo Pereira", phone: "(61) 94321-0987", email: "ricardo@email.com", status: "atendimento", tag: "quente", notes: "Reserva Airbnb - documentos coletados", createdAt: "2026-03-25T11:20:00", value: 5500 },
  { id: "7", name: "Fernanda Costa", phone: "(71) 93210-9876", email: "fernanda@email.com", status: "proposta", tag: "quente", notes: "Reserva longa temporada - 15 dias", createdAt: "2026-03-24T13:00:00", value: 8900 },
  { id: "8", name: "Lucas Mendes", phone: "(81) 92109-8765", email: "lucas@email.com", status: "novo", tag: "frio", notes: "", createdAt: "2026-03-26T09:30:00", value: 0 },
];

export const conversations: Conversation[] = [
  {
    id: "c1", lead: leads[0], channel: "whatsapp", lastMessage: "Preciso das instruções de check-in", lastMessageTime: "10:32",
    unread: 2,
    messages: [
      { id: "m1", leadId: "1", content: "Oi! Minha reserva é dia 02/04, como faço o check-in?", sender: "lead", channel: "whatsapp", timestamp: "10:30" },
      { id: "m2", leadId: "1", content: "Olá Ana! Seja bem-vinda! 🏠 Vou te passar todas as instruções. Primeiro, pode me enviar uma foto do seu RG ou CPF para confirmarmos o cadastro?", sender: "ai", channel: "whatsapp", timestamp: "10:30" },
      { id: "m3", leadId: "1", content: "Preciso das instruções de check-in", sender: "lead", channel: "whatsapp", timestamp: "10:32" },
    ],
  },
  {
    id: "c2", lead: leads[1], channel: "whatsapp", lastMessage: "Você pode me enviar o código da fechadura?", lastMessageTime: "09:15",
    unread: 1,
    messages: [
      { id: "m4", leadId: "2", content: "Bom dia! Você pode me enviar o código da fechadura? Chego hoje às 15h", sender: "lead", channel: "whatsapp", timestamp: "09:15" },
    ],
  },
  {
    id: "c3", lead: leads[4], channel: "whatsapp", lastMessage: "Qual a disponibilidade para o feriado?", lastMessageTime: "08:45",
    unread: 1,
    messages: [
      { id: "m5", leadId: "5", content: "Oi, vocês têm disponibilidade para o feriado de Tiradentes? 2 pessoas", sender: "lead", channel: "whatsapp", timestamp: "08:45" },
    ],
  },
  {
    id: "c4", lead: leads[5], channel: "whatsapp", lastMessage: "Obrigado pela estadia, foi ótimo!", lastMessageTime: "Ontem",
    unread: 0,
    messages: [
      { id: "m6", leadId: "6", content: "Olá Ricardo! Como foi sua estadia? 😊", sender: "ai", channel: "whatsapp", timestamp: "14:00" },
      { id: "m7", leadId: "6", content: "Obrigado pela estadia, foi ótimo!", sender: "lead", channel: "whatsapp", timestamp: "14:05" },
      { id: "m8", leadId: "6", content: "Que ótimo! 🌟 Que tal deixar uma avaliação no Airbnb? Sua opinião nos ajuda muito!", sender: "ai", channel: "whatsapp", timestamp: "14:10" },
    ],
  },
];

export const kpiData = {
  totalLeads: 248,
  leadsThisMonth: 42,
  leadsGrowth: 12.5,
  conversions: 18,
  conversionRate: 42.8,
  conversionGrowth: 8.2,
  revenue: 84600,
  revenueGrowth: 15.3,
  avgResponseTime: "3min",
  responseGrowth: -22,
};

export const chartData = [
  { month: "Out", leads: 32, conversions: 12, revenue: 58000 },
  { month: "Nov", leads: 38, conversions: 15, revenue: 67000 },
  { month: "Dez", leads: 35, conversions: 14, revenue: 63000 },
  { month: "Jan", leads: 40, conversions: 16, revenue: 72000 },
  { month: "Fev", leads: 37, conversions: 15, revenue: 71000 },
  { month: "Mar", leads: 42, conversions: 18, revenue: 84600 },
];

export const recentActivities = [
  { id: "a1", text: "Ana Silva solicitou instruções de check-in (Apto 301)", time: "2 min atrás", type: "message" as const },
  { id: "a2", text: "Carlos Souza enviou documentos - cadastro confirmado", time: "15 min atrás", type: "status" as const },
  { id: "a3", text: "Nova reserva: Beatriz Lima via Airbnb - check-in 05/04", time: "1h atrás", type: "lead" as const },
  { id: "a4", text: "NPS enviado para Fernanda Costa após checkout", time: "2h atrás", type: "proposal" as const },
  { id: "a5", text: "João Santos - Checkout realizado! R$ 3.600 recebido", time: "3h atrás", type: "deal" as const },
];

export const automationRules = [
  { id: "r1", name: "Boas-vindas ao hóspede", trigger: "Reserva confirmada (Airbnb/Booking)", action: "Enviar mensagem de boas-vindas e solicitar documentos", active: true, channel: "whatsapp" as Channel },
  { id: "r2", name: "Instruções de check-in", trigger: "24h antes do check-in", action: "Enviar endereço, código da fechadura e instruções", active: true, channel: "whatsapp" as Channel },
  { id: "r3", name: "NPS pós-checkout", trigger: "1h após checkout", action: "Enviar pesquisa de satisfação e pedir avaliação", active: true, channel: "whatsapp" as Channel },
  { id: "r4", name: "Follow-up sem resposta", trigger: "48h sem resposta a documentos", action: "Lembrar hóspede de enviar documentação pendente", active: false, channel: "whatsapp" as Channel },
];
