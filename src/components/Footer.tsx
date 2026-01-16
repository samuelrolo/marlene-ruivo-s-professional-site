import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C4A3E] text-white py-12 border-t-4 border-[#1a2e26]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Branco */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/logo-white.png"
              alt="Drª Marlene Ruivo - Nutricionista"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>© 2026 Marlene Ruivo.</span>
            <span className="hidden sm:inline">Feito com</span>
            <Leaf className="hidden sm:inline w-4 h-4 text-[#6FA89E]" fill="currentColor" />
            <span className="hidden sm:inline">em Portugal</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
