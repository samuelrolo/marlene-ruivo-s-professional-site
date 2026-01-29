# Sistema de Questionários e Checklist FODMAP

## 📋 Visão Geral

Sistema completo para gestão de questionários de saúde e checklist FODMAP integrado ao site marleneruivo.pt.

### Funcionalidades Principais:

✅ **5 Questionários de Saúde**
- Saúde Intestinal (28 questões)
- Intolerância à Histamina (4 questões)
- Avaliação Emocional (7 questões)
- SIFO - Super crescimento Fúngico (8 questões)
- Doença Inflamatória Intestinal (5 questões)

✅ **Checklist FODMAP Interativo**
- 50+ alimentos organizados em 8 categorias
- Registo de testes e sintomas
- Indicadores visuais de tolerância
- Estatísticas em tempo real

✅ **Painel Administrativo**
- Alocar questionários/checklists a pacientes
- Visualizar resultados
- Acompanhar progresso

✅ **Área do Paciente**
- Responder questionários
- Preencher checklist FODMAP
- Ver histórico e resultados

## 🚀 Instalação Rápida

### Passo 1: Aplicar Migration no Supabase

```bash
# Opção 1: Via Supabase CLI (recomendado)
cd marlene-repo-fresh
supabase db push

# Opção 2: Via Dashboard Supabase
# 1. Aceder a https://supabase.com/dashboard
# 2. Selecionar projeto
# 3. SQL Editor → New Query
# 4. Copiar conteúdo de supabase/migrations/20260129_questionnaires_system.sql
# 5. Run
```

### Passo 2: Popular Questionários

```bash
# Via Supabase CLI
supabase db seed

# Ou via Dashboard: copiar e executar supabase/seed/questionnaires_data.sql
```

### Passo 3: Verificar Instalação

Execute no SQL Editor do Supabase:

```sql
-- Verificar questionários criados
SELECT name, slug, is_active FROM questionnaires;

-- Verificar alimentos FODMAP
SELECT category, COUNT(*) FROM fodmap_foods GROUP BY category;

-- Deve retornar 5 questionários e 50+ alimentos
```

## 📁 Estrutura de Ficheiros

```
marlene-repo-fresh/
├── supabase/
│   ├── migrations/
│   │   └── 20260129_questionnaires_system.sql  ✅ CRIADO
│   └── seed/
│       └── questionnaires_data.sql              ✅ CRIADO
├── src/
│   ├── types/
│   │   ├── questionnaire.ts                     ✅ CRIADO
│   │   └── fodmap.ts                            ✅ CRIADO
│   └── components/
│       ├── questionnaires/
│       │   ├── QuestionRenderer.tsx             ✅ CRIADO
│       │   └── QuestionnaireForm.tsx            ✅ CRIADO
│       └── fodmap/
│           └── FODMAPChecklistView.tsx          ✅ CRIADO
└── QUESTIONARIOS_README.md                      ✅ CRIADO
```

## 🔧 Próximos Passos (Implementação Completa)

### Componentes a Criar:

1. **Páginas do Paciente** (4-6 horas)
   - `src/pages/patient/QuestionnairesList.tsx`
   - `src/pages/patient/QuestionnaireFormPage.tsx`
   - `src/pages/patient/QuestionnaireResultPage.tsx`
   - `src/pages/patient/FODMAPChecklistPage.tsx`

2. **Páginas Admin** (4-6 horas)
   - `src/pages/admin/AllocateQuestionnairePage.tsx`
   - `src/pages/admin/AllocateFODMAPPage.tsx`
   - `src/pages/admin/ResultsPage.tsx`

3. **Componentes Admin** (3-4 horas)
   - `src/components/admin/QuestionnaireAllocator.tsx`
   - `src/components/admin/FODMAPAllocator.tsx`
   - `src/components/admin/ResultsDashboard.tsx`

4. **Rotas** (1 hora)
   - Adicionar rotas em `src/App.tsx`

### Template de Página (Exemplo):

```typescript
// src/pages/patient/QuestionnaireFormPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import QuestionnaireForm from '@/components/questionnaires/QuestionnaireForm';
import { Loader2 } from 'lucide-react';

const QuestionnaireFormPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: pq, error } = await supabase
        .from('patient_questionnaires')
        .select(`
          *,
          questionnaire:questionnaires(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setData(pq);
    } catch (error) {
      console.error('Error loading questionnaire:', error);
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

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Questionário não encontrado
          </h2>
          <p className="text-gray-600">
            O questionário que procura não existe ou não tem permissão para aceder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.questionnaire.name}
          </h1>
          {data.questionnaire.description && (
            <p className="text-gray-600">{data.questionnaire.description}</p>
          )}
        </div>

        <QuestionnaireForm 
          patientQuestionnaire={data}
          questionnaire={data.questionnaire}
        />
      </div>
    </div>
  );
};

