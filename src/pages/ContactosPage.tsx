import { Header } from '@/components/Header';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const ContactosPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <ContactSection />
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default ContactosPage;
