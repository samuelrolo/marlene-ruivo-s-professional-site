import { Award, Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import marleneCup from '@/assets/marlene-cup.jpg';

const stats = [
  { value: '15+', label: 'Anos de experiência clínica' },
  { value: 'Monash', label: 'Certified' },
];

const highlights = [
  {
    icon: Users,
    title: 'Percurso Consolidado',
    description: '15 anos dedicados à nutrição clínica (SousaClínica, Clínica do Tempo), agora focada em devolver qualidade de vida através da saúde intestinal.',
  },
  {
    icon: Award,
    title: 'Especialização Monash',
    description: 'Formação certificada em dieta Low FODMAP pela Monash University, a referência mundial para tratamento de SII.',
  },
  {
    icon: Heart,
    title: 'Abordagem Humana',
    description: 'Acredito numa nutrição sem julgamentos, onde cada sintoma é validado e cada plano é adaptado à sua realidade real.',
  },
];

const services = ['SII & SIBO', 'Gestão de sintomas', 'Perda de Peso'];

export const About = () => {
  return (
    <section id="sobre" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={marleneCup}
                alt="Marlene Ruivo - Nutricionista"
                className="w-full max-w-md mx-auto rounded-3xl shadow-card"
              />
              
              {/* Stats overlay */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-card border border-border/50 text-center"
                  >
                    <p className="text-2xl font-heading font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-sage-light/50 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-beige-dark/50 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Sobre Marlene Ruivo
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
                Nutrição com empatia e ciência
              </h2>
            </div>

            <div className="space-y-6">
              {highlights.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-sage-dark" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sage-light/50 rounded-full text-sm font-medium text-sage-dark border border-sage/20"
                >
                  <Sparkles className="w-4 h-4" />
                  {service}
                </span>
              ))}
            </div>

            <Button asChild>
              <a href="#contactos">Conhecer consultas</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