export default QuestionnaireFormPage;
```

## 🎨 Design System

### Cores:
- **Primary**: `#6FA89E` (verde-água)
- **Success**: Verde (`green-600`)
- **Warning**: Laranja (`orange-600`)
- **Danger**: Vermelho (`red-600`)

### Componentes Tailwind:
- Botões: `rounded-lg` com transições suaves
- Cards: `border-2` com `shadow-sm`
- Inputs: `focus:ring-2 focus:ring-[#6FA89E]/30`

## 📊 Fluxos de Trabalho

### Fluxo 1: Admin Aloca Questionário

```
Admin → /admin/questionarios/alocar
     → Seleciona paciente
     → Escolhe questionário
     → Define prazo (opcional)
     → Clica "Alocar"
     → Sistema cria registo em patient_questionnaires
```

### Fluxo 2: Paciente Responde

```
Paciente → Login → /dashboard/questionarios
        → Vê lista de pendentes
        → Clica "Responder"
        → Responde questões (navegação step-by-step)
        → Clica "Submeter"
        → Sistema calcula pontuação
        → Vê resultado imediato
```

### Fluxo 3: Paciente Preenche FODMAP

```
Paciente → /dashboard/fodmap
        → Vê lista de alimentos
        → Filtra por categoria
        → Clica "Registar" num alimento
        → Preenche:
           - Data do teste
           - Sintomas
           - Tolerado (Sim/Não)
           - Notas
        → Clica "Guardar"
        → Alimento fica marcado visualmente
```

## 🔒 Segurança

### Row Level Security (RLS):

✅ Todas as tabelas têm RLS ativado
✅ Pacientes só veem seus próprios dados
✅ Admins veem todos os dados
✅ Políticas de INSERT/UPDATE/DELETE configuradas

### Validação:

✅ Frontend: React com validação em tempo real
✅ Backend: Supabase RLS + CHECK constraints
✅ Campos obrigatórios marcados claramente

## 📝 Testes

### Checklist de Testes:

- [ ] Aplicar migration no Supabase
- [ ] Popular questionários (seed data)
- [ ] Verificar 5 questionários criados
- [ ] Verificar 50+ alimentos FODMAP
- [ ] Criar páginas wrapper
- [ ] Adicionar rotas
- [ ] Testar alocação de questionário
- [ ] Testar resposta de questionário
- [ ] Verificar cálculo de pontuação
- [ ] Testar checklist FODMAP
- [ ] Verificar RLS (paciente não vê dados de outro)
- [ ] Testar visualização admin

## 📚 Documentação Adicional

Ver `GUIA_IMPLEMENTACAO_QUESTIONARIOS_FODMAP.md` para:
- Arquitetura detalhada
- Estrutura JSON dos questionários
- Exemplos de código completos
- Melhorias futuras
- Troubleshooting

## 🆘 Suporte

### Problemas Comuns:

**Erro ao aplicar migration:**
- Verificar se há conflitos com tabelas existentes
- Verificar permissões no Supabase
- Tentar via Dashboard em vez de CLI

**Questionários não aparecem:**
- Verificar se seed data foi executado
- Verificar campo `is_active = true`
- Verificar RLS policies

**Erro de permissão:**
- Verificar role do utilizador (admin/paciente)
- Verificar RLS policies
- Verificar auth.uid() está correto

## ✅ Status Atual

### Concluído:
- ✅ Schema da base de dados
- ✅ 5 questionários estruturados
- ✅ Checklist FODMAP com 50+ alimentos
- ✅ Componentes React principais
- ✅ Tipos TypeScript
- ✅ RLS policies
- ✅ Seed data

### Pendente:
- ⏳ Páginas wrapper (paciente + admin)
- ⏳ Rotas
- ⏳ Componentes admin
- ⏳ Testes end-to-end
- ⏳ Deployment

**Tempo estimado para conclusão**: 12-16 horas de desenvolvimento adicional

---

**Desenvolvido para**: Marlene Ruivo - Nutricionista
**Data**: Janeiro 2026
**Versão**: 1.0.0
