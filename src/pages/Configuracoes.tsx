import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Webhook, Users } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Configuracoes() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.company_name);
      setCompanyEmail(settings.company_email);
    }
  }, [settings]);

  const handleSave = () => {
    if (!settings) return;
    updateSettings.mutate(
      { id: settings.id, company_name: companyName, company_email: companyEmail },
      { onSuccess: () => toast.success("Configurações salvas!") }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações do sistema</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Webhook className="h-4 w-4 text-primary" /> API WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-warning/10 text-warning border-warning/20" variant="outline">Simulada</Badge>
            <span className="text-sm text-muted-foreground">Integração simulada para demonstração</span>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input defaultValue={settings?.api_key || ""} type="password" />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input defaultValue={settings?.webhook_url || ""} readOnly />
          </div>
          <Button variant="outline">Testar Conexão</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Admin", email: "admin@flowai.com", role: "Administrador" },
              { name: "Operador 1", email: "op1@flowai.com", role: "Operador" },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{u.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
