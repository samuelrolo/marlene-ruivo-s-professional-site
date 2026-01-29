-- Migration: Sistema de Questionários (Versão Simplificada)
-- Data: 2026-01-29
-- Descrição: Cria tabelas para sistema de questionários sem dependência de tabela profiles

-- ============================================================================
-- TABELA: questionnaires (Templates de Questionários)
-- ============================================================================

CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    scoring_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_questionnaires_slug ON questionnaires(slug);
CREATE INDEX IF NOT EXISTS idx_questionnaires_category ON questionnaires(category);
CREATE INDEX IF NOT EXISTS idx_questionnaires_is_active ON questionnaires(is_active);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questionnaires_updated_at
    BEFORE UPDATE ON questionnaires
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABELA: patient_questionnaires (Questionários Alocados a Pacientes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS patient_questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    started_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_patient_questionnaires_patient ON patient_questionnaires(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_questionnaires_questionnaire ON patient_questionnaires(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_patient_questionnaires_status ON patient_questionnaires(status);
CREATE INDEX IF NOT EXISTS idx_patient_questionnaires_assigned_by ON patient_questionnaires(assigned_by);

-- Trigger para updated_at
CREATE TRIGGER update_patient_questionnaires_updated_at
    BEFORE UPDATE ON patient_questionnaires
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABELA: questionnaire_responses (Respostas dos Questionários)
-- ============================================================================

CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_questionnaire_id UUID NOT NULL REFERENCES patient_questionnaires(id) ON DELETE CASCADE,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_score INTEGER,
    classification_label TEXT,
    classification_title TEXT,
    classification_description TEXT,
    classification_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_questionnaire_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_patient_questionnaire ON questionnaire_responses(patient_questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_score ON questionnaire_responses(total_score);

-- Trigger para updated_at
CREATE TRIGGER update_questionnaire_responses_updated_at
    BEFORE UPDATE ON questionnaire_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABELA: fodmap_foods (Catálogo de Alimentos FODMAP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS fodmap_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    food_name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fodmap_foods_category ON fodmap_foods(category);
CREATE INDEX IF NOT EXISTS idx_fodmap_foods_is_active ON fodmap_foods(is_active);
CREATE INDEX IF NOT EXISTS idx_fodmap_foods_order ON fodmap_foods(order_index);

-- Trigger para updated_at
CREATE TRIGGER update_fodmap_foods_updated_at
    BEFORE UPDATE ON fodmap_foods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABELA: patient_fodmap_checklists (Checklists FODMAP Alocados)
-- ============================================================================

CREATE TABLE IF NOT EXISTS patient_fodmap_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_patient_fodmap_checklists_patient ON patient_fodmap_checklists(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_fodmap_checklists_status ON patient_fodmap_checklists(status);

-- Trigger para updated_at
CREATE TRIGGER update_patient_fodmap_checklists_updated_at
    BEFORE UPDATE ON patient_fodmap_checklists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABELA: fodmap_checklist_entries (Registos de Testes FODMAP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS fodmap_checklist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES patient_fodmap_checklists(id) ON DELETE CASCADE,
    fodmap_food_id UUID NOT NULL REFERENCES fodmap_foods(id) ON DELETE CASCADE,
    tested BOOLEAN DEFAULT false,
    tested_date DATE,
    symptoms TEXT,
    tolerated BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(checklist_id, fodmap_food_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fodmap_checklist_entries_checklist ON fodmap_checklist_entries(checklist_id);
CREATE INDEX IF NOT EXISTS idx_fodmap_checklist_entries_food ON fodmap_checklist_entries(fodmap_food_id);
CREATE INDEX IF NOT EXISTS idx_fodmap_checklist_entries_tested ON fodmap_checklist_entries(tested);

-- Trigger para updated_at
CREATE TRIGGER update_fodmap_checklist_entries_updated_at
    BEFORE UPDATE ON fodmap_checklist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fodmap_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_fodmap_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE fodmap_checklist_entries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: questionnaires (Todos autenticados podem ver)
-- ============================================================================

CREATE POLICY "Authenticated users can view active questionnaires"
    ON questionnaires FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage questionnaires"
    ON questionnaires FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- POLICIES: patient_questionnaires
-- ============================================================================

-- Pacientes veem apenas seus questionários
CREATE POLICY "Users can view their own questionnaires"
    ON patient_questionnaires FOR SELECT
    TO authenticated
    USING (patient_id = auth.uid());

-- Qualquer autenticado pode alocar (para simplificar - ajustar depois)
CREATE POLICY "Authenticated users can assign questionnaires"
    ON patient_questionnaires FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Pacientes podem atualizar seus questionários
CREATE POLICY "Users can update their questionnaires"
    ON patient_questionnaires FOR UPDATE
    TO authenticated
    USING (patient_id = auth.uid());

-- Qualquer autenticado pode deletar (para simplificar - ajustar depois)
CREATE POLICY "Authenticated users can delete questionnaires"
    ON patient_questionnaires FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: questionnaire_responses
-- ============================================================================

-- Pacientes veem apenas suas respostas
CREATE POLICY "Users can view their own responses"
    ON questionnaire_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND patient_questionnaires.patient_id = auth.uid()
        )
    );

-- Pacientes podem inserir suas respostas
CREATE POLICY "Users can insert their own responses"
    ON questionnaire_responses FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND patient_questionnaires.patient_id = auth.uid()
        )
    );

-- Pacientes podem atualizar suas respostas
CREATE POLICY "Users can update their own responses"
    ON questionnaire_responses FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND patient_questionnaires.patient_id = auth.uid()
        )
    );

-- ============================================================================
-- POLICIES: fodmap_foods (Todos autenticados podem ver)
-- ============================================================================

CREATE POLICY "Authenticated users can view active foods"
    ON fodmap_foods FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage foods"
    ON fodmap_foods FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- POLICIES: patient_fodmap_checklists
-- ============================================================================

CREATE POLICY "Users can view their own checklists"
    ON patient_fodmap_checklists FOR SELECT
    TO authenticated
    USING (patient_id = auth.uid());

CREATE POLICY "Authenticated users can assign checklists"
    ON patient_fodmap_checklists FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their checklists"
    ON patient_fodmap_checklists FOR UPDATE
    TO authenticated
    USING (patient_id = auth.uid());

-- ============================================================================
-- POLICIES: fodmap_checklist_entries
-- ============================================================================

CREATE POLICY "Users can view their own entries"
    ON fodmap_checklist_entries FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own entries"
    ON fodmap_checklist_entries FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own entries"
    ON fodmap_checklist_entries FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );
