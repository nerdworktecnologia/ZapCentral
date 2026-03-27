import { useState } from "react";
import { useLeads, useUpdateLead } from "@/hooks/use-leads";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, GripVertical, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/integrations/supabase/types";

type LeadStatus = Tables<"leads">["status"];

const columns: { id: LeadStatus; label: string; headerColor: string; dotColor: string }[] = [
  { id: "novo",        label: "Novo Lead",      headerColor: "bg-violet-50 border-violet-200 dark:bg-violet-900/20",  dotColor: "bg-violet-500" },
  { id: "atendimento", label: "Em Atendimento", headerColor: "bg-amber-50  border-amber-200  dark:bg-amber-900/20",   dotColor: "bg-amber-500" },
  { id: "proposta",    label: "Proposta",        headerColor: "bg-blue-50   border-blue-200   dark:bg-blue-900/20",    dotColor: "bg-blue-500" },
  { id: "fechado",     label: "Fechado",         headerColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20", dotColor: "bg-emerald-500" },
];

const tagStyles: Record<string, string> = {
  quente:   "bg-rose-50    text-rose-600    border-rose-200    dark:bg-rose-900/30",
  frio:     "bg-sky-50     text-sky-600     border-sky-200     dark:bg-sky-900/30",
  cliente:  "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30",
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

export default function CRM() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent, col: LeadStatus) => {
    e.preventDefault();
    setDragOver(col);
  };
  const handleDrop = (status: LeadStatus) => {
    if (!dragging) return;
    updateLead.mutate({ id: dragging, status });
    setDragging(null);
    setDragOver(null);
  };
  const handleDragLeave = () => setDragOver(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-[400px]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CRM Kanban</h1>
        <p className="text-muted-foreground text-sm">Arraste os cards entre as colunas para atualizar o status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colLeads = (leads || []).filter((l) => l.status === col.id);
          const totalValue = colLeads.reduce((s, l) => s + Number(l.value), 0);
          const isOver = dragOver === col.id;

          return (
            <div
              key={col.id}
              className={`rounded-xl border transition-colors ${col.headerColor} ${isOver ? "ring-2 ring-primary/40" : ""}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={() => handleDrop(col.id)}
              onDragLeave={handleDragLeave}
            >
              {/* Column header */}
              <div className="px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${col.dotColor}`} />
                  <span className="text-sm font-semibold">{col.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs h-5 px-1.5">{colLeads.length}</Badge>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[320px]">
                {colLeads.map((lead, idx) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all bg-card ${
                      dragging === lead.id ? "opacity-40 scale-95" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                        {initials(lead.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-sm truncate">{lead.name}</span>
                          <Badge variant="outline" className={`text-[9px] shrink-0 px-1.5 ${tagStyles[lead.tag]}`}>
                            {lead.tag}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                        {lead.notes && (
                          <p className="text-xs text-muted-foreground truncate mt-1">{lead.notes}</p>
                        )}
                        {lead.value > 0 && (
                          <div className="flex items-center gap-0.5 mt-1.5">
                            <DollarSign className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-600">
                              {Number(lead.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                        )}
                      </div>
                      <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                    </div>
                  </Card>
                ))}

                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-border/50">
                    <p className="text-xs text-muted-foreground">Arraste um lead aqui</p>
                  </div>
                )}
              </div>

              {/* Column footer with total value */}
              {totalValue > 0 && (
                <div className="px-3 py-2 border-t border-border/40 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
