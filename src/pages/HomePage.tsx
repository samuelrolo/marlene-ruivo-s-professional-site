import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, Leaf } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <Hero />

                {/* Quick Actions Section */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <Link to="/contactos" className="group">
                                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary transition-all hover:shadow-lg">
                                    <Calendar className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-heading font-semibold mb-2">Marcar Consulta</h3>
                                    <p className="text-muted-foreground mb-4">Agende a sua primeira consulta de nutrição</p>
                                    <Button variant="link" className="p-0">Agendar →</Button>
                                </div>
                            </Link>

                            <Link to="/fodmap" className="group">
                                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary transition-all hover:shadow-lg">
                                    <Leaf className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-heading font-semibold mb-2">Dieta FODMAP</h3>
                                    <p className="text-muted-foreground mb-4">Saiba como a dieta FODMAP pode ajudar</p>
                                    <Button variant="link" className="p-0">Saber mais →</Button>
                                </div>
                            </Link>

                            <Link to="/testemunhos" className="group">
                                <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary transition-all hover:shadow-lg">
                                    <Users className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-heading font-semibold mb-2">Testemunhos</h3>
                                    <p className="text-muted-foreground mb-4">Veja o que os pacientes dizem</p>
                                    <Button variant="link" className="p-0">Ver testemunhos →</Button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default HomePage;
