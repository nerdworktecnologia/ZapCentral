import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Skeleton } from "@/components/ui/skeleton";

const Index        = lazy(() => import("./pages/Index"));
const CRM          = lazy(() => import("./pages/CRM"));
const Chat         = lazy(() => import("./pages/Chat"));
const AI           = lazy(() => import("./pages/AI"));
const Automacao    = lazy(() => import("./pages/Automacao"));
const Clientes     = lazy(() => import("./pages/Clientes"));
const Passeios     = lazy(() => import("./pages/Passeios"));
const NPS          = lazy(() => import("./pages/NPS"));
const Documentos   = lazy(() => import("./pages/Documentos"));
const Pagamentos   = lazy(() => import("./pages/Pagamentos"));
const Relatorios   = lazy(() => import("./pages/Relatorios"));
const Configuracoes= lazy(() => import("./pages/Configuracoes"));
const NotFound     = lazy(() => import("./pages/NotFound"));
const Landing      = lazy(() => import("./pages/Landing"));
const Obrigado     = lazy(() => import("./pages/Obrigado"));

function PageLoader() {
  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
