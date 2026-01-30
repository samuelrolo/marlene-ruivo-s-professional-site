import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { PatientQuestionnaire, Questionnaire } from '../../types/questionnaire';
import { Loader2, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuestionnaireWithDetails extends PatientQuestionnaire {
  questionnaire: Questionnaire;
}

const QuestionnairesList = () => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { data, error } = await supabase
        .from('patient_questionnaires')
        .select(`
          *,
          questionnaire:questionnaires(*)
        `)
        .eq('patient_id', user.id)
        .order('assigned_date', { ascending: false });

      if (error) throw error;
      setQuestionnaires(data || []);
    } catch (error) {
      console.error('Erro ao carregar questionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const filteredQuestionnaires = filter === 'all'
    ? questionnaires
    : questionnaires.filter(q => q.status === filter);

  const stats = {
    total: questionnaires.length,
    pending: questionnaires.filter(q => q.status === 'pending').length,
    in_progress: questionnaires.filter(q => q.status === 'in_progress').length,
    completed: questionnaires.filter(q => q.status === 'completed').length
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
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Os Meus Questionários
          </h1>
          <p className="text-gray-600">
            Responda aos questionários alocados pela Dra. Marlene Ruivo
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-200 p-4">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pendentes</div>
          </div>
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
            <div className="text-2xl font-bold text-blue-700">{stats.in_progress}</div>
            <div className="text-sm text-blue-600">Em Progresso</div>
          </div>
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-600">Concluídos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === 'all'
                ? "bg-[#6FA89E] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === 'pending'
                ? "bg-[#6FA89E] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Pendentes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === 'in_progress'
                ? "bg-[#6FA89E] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Em Progresso ({stats.in_progress})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === 'completed'
                ? "bg-[#6FA89E] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Concluídos ({stats.completed})
          </button>
        </div>

        {/* Lista de Questionários */}
        {filteredQuestionnaires.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum questionário encontrado
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Ainda não tem questionários alocados.'
                : `Não tem questionários ${getStatusLabel(filter).toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestionnaires.map((pq) => (
              <div
                key={pq.id}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#6FA89E] transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-[#6FA89E]/10 rounded-lg">
                      <FileText className="w-6 h-6 text-[#6FA89E]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pq.questionnaire.name}
                      </h3>
                      {pq.questionnaire.description && (
                        <p className="text-gray-600 mb-3">
                          {pq.questionnaire.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Alocado em: {new Date(pq.assigned_at).toLocaleDateString('pt-PT')}
                        </span>
                        {pq.due_date && (
                          <span>
                            Prazo: {new Date(pq.due_date).toLocaleDateString('pt-PT')}
                          </span>
                        )}
                      </div>
                      {pq.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> {pq.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border-2",
                    getStatusColor(pq.status)
                  )}>
                    {getStatusIcon(pq.status)}
                    {getStatusLabel(pq.status)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {pq.status === 'completed' ? (
                    <>
                      <Link
                        to={`/dashboard/questionarios/${pq.id}/resultado`}
                        className="px-6 py-3 bg-[#6FA89E] text-white rounded-lg font-medium hover:bg-[#5d8d84] transition-all"
                      >
                        Ver Resultado
                      </Link>
                      {pq.completed_at && (
                        <span className="text-sm text-gray-500">
                          Concluído em: {new Date(pq.completed_at).toLocaleDateString('pt-PT')}
                        </span>
                      )}
                    </>
                  ) : (
                    <Link
                      to={`/dashboard/questionarios/${pq.id}`}
                      className="px-6 py-3 bg-[#6FA89E] text-white rounded-lg font-medium hover:bg-[#5d8d84] transition-all"
                    >
                      {pq.status === 'in_progress' ? 'Continuar' : 'Responder'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnairesList;
