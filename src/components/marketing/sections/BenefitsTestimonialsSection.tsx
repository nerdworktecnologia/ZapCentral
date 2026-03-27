import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/Reveal";

const benefits = [
  "Mais reservas com atendimento instantâneo",
  "Menos trabalho manual e operação enxuta",
  "Documentos coletados sem esforço",
  "Pagamentos e repasses automatizados",
  "NPS alto e hóspedes satisfeitos",
  "Visão completa da operação em tempo real",
];

const testimonials = [
  {
    quote: "Com o ZapCentral centralizamos Airbnb, Booking e WhatsApp. Nossa taxa de resposta foi de 40% para 95%.",
    author: "João Mendes",
    role: "Property Manager — 28 imóveis",
  },
  {
    quote: "A coleta de documentos pelo WhatsApp economiza horas por semana. Os hóspedes adoram a praticidade.",
    author: "Mariana Costa",
    role: "Imobiliária de Temporada",
  },
  {
    quote: "O NPS automatizado nos mostrou que estávamos perdendo avaliações. Subimos de 7.2 para 9.1 em 3 meses.",
    author: "Rafael Lima",
    role: "Host Airbnb — Florianópolis",
  },
  {
    quote: "Os repasses automáticos eliminaram conflitos com proprietários. Tudo calculado e distribuído na hora certa.",
    author: "Fernanda Souza",
    role: "Gestora de 50+ imóveis",
  },
  {
    quote: "A IA atende os hóspedes enquanto eu durmo. Fechei mais 12 reservas no primeiro mês sem fazer nada diferente.",
    author: "Carlos Andrade",
    role: "Airbnb + Booking Host",
  },
  {
    quote: "Antes eu ficava horas no WhatsApp. Hoje o sistema cuida de 80% das mensagens e eu foco no que importa.",
    author: "Patrícia Nunes",
    role: "Proprietária — 8 apartamentos",
  },
];

export function BenefitsTestimonialsSection() {
  return (
    <>
      <section id="beneficios" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  O que você ganha com o ZapCentral
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Operação mais eficiente, hóspedes mais satisfeitos e mais reservas no piloto automático.
                </p>
              </div>
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="grid gap-3 text-sm">
                    {benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="depoimentos" className="bg-muted/20 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Depoimentos</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Resultados reais de quem já usa o ZapCentral na operação.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.author} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium leading-relaxed">"{t.quote}"</div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{t.author}</span> — {t.role}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
