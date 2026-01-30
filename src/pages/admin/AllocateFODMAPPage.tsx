import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, Apple, User, StickyNote, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Patient {
  id: string;
  full_name: string;
  phone: string;
}

const AllocateFODMAPPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);

    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert('Por favor selecione um paciente');
      return;
    }

    try {
      setSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      // Verificar se já existe checklist ativo para este paciente
      const { data: existing } = await supabase
        .from('patient_fodmap_checklists')
        .select('id')
        .eq('patient_id', selectedPatient)
        .eq('status', 'active')
        .single();

      if (existing) {
        alert('Este paciente já tem um checklist FODMAP ativo.');
        return;
      }

      // Criar checklist
      const { error } = await supabase
        .from('patient_fodmap_checklists')
        .insert({
          patient_id: selectedPatient,
          assigned_by: user.id,
          admin_notes: notes || null,
          status: 'active'
        });

      if (error) throw error;

      // Obter dados do paciente para o email
      const patient = patients.find(p => p.id === selectedPatient);

      // Obter email do paciente da tabela auth.users
      const { data: { user: authUser } } = await supabase.auth.admin.getUserById(selectedPatient);

      // Enviar notificação por email
      if (patient && authUser?.email) {
        try {
          await fetch('/api/send-fodmap-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patientName: patient.full_name,
              patientEmail: authUser.email,
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
      setNotes('');

      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Erro ao alocar checklist:', error);
      alert('Erro ao alocar checklist. Tente novamente.');
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
            Alocar Checklist FODMAP
          </h1>
          <p className="text-gray-600">
            Atribua o checklist FODMAP interativo a pacientes
          </p>
        </div>

        {/* Mensagem de Sucesso */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Checklist FODMAP alocado com sucesso!</p>
              <p className="text-sm text-green-700">O paciente já pode começar a preencher o checklist.</p>
            </div>
          </div>
        )}

        {/* Informação sobre FODMAP */}
        <div className="mb-6 p-6 bg-[#6FA89E]/10 rounded-lg border-2 border-[#6FA89E]/30">
          <h3 className="font-bold text-[#6FA89E] mb-3 flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Sobre o Checklist FODMAP
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              O checklist FODMAP contém <strong>50+ alimentos</strong> organizados em <strong>8 categorias</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Frutanos – Vegetais (8 alimentos)</li>
              <li>Frutanos – Cereais (7 alimentos)</li>
              <li>Galactanos/leguminosas (7 alimentos)</li>
              <li>Lactose (7 alimentos)</li>
              <li>Frutose – Fruta (8 alimentos)</li>
              <li>Frutose – Outros (5 alimentos)</li>
              <li>Polióis – Fruta/Vegetais (6 alimentos)</li>
              <li>Polióis – Adoçantes (4 alimentos)</li>
            </ul>
            <p className="mt-3">
              O paciente poderá registar progressivamente cada alimento testado, incluindo data, sintomas e tolerância.
            </p>
          </div>
        </div>

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

          {/* Notas (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <StickyNote className="w-4 h-4 inline mr-2" />
              Instruções para o Paciente (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Ex: Comece pelos alimentos da categoria Frutanos. Teste um alimento de cada vez e aguarde 24h antes de testar o próximo..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-[#6FA89E] resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || !selectedPatient}
              className={cn(
                "flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                submitting || !selectedPatient
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
                  <Apple className="w-5 h-5" />
                  Alocar Checklist FODMAP
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPatient('');
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
            <li>• O paciente receberá uma notificação por email e verá o checklist na sua área pessoal</li>
            <li>• Pode filtrar alimentos por categoria</li>
            <li>• Cada alimento pode ser marcado como testado com data, sintomas e tolerância</li>
            <li>• Estatísticas em tempo real mostram o progresso</li>
            <li>• Apenas um checklist ativo por paciente (pode arquivar e criar novo)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllocateFODMAPPage;
