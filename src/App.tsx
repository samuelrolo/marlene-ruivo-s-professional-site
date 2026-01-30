import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { CookieConsent } from "./components/CookieConsent";
import ChatBot from "./components/ChatBot";
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

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDocumentsPage from "./pages/admin/AdminDocumentsPage";
import AllocateQuestionnairePage from "./pages/admin/AllocateQuestionnairePage";
import AllocateFODMAPPage from "./pages/admin/AllocateFODMAPPage";
import QuestionnaireResultsPage from "./pages/admin/QuestionnaireResultsPage";
import { PatientHealthDataPage } from "./pages/admin/PatientHealthDataPage";

// Patient Pages
import QuestionnairesList from "./pages/patient/QuestionnairesList";
import QuestionnaireFormPage from "./pages/patient/QuestionnaireFormPage";
import QuestionnaireResultPage from "./pages/patient/QuestionnaireResultPage";
import FODMAPChecklistPage from "./pages/patient/FODMAPChecklistPage";
import HealthDataFormPage from "./pages/patient/HealthDataFormPage";

const App = () => (
  <BrowserRouter>
    <CookieConsent />
    <ChatBot />
    <Header />
    <main className="pt-24 lg:pt-32">
      <Routes>
        {/* Rotas Públicas */}
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

        {/* Dashboard do Paciente */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Rotas de Questionários do Paciente */}
        <Route path="/dashboard/questionarios" element={<QuestionnairesList />} />
        <Route path="/dashboard/questionarios/:id" element={<QuestionnaireFormPage />} />
        <Route path="/dashboard/questionarios/:id/resultado" element={<QuestionnaireResultPage />} />
        
        {/* Rota de Checklist FODMAP do Paciente */}
        <Route path="/dashboard/fodmap" element={<FODMAPChecklistPage />} />
        
        {/* Rota de Hábitos Alimentares do Paciente */}
        <Route path="/dashboard/habitos-alimentares" element={<HealthDataFormPage />} />

        {/* Painel Administrativo com Sub-rotas */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDocumentsPage />} />
          <Route path="documentos" element={<AdminDocumentsPage />} />
          <Route path="questionarios/alocar" element={<AllocateQuestionnairePage />} />
          <Route path="questionarios/resultados" element={<QuestionnaireResultsPage />} />
          <Route path="fodmap/alocar" element={<AllocateFODMAPPage />} />
          <Route path="dados-saude" element={<PatientHealthDataPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
