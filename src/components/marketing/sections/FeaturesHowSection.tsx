import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/Reveal";
import { scrollToId } from "@/components/marketing/scroll";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export function FeaturesHowSection({ features }: { features: Feature[] }) {
  return (
    <>
      <section id="recursos" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Tudo que sua operação precisa
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Da reserva ao check-out: omnichannel, IA, documentos, pagamentos e NPS em um único sistema.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="group rounded-2xl transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{f.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{f.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="como-funciona" className="bg-muted/20 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Como funciona</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Em 4 passos simples, você transforma sua operação de temporada em um negócio escalável.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                {
                  title: "Conectar",
                  desc: "Integre Airbnb, Booking.com e WhatsApp em uma única caixa de entrada omnichannel.",
                  bullets: ["Conexão em minutos", "Histórico centralizado"],
                },
                {
                  title: "Organizar",
                  desc: "Visualize reservas, tarefas e hóspedes no Kanban com etapas claras do check-in ao check-out.",
                  bullets: ["Pipeline visual", "Status por etapa"],
                },
                {
                  title: "Automatizar",
                  desc: "IA responde hóspedes, coleta documentos e dispara notificações antes, durante e após a estadia.",
                  bullets: ["Atendimento 24/7", "Coleta de documentos"],
                },
                {
                  title: "Crescer",
                  desc: "Acompanhe NPS, conversões e repasses. Tome decisões com dados e escale sem aumentar equipe.",
                  bullets: ["NPS automatizado", "Repasses precisos"],
                },
              ].map((s, idx) => (
                <Card key={s.title} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <span className="text-sm font-semibold">{idx + 1}</span>
                      </div>
                      <div className="text-sm font-semibold">{s.title}</div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8">
              <Button onClick={() => scrollToId("demo")}>
                Solicitar demonstração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
