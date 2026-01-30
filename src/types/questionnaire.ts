// Tipos TypeScript para o Sistema de Questionários

export type QuestionType = 
  | 'single_choice' 
  | 'multiple_choice' 
  | 'yes_no' 
  | 'bristol_scale'
  | 'text';

export type QuestionnaireStatus = 'pending' | 'in_progress' | 'completed';

export interface QuestionOption {
  value: string;
  label: string;
  points?: number;
  allow_text?: boolean;
}

export interface QuestionConditional {
  question_id: string;
  required_value: string | string[];
}

export interface Question {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  required: boolean;
  conditional?: QuestionConditional;
  image_url?: string;
  points?: number;
}

export interface ScoringClassification {
  range?: [number, number];
  condition?: 'above_threshold' | 'below_threshold';
  label?: string;
  title: string;
  description: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

export interface ScoringRules {
  type: 'sum' | 'threshold';
  threshold?: number;
  count_value?: string;
  classifications: ScoringClassification[];
}

export interface Questionnaire {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  questions: Question[];
  scoring_rules: ScoringRules;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientQuestionnaire {
  id: string;
  patient_id: string;
  questionnaire_id: string;
  assigned_by: string;
  assigned_date: string;
  status: QuestionnaireStatus;
  started_date?: string;
  completed_date?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  questionnaire?: Questionnaire;
  patient?: {
    id: string;
    name: string;
    email: string;
  };
  assigned_by_user?: {
    id: string;
    name: string;
  };
}

export interface QuestionnaireResponse {
  id: string;
  patient_questionnaire_id: string;
  responses: Record<string, {
    value: string | string[];
    points?: number;
    text?: string;
  }>;
  score?: number;
  classification?: string;
  interpretation?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireResult {
  score: number;
  classification: string;
  interpretation: string;
  responses: QuestionnaireResponse['responses'];
  completed_date: string;
}
