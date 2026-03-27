import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeadState = { lead?: { name: string; email: string; whatsapp?: string } };

export default function Obrigado() {
  const location = useLocation();
  const state = (location.state || {}) as LeadState;
  const leadName = state.lead?.name;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-16">
        <Card className="w-full rounded-2xl">
          <CardHeader>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-2xl">Solicitação enviada!</CardTitle>
            <p className="text-sm text-muted-foreground">
              {leadName ? `Obrigado, ${leadName}. ` : "Obrigado. "}Em breve entraremos em contato para agendar sua demonstração.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
              Próximos passos: você receberá uma mensagem em até 1 dia útil com opções de horário.
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

