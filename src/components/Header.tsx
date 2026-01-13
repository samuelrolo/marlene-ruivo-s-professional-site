import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'FODMAP', href: '/fodmap' },
  { label: 'Sintomas', href: '/sintomas' },
  { label: 'Locais', href: '/localizacoes' },
  { label: 'Testemunhos', href: '/testemunhos' },
  { label: 'Contactos', href: '/contactos' },
];

// Custom NavLink component to highlight active links
interface NavLinkProps {
  href: string;
  children: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => {
  const resolved = useResolvedPath(href);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-accent ${match ? 'text-primary bg-accent' : 'text-foreground/80 hover:text-primary'
        }`}
    >
      {children}
    </Link>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-marlene-ruivo.jpg"
              alt="Drª Marlene Ruivo - Nutricionista"
              className="h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
              style={{ filter: 'none' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild>
              <Link to="/contactos">Marcar Consulta</Link>
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
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <Button asChild className="mt-4">
                <Link to="/contactos" onClick={() => setIsMenuOpen(false)}>
                  Marcar Consulta
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
