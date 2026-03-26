import { automationRules } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Automacao() {
  const [rules, setRules] = useState(automationRules);

  const toggle = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Automação</h1>
        <p className="text-muted-foreground text-sm">Regras de automação para atendimento</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className={`transition-all ${rule.active ? "border-primary/20" : "opacity-60"}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${rule.active ? "bg-primary/10" : "bg-muted"}`}>
                    <Zap className={`h-5 w-5 ${rule.active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{rule.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">{rule.trigger}</Badge>
                      <ArrowRight className="h-3 w-3" />
                      <span>{rule.action}</span>
                    </div>
                  </div>
                </div>
                <Switch checked={rule.active} onCheckedChange={() => toggle(rule.id)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
