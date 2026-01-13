import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mbwayPayment } from '@/lib/api';
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export function PaymentSection() {
    const { toast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('50');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [orderId, setOrderId] = useState<string>('');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number
        const cleanPhone = phoneNumber.replace(/\s/g, '');
        if (!/^9[1236]\d{7}$/.test(cleanPhone)) {
            toast({
                title: "Número inválido",
                description: "Por favor, insira um número de telemóvel português válido (9XXXXXXXX)",
                variant: "destructive",
            });
            return;
        }

        // Validate amount
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast({
                title: "Valor inválido",
                description: "Por favor, insira um valor válido",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('processing');

        try {
            const response = await mbwayPayment({
                phoneNumber: cleanPhone,
                amount: numAmount,
                email: email || undefined,
            });

            setOrderId(response.orderId);
            setPaymentStatus('success');

            toast({
                title: "Pedido enviado",
                description: `Verifique a notificação MB WAY no seu telemóvel (${cleanPhone}). Ref: ${response.orderId}`,
            });

        } catch (error) {
            setPaymentStatus('error');

            toast({
                title: "Erro no pagamento",
                description: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
        setPaymentStatus('idle');
        setOrderId('');
        setPhoneNumber('');
        setEmail('');
    };

    if (paymentStatus === 'success') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-center">Pedido Enviado</CardTitle>
                    <CardDescription className="text-center">
                        O pagamento MB WAY foi solicitado com sucesso
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Referência do Pedido</p>
                        <p className="text-lg font-mono font-semibold">{orderId}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            📱 Verifique a notificação MB WAY no seu telemóvel <strong>{phoneNumber}</strong> e confirme o pagamento.
                        </p>
                    </div>
                    <Button onClick={resetForm} variant="outline" className="w-full">
                        Fazer outro pagamento
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (paymentStatus === 'error') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-center">Erro no Pagamento</CardTitle>
                    <CardDescription className="text-center">
                        Não foi possível processar o pagamento
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            Por favor, verifique os dados e tente novamente. Se o problema persistir, contacte-nos diretamente.
                        </p>
                    </div>
                    <Button onClick={resetForm} className="w-full">
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamento MB WAY
                </CardTitle>
                <CardDescription>
                    Pague a sua consulta de forma rápida e segura
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Número de Telemóvel *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="9XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={isProcessing}
                            required
                            maxLength={9}
                        />
                        <p className="text-xs text-muted-foreground">
                            Número associado à sua conta MB WAY
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Valor (€) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="50.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isProcessing}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Valor da consulta ou serviço
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email (opcional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isProcessing}
                        />
                        <p className="text-xs text-muted-foreground">
                            Para receber confirmação do pagamento
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                A processar...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pagar com MB WAY
                            </>
                        )}
                    </Button>

                    <div className="text-xs text-center text-muted-foreground">
                        Ao prosseguir, receberá uma notificação MB WAY no seu telemóvel
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
