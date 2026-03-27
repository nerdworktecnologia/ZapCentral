import { Reveal } from "@/components/marketing/Reveal";

export function SocialProofSection() {
  return (
    <section id="prova-social" className="border-y bg-muted/20 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">Empresas que já confiam</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Feito para hosts, imobiliárias e property managers.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:grid-cols-4">
              {["Airbnb Hosts", "Booking.com", "Imobiliárias", "Property Managers"].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center rounded-xl border bg-background px-3 py-3 text-xs font-medium text-muted-foreground"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

