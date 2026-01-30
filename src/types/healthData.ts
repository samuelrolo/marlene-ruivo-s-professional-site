// Tipos para o formulário de Hábitos Alimentares e Dados Clínicos

export interface HealthDataFormData {
  // 1. Dados Pessoais
  nome: string;
  dataNascimento: string;
  morada: string;
  profissao: string;
  profissaoOutro?: string;
  dataConsulta: string;

  // 2. Objetivos da Consulta
  objetivosConsulta: string[];
  objetivosConsultaOutro?: string;
  comoConheceu: string;
  comoConheceuOutro?: string;

  // 3. Dados Clínicos
  diagnosticoDoenca: string;
  operacoes: string;
  medicacao: string;
  suplementacao: {
    vitaminaD: boolean;
    vitaminaB12: boolean;
    omega3: boolean;
    probioticos: boolean;
    magnesio: boolean;
    ferro: boolean;
    zinco: boolean;
    vitaminaC: boolean;
    calcio: boolean;
    multivitaminico: boolean;
    outros: string;
  };

  // 4. Hábitos Alimentares
  diaAlimentar: string;
  quantidadeAgua: string;
  comeFora: boolean;
  consumoAlcool: string;
  consumoAlcoolOutro?: string;
  cafesPorDia: number;
  horaUltimoCafe?: string;
  refrigerantes: string;
  dietaEspecifica: string;

  // 5. Estilo de Vida
  praticaExercicio: boolean;
  ondePraticaExercicio?: string[];
  ondePraticaExercicioOutro?: string;
  frequenciaExercicio?: string;
  tipoExercicio?: string;

  // 6. Sono e Stress
  horasSono: number;
  sonoLeve?: number;
  sonoREM?: number;
  sonoProfundo?: number;
  horaFixaDeitar: boolean;
  nivelStress: number;
  sintomasStress: string[];
  sintomasStressOutros?: string;
}

export interface PatientHealthData {
  id: string;
  patient_id: string;
  responses: HealthDataFormData;
  clinical_file_url?: string;
  clinical_file_name?: string;
  clinical_file_size?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const PROFISSAO_OPTIONS = [
  'Estudante',
  'Empregado(a) por conta de outrem',
  'Trabalhador(a) independente',
  'Reformado(a)',
  'Desempregado(a)',
  'Outro'
];

export const OBJETIVOS_CONSULTA_OPTIONS = [
  'Perder Peso',
  'Conhecer FODMAP',
  'Aconselhamento SIBO/SIBB',
  'Ter uma alimentação mais saudável',
  'Adaptação da dieta a situação clínica',
  'Outro'
];

export const COMO_CONHECEU_OPTIONS = [
  'Website',
  'Google',
  'Referência de Amigo/Familiar',
  'Instagram',
  'Facebook',
  'Outro'
];

export const QUANTIDADE_AGUA_OPTIONS = [
  'Menos de 1L',
  '1L - 1.5L',
  '1.5L - 2L',
  '2L - 2.5L',
  'Mais de 2.5L'
];

export const CONSUMO_ALCOOL_OPTIONS = [
  'Nunca',
  'Ocasionalmente (1x por mês)',
  '1x por semana',
  '2-3x por semana',
  'Todos os dias',
  'Outro'
];

export const REFRIGERANTES_OPTIONS = [
  'Sim',
  'Não',
  'Ocasionalmente'
];

export const ONDE_PRATICA_EXERCICIO_OPTIONS = [
  'Ginásio',
  'Outdoor',
  'Em casa',
  'Outro'
];

export const FREQUENCIA_EXERCICIO_OPTIONS = [
  '1x por semana',
  '2x por semana',
  '3x por semana',
  '4-5x por semana',
  'Todos os dias'
];

export const SINTOMAS_STRESS_OPTIONS = [
  'Ansiedade',
  'Insónia',
  'Dores de cabeça',
  'Tensão muscular',
  'Fadiga',
  'Irritabilidade',
  'Dificuldade de concentração',
  'Alterações de apetite',
  'Problemas digestivos',
  'Outros'
];
