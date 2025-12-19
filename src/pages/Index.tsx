import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { FodmapSection } from '@/components/FodmapSection';
import { SymptomsSection } from '@/components/SymptomsSection';
import { LocationsSection } from '@/components/LocationsSection';
import { MapSection } from '@/components/MapSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
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
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
