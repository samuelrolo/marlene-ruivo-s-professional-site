import { Header } from '@/components/Header';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const SobrePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <About />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default SobrePage;
