import { Minus, Plus, Check } from 'lucide-react';

const phases = [
  {
    number: '1',
    title: 'Eliminação',
    description: 'Retirada temporária de hidratos de carbono fermentáveis para acalmar o intestino e reduzir sintomas.',
    color: 'bg-sage-light',
    textColor: 'text-sage-dark',
  },
  {
    number: '2',
    title: 'Reintrodução',
    description: 'Testes controlados para identificar exatamente quais os alimentos gatilho para o seu corpo.',
    color: 'bg-beige',
    textColor: 'text-foreground',
  },
  {
    number: '3',
    title: 'Personalização',
    description: 'Plano alimentar final, variado e equilibrado, mantendo apenas as restrições estritamente necessárias.',
    color: 'bg-primary/10',
    textColor: 'text-primary',
  },
];

const benefits = [
  {
    title: 'Atenção centrada na pessoa',
    description: 'Plano que respeita sintomas, rotinas e preferências alimentares para avanços sustentáveis.',
  },
  {
    title: 'Acompanhamento próximo',
    description: 'Consultas regulares, monitorização de sintomas e ajustes ágeis para manter o conforto digestivo.',
  },
  {
    title: 'Educação alimentar',
    description: 'Ferramentas práticas para reconhecer gatilhos, gerir recaídas e manter equilíbrio a longo prazo.',
  },
  {
    title: 'Experiência clínica',
    description: '15+ anos em nutrição clínica, agora focada em saúde intestinal.',
  },
];

export const FodmapSection = () => {
  return (
    <section id="fodmap" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Dieta FODMAP
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Ciência aplicada à sua rotina digestiva
          </h2>
          <p className="text-lg text-muted-foreground">
            A estratégia gold-standard para o controlo da Síndrome do Intestino Irritável.
          </p>
        </div>

        {/* Phases */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {phases.map((phase, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl ${phase.color} border border-border/30 shadow-soft hover:shadow-card transition-all duration-300 group`}
            >
              <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center font-heading text-xl font-bold ${phase.textColor}`}>
                {phase.number}
              </div>
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center ${phase.textColor}`}>
                  {index === 0 && <Minus className="w-6 h-6" />}
                  {index === 1 && <Plus className="w-6 h-6" />}
                  {index === 2 && <Check className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-heading font-semibold text-foreground">
                  {phase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border/30 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
