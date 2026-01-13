import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { FodmapSection } from '@/components/FodmapSection';
import { SymptomsSection } from '@/components/SymptomsSection';
import { LocationsSection } from '@/components/LocationsSection';
import { MapSection } from '@/components/MapSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { PaymentSection } from '@/components/PaymentSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <FodmapSection />
        <SymptomsSection />
        <LocationsSection />
        <MapSection />
        <TestimonialsSection />
        <ContactSection />
        {/* Payment Section */}
        <section id="pagamento" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pagamento de Consultas</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Realize o pagamento da sua consulta de forma rápida e segura através de MB WAY
              </p>
            </div>
            <PaymentSection />
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
