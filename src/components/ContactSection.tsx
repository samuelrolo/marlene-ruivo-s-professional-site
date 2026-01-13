import { useState } from 'react';
import { Mail, MapPin, Instagram, Linkedin, Check, CreditCard, User, Phone, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type Step = 'form' | 'payment' | 'success';

export const ContactSection = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultType: '1',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const consultPrice = formData.consultType === '1' ? 60 : 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      toast({
        title: 'Pagamento confirmado!',
        description: 'Receberá um email com os detalhes da sua marcação.',
      });
    }, 2000);
  };

  const resetForm = () => {
    setStep('form');
    setFormData({ name: '', email: '', phone: '', consultType: '1' });
  };

  return (
    <section id="contactos" className="py-20 lg:py-32 bg-sage-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Contactos e Marcações
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
            Comece a cuidar do seu intestino
          </h2>
          <p className="text-lg text-muted-foreground">
            Envie uma mensagem ou agende a primeira consulta. Respondemos com brevidade.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/30">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Agende a sua consulta
            </h3>
            <p className="text-muted-foreground mb-8">
              Garanta o seu espaço na agenda. O processo é simples: escolha o tipo de consulta,
              efetue o pagamento seguro via MB WAY e selecione o seu horário preferido.
            </p>

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="O seu nome"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telemóvel (para MB WAY)</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="912 345 678"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="consultType">Tipo de Consulta</Label>
                  <select
                    id="consultType"
                    className="mt-2 w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    value={formData.consultType}
                    onChange={(e) => setFormData({ ...formData, consultType: e.target.value })}
                  >
                    <option value="1">1ª Consulta (60€)</option>
                    <option value="2">Acompanhamento (50€)</option>
                  </select>
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  Continuar
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="p-6 bg-sage-light/30 rounded-2xl border border-sage/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Enviaremos um pedido de pagamento para o seu telemóvel.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total a pagar</span>
                    <span className="text-3xl font-heading font-bold text-primary">
                      {consultPrice}.00€
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="w-12 h-12 bg-[#ff0000] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">MB WAY</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">MB WAY</p>
                    <p className="text-sm text-muted-foreground">Pagamento seguro</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                    Voltar
                  </Button>
                  <Button
                    variant="hero"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'A processar...' : 'Pagar com MB WAY'}
                  </Button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-sage-dark" />
                </div>
                <h4 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Pagamento Confirmado!
                </h4>
                <p className="text-muted-foreground mb-6">
                  Receberá um email com instruções para escolher o horário da sua consulta.
                </p>
                <Button variant="sage" onClick={resetForm}>
                  Nova marcação
                </Button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quote */}
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-sage-dark" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  Marlene Ruivo
                </p>
              </div>
              <p className="text-2xl font-heading italic text-foreground leading-relaxed">
                "Devolver o prazer de comer e a liberdade de viver."
              </p>
            </div>

            {/* Contact Details - Grid Layout */}
            <div className="grid gap-6">
              <a
                href="mailto:marleneruivonutricao@gmail.com"
                className="flex items-center gap-4 p-6 rounded-2xl bg-card shadow-card border border-border/30 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-sage-light/50 flex items-center justify-center group-hover:bg-sage group-hover:scale-110 transition-all">
                  <Mail className="w-6 h-6 text-sage-dark" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-foreground">marleneruivonutricao@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-card shadow-card border border-border/30">
                <div className="w-14 h-14 rounded-xl bg-sage-light/50 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-sage-dark" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Localizações</p>
                  <p className="font-medium text-foreground">Mafra · Lisboa · Sintra · Online</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card shadow-card border border-border/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Redes Sociais</p>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://www.instagram.com/nutri_fodmap_marleneruivo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sage-light/50 hover:bg-sage hover:scale-105 transition-all group"
                  >
                    <Instagram className="w-6 h-6 text-sage-dark" />
                    <span className="text-xs font-medium text-foreground">Instagram</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/marlene-ruivo-b2a2104a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sage-light/50 hover:bg-sage hover:scale-105 transition-all group"
                  >
                    <Linkedin className="w-6 h-6 text-sage-dark" />
                    <span className="text-xs font-medium text-foreground">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/351915089258?text=Ol%C3%A1%2C%20gostaria%20de%20marcar%20uma%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl font-medium transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
