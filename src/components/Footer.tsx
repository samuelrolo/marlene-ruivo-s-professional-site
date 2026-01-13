import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest text-cream py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-marlene-ruivo.jpg"
              alt="Drª Marlene Ruivo - Nutricionista"
              className="h-10 w-auto object-contain"
              style={{ filter: 'none' }}
            />
            <div>
              <p className="font-heading text-lg font-semibold">Drª Marlene Ruivo</p>
              <p className="text-xs text-cream/60 tracking-wide uppercase">Nutricionista</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-cream/60">
            <span>© 2026 Marlene Ruivo.</span>
            <span className="hidden sm:inline">Feito com</span>
            <Heart className="hidden sm:inline w-4 h-4 text-sage" fill="currentColor" />
            <span className="hidden sm:inline">em Portugal</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-cream/60 hover:text-cream transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-cream/60 hover:text-cream transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
