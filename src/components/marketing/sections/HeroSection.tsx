import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/Reveal";
import { scrollToId } from "@/components/marketing/scroll";

export function HeroSection({ mockupSrc }: { mockupSrc: string }) {
  return (
    <section id="hero" className="scroll-mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-14 md:grid-cols-2 md:items-center md:pb-16 md:pt-20">
        <Reveal>
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Airbnb + Booking.com + WhatsApp + IA
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.1]">
              Gerencie seu aluguel por temporada com IA omnichannel
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Centralize Airbnb, Booking.com e WhatsApp em uma plataforma. Atenda com IA 24/7, colete documentos, gerencie pagamentos e acompanhe a satisfação dos hóspedes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => scrollToId("demo")}>
                Solicitar demonstração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToId("como-funciona")}
              >
                Ver como funciona
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Sem compromisso • Resposta em até 1 dia útil</p>
          </div>
        </Reveal>

        <Reveal className="md:justify-self-end">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
            <Card className="overflow-hidden rounded-[28px] border bg-card shadow-sm">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-semibold">Visão do ZapCentral</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={mockupSrc}
                  alt="Mockup de dashboard do ZapCentral com inbox e reservas"
                  className="h-auto w-full"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

