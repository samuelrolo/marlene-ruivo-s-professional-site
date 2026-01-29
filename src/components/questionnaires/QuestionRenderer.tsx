import { useState } from 'react';
import { Question, QuestionOption } from '@/types/questionnaire';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[], text?: string) => void;
  disabled?: boolean;
}

const QuestionRenderer = ({ question, value, onChange, disabled = false }: QuestionRendererProps) => {
  const [otherText, setOtherText] = useState('');

  const handleSingleChoice = (optionValue: string) => {
    onChange(optionValue);
  };

  const handleMultipleChoice = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter(v => v !== optionValue);
    onChange(newValues);
  };

  const handleOtherText = (text: string, optionValue: string) => {
    setOtherText(text);
    onChange(optionValue, text);
  };

  // Renderizar imagem se existir (ex: Escala de Bristol)
  const renderImage = () => {
    if (!question.image_url) return null;
    return (
      <div className="my-4 flex justify-center">
        <img 
          src={question.image_url} 
          alt={question.text}
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
    );
  };

  // Renderizar opções de escolha única
  const renderSingleChoice = () => (
    <div className="space-y-3">
      {question.options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
            value === option.value
              ? "border-[#6FA89E] bg-[#6FA89E]/5"
              : "border-gray-200 hover:border-[#6FA89E]/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={value === option.value}
            onChange={() => handleSingleChoice(option.value)}
            disabled={disabled}
            className="mt-1 mr-3 text-[#6FA89E] focus:ring-[#6FA89E]"
          />
          <span className="flex-1 text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );

  // Renderizar opções de múltipla escolha
  const renderMultipleChoice = () => {
    const currentValues = Array.isArray(value) ? value : [];
    
    return (
      <div className="space-y-3">
        {question.options.map((option) => {
          const isChecked = currentValues.includes(option.value);
          
          return (
            <div key={option.value}>
              <label
                className={cn(
                  "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
                  isChecked
                    ? "border-[#6FA89E] bg-[#6FA89E]/5"
                    : "border-gray-200 hover:border-[#6FA89E]/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => handleMultipleChoice(option.value, e.target.checked)}
                  disabled={disabled}
                  className="mt-1 mr-3 text-[#6FA89E] focus:ring-[#6FA89E] rounded"
                />
                <span className="flex-1 text-gray-700">{option.label}</span>
              </label>
              
              {/* Campo de texto adicional se allow_text */}
              {option.allow_text && isChecked && (
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => handleOtherText(e.target.value, option.value)}
                  placeholder="Especifique..."
                  disabled={disabled}
                  className="mt-2 ml-11 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar Sim/Não
  const renderYesNo = () => (
    <div className="flex gap-4">
      {question.options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSingleChoice(option.value)}
          disabled={disabled}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-medium transition-all",
            value === option.value
              ? "bg-[#6FA89E] text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  // Renderizar campo de texto
  const renderText = () => (
    <textarea
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={4}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 resize-none"
      placeholder="Escreva a sua resposta..."
    />
  );

  return (
    <div className="space-y-4">
      {/* Número e texto da questão */}
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#6FA89E] text-white rounded-full font-semibold text-sm">
          {question.order}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
        </div>
      </div>

      {/* Imagem (se existir) */}
      {renderImage()}

      {/* Opções baseadas no tipo */}
      <div className="pl-11">
        {question.type === 'single_choice' && renderSingleChoice()}
        {question.type === 'multiple_choice' && renderMultipleChoice()}
        {question.type === 'yes_no' && renderYesNo()}
        {question.type === 'bristol_scale' && renderSingleChoice()} {/* Usa mesmo layout */}
        {question.type === 'text' && renderText()}
      </div>
    </div>
  );
};

export default QuestionRenderer;
