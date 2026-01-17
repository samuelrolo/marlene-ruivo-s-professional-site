import { Header } from '@/components/Header';
import { LocationsSection } from '@/components/LocationsSection';
import { MapSection } from '@/components/MapSection';
import { Footer } from '@/components/Footer';
import { GoogleCalendarEmbed } from '@/components/GoogleCalendarEmbed';
import { ChatBot } from '@/components/ChatBot';

const ConsultasPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <LocationsSection />
                <MapSection />
            </main>
            <GoogleCalendarEmbed embedUrl="https://calendar.app.google/qhbF3KM1hqJCrcbV6" />
            <Footer />
            <ChatBot />
        </div>
    );
};

export default ConsultasPage;
