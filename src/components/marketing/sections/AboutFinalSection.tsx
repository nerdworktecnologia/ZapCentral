import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/Reveal";
import { DemoForm } from "@/components/marketing/DemoForm";
import { scrollToId } from "@/components/marketing/scroll";

export function AboutFinalSection() {
  return (
    <>
      <section id="indique" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border bg-gradient-to-b from-primary/10 via-background to-background p-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Indique e Ganhe</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Indique outros gestores e property managers e ganhe benefícios exclusivos no seu plano.
                </p>
              </div>
              <Button size="lg" onClick={() => scrollToId("demo")}>
                Quero indicar e ganhar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cta-intermediario" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border bg-gradient-to-b from-primary/10 via-background to-background p-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                  Pronto para transformar sua gestão de temporada?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Agende uma demonstração e veja omnichannel, IA, documentos e pagamentos funcionando juntos.
                </p>
              </div>
              <Button size="lg" onClick={() => scrollToId("demo")}>
                Solicitar demonstração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="sobre" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Sobre o ZapCentral</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  O ZapCentral foi criado para simplificar a gestão de aluguel por temporada. Nossa plataforma
                  integra Airbnb, Booking.com e WhatsApp em um sistema omnichannel com IA, automação de documentos,
                  gestão de pagamentos e NPS — tudo para você operar mais com menos esforço.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Omnichannel", "IA 24/7", "Documentos", "Pagamentos", "NPS", "Kanban", "Automação"].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold">Para quem é</div>
                  <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                    <div className="rounded-xl border bg-background p-4">
                      <div className="font-medium text-foreground">Hosts e anfitriões</div>
                      <div className="mt-1">Que usam Airbnb, Booking.com ou aluguel direto via WhatsApp.</div>
                    </div>
                    <div className="rounded-xl border bg-background p-4">
                      <div className="font-medium text-foreground">Property Managers</div>
                      <div className="mt-1">Com múltiplos imóveis que precisam de rastreabilidade e escala.</div>
                    </div>
                    <div className="rounded-xl border bg-background p-4">
                      <div className="font-medium text-foreground">Imobiliárias de Temporada</div>
                      <div className="mt-1">Que gerenciam carteiras de proprietários e precisam de repasses precisos.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="demo" className="border-t bg-muted/20 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Solicitar demonstração</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Veja o ZapCentral em ação com foco na sua operação.
                </p>
                <div className="mt-6 rounded-2xl border bg-background p-5">
                  <div className="text-sm font-semibold">O que você recebe</div>
                  <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Demonstração guiada do omnichannel, IA, documentos e pagamentos.
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Sugestões de automações para aumentar suas reservas.
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Plano de implantação personalizado para sua operação.
                    </div>
                  </div>
                </div>
              </div>
              <DemoForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
