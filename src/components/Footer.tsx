import { Leaf, Instagram, Linkedin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C4A3E] text-white py-6 border-t border-[#1a2e26]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo e Copyright */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/logo-marlene-ruivo.png"
              alt="Drª Marlene Ruivo - Nutricionista"
              className="h-10 w-auto object-contain brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium">© 2026 Marlene Ruivo</span>
              <div className="flex items-center gap-1 text-[10px] text-white/60">
                <span>Feito com</span>
                <Leaf className="w-3 h-3 text-white" fill="white" stroke="white" strokeWidth={0} />
                <span>em Portugal</span>
              </div>
            </div>
          </div>

          {/* Contactos Diretos */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs">
            <a href="tel:+351915089256" className="flex items-center gap-2 hover:text-[#6FA89E] transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>915 089 256</span>
            </a>
            <a href="mailto:marleneruivonutricao@gmail.com" className="flex items-center gap-2 hover:text-[#6FA89E] transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>marleneruivonutricao@gmail.com</span>
            </a>
          </div>

          {/* Redes Sociais e Links Legais */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/nutri_fodmap_marleneruivo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/marlene-ruivo-b2a2104a/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
