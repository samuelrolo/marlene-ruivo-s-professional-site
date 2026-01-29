-- Migration: Sistema de Questionários
-- Data: 2026-01-29
-- Descrição: Cria tabelas e políticas RLS para sistema de questionários

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
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
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
    score INTEGER,
    classification TEXT,
    interpretation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_questionnaire_id) -- Apenas uma resposta por alocação
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_patient_questionnaire ON questionnaire_responses(patient_questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_score ON questionnaire_responses(score);

-- Trigger para updated_at
CREATE TRIGGER update_questionnaire_responses_updated_at
    BEFORE UPDATE ON questionnaire_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: questionnaires
-- ============================================================================

-- Todos autenticados podem ver questionários ativos
CREATE POLICY "Authenticated users can view active questionnaires"
    ON questionnaires FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Apenas admins podem inserir questionários
CREATE POLICY "Only admins can insert questionnaires"
    ON questionnaires FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Apenas admins podem atualizar questionários
CREATE POLICY "Only admins can update questionnaires"
    ON questionnaires FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Apenas admins podem deletar questionários
CREATE POLICY "Only admins can delete questionnaires"
    ON questionnaires FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- POLICIES: patient_questionnaires
-- ============================================================================

-- Pacientes veem apenas seus questionários; Admins veem todos
CREATE POLICY "Users can view their own questionnaires, admins can view all"
    ON patient_questionnaires FOR SELECT
    TO authenticated
    USING (
        patient_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Apenas admins podem alocar questionários
CREATE POLICY "Only admins can assign questionnaires"
    ON patient_questionnaires FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Pacientes podem atualizar status dos seus questionários; Admins podem atualizar tudo
CREATE POLICY "Patients can update their questionnaire status, admins can update all"
    ON patient_questionnaires FOR UPDATE
    TO authenticated
    USING (
        patient_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Apenas admins podem deletar alocações
CREATE POLICY "Only admins can delete patient questionnaires"
    ON patient_questionnaires FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- POLICIES: questionnaire_responses
-- ============================================================================

-- Pacientes veem apenas suas respostas; Admins veem todas
CREATE POLICY "Users can view their own responses, admins can view all"
    ON questionnaire_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND (
                patient_questionnaires.patient_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            )
        )
    );

-- Apenas o paciente dono pode inserir respostas
CREATE POLICY "Patients can insert their own responses"
    ON questionnaire_responses FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND patient_questionnaires.patient_id = auth.uid()
        )
    );

-- Apenas o paciente dono pode atualizar suas respostas (se não completado)
CREATE POLICY "Patients can update their own responses if not completed"
    ON questionnaire_responses FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_questionnaires
            WHERE patient_questionnaires.id = questionnaire_responses.patient_questionnaire_id
            AND patient_questionnaires.patient_id = auth.uid()
            AND patient_questionnaires.status != 'completed'
        )
    );

-- Apenas admins podem deletar respostas
CREATE POLICY "Only admins can delete responses"
    ON questionnaire_responses FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para calcular pontuação automaticamente
CREATE OR REPLACE FUNCTION calculate_questionnaire_score(
    questionnaire_id_param UUID,
    responses_param JSONB
)
RETURNS TABLE (
    score INTEGER,
    classification TEXT,
    interpretation TEXT
) AS $$
DECLARE
    questionnaire_data RECORD;
    scoring_type TEXT;
    total_score INTEGER := 0;
    classification_result TEXT;
    interpretation_result TEXT;
