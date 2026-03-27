import {
  LayoutDashboard, Kanban, MessageSquare, Bot, Zap, Users, BarChart3, Settings, ChevronLeft, Star, FileText, Wallet, MapPin,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function useLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  useEffect(() => {
    setLogo(localStorage.getItem("company_logo"));
    const handler = () => setLogo(localStorage.getItem("company_logo"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return logo;
}

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
  { title: "Configurações", url: "/app/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const logo = useLogo();

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0 overflow-hidden">
          {logo ? (
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          ) : (
            "Z"
          )}
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
            ZapCentral
          </span>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={toggleSidebar}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/app"}
                      className="hover:bg-sidebar-accent/80 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {!collapsed && (
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
