import { ArrowRight, MessageCircle, Bot, BarChart3, Users, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[hsl(142,71%,45%)] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ZapCentral</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
            <a href="#depoimentos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Depoimentos</a>
            <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,38%)] text-white rounded-full px-6"
          >
            Solicitar demonstração
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight">
              Automatize o atendimento do seu aluguel por temporada no WhatsApp e aumente suas reservas
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Centralize mensagens, automatize respostas com IA e organize suas reservas em um único lugar
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,38%)] text-white rounded-full px-8 py-6 text-base gap-2"
              >
                Solicitar demonstração <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full px-8 py-6 text-base border-border"
              >
                Ver como funciona
              </Button>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/5 overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Visão do ZapCentral</span>
              </div>
              <div className="p-4 space-y-4">
                {/* Mini WhatsApp mockup */}
                <div className="flex gap-3">
                  <div className="w-[45%] rounded-xl bg-[hsl(142,71%,45%)]/10 border border-[hsl(142,71%,45%)]/20 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[hsl(142,71%,45%)]" />
                      <span className="text-xs font-medium">WhatsApp</span>
                    </div>
                    <div className="space-y-1.5">
                      {["Sakaia Danon", "16A24", "Remy 16A24"].map((name) => (
                        <div key={name} className="flex items-center gap-2 bg-background rounded-lg px-2 py-1.5">
                          <div className="w-5 h-5 rounded-full bg-muted" />
                          <span className="text-[10px] truncate">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-xs font-semibold">Whats Autom CRM</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-[10px] text-muted-foreground">Mockign</div>
                        <div className="w-full h-10 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border-4 border-[hsl(142,71%,45%)] border-r-transparent" />
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-[10px] text-muted-foreground">Kohoster</div>
                        <div className="flex gap-0.5 items-end justify-center h-10">
                          {[40, 60, 30, 50, 70, 45].map((h, i) => (
                            <div key={i} className="w-2 rounded-t bg-[hsl(142,71%,45%)]" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating decoration */}
            <div className="absolute -z-10 top-8 -right-8 w-64 h-64 bg-[hsl(142,71%,45%)]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="bg-muted/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gerencie leads, automatize atendimentos e aumente conversões com ferramentas poderosas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, title: "Chat Omnichannel", desc: "WhatsApp e Instagram em uma única inbox inteligente" },
              { icon: Bot, title: "IA Integrada", desc: "Respostas automáticas personalizadas com inteligência artificial" },
              { icon: Users, title: "CRM Kanban", desc: "Pipeline visual com drag-and-drop para gerenciar leads" },
              { icon: BarChart3, title: "Relatórios", desc: "Dashboards e métricas em tempo real do seu negócio" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[hsl(142,71%,45%)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[hsl(142,71%,45%)]" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
            <p className="text-muted-foreground">Três passos simples para transformar seu atendimento</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Conecte seus canais", desc: "Integre WhatsApp e Instagram em minutos, sem configuração técnica" },
              { step: "02", title: "Configure a IA", desc: "Defina regras de automação e deixe a IA atender seus clientes 24/7" },
              { step: "03", title: "Acompanhe resultados", desc: "Monitore conversões, faturamento e performance em tempo real" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center space-y-4">
                <div className="text-5xl font-black text-[hsl(142,71%,45%)]/15">{step}</div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="bg-muted/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marina Costa", role: "Proprietária — Florianópolis", text: "Aumentei minhas reservas em 40% no primeiro mês usando o ZapCentral. A IA responde os hóspedes instantaneamente!" },
              { name: "Ricardo Almeida", role: "Gestor — Rio de Janeiro", text: "Antes eu perdia leads por demora no atendimento. Agora a IA cuida de tudo e eu fecho mais contratos." },
              { name: "Carla Ferreira", role: "Anfitriã — São Paulo", text: "O CRM Kanban me dá uma visão clara de cada hóspede. Recomendo para qualquer anfitrião profissional." },
            ].map(({ name, role, text }) => (
              <div key={name} className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-6 italic">"{text}"</p>
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Pronto para automatizar seu atendimento?</h2>
          <p className="text-muted-foreground text-lg">
            Comece agora e veja resultados em poucos dias
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,38%)] text-white rounded-full px-10 py-6 text-base gap-2"
          >
            Começar agora <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="sobre" className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[hsl(142,71%,45%)] flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">ZapCentral</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ZapCentral. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
