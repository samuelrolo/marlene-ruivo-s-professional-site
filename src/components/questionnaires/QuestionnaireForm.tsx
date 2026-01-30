import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Questionnaire, PatientQuestionnaire } from '../../types/questionnaire';
import QuestionRenderer from './QuestionRenderer';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuestionnaireFormProps {
  patientQuestionnaire: PatientQuestionnaire;
  questionnaire: Questionnaire;
}

const QuestionnaireForm = ({ patientQuestionnaire, questionnaire }: QuestionnaireFormProps) => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, { value: string | string[]; text?: string; points?: number }>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleQuestions = questionnaire.questions.filter(q => {
    if (!q.conditional) return true;
    
    const conditionalResponse = responses[q.conditional.question_id];
    if (!conditionalResponse) return false;

    const requiredValues = Array.isArray(q.conditional.required_value) 
      ? q.conditional.required_value 
      : [q.conditional.required_value];

    return requiredValues.includes(conditionalResponse.value as string);
  });

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;

  // Marcar como "in_progress" na primeira interação
  useEffect(() => {
    if (patientQuestionnaire.status === 'pending') {
      updateStatus('in_progress');
    }
  }, []);

  const updateStatus = async (status: 'in_progress' | 'completed') => {
    const updateData: any = { status };
    if (status === 'in_progress' && !patientQuestionnaire.started_date) {
      updateData.started_date = new Date().toISOString();
    }
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString();
    }

    await supabase
      .from('patient_questionnaires')
      .update(updateData)
      .eq('id', patientQuestionnaire.id);
  };

  const handleAnswer = (value: string | string[], text?: string) => {
    const option = currentQuestion.options.find(opt => 
      Array.isArray(value) ? value.includes(opt.value) : opt.value === value
    );

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        value,
        text,
        points: option?.points
      }
    }));
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const response = responses[currentQuestion.id];
    if (!response) return false;
    if (Array.isArray(response.value)) return response.value.length > 0;
    return response.value !== '';
  };

  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const scoringRules = questionnaire.scoring_rules;

    if (scoringRules.type === 'sum') {
      return Object.values(responses).reduce((sum, response) => {
        return sum + (response.points || 0);
      }, 0);
    }

    if (scoringRules.type === 'threshold') {
      const countValue = scoringRules.count_value || 'yes';
      return Object.values(responses).filter(r => r.value === countValue).length;
    }

    return 0;
  };

  const getClassification = (score: number) => {
    const scoringRules = questionnaire.scoring_rules;

    if (scoringRules.type === 'sum') {
      const classification = scoringRules.classifications.find(c => {
        if (!c.range) return false;
        return score >= c.range[0] && score <= c.range[1];
      });
      return classification;
    }

    if (scoringRules.type === 'threshold') {
      const threshold = scoringRules.threshold || 0;
      const condition = score > threshold ? 'above_threshold' : 'below_threshold';
      return scoringRules.classifications.find(c => c.condition === condition);
    }

    return null;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const score = calculateScore();
      const classification = getClassification(score);

      // Salvar resposta
      const { error: responseError } = await supabase
        .from('questionnaire_responses')
        .insert({
          patient_questionnaire_id: patientQuestionnaire.id,
          responses,
          total_score: score,
          classification_label: classification?.label,
          classification_title: classification?.title,
          classification_description: classification?.description,
          classification_color: classification?.color
        });

      if (responseError) throw responseError;

      // Atualizar status para completed
      await updateStatus('completed');

      // Redirecionar para resultado
      navigate(`/dashboard/questionarios/${patientQuestionnaire.id}/resultado`);
    } catch (err: any) {
      console.error('Error submitting questionnaire:', err);
      setError(err.message || 'Erro ao submeter questionário');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#6FA89E]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Questão {currentQuestionIndex + 1} de {visibleQuestions.length}
          </span>
          <span className="text-sm font-medium text-[#6FA89E]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#6FA89E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questão Atual */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <QuestionRenderer
          question={currentQuestion}
          value={responses[currentQuestion.id]?.value}
          onChange={handleAnswer}
          disabled={isSubmitting}
        />
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Botões de Navegação */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all",
            currentQuestionIndex === 0 || isSubmitting
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          Anterior
        </button>

        {currentQuestionIndex < visibleQuestions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              !canProceed() || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#6FA89E] text-white hover:bg-[#5d8d84] shadow-md"
            )}
          >
            Próxima
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className={cn(
              "px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
              !canProceed() || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#6FA89E] text-white hover:bg-[#5d8d84] shadow-md"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                A submeter...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submeter
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireForm;
