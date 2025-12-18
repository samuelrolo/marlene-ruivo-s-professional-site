import { Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import marleneHero from '@/assets/marlene-hero.png';

export const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen pt-20 lg:pt-24 gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-sage-light/30 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-48 h-48 bg-sage/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-light/60 rounded-full border border-sage/30">
              <span className="text-sm font-medium text-sage-dark">Saúde intestinal</span>
              <span className="w-1 h-1 bg-sage-dark rounded-full" />
              <span className="text-sm font-medium text-sage-dark">Dieta FODMAP</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground leading-tight text-balance">
              Nutrição especializada em{' '}
              <span className="text-primary">saúde intestinal</span> e dieta FODMAP
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Apoio clínico baseado em ciência para reduzir sintomas e recuperar o bem-estar digestivo. 
              A Marlene estreia-se como nutricionista freelance em dezembro de 2025, mantendo o 
              acompanhamento próximo e humano que marca a sua carreira.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <a href="#contactos">
                  Agendar consulta
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="hero-outline" asChild>
                <a href="#sobre">Saber mais</a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative z-10">
              <img
                src={marleneHero}
                alt="Marlene Ruivo - Nutricionista especializada em saúde intestinal"
                className="w-full max-w-md mx-auto lg:max-w-lg rounded-3xl shadow-card"
              />

              {/* Monash Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0 bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-card border border-border/50 animate-scale-in animation-delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
                    <Award className="w-6 h-6 text-sage-dark" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Monash Certified</p>
                    <p className="text-sm font-medium text-foreground">Plano FODMAP personalizado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute -top-8 -right-8 w-full h-full bg-sage-light/40 rounded-3xl -z-10 rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
};
