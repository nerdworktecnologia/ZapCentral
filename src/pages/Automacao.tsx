import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, ExternalLink, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { n8n, type N8nWorkflow, type N8nExecution } from "@/lib/n8n";

const N8N_URL = (import.meta.env.VITE_N8N_URL as string) ?? "https://automacao.ieneassessoria.com.br";

function statusIcon(status: N8nExecution["status"]) {
  if (status === "success") return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
  if (status === "error") return <XCircle className="h-3.5 w-3.5 text-destructive" />;
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function Automacao() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: workflows = [], isLoading, isFetching } = useQuery({
    queryKey: ["n8n-workflows"],
    queryFn: () => n8n.getWorkflows(),
    refetchInterval: 30_000,
  });

  const { data: executions = [], isLoading: loadingExec } = useQuery({
    queryKey: ["n8n-executions", selectedId],
    queryFn: () => n8n.getExecutions(selectedId ?? undefined, 10),
    enabled: true,
    refetchInterval: 15_000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      if (active) await n8n.deactivateWorkflow(id);
      else await n8n.activateWorkflow(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["n8n-workflows"] }),
    onError: () => toast({ title: "Erro ao alterar workflow.", variant: "destructive" }),
  });

  const ativos = workflows.filter((w) => w.active).length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Automação</h1>
          <p className="text-sm text-muted-foreground">Workflows n8n em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["n8n-workflows"] })} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={N8N_URL} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" /> Abrir n8n
            </a>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total de workflows", value: workflows.length },
          { label: "Ativos", value: ativos, highlight: true },
          { label: "Inativos", value: workflows.length - ativos },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <div className={`text-2xl font-semibold mt-1 ${k.highlight ? "text-primary" : ""}`}>{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Workflows */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Workflows</h2>
          {isLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          ) : workflows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum workflow encontrado.</p>
          ) : (
            workflows.map((w) => (
              <Card
                key={w.id}
                className={`cursor-pointer transition-all rounded-xl ${selectedId === w.id ? "border-primary ring-1 ring-primary" : ""} ${!w.active ? "opacity-60" : ""}`}
                onClick={() => setSelectedId(w.id === selectedId ? null : w.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${w.active ? "bg-primary/10" : "bg-muted"}`}>
                        <Zap className={`h-4 w-4 ${w.active ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{w.name}</div>
                        <div className="text-xs text-muted-foreground">Atualizado {formatDate(w.updatedAt)}</div>
                      </div>
                    </div>
                    <Switch
                      checked={w.active}
                      disabled={toggleMutation.isPending}
                      onCheckedChange={() => toggleMutation.mutate({ id: w.id, active: w.active })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Execuções */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {selectedId ? `Execuções — ${workflows.find((w) => w.id === selectedId)?.name ?? selectedId}` : "Execuções recentes"}
          </h2>
          {loadingExec ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)
          ) : executions.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="p-5 text-sm text-muted-foreground">
                {selectedId ? "Nenhuma execução para este workflow." : "Nenhuma execução recente."}
              </CardContent>
            </Card>
          ) : (
            executions.map((ex) => (
              <Card key={ex.id} className="rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {statusIcon(ex.status)}
                      <div>
                        <div className="text-xs font-medium capitalize">{ex.status}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(ex.startedAt)}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{ex.mode}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
