import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    name: 'Clínica Hygeia',
    city: 'Mafra',
    address: 'Mafra, Portugal',
    lat: 38.9369,
    lng: -9.3325,
    day: 'Segunda-feira',
    hours: '9:00 - 13:00',
    mapLink: 'https://www.waze.com/ul?q=Cl%C3%ADnica%20Hygeia%20Mafra',
    siteLink: 'https://sheerme.com/hygeia-clinica-de-osteopatia-de-mafra',
  },
  {
    name: 'Instituto Bettencourt',
    city: 'Lisboa',
    address: 'Lisboa, Portugal',
    lat: 38.7223,
    lng: -9.1393,
    day: 'Terça-feira',
    hours: '9:00 - 16:00',
    mapLink: 'https://www.waze.com/ul?q=Instituto%20Bettencourt%20Lisboa',
    siteLink: 'https://institutobettencourt.pt/',
  },
  {
    name: 'Clínica Sousi',
    city: 'Sintra',
    address: 'Sintra, Portugal',
    lat: 38.7980,
    lng: -9.3880,
    day: 'Quarta-feira',
    hours: '9:00 - 17:00',
    mapLink: 'https://www.waze.com/ul?q=Cl%C3%ADnica%20Sousi%20Sintra',
    siteLink: 'https://sousiclinica.pt/',
  },
];

interface MapSectionProps {
  mapboxToken?: string;
}

export const MapSection = ({ mapboxToken }: MapSectionProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [tokenInput, setTokenInput] = useState('');
  const [activeToken, setActiveToken] = useState(mapboxToken || '');

  useEffect(() => {
    if (!mapContainer.current || !activeToken) return;

    mapboxgl.accessToken = activeToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-9.25, 38.82],
      zoom: 9,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each location
    locations.forEach((loc, index) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, hsl(150 18% 45%) 0%, hsl(150 20% 55%) 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      const inner = document.createElement('span');
      inner.style.cssText = `
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 14px;
      `;
      inner.textContent = (index + 1).toString();
      el.appendChild(inner);

      el.addEventListener('click', () => {
        setSelectedLocation(index);
        map.current?.flyTo({
          center: [loc.lng, loc.lat],
          zoom: 13,
          duration: 1500,
        });
      });

      new mapboxgl.Marker(el)
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [activeToken]);

  const flyToLocation = (index: number) => {
    setSelectedLocation(index);
    map.current?.flyTo({
      center: [locations[index].lng, locations[index].lat],
      zoom: 13,
      duration: 1500,
    });
  };

  if (!activeToken) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-4">Visualização do Mapa</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Para ver o mapa interativo com as localizações das clínicas, introduza o seu token público do Mapbox.
              <br />
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Obter token no Mapbox →
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.eyJ1Ijoi..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button onClick={() => setActiveToken(tokenInput)} disabled={!tokenInput}>
                Ativar Mapa
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">
            Encontre-nos no Mapa
          </h3>
          <p className="text-muted-foreground">
            Clique nos marcadores ou nas localizações abaixo para explorar
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Location Cards */}
          <div className="lg:col-span-1 space-y-3">
            {locations.map((loc, index) => (
              <button
                key={index}
                onClick={() => flyToLocation(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedLocation === index
                    ? 'border-primary bg-sage-light/50 shadow-soft'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedLocation === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-foreground">{loc.name}</h4>
                    <p className="text-sm text-primary font-medium">{loc.city}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {loc.day} • {loc.hours}
                    </p>
                    {loc.mapLink && (
                      <div className="flex gap-3 mt-2">
                        <a
                          href={loc.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation className="w-3 h-3" />
                          Waze
                        </a>
                        {loc.siteLink && (
                          <a
                            href={loc.siteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-border">
              <div ref={mapContainer} className="h-[400px] lg:h-[450px]" />
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground">
                  {locations[selectedLocation].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locations[selectedLocation].city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
