import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/Reveal";

const problems = [
  "Reservas dispersas em Airbnb, Booking e WhatsApp",
  "Documentos coletados manualmente por e-mail",
  "Repasses e pagamentos calculados na mão",
  "Sem visibilidade da satisfação dos hóspedes",
  "Atendimento lento que faz perder reservas",
  "Processos manuais que não escalam",
];

const solutions = [
  "Inbox omnichannel: Airbnb, Booking.com e WhatsApp",
  "Coleta automática de documentos pelo WhatsApp",
  "Distribuição automática de repasses e cobranças",
  "NPS automatizado após cada estadia",
  "IA que responde hóspedes 24/7",
  "Kanban e automações para operar em escala",
];

export function ProblemSolutionSection() {
  return (
    <>
      <section id="problema" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Gerenciar aluguel por temporada virou caos?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Canais descentralizados, processos manuais e falta de visibilidade custam reservas e dinheiro.
                </p>
              </div>
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm">
                    {problems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <X className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="solucao" className="bg-muted/20 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">O ZapCentral resolve tudo isso</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Uma plataforma completa para gestão omnichannel de aluguel por temporada.
                </p>
                <div className="mt-6 grid gap-3">
                  {solutions.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Uma central para toda sua operação</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Omnichannel, IA, documentos e pagamentos em um só lugar.
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="rounded-xl border bg-background p-4">
                    <div className="font-medium">Atendimento omnichannel com IA</div>
                    <div className="mt-1 text-muted-foreground">Airbnb, Booking.com e WhatsApp centralizados. IA responde 24/7.</div>
                  </div>
                  <div className="rounded-xl border bg-background p-4">
                    <div className="font-medium">Documentos e pagamentos automáticos</div>
                    <div className="mt-1 text-muted-foreground">Coleta via WhatsApp e repasses calculados automaticamente.</div>
                  </div>
                  <div className="rounded-xl border bg-background p-4">
                    <div className="font-medium">NPS e satisfação em tempo real</div>
                    <div className="mt-1 text-muted-foreground">Pesquisas automáticas após cada estadia com dashboard de NPS.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
