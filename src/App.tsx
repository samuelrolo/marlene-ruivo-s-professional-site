import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { CookieConsent } from "./components/CookieConsent";
import SobrePage from "./pages/SobrePage";
import FodmapPage from "./pages/FodmapPage";
import SintomasPage from "./pages/SintomasPage";
import LocacoesPage from "./pages/LocacoesPage";
import TestemunhosPage from "./pages/TestemunhosPage";
import ContactosPage from "./pages/ContactosPage";
import PagamentoPage from "./pages/PagamentoPage";
import AgendamentoPage from "./pages/AgendamentoPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <CookieConsent />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/fodmap" element={<FodmapPage />} />
      <Route path="/sintomas" element={<SintomasPage />} />
      <Route path="/localizacoes" element={<LocacoesPage />} />
      <Route path="/testemunhos" element={<TestemunhosPage />} />
      <Route path="/contactos" element={<ContactosPage />} />
      <Route path="/pagamento" element={<PagamentoPage />} />
      <Route path="/agendamento" element={<AgendamentoPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

// Force re-deploy to apply UI updates and user account system
