import { Header } from '@/components/Header';
import { SymptomsSection } from '@/components/SymptomsSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const SintomasPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <SymptomsSection />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default SintomasPage;
