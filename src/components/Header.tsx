import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'FODMAP', href: '#fodmap' },
  { label: 'Sintomas', href: '#sintomas' },
  { label: 'Locais', href: '#locais' },
  { label: 'Testemunhos', href: '#testemunhos' },
  { label: 'Contactos', href: '#contactos' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <span className="text-sage-dark text-lg">🌿</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-lg font-semibold text-foreground">Drª Marlene Ruivo</p>
              <p className="text-xs text-muted-foreground tracking-wide uppercase">Nutricionista</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild>
              <a href="#contactos">Marcar Consulta</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="mt-4">
                <a href="#contactos" onClick={() => setIsMenuOpen(false)}>
                  Marcar Consulta
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
