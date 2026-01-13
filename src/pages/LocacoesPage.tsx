import { Header } from '@/components/Header';
import { LocationsSection } from '@/components/LocationsSection';
import { MapSection } from '@/components/MapSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const LocacoesPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <LocationsSection />
                <MapSection />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default LocacoesPage;
