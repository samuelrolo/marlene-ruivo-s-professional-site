import { AlertCircle, Activity, Wind, Droplets, Maximize2 } from 'lucide-react';

const symptoms = [
  {
    icon: AlertCircle,
    title: 'Dor ou desconforto abdominal',
    description: 'Dor recorrente que pode variar em intensidade e localização',
  },
  {
    icon: Maximize2,
    title: 'Inchaço abdominal (distensão)',
    description: 'Sensação de barriga inchada e desconforto visível',
  },
  {
    icon: Wind,
    title: 'Sensação de gases excessivos',
    description: 'Acumulação de gases que causa desconforto e pressão',
  },
  {
    icon: Activity,
    title: 'Diarreia, obstipação ou alternância',
    description: 'Alterações no trânsito intestinal, com padrões irregulares',
  },
  {
    icon: Droplets,
    title: 'Sensação de evacuação incompleta',
    description: 'Sensação persistente de necessidade de evacuar',
  },
];

export const SymptomsSection = () => {
  return (
    <section id="sintomas" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Sintomas Gastrointestinais
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Sintomas gastrointestinais mais comuns
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Os sintomas gastrointestinais são queixas frequentes e podem afetar significativamente
            a qualidade de vida. Entre os mais comuns destacam-se:
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        {/* SII Information */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-sage-light/30 rounded-3xl p-8 border border-sage/20">
            <p className="text-lg text-foreground leading-relaxed text-center">
              Quando estes sintomas são recorrentes e não existe uma causa orgânica identificada,
              pode estar associada uma <strong className="text-primary">doença gastrointestinal funcional</strong>,
              como a <strong className="text-primary">Síndrome do Intestino Irritável (SII)</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
