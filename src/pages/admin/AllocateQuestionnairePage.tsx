import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Questionnaire } from '../../types/questionnaire';
import { Loader2, FileText, User, Calendar, StickyNote, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Patient {
  id: string;
  full_name: string;
  phone: string;
}

const AllocateQuestionnairePage = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar questionários ativos
      const { data: questData, error: questError } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (questError) throw questError;
      setQuestionnaires(questData || []);

      // Carregar pacientes
      const { data: patientsData, error: patientsError } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (patientsError) throw patientsError;
      setPatients(patientsData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !selectedQuestionnaire) {
      alert('Por favor selecione um paciente e um questionário');
      return;
    }

    try {
      setSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { error } = await supabase
        .from('patient_questionnaires')
        .insert({
          patient_id: selectedPatient,
          questionnaire_id: selectedQuestionnaire,
          assigned_by: user.id,
          due_date: dueDate || null,
          admin_notes: notes || null,
          status: 'pending'
        });

      if (error) throw error;

      // Obter dados do paciente e questionário para o email
      const patient = patients.find(p => p.id === selectedPatient);
      const questionnaire = questionnaires.find(q => q.id === selectedQuestionnaire);

      // Obter email do paciente
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', selectedPatient)
        .single();

      // Enviar notificação por email
      if (patient && questionnaire && profileData?.email) {
        try {
          await fetch('/api/send-questionnaire-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patientName: patient.full_name,
              patientEmail: profileData.email,
              questionnaireName: questionnaire.name,
              deadline: dueDate || null,
              notes: notes || null
            })
          });
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
          // Não bloquear o processo se o email falhar
        }
      }

      // Mostrar sucesso
      setSuccess(true);
      
      // Limpar formulário
      setSelectedPatient('');
      setSelectedQuestionnaire('');
      setDueDate('');
      setNotes('');

      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Erro ao alocar questionário:', error);
      alert('Erro ao alocar questionário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alocar Questionário
          </h1>
          <p className="text-gray-600">
            Atribua questionários a pacientes específicos
          </p>
        </div>

        {/* Mensagem de Sucesso */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Questionário alocado com sucesso!</p>
              <p className="text-sm text-green-700">O paciente já pode responder ao questionário.</p>
            </div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6">
          {/* Selecionar Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Selecionar Paciente *
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E]"
            >
              <option value="">-- Escolha um paciente --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name} {patient.phone && `(${patient.phone})`}
                </option>
              ))}
            </select>
            {patients.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Nenhum paciente encontrado no sistema
              </p>
            )}
          </div>

          {/* Selecionar Questionário */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Selecionar Questionário *
            </label>
            <select
              value={selectedQuestionnaire}
              onChange={(e) => setSelectedQuestionnaire(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E]"
            >
              <option value="">-- Escolha um questionário --</option>
              {questionnaires.map((quest) => (
                <option key={quest.id} value={quest.id}>
                  {quest.name} ({quest.category})
                </option>
              ))}
            </select>

            {/* Descrição do questionário selecionado */}
            {selectedQuestionnaire && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  {questionnaires.find(q => q.id === selectedQuestionnaire)?.description}
                </p>
              </div>
            )}
          </div>

          {/* Prazo (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Prazo (Opcional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E]"
            />
            <p className="mt-1 text-sm text-gray-500">
              Defina uma data limite para o paciente responder (opcional)
            </p>
          </div>

          {/* Notas (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <StickyNote className="w-4 h-4 inline mr-2" />
              Notas para o Paciente (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Ex: Por favor responda com atenção. Este questionário é importante para avaliar..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E] resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || !selectedPatient || !selectedQuestionnaire}
              className={cn(
                "flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                submitting || !selectedPatient || !selectedQuestionnaire
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#6FA89E] text-white hover:bg-[#5d8d84]"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A alocar...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Alocar Questionário
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPatient('');
                setSelectedQuestionnaire('');
                setDueDate('');
                setNotes('');
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </form>

        {/* Informação Adicional */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">ℹ️ Informação</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• O paciente receberá uma notificação por email e o questionário na sua área pessoal</li>
            <li>• O questionário ficará com status "Pendente" até o paciente começar a responder</li>
            <li>• Pode alocar o mesmo questionário várias vezes ao mesmo paciente</li>
            <li>• Os resultados ficam disponíveis automaticamente após conclusão</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllocateQuestionnairePage;
