import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { SocialProofSection } from "@/components/marketing/sections/SocialProofSection";
import { ProblemSolutionSection } from "@/components/marketing/sections/ProblemSolutionSection";
import { FeaturesHowSection } from "@/components/marketing/sections/FeaturesHowSection";
import { BenefitsTestimonialsSection } from "@/components/marketing/sections/BenefitsTestimonialsSection";
import { AboutFinalSection } from "@/components/marketing/sections/AboutFinalSection";
import { ToursSection } from "@/components/marketing/sections/ToursSection";
import { Bot, Kanban, Bell, BarChart3, Globe2, Star, FileText, Wallet, UserCheck } from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "Omnichannel",
    description: "Airbnb, Booking.com e WhatsApp centralizados em uma única caixa de entrada",
  },
  {
    icon: Bot,
    title: "Suporte com IA 24/7",
    description: "Atendimento automático a hóspedes a qualquer hora do dia",
  },
  {
    icon: Kanban,
    title: "Kanban de tarefas",
    description: "Organize reservas e operação visualmente com quadros Kanban",
  },
  {
    icon: Star,
    title: "NPS automatizado",
    description: "Meça a satisfação dos hóspedes automaticamente após a estadia",
  },
  {
    icon: FileText,
    title: "Coleta de documentos",
    description: "Receba RG, CPF e contrato pelo WhatsApp sem esforço",
  },
  {
    icon: Wallet,
    title: "Gestão de pagamentos",
    description: "Distribua repasses e automatize cobranças com precisão",
  },
  {
    icon: UserCheck,
    title: "Qualificação com IA",
    description: "Identifique leads quentes e feche mais reservas automaticamente",
  },
  {
    icon: Bell,
    title: "Notificações automáticas",
    description: "Mensagens antes, durante e após a estadia no piloto automático",
  },
  {
    icon: BarChart3,
    title: "Relatórios",
    description: "Acompanhe desempenho, conversões e NPS em tempo real",
  },
];

const navItems = [
  { label: "Recursos", id: "recursos" },
  { label: "Como funciona", id: "como-funciona" },
  { label: "Traslados", id: "traslados" },
  { label: "Depoimentos", id: "depoimentos" },
  { label: "Sobre", id: "sobre" },
  { label: "Indique e Ganhe", id: "indique" },
];

export default function Landing() {
  const mockupSrc =
    "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=" +
    encodeURIComponent(
      "SaaS dashboard mockup, WhatsApp automation CRM, clean modern UI, green accents (#16A34A), white background, dark gray typography, cards, charts, chat inbox, kanban board, subtle shadows, premium startup landing screenshot style, high detail, 3D depth, soft lighting",
    ) +
    "&image_size=landscape_16_9";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader items={navItems} />

      <HeroSection mockupSrc={mockupSrc} />
      <SocialProofSection />
      <ProblemSolutionSection />
      <FeaturesHowSection features={features} />
      <ToursSection />
      <BenefitsTestimonialsSection />
      <AboutFinalSection />

      <MarketingFooter />
    </div>
  );
}
