import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Section1, Section2, Section3, Section4, Section5, Section6, Section7 } from './HealthDataFormSections';
import { HealthDataFormData } from '../types/healthData';

interface HealthDataFormProps {
  patientId: string;
  onSubmitSuccess?: () => void;
}

export const HealthDataForm: React.FC<HealthDataFormProps> = ({ patientId, onSubmitSuccess }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [clinicalFile, setClinicalFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<HealthDataFormData>({
    // 1. Dados Pessoais
    nome: '',
    dataNascimento: '',
    morada: '',
    profissao: '',
    dataConsulta: '',

    // 2. Objetivos da Consulta
    objetivosConsulta: [],
    comoConheceu: '',

    // 3. Dados Clínicos
    diagnosticoDoenca: '',
    operacoes: '',
    medicacao: '',
    suplementacao: {
      vitaminaD: false,
      vitaminaB12: false,
      omega3: false,
      probioticos: false,
      magnesio: false,
      ferro: false,
      zinco: false,
      vitaminaC: false,
      calcio: false,
      multivitaminico: false,
      outros: ''
    },

    // 4. Hábitos Alimentares
    diaAlimentar: '',
    quantidadeAgua: '',
    comeFora: false,
    consumoAlcool: '',
    cafesPorDia: 0,
    refrigerantes: '',
    dietaEspecifica: '',

    // 5. Estilo de Vida
    praticaExercicio: false,

    // 6. Sono e Stress
    horasSono: 7,
    horaFixaDeitar: false,
    nivelStress: 50,
    sintomasStress: []
  });

  const sections = [
    { id: 1, title: 'Dados Pessoais', icon: '👤' },
    { id: 2, title: 'Objetivos da Consulta', icon: '🎯' },
    { id: 3, title: 'Dados Clínicos', icon: '🏥' },
    { id: 4, title: 'Hábitos Alimentares', icon: '🍽️' },
    { id: 5, title: 'Estilo de Vida', icon: '🏃' },
    { id: 6, title: 'Sono e Stress', icon: '😴' },
    { id: 7, title: 'Análises Clínicas', icon: '📄' }
  ];

  // Calcular idade automaticamente
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dataNascimento);

  // Carregar dados existentes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data, error } = await supabase
          .from('patient_health_data')
          .select('*')
          .eq('patient_id', patientId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao carregar dados:', error);
          return;
        }

        if (data) {
          setFormData(data.responses);
          // TODO: Carregar informação do ficheiro se existir
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };

    loadExistingData();
  }, [patientId]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o utilizador edita
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateSuplemento = (field: keyof HealthDataFormData['suplementacao'], value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      suplementacao: {
        ...prev.suplementacao,
        [field]: value
      }
    }));
  };

  const toggleCheckbox = (field: keyof HealthDataFormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const validateSection = (sectionId: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (sectionId) {
      case 1: // Dados Pessoais
        if (!formData.nome || formData.nome.length < 3) {
          newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
        }
        if (!formData.dataNascimento) {
          newErrors.dataNascimento = 'Data de nascimento é obrigatória';
        }
        if (!formData.morada) {
          newErrors.morada = 'Morada é obrigatória';
        }
        if (!formData.profissao) {
          newErrors.profissao = 'Profissão é obrigatória';
        }
        if (formData.profissao === 'Outro' && !formData.profissaoOutro) {
          newErrors.profissaoOutro = 'Por favor especifique a profissão';
        }
        if (!formData.dataConsulta) {
          newErrors.dataConsulta = 'Data da consulta é obrigatória';
        }
        break;

      case 2: // Objetivos da Consulta
        if (formData.objetivosConsulta.length === 0) {
          newErrors.objetivosConsulta = 'Selecione pelo menos um objetivo';
        }
        if (formData.objetivosConsulta.includes('Outro') && !formData.objetivosConsultaOutro) {
          newErrors.objetivosConsultaOutro = 'Por favor especifique o objetivo';
        }
        if (!formData.comoConheceu) {
          newErrors.comoConheceu = 'Campo obrigatório';
        }
        if (formData.comoConheceu === 'Outro' && !formData.comoConheceuOutro) {
          newErrors.comoConheceuOutro = 'Por favor especifique';
        }
        break;

      case 3: // Dados Clínicos
        if (!formData.diagnosticoDoenca) {
          newErrors.diagnosticoDoenca = 'Campo obrigatório';
        }
        if (!formData.operacoes) {
          newErrors.operacoes = 'Campo obrigatório';
        }
        if (!formData.medicacao) {
          newErrors.medicacao = 'Campo obrigatório';
        }
        break;

      case 4: // Hábitos Alimentares
        if (!formData.diaAlimentar) {
          newErrors.diaAlimentar = 'Campo obrigatório';
        }
        if (!formData.quantidadeAgua) {
          newErrors.quantidadeAgua = 'Campo obrigatório';
        }
        if (!formData.consumoAlcool) {
          newErrors.consumoAlcool = 'Campo obrigatório';
        }
        if (formData.consumoAlcool === 'Outro' && !formData.consumoAlcoolOutro) {
          newErrors.consumoAlcoolOutro = 'Por favor especifique';
        }
        if (formData.cafesPorDia > 0 && !formData.horaUltimoCafe) {
          newErrors.horaUltimoCafe = 'Campo obrigatório quando consome café';
        }
        if (!formData.refrigerantes) {
          newErrors.refrigerantes = 'Campo obrigatório';
        }
        if (!formData.dietaEspecifica) {
          newErrors.dietaEspecifica = 'Campo obrigatório';
        }
        break;

      case 5: // Estilo de Vida
        if (formData.praticaExercicio) {
          if (!formData.ondePraticaExercicio || formData.ondePraticaExercicio.length === 0) {
            newErrors.ondePraticaExercicio = 'Campo obrigatório';
          }
          if (formData.ondePraticaExercicio?.includes('Outro') && !formData.ondePraticaExercicioOutro) {
            newErrors.ondePraticaExercicioOutro = 'Por favor especifique';
          }
          if (!formData.frequenciaExercicio) {
            newErrors.frequenciaExercicio = 'Campo obrigatório';
          }
          if (!formData.tipoExercicio) {
            newErrors.tipoExercicio = 'Campo obrigatório';
          }
        }
        break;

      case 6: // Sono e Stress
        if (!formData.horasSono || formData.horasSono <= 0) {
          newErrors.horasSono = 'Campo obrigatório';
        }
        if (formData.sintomasStress.length === 0) {
          newErrors.sintomasStress = 'Selecione pelo menos um sintoma';
        }
        if (formData.sintomasStress.includes('Outros') && !formData.sintomasStressOutros) {
          newErrors.sintomasStressOutros = 'Por favor especifique';
        }
        break;

      case 7: // Análises Clínicas
        if (!clinicalFile) {
          newErrors.clinicalFile = 'Por favor faça upload das análises clínicas';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < sections.length) {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de ficheiro
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, clinicalFile: 'Formato não suportado. Use PDF, JPG ou PNG.' });
      return;
    }

    // Validar tamanho (100 MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ ...errors, clinicalFile: 'Ficheiro muito grande. Máximo 100 MB.' });
      return;
    }

    setClinicalFile(file);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.clinicalFile;
      return newErrors;
    });
  };

  const uploadClinicalFile = async (): Promise<{ url: string; name: string; size: number } | null> => {
    if (!clinicalFile) return null;

    setUploadingFile(true);
    try {
      const fileExt = clinicalFile.name.split('.').pop();
      const fileName = `${patientId}_${Date.now()}.${fileExt}`;
      const filePath = `clinical-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinical-files')
        .upload(filePath, clinicalFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinical-files')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        name: clinicalFile.name,
        size: clinicalFile.size
      };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setErrors({ ...errors, clinicalFile: 'Erro ao fazer upload do ficheiro' });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(currentSection)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload do ficheiro de análises clínicas
      const fileData = await uploadClinicalFile();
      if (!fileData) {
        setIsSubmitting(false);
        return;
      }

      // Verificar se já existe um registo
      const { data: existingData } = await supabase
        .from('patient_health_data')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      const dataToSave = {
        patient_id: patientId,
        responses: formData,
        clinical_file_url: fileData.url,
        clinical_file_name: fileData.name,
        clinical_file_size: fileData.size,
        completed_at: new Date().toISOString()
      };

      let error;
      if (existingData) {
        // Atualizar registo existente
        ({ error } = await supabase
          .from('patient_health_data')
          .update(dataToSave)
          .eq('patient_id', patientId));
      } else {
        // Criar novo registo
        ({ error } = await supabase
          .from('patient_health_data')
          .insert([dataToSave]));
      }

      if (error) throw error;

      alert('Formulário submetido com sucesso!');
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      alert('Erro ao submeter formulário. Por favor tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentSection / sections.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Secção {currentSection} de {sections.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}% completo
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              currentSection === section.id
                ? 'bg-green-600 text-white'
                : section.id < currentSection
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span>{section.icon}</span>
            <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {sections[currentSection - 1].title}
        </h2>

        {/* Render section content based on currentSection */}
        {currentSection === 1 && renderSection1()}
        {currentSection === 2 && renderSection2()}
        {currentSection === 3 && renderSection3()}
        {currentSection === 4 && renderSection4()}
        {currentSection === 5 && renderSection5()}
        {currentSection === 6 && renderSection6()}
        {currentSection === 7 && renderSection7()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {currentSection < sections.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || uploadingFile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || uploadingFile ? 'A submeter...' : 'Submeter Formulário'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Section render functions
  function renderSection1() {
    return <Section1 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection2() {
    return <Section2 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection3() {
    return <Section3 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection4() {
    return <Section4 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection5() {
    return <Section5 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection6() {
    return <Section6 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }

  function renderSection7() {
    return <Section7 formData={formData} updateFormData={updateFormData} updateSuplemento={updateSuplemento} toggleCheckbox={toggleCheckbox} errors={errors} age={age} clinicalFile={clinicalFile} handleFileChange={handleFileChange} />;
  }
};
