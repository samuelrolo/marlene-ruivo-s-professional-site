import { Puzzle, ArrowRight, FlaskConical } from 'lucide-react';

const fodmapLetters = [
  { letter: 'F', word: 'Fermentáveis' },
  { letter: 'O', word: 'Oligossacarídeos' },
  { letter: 'D', word: 'Dissacarídeos' },
  { letter: 'M', word: 'Monossacarídeos' },
  { letter: 'A', word: 'And' },
  { letter: 'P', word: 'Polióis' },
];

const phases = [
  {
    number: '1',
    title: 'Fase de redução',
    description: 'Durante um período limitado, os alimentos ricos em FODMAP são reduzidos da alimentação. Esta fase ajuda a aliviar os sintomas gastrointestinais e a "acalmar" o sistema digestivo.',
    icon: '🍽️',
  },
  {
    number: '2',
    title: 'Fase de reintrodução',
    description: 'Os alimentos são reintroduzidos gradualmente, um de cada vez, para perceber quais causam sintomas e em que quantidade. Esta fase é essencial para personalizar o plano alimentar.',
    icon: '🔬',
  },
  {
    number: '3',
    title: 'Fase de personalização',
    description: 'Com base na tolerância individual, constrói-se uma alimentação variada, equilibrada e adaptada, evitando apenas os alimentos que realmente provocam desconforto.',
    icon: '✅',
  },
];

const conditions = [
  'Síndrome do Intestino Irritável',
  'SIBO',
  'Doenças inflamatórias intestinais em remissão',
  'Endometriose',
  'Fibromialgia',
];

export const FodmapSection = () => {
  return (
    <section id="fodmap" className="py-20 lg:py-32 bg-sage-light/20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Dieta FODMAP
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            A estratégia FODMAP
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A estratégia FODMAP é uma abordagem nutricional utilizada no controlo de doenças gastrointestinais
            funcionais, especialmente em pessoas que sofrem de sintomas digestivos frequentes, como inchaço abdominal,
            dor, gases, diarreia ou obstipação.
          </p>
        </div>

        {/* What is FODMAP - Puzzle Cards */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
              O que significa FODMAP?
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              FODMAP é um acrónimo em inglês que se refere a um conjunto de hidratos de carbono de difícil digestão
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {fodmapLetters.map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl border-2 border-primary/20 shadow-soft hover:shadow-card hover:border-primary transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-heading font-bold text-primary">{item.letter}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.word}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <p className="text-center text-foreground leading-relaxed">
                Estes compostos não são bem absorvidos no intestino delgado e acabam por fermentar no intestino grosso,
                o que pode provocar <strong className="text-primary">desconforto gastrointestinal em pessoas sensíveis</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* How it works - Phases */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
              Como funciona a estratégia FODMAP?
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A estratégia FODMAP não é uma dieta restritiva permanent, mas sim um processo estruturado em fases,
              com o objetivo de identificar quais os alimentos que desencadeiam sintomas em cada pessoa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {phases.map((phase, index) => (
              <div
                key={index}
                className="relative bg-card p-8 rounded-3xl border border-border/30 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-heading font-bold text-primary-foreground">{phase.number}</span>
                </div>
                <div className="text-5xl mb-4">{phase.icon}</div>
                <h4 className="text-xl font-heading font-semibold text-foreground mb-4">
                  {phase.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
              Condições que podem beneficiar
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-sage-light rounded-full border border-sage hover:bg-sage hover:text-white transition-colors duration-300"
              >
                <span className="font-medium">{condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 text-center">
            <FlaskConical className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg text-foreground leading-relaxed">
              A estratégia FODMAP é uma <strong className="text-primary">ferramenta eficaz</strong> para melhorar a qualidade
              de vida de pessoas com sintomas gastrointestinais, permitindo identificar gatilhos alimentares e adaptar a
              alimentação de forma <strong className="text-primary">individualizada, segura e sustentável</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
