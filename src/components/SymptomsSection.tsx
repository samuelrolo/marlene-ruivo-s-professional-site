import { Activity, Stethoscope, Brain, Pill, HeartPulse, Wind } from 'lucide-react';

const symptoms = [
  {
    icon: Activity,
    title: 'Dor abdominal',
    description: 'Protocolos de alívio imediato e estratégias de longo prazo para regular a motilidade.',
  },
  {
    icon: Wind,
    title: 'Inchaço',
    description: 'Redução de fermentação com escolhas low-FODMAP e gestão de fibras.',
  },
  {
    icon: Stethoscope,
    title: 'Cólica',
    description: 'Planos que minimizam gatilhos e ajustam combinações alimentares para conforto digestivo.',
  },
  {
    icon: HeartPulse,
    title: 'Diarreia',
    description: 'Protocolos de estabilização com foco na hidratação, eletrólitos e alimentos bem tolerados.',
  },
  {
    icon: Pill,
    title: 'Obstipação',
    description: 'Gestão de fibras, hidratação, psicobióticos e rotina alimentar para regularidade.',
  },
  {
    icon: Brain,
    title: 'Eixo Intestino-Cérebro',
    description: 'Ligação intestino-cérebro, probióticos específicos e estratégias de gestão do stress.',
  },
];

export const SymptomsSection = () => {
  return (
    <section id="sintomas" className="py-20 lg:py-32 bg-sage-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Serviços Especializados
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Como posso ajudar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Acompanhamento especializado para SII, SIBO, dieta FODMAP e o eixo intestino-cérebro.
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.map((symptom, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-card border border-border/30 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <symptom.icon className="w-7 h-7 text-sage-dark group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {symptom.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {symptom.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
