import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SobrePage from "./pages/SobrePage";
import FodmapPage from "./pages/FodmapPage";
import SintomasPage from "./pages/SintomasPage";
import LocacoesPage from "./pages/LocacoesPage";
import TestemunhosPage from "./pages/TestemunhosPage";
import ContactosPage from "./pages/ContactosPage";
import PagamentoPage from "./pages/PagamentoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/fodmap" element={<FodmapPage />} />
          <Route path="/sintomas" element={<SintomasPage />} />
          <Route path="/localizacoes" element={<LocacoesPage />} />
          <Route path="/testemunhos" element={<TestemunhosPage />} />
          <Route path="/contactos" element={<ContactosPage />} />
          <Route path="/pagamento" element={<PagamentoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
