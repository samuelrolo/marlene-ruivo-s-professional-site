import { MapPin, Clock, Monitor, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    name: 'Clínica Hygeia',
    city: 'Mafra',
    day: 'Segunda-feira',
    hours: '9:00 - 13:00',
    icon: '🏥',
    mapLink: 'https://www.waze.com/ul?q=Cl%C3%ADnica%20Hygeia%20Mafra',
    siteLink: 'https://sheerme.com/hygeia-clinica-de-osteopatia-de-mafra',
  },
  {
    name: 'Instituto Bettencourt',
    city: 'Lisboa',
    day: 'Terça-feira',
    hours: '9:00 - 16:00',
    icon: '🏛️',
    mapLink: 'https://www.waze.com/ul?q=Instituto%20Bettencourt%20Lisboa',
    siteLink: 'https://institutobettencourt.pt/',
  },
  {
    name: 'Clínica Sousi',
    city: 'Sintra',
    day: 'Quarta-feira',
    hours: '9:00 - 17:00',
    icon: '🏰',
    mapLink: 'https://www.waze.com/ul?q=Cl%C3%ADnica%20Sousi%20Sintra',
    siteLink: 'https://sousiclinica.pt/',
  },
  {
    name: 'Consulta Online',
    city: 'Horário flexível',
    day: 'Videochamada',
    hours: 'Flexível',
    icon: '💻',
    mapLink: null,
    siteLink: null,
  },
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
            3 localizações físicas + opção online para maior flexibilidade.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group p-6 rounded-3xl bg-background border border-border/30 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{location.icon}</div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                {location.name}
              </h3>
              <p className="text-primary font-medium mb-4">{location.city}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{location.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 flex items-center justify-center">⏰</span>
                  <span>{location.hours}</span>
                </div>
              </div>

              {(location.mapLink || location.siteLink) && (
                <div className="flex gap-2">
                  {location.siteLink && (
                    <a
                      href={location.siteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <MapPin className="w-3 h-3" />
                      Onde
                    </a>
                  )}
                  {location.mapLink && (
                    <a
                      href={location.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Como Chegar
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pricing Banner */}
        <div className="bg-sage-light/50 rounded-3xl p-8 md:p-12 text-center border border-sage/20">
          <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
            Preços
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-6">
            <div>
              <p className="text-4xl font-heading font-bold text-primary">60€</p>
              <p className="text-muted-foreground">1ª Consulta</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-border" />
            <div>
              <p className="text-4xl font-heading font-bold text-primary">50€</p>
              <p className="text-muted-foreground">Acompanhamento</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Se não tiver agenda conciliável, é possível agendar videochamada noutra data.
          </p>
          <Button variant="hero" asChild>
            <a href="#contactos">Agendar Consulta →</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
