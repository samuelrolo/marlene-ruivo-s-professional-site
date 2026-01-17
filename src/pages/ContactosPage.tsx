import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

// Supabase GenNutri project
const SUPABASE_URL = "https://hihzmjqkszcxxdrhnqpy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaHptanFrc3pjeHhkcmhucXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODU4MTIsImV4cCI6MjA1MjM2MTgxMn0.z3HQs5_zYNQQF2s7gZvGrP6FrQHXQSdNw_PREejl1y4";

const ContactosPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consultationType, setConsultationType] = useState("first");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [requestId, setRequestId] = useState("");

  const amounts = {
    'first': '60.00€',
    'followup': '40.00€',
    'online': '55.00€'
  };

  const consultationLabels = {
    'first': 'Primeira Consulta',
    'followup': 'Consulta de Seguimento',
    'online': 'Consulta Online'
  };

  // Poll payment status
  useEffect(() => {
    if (paymentStatus === 'pending' && requestId) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(
            `${SUPABASE_URL}/functions/v1/check-payment-status?requestId=${requestId}`,
            {
              headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              }
            }
          );
          const data = await response.json();

          if (data.status === 'confirmed') {
            setPaymentStatus('confirmed');
            clearInterval(interval);
          } else if (data.status === 'failed') {
            setPaymentStatus('failed');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment:', error);
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(interval);
        if (paymentStatus === 'pending') {
          setPaymentStatus('failed');
        }
      }, 600000);

      return () => clearInterval(interval);
    }
  }, [paymentStatus, requestId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const phoneRegex = /^9[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Número de telemóvel inválido. Deve ter 9 dígitos e começar por 9.");
      return;
    }

    setLoading(true);
    setPaymentStatus('idle');

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/mbway-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            consultationType
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setRequestId(data.requestId);
        setPaymentStatus('pending');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento. Por favor, tente novamente.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setConsultationType("first");
    setPaymentStatus('idle');
    setRequestId("");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-40 pb-20 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">
            AGENDAR CONSULTA
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C4A3E] mt-4 mb-4">
            {paymentStatus === 'confirmed' ? 'Pagamento Confirmado!' : 'Marque a Sua Consulta'}
          </h1>
          <p className="text-gray-500 text-sm font-light max-w-xl mx-auto">
            {paymentStatus === 'confirmed'
              ? 'Receberá um email de confirmação com os detalhes da sua consulta.'
              : 'Visualize os horários disponíveis e efetue o pagamento para confirmar o agendamento.'}
          </p>
        </div>

        {paymentStatus === 'confirmed' ? (
          /* Success State - Simple Message */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-[#2C4A3E] mb-4">Consulta Agendada com Sucesso!</h2>
              <p className="text-gray-600 mb-2"><strong>Nome:</strong> {name}</p>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {email}</p>
              <p className="text-gray-600 mb-2"><strong>Tipo:</strong> {consultationLabels[consultationType as keyof typeof consultationLabels]}</p>
              <p className="text-gray-600 mb-8"><strong>Valor:</strong> {amounts[consultationType as keyof typeof amounts]}</p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-800">
                  ✅ Receberá um email com os detalhes da consulta<br />
                  ✅ Será contactada para confirmar o horário escolhido<br />
                  ✅ Em caso de dúvidas: marleneruivonutricao@gmail.com
                </p>
              </div>

              <button
                onClick={resetForm}
                className="px-8 py-3 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-colors"
              >
                Nova Marcação
              </button>
            </div>
          </div>
        ) : (
          /* Main Content - Calendar + Payment Form */
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

            {/* Left Column - Google Calendar */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-serif text-[#2C4A3E] mb-4">
                Horários Disponíveis
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Consulte os horários disponíveis. Após preencher o formulário e efetuar o pagamento,
                receberá confirmação por email.
              </p>

              <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '500px' }}>
                <iframe
                  src="https://calendar.app.google/qhbF3KM1hqJCrcbV6"
                  width="100%"
                  height="100%"
                  frameBorder={0}
                  title="Agendar Consulta - Marlene Ruivo"
                ></iframe>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              {paymentStatus === 'pending' ? (
                /* Pending Payment State */
                <div className="text-center py-12">
                  <div className="animate-pulse mb-6">
                    <div className="w-20 h-20 bg-[#6FA89E]/20 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-[#2C4A3E] mb-3">Aguardando Pagamento</h3>
                  <p className="text-gray-600 mb-2">Confirme o pagamento na sua aplicação MB WAY</p>
                  <p className="text-sm text-gray-400 mb-8">Telemóvel: {phone}</p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : paymentStatus === 'failed' ? (
                /* Failed Payment State */
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-[#2C4A3E] mb-3">Pagamento Não Confirmado</h3>
                  <p className="text-gray-600 mb-8">O pagamento não foi aprovado ou expirou.</p>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                /* Payment Form */
                <>
                  <h2 className="text-xl font-serif text-[#2C4A3E] mb-4">
                    Dados para Agendamento
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Preencha os seus dados e escolha o tipo de consulta para efetuar o pagamento.
                  </p>

                  <form onSubmit={handlePayment} className="space-y-5">
                    {/* Tipo de Consulta */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C4A3E] mb-3">
                        Tipo de Consulta
                      </label>
                      <div className="space-y-3">
                        {Object.entries(consultationLabels).map(([key, label]) => (
                          <label
                            key={key}
                            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${consultationType === key
                                ? 'border-[#6FA89E] bg-[#6FA89E]/5'
                                : 'border-gray-200 hover:border-[#6FA89E]/50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="consultationType"
                                value={key}
                                checked={consultationType === key}
                                onChange={(e) => setConsultationType(e.target.value)}
                                className="w-4 h-4 text-[#6FA89E] focus:ring-[#6FA89E]"
                              />
                              <span className="font-medium text-[#2C4A3E]">{label}</span>
                            </div>
                            <span className="text-lg font-serif text-[#2C4A3E]">
                              {amounts[key as keyof typeof amounts]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C4A3E] mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6FA89E] focus:ring-2 focus:ring-[#6FA89E]/20 outline-none"
                        placeholder="João Silva"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C4A3E] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6FA89E] focus:ring-2 focus:ring-[#6FA89E]/20 outline-none"
                        placeholder="joao@example.com"
                        required
                      />
                    </div>

                    {/* Telemóvel */}
                    <div>
                      <label className="block text-sm font-medium text-[#2C4A3E] mb-2">
                        Telemóvel (MB WAY)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6FA89E] focus:ring-2 focus:ring-[#6FA89E]/20 outline-none"
                        placeholder="912345678"
                        maxLength={9}
                        pattern="9[0-9]{8}"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">9 dígitos - para pagamento MB WAY</p>
                    </div>

                    {/* MB WAY Info */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MB_Way_logo.svg/1200px-MB_Way_logo.svg.png"
                          alt="MB WAY"
                          className="h-6 object-contain"
                        />
                        <span className="text-sm font-medium text-[#2C4A3E]">Pagamento Seguro</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Receberá um pedido de pagamento no seu telemóvel
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-6 bg-[#6FA89E] text-white rounded-xl font-medium text-lg hover:bg-[#5d8d84] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                        }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </>
                      ) : (
                        `Pagar ${amounts[consultationType as keyof typeof amounts]} via MB WAY`
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ContactosPage;
