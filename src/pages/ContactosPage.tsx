import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";
import { supabase } from "../lib/supabaseClient";

// API Route para pagamento MB WAY

const ContactosPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consultationType, setConsultationType] = useState<'first' | 'followup'>('first');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [requestId, setRequestId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
      setUserId(user.id);
      // Pré-preencher dados do perfil
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setName(profile.full_name);
        setEmail(user.email || "");
        setPhone(profile.phone);
      }
    }
  };

  const amounts = {
    'first': '60.00€',
    'followup': '50.00€'
  };

  const consultationLabels = {
    'first': 'Primeira Consulta',
    'followup': 'Consulta de Seguimento'
  };

  useEffect(() => {
    if (paymentStatus === 'pending' && requestId) {
      // Simular confirmação após 10 segundos (em produção, seria feito polling com o servidor)
      const timeout = setTimeout(() => {
        setPaymentStatus('confirmed');
      }, 10000);

      // Timeout de 10 minutos
      const maxTimeout = setTimeout(() => {
        if (paymentStatus === 'pending') {
          setPaymentStatus('failed');
        }
      }, 600000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(maxTimeout);
      };
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
      const amount = consultationType === 'first' ? '60.00' : '50.00';
      
      const response = await fetch('/api/mbway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: amount,
          email: email
        })
      });

      const data = await response.json();

      if (response.ok && data.Estado === '000') {
        const reference = data.Referencia || 'REF-' + Date.now();
        setRequestId(reference);
        
        // Se o utilizador está autenticado, guardar a consulta
        if (isLoggedIn && userId) {
          const { error: appointmentError } = await supabase
            .from('appointments')
            .insert([{
              user_id: userId,
              consultation_type: consultationType,
              amount: parseFloat(amount),
              payment_status: 'pending',
              payment_reference: reference
            }]);
          
          if (appointmentError) {
            console.error('Erro ao guardar consulta:', appointmentError);
          }
        }
        
        setPaymentStatus('pending');
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento. Por favor, tenta novamente.');
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
      <main className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        {/* Header Section - Minimalist */}
          <div className="text-center mb-12">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[9px]">
            AGENDAR CONSULTA
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#2C4A3E] mt-3 mb-3">
            {paymentStatus === 'confirmed' ? 'Pagamento Confirmado' : 'Marca a Tua Consulta'}
          </h1>
          <p className="text-gray-400 text-xs font-light max-w-md mx-auto leading-relaxed">
            {paymentStatus === 'confirmed'
              ? 'Vais receber um email de confirmação com os detalhes da tua consulta.'
              : 'Seleciona o horário e efetua o pagamento para confirmares o agendamento.'}
          </p>
          {!isLoggedIn && paymentStatus === 'idle' && (
            <p className="text-xs text-gray-400 mt-4">
              <a href="/login" className="text-[#6FA89E] hover:underline">Entra</a> ou{" "}
              <a href="/register" className="text-[#6FA89E] hover:underline">cria conta</a> para guardar o histórico das tuas consultas
            </p>
          )}
        </div>

        {paymentStatus === 'confirmed' ? (
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-3xl p-10 border border-gray-50 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-serif text-[#2C4A3E] mb-6">Agendado com Sucesso</h2>
              <div className="space-y-2 mb-8 text-sm text-gray-500 font-light">
                <p><strong>Nome:</strong> {name}</p>
                <p><strong>Tipo:</strong> {consultationLabels[consultationType]}</p>
                <p><strong>Valor:</strong> {amounts[consultationType]}</p>
              </div>
              {isLoggedIn ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-[#6FA89E] text-white rounded-2xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
                  >
                    Ver Minhas Consultas
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Nova Marcação
                  </button>
                </div>
              ) : (
                <button
                  onClick={resetForm}
                  className="w-full py-3 bg-[#6FA89E] text-white rounded-2xl text-sm font-medium hover:bg-[#5d8d84] transition-all"
                >
                  Nova Marcação
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            {/* Left Column - Calendar Widget */}
            <div className="bg-white rounded-2xl p-3 border border-gray-50 shadow-sm">
              <h2 className="text-xs font-serif text-[#2C4A3E] mb-2 uppercase tracking-wider">
                1. Escolha o Horário
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '300px' }}>
                <iframe
                  src="https://calendar.app.google/qhbF3KM1hqJCrcbV6"
                  width="100%"
                  height="100%"
                  frameBorder={0}
                  title="Agendar Consulta"
                ></iframe>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm">
              {paymentStatus === 'pending' ? (
                <div className="text-center py-10">
                  <div className="animate-pulse mb-6">
                    <div className="w-14 h-14 bg-[#6FA89E]/10 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-7 h-7 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">À espera do MB WAY</h3>
                  <p className="text-gray-400 text-xs mb-8">Confirma o pagamento no teu telemóvel</p>
                  <button onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-600 underline">Cancelar</button>
                </div>
              ) : paymentStatus === 'failed' ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif text-[#2C4A3E] mb-6">Pagamento Não Confirmado</h3>
                  <button onClick={resetForm} className="w-full py-3 bg-[#6FA89E] text-white rounded-2xl text-sm font-medium">Tentar Novamente</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xs font-serif text-[#2C4A3E] mb-4 uppercase tracking-wider">
                    2. Dados de Pagamento
                  </h2>
                  <form onSubmit={handlePayment} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(consultationLabels).map(([key, label]) => (
                        <label
                          key={key}
                          className={`cursor-pointer p-2 rounded-xl border transition-all text-center text-xs ${
                            consultationType === key ? 'border-[#6FA89E] bg-[#6FA89E]/5' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="consultationType"
                            value={key}
                            checked={consultationType === key}
                            onChange={(e) => setConsultationType(e.target.value as 'first' | 'followup')}                            className="hidden"
                          />
                          <p className="text-[10px] text-gray-400 uppercase mb-1">{label}</p>
                          <p className="text-sm font-serif text-[#2C4A3E]">{amounts[key as keyof typeof amounts]}</p>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs focus:border-[#6FA89E] outline-none transition-all"
                        placeholder="Nome"
                        required
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs focus:border-[#6FA89E] outline-none transition-all"
                        placeholder="Email"
                        required
                      />
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs focus:border-[#6FA89E] outline-none transition-all"
                          placeholder="Telemovel (9 dígitos)"
                          maxLength={9}
                          required
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MB_Way_logo.svg/1200px-MB_Way_logo.svg.png" alt="MB WAY" className="h-4 opacity-70" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">Pagamento Seguro</span>
                      </div>
                      <span className="text-xs font-serif text-[#2C4A3E]">{amounts[consultationType]}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#6FA89E] text-white rounded-xl text-sm font-medium hover:bg-[#5d8d84] transition-all shadow-sm disabled:opacity-50"
                    >
                      {loading ? 'Processando...' : `Pagar via MB WAY`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Minimalist Contact Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
            <div className="w-8 h-8 bg-[#6FA89E]/5 rounded-full flex items-center justify-center text-[#6FA89E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-xs text-gray-500 font-light">marleneruivonutricao@gmail.com</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-center gap-6">
            <a href="https://www.instagram.com/nutri_fodmap_marleneruivo/" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#6FA89E] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/marlene-ruivo-b2a2104a/" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#6FA89E] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
            <div className="w-8 h-8 bg-[#25D366]/5 rounded-full flex items-center justify-center text-[#25D366]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </div>
            <a href="https://wa.me/351915089256" target="_blank" rel="noreferrer" className="text-xs text-gray-500 font-light hover:text-[#25D366] transition-colors">915 089 256</a>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ContactosPage;
