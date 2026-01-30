import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PatientHealthData } from '../../types/healthData';
import { Link } from 'react-router-dom';

interface PatientWithHealthData {
  id: string;
  full_name: string;
  email: string;
  health_data?: PatientHealthData;
}

export const PatientHealthDataPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientWithHealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithHealthData | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      // 1. Carregar dados de saúde
      const { data: healthData, error: healthError } = await supabase
        .from('patient_health_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (healthError) {
        console.error('Erro ao carregar dados de saúde:', healthError);
        throw new Error(`Erro ao carregar dados: ${healthError.message}`);
      }

      if (!healthData || healthData.length === 0) {
        console.log('Nenhum dado de saúde encontrado');
        setPatients([]);
        return;
      }

      console.log('Health data carregado:', healthData);

      // 2. Obter IDs dos pacientes
      const patientIds = healthData.map((h: any) => h.patient_id);

      // 3. Carregar informações dos pacientes
      const { data: patientsData, error: patientsError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .in('id', patientIds);

      if (patientsError) {
        console.error('Erro ao carregar perfis:', patientsError);
        throw new Error(`Erro ao carregar perfis: ${patientsError.message}`);
      }

      console.log('Perfis carregados:', patientsData);

      // 4. Combinar dados com validação
      const combined: PatientWithHealthData[] = [];
      
      for (const health of healthData) {
        const patient = patientsData?.find((p: any) => p.id === health.patient_id);
        
        if (!patient) {
          console.warn(`Paciente não encontrado para health_data id: ${health.id}`);
          continue;
        }

        // Parse responses se vier como string
        let responses = health.responses;
        if (typeof responses === 'string') {
          try {
            responses = JSON.parse(responses);
          } catch (e) {
            console.error('Erro ao fazer parse de responses:', e);
            continue;
          }
        }

        combined.push({
          id: patient.id,
          full_name: patient.full_name,
          email: patient.email,
          health_data: {
            ...health,
            responses
          }
        });
      }

      console.log('Dados combinados:', combined);
      setPatients(combined);

    } catch (error: any) {
      console.error('Erro ao carregar pacientes:', error);
      alert(`Erro ao carregar dados dos pacientes:\n\n${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    if (filter === 'completed') return patient.health_data?.completed_at;
    if (filter === 'pending') return !patient.health_data?.completed_at;
    return true;
  });

  const completedCount = patients.filter(p => p.health_data?.completed_at).length;
  const pendingCount = patients.filter(p => !p.health_data?.completed_at).length;

  const downloadClinicalFile = async (patient: PatientWithHealthData) => {
    if (!patient.health_data?.clinical_file_url) return;
    
    try {
      // Extrair o caminho do ficheiro do URL
      const url = new URL(patient.health_data.clinical_file_url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('clinical-files') + 1).join('/');
      
      // Gerar signed URL
      const { data, error } = await supabase.storage
        .from('clinical-files')
        .createSignedUrl(filePath, 60); // 60 segundos de validade
      
      if (error) {
        console.error('Erro ao gerar signed URL:', error);
        alert('Erro ao fazer download do ficheiro');
        return;
      }
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao processar download:', error);
      alert('Erro ao fazer download do ficheiro');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dados de Saúde dos Pacientes</h1>
              <p className="text-gray-600 mt-1">Visualize e gerencie os formulários de hábitos alimentares</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Pacientes</p>
                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formulários Completos</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({patients.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completos ({completedCount})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'pending'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({pendingCount})
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Submissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum paciente encontrado
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.health_data?.completed_at ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completo
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.health_data?.completed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {patient.health_data?.completed_at ? (
                          <>
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Ver Detalhes
                            </button>
                            {patient.health_data?.clinical_file_url && (
                              <button
                                onClick={() => downloadClinicalFile(patient)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Download Análises
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Aguardando preenchimento</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedPatient && selectedPatient.health_data && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

// Modal de Detalhes do Paciente
const PatientDetailsModal: React.FC<{
  patient: PatientWithHealthData;
  onClose: () => void;
}> = ({ patient, onClose }) => {
  if (!patient.health_data?.responses) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-700 mb-4">Não foi possível carregar os dados de saúde deste paciente.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }
  
  const data = patient.health_data.responses;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.full_name}</h2>
            <p className="text-sm text-gray-500">{patient.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Secção 1: Dados Pessoais */}
          <Section title="Dados Pessoais">
            <DataRow label="Nome" value={data.nome} />
            <DataRow label="Data de Nascimento" value={data.dataNascimento} />
            <DataRow label="Morada" value={data.morada} />
            <DataRow label="Profissão" value={data.profissao === 'Outro' ? data.profissaoOutro : data.profissao} />
          </Section>

          {/* Secção 2: Objetivos da Consulta */}
          <Section title="Objetivos da Consulta">
            <DataRow label="Objetivos" value={data.objetivosConsulta.join(', ')} />
            {data.objetivosConsultaOutro && <DataRow label="Outro objetivo" value={data.objetivosConsultaOutro} />}
            <DataRow label="Como conheceu" value={data.comoConheceu === 'Outro' ? data.comoConheceuOutro : data.comoConheceu} />
          </Section>

          {/* Secção 3: Dados Clínicos */}
          <Section title="Dados Clínicos">
            <DataRow label="Diagnóstico de Doença" value={data.diagnosticoDoenca} multiline />
            <DataRow label="Operações" value={data.operacoes} multiline />
            <DataRow label="Medicação" value={data.medicacao} multiline />
            <div className="mt-4">
              <p className="font-medium text-gray-700 mb-2">Suplementação:</p>
              <div className="grid grid-cols-2 gap-2 pl-4">
                {data.suplementacao.vitaminaD && <span className="text-sm">✓ Vitamina D</span>}
                {data.suplementacao.vitaminaB12 && <span className="text-sm">✓ Vitamina B12</span>}
                {data.suplementacao.omega3 && <span className="text-sm">✓ Ómega 3</span>}
                {data.suplementacao.probioticos && <span className="text-sm">✓ Probióticos</span>}
                {data.suplementacao.magnesio && <span className="text-sm">✓ Magnésio</span>}
                {data.suplementacao.ferro && <span className="text-sm">✓ Ferro</span>}
                {data.suplementacao.zinco && <span className="text-sm">✓ Zinco</span>}
                {data.suplementacao.vitaminaC && <span className="text-sm">✓ Vitamina C</span>}
                {data.suplementacao.calcio && <span className="text-sm">✓ Cálcio</span>}
                {data.suplementacao.multivitaminico && <span className="text-sm">✓ Multivitamínico</span>}
              </div>
              {data.suplementacao.outros && <DataRow label="Outros suplementos" value={data.suplementacao.outros} />}
            </div>
          </Section>

          {/* Secção 4: Hábitos Alimentares */}
          <Section title="Hábitos Alimentares">
            <DataRow label="Dia Alimentar" value={data.diaAlimentar} multiline />
            <DataRow label="Quantidade de Água" value={data.quantidadeAgua} />
            <DataRow label="Come Fora" value={data.comeFora ? 'Sim' : 'Não'} />
            <DataRow label="Consumo de Álcool" value={data.consumoAlcool === 'Outro' ? data.consumoAlcoolOutro : data.consumoAlcool} />
            <DataRow label="Cafés por Dia" value={data.cafesPorDia.toString()} />
            {data.horaUltimoCafe && <DataRow label="Hora do Último Café" value={data.horaUltimoCafe} />}
            <DataRow label="Refrigerantes" value={data.refrigerantes} />
            <DataRow label="Dieta Específica" value={data.dietaEspecifica} />
          </Section>

          {/* Secção 5: Estilo de Vida */}
          <Section title="Estilo de Vida">
            <DataRow label="Pratica Exercício" value={data.praticaExercicio ? 'Sim' : 'Não'} />
            {data.praticaExercicio && (
              <>
                <DataRow label="Onde Pratica" value={data.ondePraticaExercicio?.join(', ')} />
                {data.ondePraticaExercicioOutro && <DataRow label="Outro local" value={data.ondePraticaExercicioOutro} />}
                <DataRow label="Frequência" value={data.frequenciaExercicio} />
                <DataRow label="Tipo de Exercício" value={data.tipoExercicio} />
              </>
            )}
          </Section>

          {/* Secção 6: Sono e Stress */}
          <Section title="Sono e Stress">
            <DataRow label="Horas de Sono" value={`${data.horasSono}h`} />
            {(data.sonoLeve || data.sonoREM || data.sonoProfundo) && (
              <div className="mt-2 pl-4">
                <p className="text-sm text-gray-600">Segmentação:</p>
                {data.sonoLeve && <p className="text-sm">• Sono Leve: {data.sonoLeve}h</p>}
                {data.sonoREM && <p className="text-sm">• Sono REM: {data.sonoREM}h</p>}
                {data.sonoProfundo && <p className="text-sm">• Sono Profundo: {data.sonoProfundo}h</p>}
              </div>
            )}
            <DataRow label="Hora Fixa de Deitar" value={data.horaFixaDeitar ? 'Sim' : 'Não'} />
            <DataRow label="Nível de Stress" value={`${data.nivelStress}%`} />
            <DataRow label="Sintomas de Stress" value={data.sintomasStress.join(', ')} />
            {data.sintomasStressOutros && <DataRow label="Outros sintomas" value={data.sintomasStressOutros} />}
          </Section>

          {/* Secção 7: Antropometria */}
          {(data.peso || data.altura || data.perimetroCintura || data.perimetroAnca || 
            data.percentagemGordura || data.massaMuscular || data.massaGorda || 
            data.perimetroBraco || data.perimetroCoxa) && (
            <Section title="Antropometria">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {data.peso && <DataRow label="Peso" value={`${data.peso} kg`} />}
                {data.altura && <DataRow label="Altura" value={`${data.altura} cm`} />}
                {data.imc && <DataRow label="IMC" value={data.imc.toString()} />}
                {data.perimetroCintura && <DataRow label="Perímetro da Cintura" value={`${data.perimetroCintura} cm`} />}
                {data.perimetroAnca && <DataRow label="Perímetro da Anca" value={`${data.perimetroAnca} cm`} />}
                {data.perimetroBraco && <DataRow label="Perímetro do Braço" value={`${data.perimetroBraco} cm`} />}
                {data.perimetroCoxa && <DataRow label="Perímetro da Coxa" value={`${data.perimetroCoxa} cm`} />}
                {data.percentagemGordura && <DataRow label="Percentagem de Gordura" value={`${data.percentagemGordura}%`} />}
                {data.massaMuscular && <DataRow label="Massa Muscular" value={`${data.massaMuscular} kg`} />}
                {data.massaGorda && <DataRow label="Massa Gorda" value={`${data.massaGorda} kg`} />}
              </div>
            </Section>
          )}

          {/* Análises Clínicas */}
          {patient.health_data?.clinical_file_url && (
            <Section title="Análises Clínicas">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{patient.health_data.clinical_file_name}</p>
                  <p className="text-sm text-gray-500">
                    {((patient.health_data.clinical_file_size || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const url = new URL(patient.health_data!.clinical_file_url!);
                      const pathParts = url.pathname.split('/');
                      const filePath = pathParts.slice(pathParts.indexOf('clinical-files') + 1).join('/');
                      
                      const { data, error } = await supabase.storage
                        .from('clinical-files')
                        .createSignedUrl(filePath, 60);
                      
                      if (error) {
                        alert('Erro ao fazer download do ficheiro');
                        return;
                      }
                      
                      if (data?.signedUrl) {
                        window.open(data.signedUrl, '_blank');
                      }
                    } catch (error) {
                      alert('Erro ao fazer download do ficheiro');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Exportar PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-6 last:border-0">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const DataRow: React.FC<{ label: string; value?: string; multiline?: boolean }> = ({ label, value, multiline }) => (
  <div className={multiline ? 'space-y-1' : 'flex justify-between items-start'}>
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className={`text-gray-900 ${multiline ? 'mt-1 whitespace-pre-wrap text-sm' : 'text-right text-sm'}`}>
      {value || 'N/a'}
    </span>
  </div>
);
