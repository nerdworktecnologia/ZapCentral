import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Lightbulb, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const aiFeatures = [
  { id: "auto-response", title: "Resposta Automática", desc: "IA responde automaticamente leads novos com perguntas de qualificação", icon: MessageSquare, defaultOn: true },
  { id: "suggestions", title: "Sugestões de Resposta", desc: "Sugere respostas contextuais para o operador durante o atendimento", icon: Lightbulb, defaultOn: true },
  { id: "qualification", title: "Qualificação de Leads", desc: "Faz perguntas sobre nome, interesse e orçamento automaticamente", icon: Bot, defaultOn: false },
  { id: "follow-up", title: "Follow-up Inteligente", desc: "Envia follow-ups personalizados baseados no contexto da conversa", icon: Zap, defaultOn: false },
];

const sampleConversation = [
  { role: "lead" as const, text: "Oi, vi o anúncio de vocês!" },
  { role: "ai" as const, text: "Olá! 😊 Que bom que nos encontrou! Qual é o seu nome?" },
  { role: "lead" as const, text: "Sou a Marina" },
  { role: "ai" as const, text: "Prazer, Marina! Qual serviço te interessou mais?" },
  { role: "lead" as const, text: "O plano empresarial" },
  { role: "ai" as const, text: "Ótima escolha! O plano empresarial tem ótimos benefícios. Qual seria o orçamento disponível para esse investimento?" },
];

export default function AI() {
  const [features, setFeatures] = useState(
    aiFeatures.map((f) => ({ ...f, enabled: f.defaultOn }))
  );

  const toggle = (id: string) => {
    setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">IA de Atendimento</h1>
        <p className="text-muted-foreground text-sm">Configure como a IA interage com seus leads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.id} className={`transition-all ${f.enabled ? "border-primary/30 shadow-sm" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${f.enabled ? "bg-primary/10" : "bg-muted"}`}>
                    <f.icon className={`h-5 w-5 ${f.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
                <Switch checked={f.enabled} onCheckedChange={() => toggle(f.id)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Simulação de Conversa com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-xl p-4 space-y-3 max-w-lg">
            {sampleConversation.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "lead" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] ${
                  msg.role === "lead"
                    ? "bg-muted text-foreground rounded-bl-md"
                    : "bg-primary/10 text-foreground rounded-br-md border border-primary/20"
                }`}>
                  {msg.role === "ai" && (
                    <Badge variant="outline" className="text-[9px] mb-1 border-primary/30 text-primary">
                      <Bot className="h-2.5 w-2.5 mr-0.5" /> IA
                    </Badge>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
