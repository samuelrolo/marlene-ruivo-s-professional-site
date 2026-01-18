import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

type PricingOption = {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'avulso' | 'pack';
};

const AgendamentoPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>('avulso-60');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const pricingOptions: PricingOption[] = [
    { id: 'avulso-60', name: 'Consulta Avulso', price: 60, description: '1ª consulta', type: 'avulso' },
    { id: 'avulso-50', name: 'Consulta Avulso', price: 50, description: 'Acompanhamento', type: 'avulso' },
    { id: 'pack-3', name: 'Pack 3 Meses', price: 145, description: 'Poupe 15€', type: 'pack' },
    { id: 'pack-6', name: 'Pack 6 Meses', price: 270, description: 'Poupe 40€', type: 'pack' },
    { id: 'pack-12', name: 'Pack 12 Meses', price: 499, description: 'Poupe 111€', type: 'pack' }
  ];

  const selectedPricing = pricingOptions.find(opt => opt.id === selectedOption);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !email) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/mbway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: selectedPricing?.price.toFixed(2),
          email: email
        }),
      });

      const result = await response.json();

      if (result.Estado === '000' || result.Estado === '0') {
        alert(`Pedido de pagamento enviado com sucesso!\n\nValor: €${selectedPricing?.price}\nTelemóvel: ${phone}\n\nPor favor, confirme na sua aplicação MB WAY.`);
        setPhone('');
        setEmail('');
      } else {
        alert(`Erro ao processar pagamento: ${result.Message || result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Ocorreu um erro ao ligar ao sistema de pagamentos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-40 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Agendamento Online</span>
          <h1 className="text-4xl font-serif text-[#2C4A3E] mt-4 mb-4">Marque a sua Consulta</h1>
          <p className="text-gray-500 text-sm font-light max-w-2xl mx-auto">
            Escolha o horário que melhor lhe convém no calendário abaixo e finalize o pagamento via MB WAY para confirmar a sua vaga.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna 1 & 2: Calendário */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[600px]">
              <iframe 
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2TcM-ckWfFttfIivcOEklLlccmm0WAl8UTt68CZE4hsvX556xNNoFZpqM0NkbQO6GD7WFIO91O?gv=true" 
                style={{ border: 0 }} 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Google Calendar"
              ></iframe>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#6FA89E]/5 rounded-2xl border border-[#6FA89E]/10">
              <div className="w-8 h-8 rounded-full bg-[#6FA89E] flex items-center justify-center text-white text-xs font-bold">1</div>
              <p className="text-xs text-[#2C4A3E]">Selecione primeiro o dia e hora no calendário acima.</p>
            </div>
          </div>

          {/* Coluna 3: Pagamento */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-[#6FA89E] flex items-center justify-center text-white text-xs font-bold">2</div>
                <h2 className="text-lg font-serif text-[#2C4A3E]">Pagamento MB WAY</h2>
              </div>

              <div className="space-y-4 mb-8">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Tipo de Consulta</label>
                <div className="grid grid-cols-1 gap-2">
                  {pricingOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                        selectedOption === option.id
                          ? 'border-[#6FA89E] bg-[#6FA89E]/5'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-[#2C4A3E]">{option.name}</p>
                        <p className="text-[10px] text-gray-400">{option.description}</p>
                      </div>
                      <span className="text-sm font-serif text-[#2C4A3E]">{option.price}€</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Telemóvel MB WAY</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9XXXXXXXX" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-xs text-gray-500">Total a pagar:</span>
                    <span className="text-2xl font-serif text-[#2C4A3E]">{selectedPricing?.price}€</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 bg-[#6FA89E] text-white rounded-xl font-medium text-sm hover:bg-[#5d8d84] transition-all shadow-sm flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Confirmar e Pagar'}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 text-gray-300 border-t border-gray-100">
                  <img src="/assets/mbway-logo.png" alt="MB WAY" className="h-4 opacity-50" />
                  <span className="text-[9px] uppercase tracking-widest">Pagamento Seguro</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default AgendamentoPage;
