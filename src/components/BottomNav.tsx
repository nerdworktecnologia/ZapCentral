import {
  LayoutDashboard, Kanban, MessageSquare, Bot, Zap, Users, BarChart3, Settings, Star, FileText, Wallet, MapPin,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "CRM", url: "/app/crm", icon: Kanban },
  { title: "Chat", url: "/app/chat", icon: MessageSquare },
  { title: "IA", url: "/app/ai", icon: Bot },
  { title: "Automação", url: "/app/automacao", icon: Zap },
  { title: "Clientes", url: "/app/clientes", icon: Users },
  { title: "Passeios", url: "/app/passeios", icon: MapPin },
  { title: "NPS", url: "/app/nps", icon: Star },
  { title: "Documentos", url: "/app/documentos", icon: FileText },
  { title: "Pagamentos", url: "/app/pagamentos", icon: Wallet },
  { title: "Relatórios", url: "/app/relatorios", icon: BarChart3 },
  { title: "Config.", url: "/app/configuracoes", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/app"}
            className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-3 text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-[10px] leading-none">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
