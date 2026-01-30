import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, FileText, User, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface PatientQuestionnaire {
  id: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_date: string;
  completed_date: string | null;
  due_date: string | null;
  admin_notes: string | null;
  patient: {
    id: string;
    full_name: string;
  };
  questionnaire: {
    id: string;
    name: string;
    category: string;
  };
  responses?: Array<{
    question_text: string;
    answer_value: any;
    question_order: number;
  }>;
}

const QuestionnaireResultsPage = () => {
  const [data, setData] = useState<PatientQuestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: results, error } = await supabase
        .from('patient_questionnaires')
        .select(`
          id,
          status,
          assigned_date,
          completed_date,
          due_date,
          admin_notes,
          user_profiles!patient_id (
            id,
            full_name
          ),
          questionnaires!questionnaire_id (
            id,
            name,
            category
          )
        `)
        .order('assigned_date', { ascending: false });

      if (error) throw error;
      
      // Normalizar dados (Supabase retorna arrays para relações)
      const normalized = (results || []).map((item: any) => ({
        ...item,
        patient: Array.isArray(item.user_profiles) ? item.user_profiles[0] : item.user_profiles,
        questionnaire: Array.isArray(item.questionnaires) ? item.questionnaires[0] : item.questionnaires
      }));
      
      setData(normalized);

    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (patientQuestionnaireId: string) => {
    try {
      const { data: responses, error } = await supabase
        .from('questionnaire_responses')
        .select('question_text, answer_value, question_order')
        .eq('patient_questionnaire_id', patientQuestionnaireId)
        .order('question_order');

      if (error) throw error;

      // Atualizar o item com as respostas
      setData(prev => prev.map(item => 
        item.id === patientQuestionnaireId 
          ? { ...item, responses } 
          : item
      ));

    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Carregar respostas se ainda não foram carregadas
      const item = data.find(d => d.id === id);
      if (item && !item.responses && item.status === 'completed') {
        loadResponses(id);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Loader2 className="w-3 h-3" />
            Em Progresso
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Concluído
          </span>
        );
      default:
        return null;
    }
  };

  const filteredData = filterStatus === 'all' 
    ? data 
    : data.filter(item => item.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Respostas dos Questionários
          </h1>
          <p className="text-gray-600">
            Visualize todas as respostas dos pacientes aos questionários alocados
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-yellow-800 mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {data.filter(d => d.status === 'pending').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-800 mb-1">Em Progresso</p>
            <p className="text-2xl font-bold text-blue-900">
              {data.filter(d => d.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <p className="text-sm text-green-800 mb-1">Concluídos</p>
            <p className="text-2xl font-bold text-green-900">
              {data.filter(d => d.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filtrar por status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E]"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>

        {/* Lista de Questionários */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'Nenhum questionário alocado ainda' 
                : `Nenhum questionário com status "${filterStatus}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-[#6FA89E]/30 transition-all"
              >
                {/* Cabeçalho do Item */}
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Paciente */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Paciente</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {item.patient.full_name}
                      </p>
                    </div>

                    {/* Questionário */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Questionário</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {item.questionnaire.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.questionnaire.category}</p>
                    </div>

                    {/* Data */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Data de Alocação</p>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(item.assigned_date).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      {item.completed_date && (
                        <p className="text-xs text-green-600 mt-1">
                          Concluído: {new Date(item.completed_date).toLocaleDateString('pt-PT')}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>

                  {/* Ícone de Expandir */}
                  <div className="ml-4">
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                {expandedId === item.id && (
                  <div className="border-t-2 border-gray-100 bg-gray-50 p-6">
                    {/* Notas do Admin */}
                    {item.admin_notes && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-2">📝 Notas do Admin:</p>
                        <p className="text-sm text-blue-800">{item.admin_notes}</p>
                      </div>
                    )}

                    {/* Respostas */}
                    {item.status === 'completed' && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Respostas do Paciente:</h3>
                        {!item.responses ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#6FA89E]" />
                          </div>
                        ) : item.responses.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Nenhuma resposta registada</p>
                        ) : (
                          <div className="space-y-3">
                            {item.responses.map((response, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  {response.question_order}. {response.question_text}
                                </p>
                                <p className="text-sm text-gray-700 pl-4">
                                  {typeof response.answer_value === 'object' 
                                    ? JSON.stringify(response.answer_value) 
                                    : response.answer_value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {item.status === 'pending' && (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Aguardando o paciente iniciar o questionário</p>
                      </div>
                    )}

                    {item.status === 'in_progress' && (
                      <div className="text-center py-8 text-gray-500">
                        <Loader2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>O paciente está a responder ao questionário</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireResultsPage;
