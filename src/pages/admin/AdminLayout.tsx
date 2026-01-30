import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FileText, Apple, FolderOpen, Menu, X, BarChart3 } from "lucide-react";

const ADMIN_EMAILS = [
  "marleneruivonutricao@gmail.com",
  "samuelrolo@gmail.com"
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        alert("Acesso negado. Esta área é exclusiva para administradores.");
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      path: "/admin/documentos",
      icon: FolderOpen,
      label: "Gestão de Documentos",
      description: "Gerir documentos de pacientes"
    },
    {
      path: "/admin/questionarios/alocar",
      icon: FileText,
      label: "Alocar Questionários",
      description: "Atribuir questionários a pacientes"
    },
    {
      path: "/admin/questionarios/resultados",
      icon: BarChart3,
      label: "Ver Respostas",
      description: "Visualizar respostas dos pacientes"
    },
    {
      path: "/admin/fodmap/alocar",
      icon: Apple,
      label: "Alocar Checklist FODMAP",
      description: "Atribuir checklist FODMAP"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <p className="text-gray-400">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-[#2C4A3E] mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-400 text-sm">
                Gestão de pacientes, questionários e documentos
              </p>
            </div>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white border border-gray-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#2C4A3E]" />
              ) : (
                <Menu className="w-6 h-6 text-[#2C4A3E]" />
              )}
            </button>
          </div>

          {/* Menu de Navegação - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    active
                      ? "bg-[#6FA89E] border-[#6FA89E] text-white"
                      : "bg-white border-gray-200 text-[#2C4A3E] hover:border-[#6FA89E]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 flex-shrink-0 ${active ? "text-white" : "text-[#6FA89E]"}`} />
                    <div>
                      <h3 className={`font-medium mb-1 ${active ? "text-white" : "text-[#2C4A3E]"}`}>
                        {item.label}
                      </h3>
                      <p className={`text-sm ${active ? "text-white/80" : "text-gray-400"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Menu de Navegação - Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block p-4 rounded-lg border-2 transition-all ${
                      active
                        ? "bg-[#6FA89E] border-[#6FA89E] text-white"
                        : "bg-white border-gray-200 text-[#2C4A3E]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-6 h-6 flex-shrink-0 ${active ? "text-white" : "text-[#6FA89E]"}`} />
                      <div>
                        <h3 className={`font-medium mb-1 ${active ? "text-white" : "text-[#2C4A3E]"}`}>
                          {item.label}
                        </h3>
                        <p className={`text-sm ${active ? "text-white/80" : "text-gray-400"}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Conteúdo da Página */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
