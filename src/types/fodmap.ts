// Tipos TypeScript para o Sistema de Checklist FODMAP

export type FODMAPCategory = 
  | 'Frutanos – Vegetais'
  | 'Frutanos – Cereais'
  | 'Galactanos (leguminosas)'
  | 'Lactose'
  | 'Frutose em excesso – Fruta'
  | 'Frutose – Outros'
  | 'Polióis – Fruta e Vegetais'
  | 'Polióis – Adoçantes';

export type ChecklistStatus = 'active' | 'completed' | 'archived';

export interface FODMAPFood {
  id: string;
  category: FODMAPCategory;
  food_name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface PatientFODMAPChecklist {
  id: string;
  patient_id: string;
  assigned_by: string;
  assigned_date: string;
  status: ChecklistStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
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

export interface FODMAPChecklistEntry {
  id: string;
  checklist_id: string;
  fodmap_food_id: string;
  tested: boolean;
  tested_date?: string;
  symptoms?: string;
  tolerated?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  food?: FODMAPFood;
}

export interface FODMAPChecklistSummary {
  total_foods: number;
  tested_count: number;
  tolerated_count: number;
  not_tolerated_count: number;
  progress_percentage: number;
  by_category: Record<FODMAPCategory, {
    total: number;
    tested: number;
    tolerated: number;
    not_tolerated: number;
  }>;
}
