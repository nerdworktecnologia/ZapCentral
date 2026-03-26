import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Webhook, Users } from "lucide-react";

export default function Configuracoes() {
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
            <Input defaultValue="Minha Empresa LTDA" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input defaultValue="contato@minhaempresa.com" />
          </div>
          <Button>Salvar</Button>
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
            <Input defaultValue="sk-demo-xxxxxxxxxxxx" type="password" />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input defaultValue="https://api.flowai.com/webhook/whatsapp" readOnly />
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
