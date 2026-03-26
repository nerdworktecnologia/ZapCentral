import { useState } from "react";
import { leads as initialLeads, Lead, LeadStatus } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, GripVertical } from "lucide-react";

const columns: { id: LeadStatus; label: string; color: string }[] = [
  { id: "novo", label: "Novo Lead", color: "bg-info/10 text-info" },
  { id: "atendimento", label: "Em Atendimento", color: "bg-warning/10 text-warning" },
  { id: "proposta", label: "Proposta", color: "bg-primary/10 text-primary" },
  { id: "fechado", label: "Fechado", color: "bg-success/10 text-success" },
];

const tagStyles: Record<string, string> = {
  quente: "bg-destructive/10 text-destructive border-destructive/20",
  frio: "bg-info/10 text-info border-info/20",
  cliente: "bg-success/10 text-success border-success/20",
};

export default function CRM() {
  const [leadsList, setLeadsList] = useState<Lead[]>(initialLeads);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (status: LeadStatus) => {
    if (!dragging) return;
    setLeadsList((prev) => prev.map((l) => l.id === dragging ? { ...l, status } : l));
    setDragging(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CRM Kanban</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus leads arrastando entre colunas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colLeads = leadsList.filter((l) => l.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-muted/50 rounded-xl p-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${col.color}`}>
                    {col.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{colLeads.length}</span>
              </div>

              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                      dragging === lead.id ? "opacity-50 rotate-1 scale-95" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate">{lead.name}</span>
                          <Badge variant="outline" className={`text-[10px] shrink-0 ${tagStyles[lead.tag]}`}>
                            {lead.tag}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                        {lead.notes && (
                          <p className="text-xs text-muted-foreground truncate">{lead.notes}</p>
                        )}
                        {lead.value > 0 && (
                          <p className="text-xs font-semibold text-primary mt-1.5">
                            R$ {lead.value.toLocaleString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
