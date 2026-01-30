import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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

interface PatientDocument {
  id: string;
  title: string;
  document_type: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
}

interface PatientQuestionnaire {
  id: string;
  questionnaire_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  assigned_date: string;
  completed_date: string | null;
  questionnaires: {
    id: string;
    name: string;
    description: string | null;
  } | {
    id: string;
    name: string;
    description: string | null;
  }[];
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [questionnaires, setQuestionnaires] = useState<PatientQuestionnaire[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

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

      // Carregar documentos
      const { data: documentsData, error: documentsError } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);

      // Carregar questionários
      const { data: questionnairesData, error: questionnairesError } = await supabase
        .from('patient_questionnaires')
        .select(`
          id,
          questionnaire_id,
          status,
          due_date,
          assigned_date,
          completed_date,
          questionnaires (
            id,
            name,
            description
          )
        `)
        .eq('patient_id', user.id)
        .order('assigned_date', { ascending: false });

      if (questionnairesError) throw questionnairesError;
      setQuestionnaires(questionnairesData || []);

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

  const startEditingProfile = () => {
    setEditedProfile(profile);
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
    setEditedProfile(null);
  };

  const saveProfileChanges = async () => {
    if (!editedProfile) return;

    setSavingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não encontrado");

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          nif: editedProfile.nif,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditingProfile(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Por favor, tenta novamente.');
    } finally {
      setSavingProfile(false);
    }
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

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      evaluation: 'Avaliação',
      meal_plan: 'Plano Alimentar',
      weight_record: 'Registo de Peso',
      intolerance: 'Intolerância',
      clinical_analysis: 'Análise Clínica',
      consultation_notes: 'Notas de Consulta',
      other: 'Outro'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
      <main className="pb-20 px-4 max-w-4xl mx-auto pt-32 lg:pt-40">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-serif text-[#2C4A3E] mb-1">A Minha Conta</h1>
                <p className="text-gray-400 text-sm">{userEmail}</p>            </div>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-[#2C4A3E] rounded-lg text-sm font-medium hover:bg-[#6FA89E] hover:text-white transition-all flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
            </button>
        </div>

        {/* Perfil */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-serif text-[#2C4A3E] uppercase tracking-wider">Dados Pessoais</h2>
            {!isEditingProfile && (
              <button
                onClick={startEditingProfile}
                className="text-xs text-[#6FA89E] hover:text-[#5d8d84] transition-colors"
              >
                Editar
              </button>
            )}
          </div>
          
          {isEditingProfile && editedProfile ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-2 block">Nome</label>
                <input
                  type="text"
                  value={editedProfile.full_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-2 block">Telemóvel</label>
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-2 block">NIF</label>
                <input
                  type="text"
                  value={editedProfile.nif || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, nif: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#6FA89E] outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveProfileChanges}
                  disabled={savingProfile}
                  className="flex-1 px-4 py-2 bg-[#6FA89E] text-white rounded-lg text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50"
                >
                  {savingProfile ? 'A guardar...' : 'Guardar'}
                </button>
                <button
                  onClick={cancelEditingProfile}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
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
              <div>
                <p className="text-gray-400 text-xs mb-1">NIF</p>
                <p className="text-[#2C4A3E]">{profile?.nif || "Não indicado"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botão Agendar Nova Consulta */}
        <div className="mb-6">
          <Link
            to="/agendamento"
            className="inline-block px-6 py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
          >
            Agendar Nova Consulta
          </Link>
        </div>

        {/* Formulário de Hábitos Alimentares */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-serif text-[#2C4A3E] uppercase tracking-wider">Hábitos Alimentares e Dados Clínicos</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Preencha o formulário de hábitos alimentares para ajudar a nutricionista a preparar a sua consulta de forma mais personalizada.
          </p>
          <Link
            to="/dashboard/habitos-alimentares"
            className="inline-block px-6 py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
          >
            📋 Preencher Formulário
          </Link>
        </div>

        {/* Os Meus Questionários */}
        {questionnaires.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
            <h2 className="text-sm font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">Os Meus Questionários</h2>
            <div className="space-y-4">
              {questionnaires.map((q) => (
                <div key={q.id} className="border border-gray-100 rounded-lg p-4 hover:border-[#6FA89E] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C4A3E] mb-1">{Array.isArray(q.questionnaires) ? q.questionnaires[0]?.name : q.questionnaires.name}</h3>
                      {(Array.isArray(q.questionnaires) ? q.questionnaires[0]?.description : q.questionnaires.description) && (
                        <p className="text-sm text-gray-600 mb-2">{Array.isArray(q.questionnaires) ? q.questionnaires[0]?.description : q.questionnaires.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Atribuído: {new Date(q.assigned_date).toLocaleDateString('pt-PT')}</span>
                        {q.due_date && (
                          <span className="text-orange-600">Prazo: {new Date(q.due_date).toLocaleDateString('pt-PT')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        q.status === 'completed' ? 'bg-green-100 text-green-700' :
                        q.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {q.status === 'completed' ? 'Concluído' :
                         q.status === 'in_progress' ? 'Em Progresso' :
                         'Pendente'}
                      </span>
                      {q.status !== 'completed' && (
                        <Link
                          to={`/dashboard/questionarios/${q.id}`}
                          className="px-4 py-2 bg-[#6FA89E] text-white rounded-lg text-sm font-medium hover:bg-[#5d8d84] transition-all"
                        >
                          Responder
                        </Link>
                      )}
                      {q.status === 'completed' && (
                        <Link
                          to={`/dashboard/questionarios/${q.id}/resultado`}
                          className="px-4 py-2 border border-[#6FA89E] text-[#6FA89E] rounded-lg text-sm font-medium hover:bg-[#6FA89E] hover:text-white transition-all"
                        >
                          Ver Resultado
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Documentos do Paciente */}
        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm mb-6">
          <h2 className="text-sm font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">Os Meus Documentos</h2>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block px-2 py-1 bg-[#6FA89E]/10 text-[#6FA89E] text-xs rounded">
                          {getDocumentTypeLabel(doc.document_type)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(doc.created_at).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                      <h3 className="text-[#2C4A3E] font-medium text-sm mb-1">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-gray-400 text-xs mb-2">{doc.description}</p>
                      )}
                      {doc.file_name && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{doc.file_name}</span>
                          {doc.file_size && <span>({formatFileSize(doc.file_size)})</span>}
                        </div>
                      )}
                    </div>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-[#6FA89E] text-white rounded-lg text-xs font-medium hover:bg-[#5d8d84] transition-all flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Abrir
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Os seus documentos, avaliações e planos alimentares aparecerão aqui.</p>
          )}
        </div>

        {/* Sem consultas */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-gray-50 shadow-sm text-center">
            <p className="text-gray-400 text-sm mb-4">Ainda não tens consultas agendadas.</p>
            <p className="text-gray-400 text-xs mb-6">Após marcar uma consulta no Google Calendar, ela aparecerá aqui automaticamente.</p>
            <Link
              to="/agendamento"
              className="inline-block px-6 py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
            >
              Agendar Primeira Consulta
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
