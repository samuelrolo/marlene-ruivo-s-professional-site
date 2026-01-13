import { Header } from '@/components/Header';
import { PaymentSection } from '@/components/PaymentSection';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';

const PagamentoPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <section className="py-20 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pagamento de Consultas</h1>
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

export default PagamentoPage;
