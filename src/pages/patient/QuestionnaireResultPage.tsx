import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle, CheckCircle, ArrowLeft, FileText } from 'lucide-react';

interface ResultData {
  questionnaire_name: string;
  questionnaire_category: string;
  completed_date: string;
  total_score: number | null;
  classification_label: string | null;
  classification_title: string | null;
  classification_description: string | null;
  classification_color: string | null;
}

const QuestionnaireResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadResult();
    }
  }, [id]);

  const loadResult = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Não autenticado');
        return;
      }

      // Carregar questionário e resposta
      const { data: pq, error: pqError } = await supabase
        .from('patient_questionnaires')
        .select(`
          *,
          questionnaire:questionnaires(name, category)
        `)
        .eq('id', id)
        .eq('patient_id', user.id)
        .single();

      if (pqError) {
        console.error('Erro ao carregar questionário:', pqError);
        setError('Questionário não encontrado');
        return;
      }

      // Verificar se foi completado
      if (pq.status !== 'completed') {
        navigate(`/dashboard/questionarios/${id}`);
        return;
      }

      // Carregar resposta
      const { data: response, error: responseError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('patient_questionnaire_id', id)
        .single();

      if (responseError) {
        console.error('Erro ao carregar resposta:', responseError);
        setError('Resultado não encontrado');
        return;
      }

      setResult({
        questionnaire_name: pq.questionnaire.name,
        questionnaire_category: pq.questionnaire.category,
        completed_date: pq.completed_date,
        total_score: response.total_score,
        classification_label: response.classification_label,
        classification_title: response.classification_title,
        classification_description: response.classification_description,
        classification_color: response.classification_color
      });

    } catch (error) {
      console.error('Erro ao carregar resultado:', error);
      setError('Erro inesperado ao carregar resultado');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string | null) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Erro ao Carregar Resultado
            </h2>
            <p className="text-red-700 mb-4">
              {error || 'O resultado que procura não existe.'}
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
        {/* Botão Voltar */}
        <Link
          to="/dashboard/questionarios"
          className="inline-flex items-center gap-2 text-[#6FA89E] hover:text-[#5d8d84] mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar aos Questionários
        </Link>

        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Questionário Concluído
            </h1>
          </div>
          <p className="text-gray-600">
            {result.questionnaire_name} • {result.questionnaire_category}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Concluído em: {new Date(result.completed_date).toLocaleDateString('pt-PT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Pontuação (se houver) */}
        {result.total_score !== null && (
          <div className="mb-6 p-6 bg-white rounded-lg border-2 border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Pontuação Total</p>
            <p className="text-5xl font-bold text-[#6FA89E]">{result.total_score}</p>
            {result.classification_label && (
              <p className="text-sm text-gray-500 mt-2">{result.classification_label}</p>
            )}
          </div>
        )}

        {/* Resultado */}
        <div className={`p-8 rounded-lg border-2 ${getColorClasses(result.classification_color)}`}>
          {result.classification_title && (
            <h2 className="text-2xl font-bold mb-4">
              {result.classification_title}
            </h2>
          )}
          
          {result.classification_description && (
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {result.classification_description}
              </p>
            </div>
          )}
        </div>

        {/* Informação Adicional */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Próximos Passos
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Este resultado está guardado e a Dra. Marlene Ruivo tem acesso</li>
            <li>• Pode consultar este resultado a qualquer momento na sua área pessoal</li>
            <li>• Se tiver dúvidas sobre o resultado, contacte a Dra. Marlene</li>
            <li>• Lembre-se: este questionário é uma autoavaliação, não substitui diagnóstico médico</li>
          </ul>
        </div>

        {/* Botão de Ação */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard/questionarios"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6FA89E] text-white rounded-lg font-medium hover:bg-[#5d8d84] transition-all"
          >
            Ver Todos os Questionários
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResultPage;
