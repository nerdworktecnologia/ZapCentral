import { Mail, MessageCircle } from "lucide-react";
import { scrollToId } from "@/components/marketing/scroll";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span>ZapCentral</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Plataforma omnichannel para gestão de aluguel por temporada: Airbnb, Booking.com e WhatsApp com IA, documentos e pagamentos.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">© 2026 ZapCentral</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm font-semibold">Links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <button type="button" onClick={() => scrollToId("hero")} className="text-left text-muted-foreground hover:text-foreground">
                Home
              </button>
              <button type="button" onClick={() => scrollToId("recursos")} className="text-left text-muted-foreground hover:text-foreground">
                Recursos
              </button>
              <button type="button" onClick={() => scrollToId("sobre")} className="text-left text-muted-foreground hover:text-foreground">
                Sobre
              </button>
              <button type="button" onClick={() => scrollToId("demo")} className="text-left text-muted-foreground hover:text-foreground">
                Contato
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">Contato</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <a className="inline-flex items-center gap-2 hover:text-foreground" href="https://wa.me/" target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a className="inline-flex items-center gap-2 hover:text-foreground" href="mailto:contato@zapcentral.com">
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5">
          <div className="text-sm font-semibold">Solicite uma demonstração</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Veja na prática como automatizar seu atendimento e aumentar reservas.
          </p>
          <button
            type="button"
            onClick={() => scrollToId("demo")}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Solicitar demonstração
          </button>
        </div>
      </div>
    </footer>
  );
}
