import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactosPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Falha ao enviar email');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-40 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">
            Entre em Contacto
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-4">
            Contactos
          </h1>
          <p className="text-gray-500 text-sm font-light max-w-2xl mx-auto">
            Tem dúvidas ou gostaria de saber mais sobre os meus serviços? Entre em contacto comigo através dos dados abaixo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information Cards */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#6FA89E]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">Email</h3>
            <p className="text-sm text-gray-600 font-light">marleneruivonutricao@gmail.com</p>
            <a href="mailto:marleneruivonutricao@gmail.com" className="text-[#6FA89E] text-sm font-medium hover:underline mt-3 inline-block">
              Enviar email →
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#6FA89E]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">Telefone</h3>
            <p className="text-sm text-gray-600 font-light">915 089 256</p>
            <a href="tel:+351915089256" className="text-[#6FA89E] text-sm font-medium hover:underline mt-3 inline-block">
              Chamar →
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#6FA89E]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">Localização</h3>
            <p className="text-sm text-gray-600 font-light">Mafra</p>
            <a href="https://maps.google.com/?q=Mafra" target="_blank" rel="noopener noreferrer" className="text-[#6FA89E] text-sm font-medium hover:underline mt-3 inline-block">
              Ver no mapa →
            </a>
          </div>
        </div>

        {/* Horários Section */}
        <div className="bg-gradient-to-br from-[#6FA89E]/5 to-[#0f766e]/5 rounded-3xl p-8 md:p-12 mb-16 border border-[#6FA89E]/10">
          <h2 className="text-2xl font-serif text-[#2C4A3E] mb-8 text-center">Horários de Atendimento</h2>
          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-[#6FA89E]/10">
                <span className="text-gray-600 font-medium">Segunda a Sexta</span>
                <span className="font-serif text-[#2C4A3E] text-lg">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/30 rounded-2xl border border-gray-100">
                <span className="text-gray-400">Sábado e Domingo</span>
                <span className="text-gray-400 font-light italic">Fechado</span>
              </div>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest">
              * Horário aplicável a consultas presenciais e online
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-2">Envie-me uma Mensagem</h2>
            <p className="text-gray-500 text-sm font-light mb-8">
              Preencha o formulário abaixo e entrarei em contacto consigo o mais breve possível.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <p className="text-green-700 text-sm font-medium">✓ Mensagem enviada com sucesso! Obrigada pelo contacto.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-700 text-sm font-medium">✗ Erro ao enviar a mensagem. Por favor, tente novamente.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="O seu nome"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block mb-2">
                  Mensagem *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A sua mensagem..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6FA89E] text-white rounded-2xl text-sm font-medium hover:bg-[#5d8d84] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A enviar...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactosPage;
