import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const N8N_URL = (import.meta.env.VITE_N8N_URL as string) ?? "https://automacao.ieneassessoria.com.br";
const WORKFLOW_ID = "HybvOiYkrGEUxNWV";
const WORKFLOW_URL = `${N8N_URL}/workflow/${WORKFLOW_ID}`;

export default function Automacao() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card shrink-0">
        <div>
          <h1 className="text-base font-semibold">Automação — SDR Iene Assessoria</h1>
          <p className="text-xs text-muted-foreground">Workflow n8n em tempo real</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={WORKFLOW_URL} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Abrir em nova aba
          </a>
        </Button>
      </div>

      {/* Embedded n8n workflow */}
      <iframe
        src={WORKFLOW_URL}
        className="flex-1 w-full border-0"
        title="Automação n8n"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