BEGIN
    -- Buscar dados do questionário
    SELECT * INTO questionnaire_data
    FROM questionnaires
    WHERE id = questionnaire_id_param;

    -- Extrair tipo de pontuação
    scoring_type := questionnaire_data.scoring_rules->>'type';

    -- Calcular pontuação baseado no tipo
    IF scoring_type = 'sum' THEN
        -- Somar pontos de todas as respostas
        SELECT COALESCE(SUM((responses_param->question_id->>'points')::INTEGER), 0)
        INTO total_score
        FROM jsonb_object_keys(responses_param) AS question_id;

        -- Determinar classificação baseado nos ranges
        SELECT 
            c->>'title',
            c->>'description'
        INTO classification_result, interpretation_result
        FROM jsonb_array_elements(questionnaire_data.scoring_rules->'classifications') AS c
        WHERE total_score >= (c->'range'->0)::INTEGER
        AND total_score <= (c->'range'->1)::INTEGER
        LIMIT 1;

    ELSIF scoring_type = 'threshold' THEN
        -- Contar respostas específicas
        DECLARE
            threshold_value INTEGER;
            count_value TEXT;
            yes_count INTEGER := 0;
        BEGIN
            threshold_value := (questionnaire_data.scoring_rules->>'threshold')::INTEGER;
            count_value := questionnaire_data.scoring_rules->>'count_value';

            SELECT COUNT(*)
            INTO yes_count
            FROM jsonb_each_text(responses_param)
            WHERE value = count_value;

            total_score := yes_count;

            -- Determinar classificação
            IF yes_count > threshold_value THEN
                SELECT 
                    c->>'title',
                    c->>'description'
                INTO classification_result, interpretation_result
                FROM jsonb_array_elements(questionnaire_data.scoring_rules->'classifications') AS c
                WHERE c->>'condition' = 'above_threshold'
                LIMIT 1;
            ELSE
                SELECT 
                    c->>'title',
                    c->>'description'
                INTO classification_result, interpretation_result
                FROM jsonb_array_elements(questionnaire_data.scoring_rules->'classifications') AS c
                WHERE c->>'condition' = 'below_threshold'
                LIMIT 1;
            END IF;
        END;
    END IF;

    RETURN QUERY SELECT total_score, classification_result, interpretation_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE questionnaires IS 'Templates de questionários disponíveis';
COMMENT ON TABLE patient_questionnaires IS 'Questionários alocados a pacientes específicos';
COMMENT ON TABLE questionnaire_responses IS 'Respostas dos pacientes aos questionários';
COMMENT ON FUNCTION calculate_questionnaire_score IS 'Calcula pontuação, classificação e interpretação baseado nas respostas';


-- ============================================================================
-- SISTEMA DE CHECKLIST FODMAP
-- ============================================================================

-- Tabela de alimentos FODMAP (template/catálogo)
CREATE TABLE IF NOT EXISTS fodmap_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    food_name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, food_name)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fodmap_foods_category ON fodmap_foods(category);
CREATE INDEX IF NOT EXISTS idx_fodmap_foods_is_active ON fodmap_foods(is_active);

-- Tabela de checklists alocados a pacientes
CREATE TABLE IF NOT EXISTS patient_fodmap_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    notes TEXT,
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

-- Tabela de entradas do checklist (registos individuais de alimentos testados)
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
CREATE INDEX IF NOT EXISTS idx_fodmap_checklist_entries_tolerated ON fodmap_checklist_entries(tolerated);

-- Trigger para updated_at
CREATE TRIGGER update_fodmap_checklist_entries_updated_at
    BEFORE UPDATE ON fodmap_checklist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES: FODMAP SYSTEM
-- ============================================================================

ALTER TABLE fodmap_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_fodmap_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE fodmap_checklist_entries ENABLE ROW LEVEL SECURITY;

-- POLICIES: fodmap_foods
CREATE POLICY "Authenticated users can view active foods"
    ON fodmap_foods FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Only admins can manage foods"
    ON fodmap_foods FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- POLICIES: patient_fodmap_checklists
CREATE POLICY "Users can view their own checklists, admins can view all"
    ON patient_fodmap_checklists FOR SELECT
    TO authenticated
    USING (
        patient_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can assign checklists"
    ON patient_fodmap_checklists FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Patients can update their checklist status, admins can update all"
    ON patient_fodmap_checklists FOR UPDATE
    TO authenticated
    USING (
        patient_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete checklists"
    ON patient_fodmap_checklists FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- POLICIES: fodmap_checklist_entries
CREATE POLICY "Users can view their own entries, admins can view all"
    ON fodmap_checklist_entries FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND (
                patient_fodmap_checklists.patient_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Patients can insert their own entries"
    ON fodmap_checklist_entries FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own entries"
    ON fodmap_checklist_entries FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );

CREATE POLICY "Patients can delete their own entries"
    ON fodmap_checklist_entries FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM patient_fodmap_checklists
            WHERE patient_fodmap_checklists.id = fodmap_checklist_entries.checklist_id
            AND patient_fodmap_checklists.patient_id = auth.uid()
        )
    );

