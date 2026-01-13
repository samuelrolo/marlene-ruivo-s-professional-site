import { Header } from '@/components/Header';
import { FodmapSection } from '@/components/FodmapSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const FodmapPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <FodmapSection />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default FodmapPage;
