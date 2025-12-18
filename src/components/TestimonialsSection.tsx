import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana',
    age: '32 anos',
    quote: 'Em poucas semanas consegui identificar os alimentos que pioravam o meu SII. O plano foi prático e respeitou a minha rotina. Hoje tenho energia e confiança para voltar a sair.',
  },
  {
    name: 'Ricardo',
    age: '41 anos',
    quote: 'A fase de reintrodução foi decisiva. Com a orientação da Marlene reaprendi a comer sem receio de crises. Os sintomas de inchaço diminuíram imenso.',
  },
  {
    name: 'Sofia',
    age: '28 anos',
    quote: 'Precisei de apoio para SIBO e FODMAP em simultâneo. Recebi um plano claro, com check-ins frequentes e estratégias para lidar com recaídas.',
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testemunhos" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Testemunhos
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Resultados sentidos no dia a dia
          </h2>
          <p className="text-lg text-muted-foreground">
            Relatos de quem recuperou conforto digestivo com acompanhamento próximo.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-3xl bg-card border border-border/30 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-sage-light mb-6" />
              <p className="text-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
                  <span className="text-lg font-heading font-semibold text-sage-dark">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.age}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
