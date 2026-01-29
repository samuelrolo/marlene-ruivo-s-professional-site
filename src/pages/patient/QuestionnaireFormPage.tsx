import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import QuestionnaireForm from '@/components/questionnaires/QuestionnaireForm';
import { Loader2, AlertCircle } from 'lucide-react';
import { Questionnaire, PatientQuestionnaire } from '@/types/questionnaire';

interface QuestionnaireData {
  patientQuestionnaire: PatientQuestionnaire;
  questionnaire: Questionnaire;
}

const QuestionnaireFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Não autenticado');
        return;
      }

      // Carregar questionário alocado
      const { data: pq, error: pqError } = await supabase
        .from('patient_questionnaires')
        .select('*')
        .eq('id', id)
        .eq('patient_id', user.id)
        .single();

      if (pqError) {
        console.error('Erro ao carregar questionário:', pqError);
        setError('Questionário não encontrado ou sem permissão');
        return;
      }

      // Carregar template do questionário
      const { data: quest, error: questError } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('id', pq.questionnaire_id)
        .single();

      if (questError) {
        console.error('Erro ao carregar template:', questError);
        setError('Erro ao carregar questionário');
        return;
      }

      // Verificar se já foi completado
      if (pq.status === 'completed') {
        navigate(`/dashboard/questionarios/${id}/resultado`);
        return;
      }

      // Marcar como "em progresso" se ainda estiver pendente
      if (pq.status === 'pending') {
        await supabase
          .from('patient_questionnaires')
          .update({
            status: 'in_progress',
            started_date: new Date().toISOString()
          })
          .eq('id', id);

        pq.status = 'in_progress';
        pq.started_date = new Date().toISOString();
      }

      setData({
        patientQuestionnaire: pq,
        questionnaire: quest
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro inesperado ao carregar questionário');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Erro ao Carregar Questionário
            </h2>
            <p className="text-red-700 mb-4">
              {error || 'O questionário que procura não existe ou não tem permissão para aceder.'}
            </p>
            <button
              onClick={() => navigate('/dashboard/questionarios')}
              className="px-6 py-3 bg-[#6FA89E] text-white rounded-lg font-medium hover:bg-[#5d8d84] transition-all"
            >
              Voltar aos Questionários
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.questionnaire.name}
          </h1>
          {data.questionnaire.description && (
            <p className="text-gray-600 mb-4">{data.questionnaire.description}</p>
          )}
          
          {/* Nota do Admin */}
          {data.patientQuestionnaire.admin_notes && (
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Nota da Dra. Marlene:</strong> {data.patientQuestionnaire.admin_notes}
              </p>
            </div>
          )}
        </div>

        {/* Formulário */}
        <QuestionnaireForm 
          patientQuestionnaire={data.patientQuestionnaire}
          questionnaire={data.questionnaire}
        />
      </div>
    </div>
  );
};

export default QuestionnaireFormPage;
