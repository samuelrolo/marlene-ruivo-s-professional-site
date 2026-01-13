import { Clock, ExternalLink, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const presencialLocations = [
  {
    name: 'Clínica Hygeia',
    city: 'Mafra',
    address: 'Rua exemplo, Mafra',
    day: 'Segunda-feira',
    hours: '9:00 - 13:00',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.7803841489895!2d-9.327595!3d38.936848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecba1234567890%3A0xabcdef!2sClinica%20Hygeia%20Mafra!5e0!3m2!1spt-PT!2spt!4v1234567890',
    siteLink: 'https://sheerme.com/hygeia-clinica-de-osteopatia-de-mafra',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  },
  {
    name: 'Instituto Bettencourt',
    city: 'Lisboa',
    address: 'Rua exemplo, Lisboa',
    day: 'Terça-feira',
    hours: '9:00 - 16:00',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.123456789!2d-9.142685!3d38.707688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1932abc!2sInstituto%20Bettencourt!5e0!3m2!1spt-PT!2spt!4v1234567890',
    siteLink: 'https://institutobettencourt.pt/',
    color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  },
  {
    name: 'Clínica Sousi',
    city: 'Sintra',
    address: 'Rua exemplo, Sintra',
    day: 'Quarta-feira',
    hours: '9:00 - 13:00',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.987654321!2d-9.390123!3d38.798765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecb123!2sClinica%20Sousi%20Sintra!5e0!3m2!1spt-PT!2spt!4v1234567890',
    siteLink: 'https://sousiclinica.pt/',
    color: 'from-green-500/10 to-green-600/5 border-green-500/20',
  },
];

const weeklySchedule = [
  { day: 'Segunda', morning: 'Clínica Hygeia', afternoon: 'Clínica Sousi' },
  { day: 'Terça', morning: 'Instituto Bettencourt', afternoon: 'Instituto Bettencourt' },
  { day: 'Quarta', morning: 'Clínica Sousi', afternoon: 'Online' },
  { day: 'Quinta', morning: 'Online', afternoon: 'Online' },
  { day: 'Sexta', morning: 'Online', afternoon: 'Online' },
];

export const LocationsSection = () => {
  return (
    <section id="locais" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Onde Atendo
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Locais de Consulta
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o local mais conveniente para si: consultas presenciais ou online.
          </p>
        </div>

        {/* Weekly Schedule Calendar - Minimalist */}
        <div className="mb-16">
          <h3 className="text-2xl font-heading font-semibold text-foreground mb-8 text-center">
            Horário Semanal
          </h3>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-3 text-left font-semibold text-foreground bg-background">
                    Dia
                  </th>
                  <th className="border border-border p-3 text-center font-semibold text-foreground bg-background">
                    Manhã
                  </th>
                  <th className="border border-border p-3 text-center font-semibold text-foreground bg-background">
                    Tarde
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((schedule, index) => (
                  <tr key={index}>
                    <td className="border border-border p-3 font-medium text-foreground bg-background">
                      {schedule.day}
                    </td>
                    <td className="border border-border p-3 text-center text-sm text-muted-foreground">
                      {schedule.morning}
                    </td>
                    <td className="border border-border p-3 text-center text-sm text-muted-foreground">
                      {schedule.afternoon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. Presencial */}
        <div className="mb-16">
          <h3 className="text-2xl font-heading font-semibold text-foreground mb-8 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</span>
            Presencial
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presencialLocations.map((location, index) => (
              <div
                key={index}
                className={`group rounded-3xl overflow-hidden bg-gradient-to-br ${location.color} border-2 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Map Preview */}
                <div className="relative h-48 bg-sage-light/20 overflow-hidden">
                  <iframe
                    src={location.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${location.name}`}
                    className="grayscale group-hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <h4 className="text-xl font-heading font-semibold text-foreground mb-1">
                    {location.name}
                  </h4>
                  <p className="text-primary font-medium mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location.city}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{location.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{location.hours}</span>
                    </div>
                  </div>

                  <a
                    href={location.siteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full group/btn">
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Agendar no Site
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Online */}
        <div className="mb-12">
          <h3 className="text-2xl font-heading font-semibold text-foreground mb-8 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</span>
            Online
          </h3>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-sage-light/30 to-background border border-border/30 shadow-card">
              <div className="p-8 md:p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-primary" />
                </div>

                <h4 className="text-2xl font-heading font-semibold text-foreground mb-3">
                  Consulta Online
                </h4>
                <p className="text-lg text-muted-foreground mb-2">
                  Quarta (tarde), Quinta e Sexta
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Consultas por videochamada com total flexibilidade de horário, ideal para quem não pode deslocar-se.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light/50 text-sm text-foreground mb-8">
                  <Clock className="w-4 h-4" />
                  <span>Horário Flexível</span>
                </div>

                <Button variant="hero" size="lg" asChild className="w-full md:w-auto">
                  <a href="https://calendar.app.google/JsNJtR3uj9XPHh5J7" target="_blank" rel="noopener noreferrer">
                    Agendar Videochamada
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Packs */}
        <div>
          <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2 text-center">
            Packs de Consultas Online
          </h3>
          <p className="text-center text-sm text-muted-foreground mb-12">
            Consultas Online: 60€ (1ª consulta) | 50€ (acompanhamento)<br />
            <span className="text-xs">Nas clínicas presenciais aplicam-se os preços da tabela de cada clínica.</span>
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pack 3 meses */}
            <div className="border-2 border-border rounded-2xl p-6 bg-background hover:border-primary/30 transition-all">
              <div className="flex items-baseline gap-2 mb-4">
                <h4 className="text-xl font-heading font-bold text-foreground">Pack 3 meses</h4>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-heading font-bold text-primary">145€</p>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">-15€</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-3">Inclui:</p>
                <p>• 1ª consulta (avaliação completa)</p>
                <p>• 2 consultas de seguimento</p>
                <p>• Acompanhamento entre consultas</p>
              </div>

              <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
                👉 Ideal para quem quer experimentar e criar hábito
              </p>
            </div>

            {/* Pack 6 meses - DESTAQUE */}
            <div className="border-2 border-primary rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-background relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Mais Popular
              </div>

              <div className="flex items-baseline gap-2 mb-4 mt-2">
                <h4 className="text-xl font-heading font-bold text-foreground">Pack 6 meses</h4>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-heading font-bold text-primary">270€</p>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">-40€</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-3">Inclui:</p>
                <p>• 1ª consulta</p>
                <p>• 5 consultas de seguimento</p>
                <p>• Ajustes regulares do plano</p>
                <p>• Prioridade no acompanhamento</p>
              </div>

              <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
                👉 Muito bom para resultados sólidos (emagrecimento, reeducação alimentar)
              </p>
            </div>

            {/* Pack 12 meses */}
            <div className="border-2 border-border rounded-2xl p-6 bg-background hover:border-primary/30 transition-all">
              <div className="flex items-baseline gap-2 mb-4">
                <h4 className="text-xl font-heading font-bold text-foreground">Pack 12 meses</h4>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-heading font-bold text-primary">499€</p>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">-111€</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-3">Inclui:</p>
                <p>• 1ª consulta</p>
                <p>• 11 consultas de seguimento</p>
                <p>• Acompanhamento contínuo</p>
                <p>• Estratégia de manutenção</p>
              </div>

              <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
                👉 Excelente para fidelização e estabilidade de longo prazo
              </p>
            </div>
          </div>

          {/* Dicas Importantes */}
          <div className="mt-12 max-w-2xl mx-auto bg-sage-light/30 rounded-2xl p-6 border border-sage/20">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>💡</span> Dicas Importantes
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Packs têm validade de 3, 6 ou 12 meses respetivamente</li>
              <li>• Não são reembolsáveis</li>
              <li>• Aplicável apenas para consultas online</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
