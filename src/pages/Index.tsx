import { TrendingUp, TrendingDown, Users, Target, DollarSign, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { chartData, recentActivities } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useLeads } from "@/hooks/use-leads";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const activityConfig: Record<string, { color: string; label: string }> = {
  message:  { color: "bg-blue-500",   label: "Mensagem" },
  status:   { color: "bg-amber-500",  label: "Status" },
  lead:     { color: "bg-violet-500", label: "Novo lead" },
  proposal: { color: "bg-sky-500",    label: "Proposta" },
  deal:     { color: "bg-green-500",  label: "Fechado" },
};

function KpiCard({ title, value, growth, icon: Icon, prefix = "", accent }: {
  title: string; value: string | number; growth: number; icon: React.ElementType; prefix?: string;
  accent: string;
}) {
  const positive = growth >= 0;
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className={`h-9 w-9 rounded-lg ${accent} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {prefix}{typeof value === "number" ? value.toLocaleString("pt-BR") : value}
        </div>
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? "text-emerald-600" : "text-rose-500"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? "+" : ""}{growth}% vs mês anterior
        </div>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const { data: leads, isLoading } = useLeads();

  const totalLeads = leads?.length || 0;
  const conversions = leads?.filter(l => l.status === "fechado").length || 0;
  const revenue = leads?.reduce((sum, l) => sum + Number(l.value), 0) || 0;

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground capitalize">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">{getGreeting()} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Aqui está o resumo do seu negócio hoje</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/chat">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Chat ao Vivo
          </Link>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Leads do Mês"      value={totalLeads}  growth={12.5} icon={Users}       prefix=""     accent="bg-violet-500" />
        <KpiCard title="Conversões"        value={conversions} growth={8.2}  icon={Target}      prefix=""     accent="bg-emerald-500" />
        <KpiCard title="Faturamento"       value={revenue}     growth={15.3} icon={DollarSign}  prefix="R$ "  accent="bg-blue-500" />
        <KpiCard title="Tempo de Resposta" value="3min"        growth={-22}  icon={Clock}       prefix=""     accent="bg-amber-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Leads & Conversões</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-500 inline-block" />Leads
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Conversões
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#7c3aed" fill="url(#leadGrad)" strokeWidth={2} name="Leads" />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="url(#convGrad)" strokeWidth={2} name="Conversões" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Faturamento"]} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
              <Link to="/app/crm">Ver CRM <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivities.map((a, i) => {
              const cfg = activityConfig[a.type] || { color: "bg-slate-400", label: a.type };
              return (
                <div key={a.id} className={`flex items-center gap-3 py-3 ${i < recentActivities.length - 1 ? "border-b border-border/40" : ""}`}>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.color}`} />
                  <Badge variant="outline" className="text-[10px] shrink-0 hidden sm:inline-flex">{cfg.label}</Badge>
                  <span className="flex-1 text-sm">{a.text}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
