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
  const [consultationType, setConsultationType] = useState<'first' | 'followup'>('first');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [requestId, setRequestId] = useState("");

  const amounts = {
    'first': '60.00€',
    'followup': '50.00€'
  };

  const consultationLabels = {
    'first': 'Primeira Consulta',
    'followup': 'Consulta de Seguimento'
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
                                onChange={(e) => setConsultationType(e.target.value as 'first' | 'followup')}
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
                        placeholder="915089256"
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

        {/* Contact Info Section - Always visible below */}
        <div className="max-w-6xl mx-auto mt-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Email Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#6FA89E]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">EMAIL</p>
                    <p className="text-[#2C4A3E] font-medium text-sm">marleneruivonutricao@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">REDES SOCIAIS</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/nutri_fodmap_marleneruivo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    title="Instagram"
                  >
                    <svg className="w-6 h-6 text-[#2C4A3E]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/marleneruivo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-6 h-6 text-[#2C4A3E]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <a
                  href="https://wa.me/351915089256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#25D366] hover:text-[#20bd5a] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">WHATSAPP</p>
                    <p className="text-[#2C4A3E] font-medium text-sm">Contactar agora</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
      </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ContactosPage;
