import React from 'react';
import {
  HealthDataFormData,
  PROFISSAO_OPTIONS,
  OBJETIVOS_CONSULTA_OPTIONS,
  COMO_CONHECEU_OPTIONS,
  QUANTIDADE_AGUA_OPTIONS,
  CONSUMO_ALCOOL_OPTIONS,
  REFRIGERANTES_OPTIONS,
  ONDE_PRATICA_EXERCICIO_OPTIONS,
  FREQUENCIA_EXERCICIO_OPTIONS,
  SINTOMAS_STRESS_OPTIONS
} from '../types/healthData';

interface SectionProps {
  formData: HealthDataFormData;
  updateFormData: (field: string, value: any) => void;
  updateSuplemento: (field: keyof HealthDataFormData['suplementacao'], value: boolean | string) => void;
  toggleCheckbox: (field: keyof HealthDataFormData, value: string) => void;
  errors: Record<string, string>;
  age: number;
  clinicalFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Componente de Input com Label
const FormInput: React.FC<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, type = 'text', value, onChange, error, required, placeholder, min, max, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Componente de Textarea com Label
const FormTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, error, required, placeholder, rows = 4 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Componente de Select com Label
const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
}> = ({ label, value, onChange, options, error, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Selecione uma opção</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Componente de Radio com Label
const FormRadio: React.FC<{
  label: string;
  value: boolean | string;
  onChange: (value: any) => void;
  options: { label: string; value: any }[];
  error?: string;
  required?: boolean;
}> = ({ label, value, onChange, options, error, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={String(option.value)} className="flex items-center">
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mr-2 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Componente de Checkbox com Label
const FormCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center mb-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mr-2 text-green-600 focus:ring-green-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

// Secção 1: Dados Pessoais
export const Section1: React.FC<SectionProps> = ({ formData, updateFormData, errors, age }) => (
  <div>
    <FormInput
      label="Nome"
      value={formData.nome}
      onChange={(value) => updateFormData('nome', value)}
      error={errors.nome}
      required
      placeholder="Nome completo"
    />

    <FormInput
      label="Data de Nascimento"
      type="date"
      value={formData.dataNascimento}
      onChange={(value) => updateFormData('dataNascimento', value)}
      error={errors.dataNascimento}
      required
    />

    {age > 0 && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Idade:</strong> {age} anos
        </p>
      </div>
    )}

    <FormInput
      label="Morada"
      value={formData.morada}
      onChange={(value) => updateFormData('morada', value)}
      error={errors.morada}
      required
      placeholder="Morada completa"
    />

    <FormSelect
      label="Profissão"
      value={formData.profissao}
      onChange={(value) => updateFormData('profissao', value)}
      options={PROFISSAO_OPTIONS}
      error={errors.profissao}
      required
    />

    {formData.profissao === 'Outro' && (
      <FormInput
        label="Especifique a profissão"
        value={formData.profissaoOutro || ''}
        onChange={(value) => updateFormData('profissaoOutro', value)}
        error={errors.profissaoOutro}
        required
        placeholder="Digite a sua profissão"
      />
    )}
  </div>
);

// Secção 2: Objetivos da Consulta
export const Section2: React.FC<SectionProps> = ({ formData, toggleCheckbox, updateFormData, errors }) => (
  <div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Objetivos da Consulta <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {OBJETIVOS_CONSULTA_OPTIONS.map((option) => (
          <FormCheckbox
            key={option}
            label={option}
            checked={formData.objetivosConsulta.includes(option)}
            onChange={() => toggleCheckbox('objetivosConsulta', option)}
          />
        ))}
      </div>
      {errors.objetivosConsulta && <p className="mt-1 text-sm text-red-500">{errors.objetivosConsulta}</p>}
    </div>

    {formData.objetivosConsulta.includes('Outro') && (
      <FormInput
        label="Especifique o objetivo"
        value={formData.objetivosConsultaOutro || ''}
        onChange={(value) => updateFormData('objetivosConsultaOutro', value)}
        error={errors.objetivosConsultaOutro}
        required
        placeholder="Digite o seu objetivo"
      />
    )}

    <FormSelect
      label="Como teve conhecimento dos meus serviços?"
      value={formData.comoConheceu}
      onChange={(value) => updateFormData('comoConheceu', value)}
      options={COMO_CONHECEU_OPTIONS}
      error={errors.comoConheceu}
      required
    />

    {formData.comoConheceu === 'Outro' && (
      <FormInput
        label="Especifique"
        value={formData.comoConheceuOutro || ''}
        onChange={(value) => updateFormData('comoConheceuOutro', value)}
        error={errors.comoConheceuOutro}
        required
        placeholder="Como conheceu os serviços?"
      />
    )}
  </div>
);

// Secção 3: Dados Clínicos
export const Section3: React.FC<SectionProps> = ({ formData, updateFormData, updateSuplemento, errors }) => (
  <div>
    <FormTextarea
      label="Diagnóstico de Doença?"
      value={formData.diagnosticoDoenca}
      onChange={(value) => updateFormData('diagnosticoDoenca', value)}
      error={errors.diagnosticoDoenca}
      placeholder="Descreva se tem algum diagnóstico médico (ex: diabetes, hipertensão, etc.)"
      rows={3}
    />

    <FormTextarea
      label="Alguma operação que tenha feito?"
      value={formData.operacoes}
      onChange={(value) => updateFormData('operacoes', value)}
      error={errors.operacoes}
      placeholder="Descreva cirurgias ou procedimentos médicos realizados"
      rows={3}
    />

    <FormTextarea
      label="Medicação"
      value={formData.medicacao}
      onChange={(value) => updateFormData('medicacao', value)}
      error={errors.medicacao}
      placeholder="Liste a medicação que toma diariamente (nome e dosagem)"
      rows={3}
    />

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Suplementação
      </label>
      <div className="space-y-2 grid grid-cols-2 gap-2">
        <FormCheckbox
          label="Vitamina D"
          checked={formData.suplementacao.vitaminaD}
          onChange={(checked) => updateSuplemento('vitaminaD', checked)}
        />
        <FormCheckbox
          label="Vitamina B12"
          checked={formData.suplementacao.vitaminaB12}
          onChange={(checked) => updateSuplemento('vitaminaB12', checked)}
        />
        <FormCheckbox
          label="Ómega 3"
          checked={formData.suplementacao.omega3}
          onChange={(checked) => updateSuplemento('omega3', checked)}
        />
        <FormCheckbox
          label="Probióticos"
          checked={formData.suplementacao.probioticos}
          onChange={(checked) => updateSuplemento('probioticos', checked)}
        />
        <FormCheckbox
          label="Magnésio"
          checked={formData.suplementacao.magnesio}
          onChange={(checked) => updateSuplemento('magnesio', checked)}
        />
        <FormCheckbox
          label="Ferro"
          checked={formData.suplementacao.ferro}
          onChange={(checked) => updateSuplemento('ferro', checked)}
        />
        <FormCheckbox
          label="Zinco"
          checked={formData.suplementacao.zinco}
          onChange={(checked) => updateSuplemento('zinco', checked)}
        />
        <FormCheckbox
          label="Vitamina C"
          checked={formData.suplementacao.vitaminaC}
          onChange={(checked) => updateSuplemento('vitaminaC', checked)}
        />
        <FormCheckbox
          label="Cálcio"
          checked={formData.suplementacao.calcio}
          onChange={(checked) => updateSuplemento('calcio', checked)}
        />
        <FormCheckbox
          label="Multivitamínico"
          checked={formData.suplementacao.multivitaminico}
          onChange={(checked) => updateSuplemento('multivitaminico', checked)}
        />
      </div>
      <FormInput
        label="Outros suplementos"
        value={formData.suplementacao.outros}
        onChange={(value) => updateSuplemento('outros', value)}
        placeholder="Digite outros suplementos que toma"
      />
    </div>
  </div>
);

// Secção 4: Hábitos Alimentares
export const Section4: React.FC<SectionProps> = ({ formData, updateFormData, errors }) => (
  <div>
    <FormTextarea
      label="Descrição Detalhada do seu dia alimentar"
      value={formData.diaAlimentar}
      onChange={(value) => updateFormData('diaAlimentar', value)}
      error={errors.diaAlimentar}
      required
      placeholder="Descreva as refeições, horários e alimentos com quantidades (ex: 08:00 - 2 fatias de pão integral com queijo)"
      rows={6}
    />

    <FormSelect
      label="Quantidade de água por dia"
      value={formData.quantidadeAgua}
      onChange={(value) => updateFormData('quantidadeAgua', value)}
      options={QUANTIDADE_AGUA_OPTIONS}
      error={errors.quantidadeAgua}
      required
    />

    <FormRadio
      label="Come fora com frequência?"
      value={formData.comeFora}
      onChange={(value) => updateFormData('comeFora', value)}
      options={[
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]}
      required
    />

    <FormSelect
      label="Consome álcool?"
      value={formData.consumoAlcool}
      onChange={(value) => updateFormData('consumoAlcool', value)}
      options={CONSUMO_ALCOOL_OPTIONS}
      error={errors.consumoAlcool}
      required
    />

    {formData.consumoAlcool === 'Outro' && (
      <FormInput
        label="Especifique"
        value={formData.consumoAlcoolOutro || ''}
        onChange={(value) => updateFormData('consumoAlcoolOutro', value)}
        error={errors.consumoAlcoolOutro}
        required
        placeholder="Especifique o consumo de álcool"
      />
    )}

    <FormInput
      label="Quantos cafés por dia?"
      type="number"
      value={formData.cafesPorDia}
      onChange={(value) => updateFormData('cafesPorDia', parseInt(value) || 0)}
      min={0}
      max={10}
      required
    />

    {formData.cafesPorDia > 0 && (
      <FormInput
        label="Hora do último café"
        type="time"
        value={formData.horaUltimoCafe || ''}
        onChange={(value) => updateFormData('horaUltimoCafe', value)}
        error={errors.horaUltimoCafe}
        required
      />
    )}

    <FormSelect
      label="Refrigerantes com frequência?"
      value={formData.refrigerantes}
      onChange={(value) => updateFormData('refrigerantes', value)}
      options={REFRIGERANTES_OPTIONS}
      error={errors.refrigerantes}
      required
    />

    <FormInput
      label="Segue alguma dieta específica?"
      value={formData.dietaEspecifica}
      onChange={(value) => updateFormData('dietaEspecifica', value)}
      error={errors.dietaEspecifica}
      required
      placeholder="Ex: vegetariana, sem glúten, low carb, etc."
    />
  </div>
);

// Secção 5: Estilo de Vida
export const Section5: React.FC<SectionProps> = ({ formData, updateFormData, toggleCheckbox, errors }) => (
  <div>
    <FormRadio
      label="Pratica Exercício Físico?"
      value={formData.praticaExercicio}
      onChange={(value) => updateFormData('praticaExercicio', value)}
      options={[
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]}
      required
    />

    {formData.praticaExercicio && (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onde pratica exercício? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {ONDE_PRATICA_EXERCICIO_OPTIONS.map((option) => (
              <FormCheckbox
                key={option}
                label={option}
                checked={formData.ondePraticaExercicio?.includes(option) || false}
                onChange={() => toggleCheckbox('ondePraticaExercicio', option)}
              />
            ))}
          </div>
          {errors.ondePraticaExercicio && <p className="mt-1 text-sm text-red-500">{errors.ondePraticaExercicio}</p>}
        </div>

        {formData.ondePraticaExercicio?.includes('Outro') && (
          <FormInput
            label="Especifique onde pratica"
            value={formData.ondePraticaExercicioOutro || ''}
            onChange={(value) => updateFormData('ondePraticaExercicioOutro', value)}
            error={errors.ondePraticaExercicioOutro}
            required
            placeholder="Digite onde pratica exercício"
          />
        )}

        <FormRadio
          label="Frequência de exercício"
          value={formData.frequenciaExercicio || ''}
          onChange={(value) => updateFormData('frequenciaExercicio', value)}
          options={FREQUENCIA_EXERCICIO_OPTIONS.map(opt => ({ label: opt, value: opt }))}
          error={errors.frequenciaExercicio}
          required
        />

        <FormInput
          label="Que exercício físico pratica?"
          value={formData.tipoExercicio || ''}
          onChange={(value) => updateFormData('tipoExercicio', value)}
          error={errors.tipoExercicio}
          required
          placeholder="Ex: musculação, corrida, yoga, natação, etc."
        />
      </>
    )}
  </div>
);

// Secção 6: Sono e Stress
export const Section6: React.FC<SectionProps> = ({ formData, updateFormData, toggleCheckbox, errors }) => (
  <div>
    <FormInput
      label="Horas de sono totais por noite"
      type="number"
      value={formData.horasSono}
      onChange={(value) => updateFormData('horasSono', parseFloat(value) || 0)}
      error={errors.horasSono}
      required
      min={0}
      max={24}
      step={0.5}
      placeholder="Ex: 7.5"
    />

    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-3">Segmentação do sono (opcional)</p>
      <div className="grid grid-cols-3 gap-4">
        <FormInput
          label="Sono Leve (horas)"
          type="number"
          value={formData.sonoLeve || 0}
          onChange={(value) => updateFormData('sonoLeve', parseFloat(value) || 0)}
          min={0}
          step={0.5}
        />
        <FormInput
          label="Sono REM (horas)"
          type="number"
          value={formData.sonoREM || 0}
          onChange={(value) => updateFormData('sonoREM', parseFloat(value) || 0)}
          min={0}
          step={0.5}
        />
        <FormInput
          label="Sono Profundo (horas)"
          type="number"
          value={formData.sonoProfundo || 0}
          onChange={(value) => updateFormData('sonoProfundo', parseFloat(value) || 0)}
          min={0}
          step={0.5}
        />
      </div>
    </div>

    <FormRadio
      label="Costuma ter uma hora fixa de deitar toda a semana?"
      value={formData.horaFixaDeitar}
      onChange={(value) => updateFormData('horaFixaDeitar', value)}
      options={[
        { label: 'Sim', value: true },
        { label: 'Não', value: false }
      ]}
      required
    />

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Nível de Stress <span className="text-red-500">*</span>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={formData.nivelStress}
        onChange={(e) => updateFormData('nivelStress', parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>0% (Sem stress)</span>
        <span className="font-bold text-green-600">{formData.nivelStress}%</span>
        <span>100% (Stress extremo)</span>
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sintomas de Stress <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2 grid grid-cols-2 gap-2">
        {SINTOMAS_STRESS_OPTIONS.map((option) => (
          <FormCheckbox
            key={option}
            label={option}
            checked={formData.sintomasStress.includes(option)}
            onChange={() => toggleCheckbox('sintomasStress', option)}
          />
        ))}
      </div>
      {errors.sintomasStress && <p className="mt-1 text-sm text-red-500">{errors.sintomasStress}</p>}
    </div>

    {formData.sintomasStress.includes('Outros') && (
      <FormInput
        label="Especifique outros sintomas"
        value={formData.sintomasStressOutros || ''}
        onChange={(value) => updateFormData('sintomasStressOutros', value)}
        error={errors.sintomasStressOutros}
        required
        placeholder="Digite outros sintomas de stress"
      />
    )}
  </div>
);

// Secção 7: Análises Clínicas
export const Section7: React.FC<SectionProps> = ({ clinicalFile, handleFileChange, errors }) => (
  <div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Análises Clínicas Recentes <span className="text-red-500">*</span>
      </label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
              <span>Carregar ficheiro</span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">ou arrastar e largar</p>
          </div>
          <p className="text-xs text-gray-500">PDF, JPG, PNG até 100 MB</p>
        </div>
      </div>
      {clinicalFile && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Ficheiro selecionado:</strong> {clinicalFile.name} ({(clinicalFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}
      {errors.clinicalFile && <p className="mt-1 text-sm text-red-500">{errors.clinicalFile}</p>}
    </div>

    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-800">
        <strong>Nota:</strong> Por favor carregue as suas análises clínicas mais recentes. Estes dados são importantes para uma avaliação nutricional completa e personalizada.
      </p>
    </div>
  </div>
);
