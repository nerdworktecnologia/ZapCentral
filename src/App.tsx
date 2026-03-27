import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { MarketingLayout } from "@/components/MarketingLayout";
import Index from "./pages/Index";
import CRM from "./pages/CRM";
import Chat from "./pages/Chat";
import AI from "./pages/AI";
import Automacao from "./pages/Automacao";
import Clientes from "./pages/Clientes";
import Passeios from "./pages/Passeios";
import NPS from "./pages/NPS";
import Documentos from "./pages/Documentos";
import Pagamentos from "./pages/Pagamentos";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Obrigado from "./pages/Obrigado";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/obrigado" element={<Obrigado />} />
          </Route>

          <Route element={<AppShell />}>
            <Route path="/app" element={<Index />} />
            <Route path="/app/crm" element={<CRM />} />
            <Route path="/app/chat" element={<Chat />} />
            <Route path="/app/ai" element={<AI />} />
            <Route path="/app/automacao" element={<Automacao />} />
            <Route path="/app/clientes" element={<Clientes />} />
            <Route path="/app/passeios" element={<Passeios />} />
            <Route path="/app/nps" element={<NPS />} />
            <Route path="/app/documentos" element={<Documentos />} />
            <Route path="/app/pagamentos" element={<Pagamentos />} />
            <Route path="/app/relatorios" element={<Relatorios />} />
            <Route path="/app/configuracoes" element={<Configuracoes />} />
          </Route>

          <Route path="/crm" element={<Navigate to="/app/crm" replace />} />
          <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
          <Route path="/ai" element={<Navigate to="/app/ai" replace />} />
          <Route path="/automacao" element={<Navigate to="/app/automacao" replace />} />
          <Route path="/clientes" element={<Navigate to="/app/clientes" replace />} />
          <Route path="/relatorios" element={<Navigate to="/app/relatorios" replace />} />
          <Route path="/configuracoes" element={<Navigate to="/app/configuracoes" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
