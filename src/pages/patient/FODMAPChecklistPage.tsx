import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import FODMAPChecklistView from '../../components/fodmap/FODMAPChecklistView';
import { Loader2, AlertCircle, Apple } from 'lucide-react';

const FODMAPChecklistPage = () => {
  const [checklistId, setChecklistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Não autenticado');
        return;
      }

      // Procurar checklist ativo do paciente
      const { data, error: checklistError } = await supabase
        .from('patient_fodmap_checklists')
        .select('id, admin_notes')
        .eq('patient_id', user.id)
        .eq('status', 'active')
        .order('assigned_date', { ascending: false })
        .limit(1)
        .single();

      if (checklistError) {
        if (checklistError.code === 'PGRST116') {
          // Nenhum checklist encontrado
          setError('no_checklist');
        } else {
          console.error('Erro ao carregar checklist:', checklistError);
          setError('Erro ao carregar checklist');
        }
        return;
      }

      setChecklistId(data.id);

    } catch (error) {
      console.error('Erro ao carregar checklist:', error);
      setError('Erro inesperado ao carregar checklist');
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

  if (error === 'no_checklist') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <Apple className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-900 mb-3">
              Checklist FODMAP Não Alocado
            </h2>
            <p className="text-yellow-700 mb-6">
              Ainda não tem um checklist FODMAP alocado. Entre em contacto com a Dra. Marlene Ruivo para solicitar acesso ao checklist.
            </p>
            <div className="p-4 bg-white rounded-lg border border-yellow-200 text-left">
              <h3 className="font-medium text-yellow-900 mb-2">O que é o Checklist FODMAP?</h3>
              <p className="text-sm text-yellow-800">
                O checklist FODMAP é uma ferramenta interativa que permite registar e acompanhar a sua tolerância a mais de 50 alimentos organizados em 8 categorias. É especialmente útil para quem segue a dieta Low FODMAP.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !checklistId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Erro ao Carregar Checklist
            </h2>
            <p className="text-red-700">
              {error || 'Ocorreu um erro ao carregar o checklist FODMAP.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Apple className="w-8 h-8 text-[#6FA89E]" />
            <h1 className="text-3xl font-bold text-gray-900">
              O Meu Checklist FODMAP
            </h1>
          </div>
          <p className="text-gray-600">
            Registe progressivamente cada alimento testado e acompanhe a sua tolerância
          </p>
        </div>

        {/* Instruções */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">📋 Como Usar</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Teste <strong>um alimento de cada vez</strong></li>
            <li>• Aguarde <strong>24-48 horas</strong> antes de testar o próximo</li>
            <li>• Registe a <strong>data do teste, sintomas</strong> e se <strong>tolerou ou não</strong></li>
            <li>• Use os <strong>filtros por categoria</strong> para organizar</li>
            <li>• Acompanhe o seu <strong>progresso nas estatísticas</strong></li>
          </ul>
        </div>

        {/* Checklist */}
        <FODMAPChecklistView checklistId={checklistId} />
      </div>
    </div>
  );
};

export default FODMAPChecklistPage;
