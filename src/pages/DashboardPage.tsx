import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface UserProfile {
  full_name: string;
  phone: string;
  nif: string | null;
}

interface Appointment {
  id: string;
  appointment_date: string | null;
  consultation_type: 'first' | 'followup';
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_reference: string | null;
  created_at: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      setUserEmail(user.email || "");

      // Carregar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Carregar consultas
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Por Efectuar',
      completed: 'Efectuado',
      failed: 'Falhado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-orange-500',
      completed: 'text-green-500',
      failed: 'text-red-500',
      cancelled: 'text-gray-400'
    };
    return colors[status] || 'text-gray-500';
  };

  const getConsultationType = (type: string) => {
    return type === 'first' ? 'Primeira Consulta' : 'Consulta de Seguimento';
  };

  const isPastAppointment = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const futureAppointments = appointments.filter(apt => !isPastAppointment(apt.appointment_date));
  const pastAppointments = appointments.filter(apt => isPastAppointment(apt.appointment_date));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#6FA89E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        {/* Header com Logo e Logout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#2C4A3E] mb-1">A Minha Conta</h1>
            <p className="text-gray-400 text-xs">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs text-gray-500 hover:text-[#6FA89E] transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Perfil */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
          <h2 className="text-sm font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">Dados Pessoais</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Nome</p>
              <p className="text-[#2C4A3E]">{profile?.full_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Telemóvel</p>
              <p className="text-[#2C4A3E]">{profile?.phone}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Email</p>
              <p className="text-[#2C4A3E]">{userEmail}</p>
            </div>
            {profile?.nif && (
              <div>
                <p className="text-gray-400 text-xs mb-1">NIF</p>
                <p className="text-[#2C4A3E]">{profile.nif}</p>
              </div>
            )}
          </div>
        </div>

        {/* Botão Agendar Nova Consulta */}
        <div className="mb-6">
          <Link
            to="/contactos"
            className="inline-block px-6 py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
          >
            Agendar Nova Consulta
          </Link>
        </div>

        {/* Consultas Futuras */}
        {futureAppointments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
            <h2 className="text-sm font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">Consultas Futuras</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Data</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Valor</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {futureAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-2 text-[#2C4A3E]">
                        {apt.appointment_date 
                          ? new Date(apt.appointment_date).toLocaleDateString('pt-PT')
                          : 'Por agendar'}
                      </td>
                      <td className="py-3 px-2 text-gray-600">{getConsultationType(apt.consultation_type)}</td>
                      <td className="py-3 px-2 text-[#2C4A3E]">{apt.amount.toFixed(2)}€</td>
                      <td className={`py-3 px-2 font-medium ${getStatusColor(apt.payment_status)}`}>
                        {getStatusLabel(apt.payment_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Histórico de Consultas */}
        {pastAppointments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
            <h2 className="text-sm font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">Histórico</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Data</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Valor</th>
                    <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50 opacity-60">
                      <td className="py-3 px-2 text-[#2C4A3E]">
                        {apt.appointment_date 
                          ? new Date(apt.appointment_date).toLocaleDateString('pt-PT')
                          : 'Por agendar'}
                      </td>
                      <td className="py-3 px-2 text-gray-600">{getConsultationType(apt.consultation_type)}</td>
                      <td className="py-3 px-2 text-[#2C4A3E]">{apt.amount.toFixed(2)}€</td>
                      <td className={`py-3 px-2 font-medium ${getStatusColor(apt.payment_status)}`}>
                        {getStatusLabel(apt.payment_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sem consultas */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-gray-50 shadow-sm text-center">
            <p className="text-gray-400 text-sm mb-4">Ainda não tens consultas agendadas.</p>
            <Link
              to="/contactos"
              className="inline-block px-6 py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
            >
              Agendar Primeira Consulta
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