-- ============================================================================
-- SEED DATA: FODMAP FOODS
-- ============================================================================

INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
-- Frutanos – Vegetais
('Frutanos – Vegetais', 'Cebola', 1),
('Frutanos – Vegetais', 'Alho', 2),
('Frutanos – Vegetais', 'Alho-francês', 3),
('Frutanos – Vegetais', 'Cebolinho (parte verde)', 4),
('Frutanos – Vegetais', 'Espargos', 5),
('Frutanos – Vegetais', 'Alcachofra', 6),
('Frutanos – Vegetais', 'Funcho', 7),
('Frutanos – Vegetais', 'Ervilhas', 8),

-- Frutanos – Cereais
('Frutanos – Cereais', 'Trigo', 10),
('Frutanos – Cereais', 'Centeio', 11),
('Frutanos – Cereais', 'Cevada', 12),
('Frutanos – Cereais', 'Pão tradicional', 13),
('Frutanos – Cereais', 'Massas de trigo', 14),
('Frutanos – Cereais', 'Cuscuz', 15),
('Frutanos – Cereais', 'Bulgur', 16),

-- Galactanos (leguminosas)
('Galactanos (leguminosas)', 'Grão-de-bico', 20),
('Galactanos (leguminosas)', 'Lentilhas', 21),
('Galactanos (leguminosas)', 'Feijão preto', 22),
('Galactanos (leguminosas)', 'Feijão vermelho', 23),
('Galactanos (leguminosas)', 'Feijão branco', 24),
('Galactanos (leguminosas)', 'Soja', 25),
('Galactanos (leguminosas)', 'Ervilhas secas', 26),

-- Lactose
('Lactose', 'Leite de vaca', 30),
('Lactose', 'Leite de cabra', 31),
('Lactose', 'Iogurte', 32),
('Lactose', 'Queijo fresco', 33),
('Lactose', 'Requeijão', 34),
('Lactose', 'Natas', 35),
('Lactose', 'Gelado', 36),

-- Frutose em excesso – Fruta
('Frutose em excesso – Fruta', 'Maçã', 40),
('Frutose em excesso – Fruta', 'Pera', 41),
('Frutose em excesso – Fruta', 'Manga', 42),
('Frutose em excesso – Fruta', 'Melancia', 43),
('Frutose em excesso – Fruta', 'Cerejas', 44),
('Frutose em excesso – Fruta', 'Figos', 45),
('Frutose em excesso – Fruta', 'Damasco', 46),
('Frutose em excesso – Fruta', 'Pêssego', 47),

-- Frutose – Outros
('Frutose – Outros', 'Mel', 50),
('Frutose – Outros', 'Xarope de agave', 51),
('Frutose – Outros', 'Xarope de milho', 52),
('Frutose – Outros', 'Sumos de fruta', 53),
('Frutose – Outros', 'Compotas', 54),

-- Polióis – Fruta e Vegetais
('Polióis – Fruta e Vegetais', 'Abacate', 60),
('Polióis – Fruta e Vegetais', 'Cogumelos', 61),
('Polióis – Fruta e Vegetais', 'Couve-flor', 62),
('Polióis – Fruta e Vegetais', 'Maçã cozida', 63),
('Polióis – Fruta e Vegetais', 'Pera cozida', 64),
('Polióis – Fruta e Vegetais', 'Ameixa', 65),

-- Polióis – Adoçantes
('Polióis – Adoçantes', 'Sorbitol', 70),
('Polióis – Adoçantes', 'Manitol', 71),
('Polióis – Adoçantes', 'Xilitol', 72),
('Polióis – Adoçantes', 'Maltitol', 73)

ON CONFLICT (category, food_name) DO NOTHING;

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE fodmap_foods IS 'Catálogo de alimentos FODMAP para checklist';
COMMENT ON TABLE patient_fodmap_checklists IS 'Checklists FODMAP alocados a pacientes';
COMMENT ON TABLE fodmap_checklist_entries IS 'Entradas individuais de alimentos testados no checklist';
