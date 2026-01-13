import { Header } from '@/components/Header';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const TestemunhosPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <TestimonialsSection />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default TestemunhosPage;
