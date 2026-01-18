-- =====================================================
-- SCHEMA PARA SISTEMA DE CONTAS DE UTILIZADOR
-- Marlene Ruivo - Nutricionista
-- =====================================================

-- Tabela de perfis de utilizador (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  nif TEXT,
  gdpr_consent BOOLEAN DEFAULT false,
  gdpr_consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de consultas/agendamentos
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('first', 'followup')),
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON public.appointments(payment_status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Utilizadores só podem ver e editar os seus próprios dados
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Utilizadores só podem ver as suas próprias consultas
CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE public.user_profiles IS 'Perfis de utilizador com dados pessoais e consentimento RGPD';
COMMENT ON TABLE public.appointments IS 'Histórico de consultas e agendamentos com estado de pagamento';
COMMENT ON COLUMN public.user_profiles.gdpr_consent IS 'Consentimento RGPD para tratamento de dados pessoais';
COMMENT ON COLUMN public.appointments.payment_status IS 'Estado do pagamento: pending, completed, failed, cancelled';
COMMENT ON COLUMN public.appointments.consultation_type IS 'Tipo de consulta: first (primeira) ou followup (seguimento)';


-- =====================================================
-- TABELAS PARA GESTÃO DE DOCUMENTOS E REGISTOS
-- =====================================================

-- Tabela de documentos de pacientes (avaliações, planos, etc.)
CREATE TABLE IF NOT EXISTS public.patient_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('evaluation', 'meal_plan', 'weight_record', 'intolerance', 'clinical_analysis', 'consultation_notes', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_by_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de registos de peso
CREATE TABLE IF NOT EXISTS public.weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5, 2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de intolerâncias e alergias
CREATE TABLE IF NOT EXISTS public.intolerances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  intolerance_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  symptoms TEXT,
  date_identified TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos alimentares
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  content TEXT,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_patient_documents_user_id ON public.patient_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_type ON public.patient_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_weight_records_user_id ON public.weight_records(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_date ON public.weight_records(date);
CREATE INDEX IF NOT EXISTS idx_intolerances_user_id ON public.intolerances(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_patient_documents_updated_at
  BEFORE UPDATE ON public.patient_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weight_records_updated_at
  BEFORE UPDATE ON public.weight_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intolerances_updated_at
  BEFORE UPDATE ON public.intolerances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (Row Level Security)
ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intolerances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para documentos: pacientes veem os seus, admin vê todos
CREATE POLICY "Users can view own documents"
  ON public.patient_documents FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

CREATE POLICY "Users can insert own documents"
  ON public.patient_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para registos de peso
CREATE POLICY "Users can view own weight records"
  ON public.weight_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight records"
  ON public.weight_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para intolerâncias
CREATE POLICY "Users can view own intolerances"
  ON public.intolerances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intolerances"
  ON public.intolerances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para planos alimentares
CREATE POLICY "Users can view own meal plans"
  ON public.meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON public.meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE public.patient_documents IS 'Documentos de pacientes: avaliações, planos alimentares, análises, etc.';
COMMENT ON TABLE public.weight_records IS 'Histórico de registos de peso dos pacientes';
COMMENT ON TABLE public.intolerances IS 'Intolerâncias e alergias identificadas dos pacientes';
COMMENT ON TABLE public.meal_plans IS 'Planos alimentares personalizados para pacientes';
