import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { HealthDataForm } from '../../components/HealthDataForm';

export const HealthDataFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setPatientId(user.id);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    navigate('/dashboard');
  };

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

  if (!patientId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 lg:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#6FA89E] hover:text-[#5d8d84] transition-colors flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-serif text-[#2C4A3E] mb-2">Hábitos Alimentares e Dados Clínicos</h1>
          <p className="text-gray-600">
            Preencha este formulário para ajudar a nutricionista a conhecer melhor os seus hábitos e necessidades.
          </p>
        </div>

        <HealthDataForm patientId={patientId} onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
};

export default HealthDataFormPage;
