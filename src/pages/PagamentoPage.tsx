import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type PricingOption = {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'avulso' | 'pack';
};

const PagamentoPage = () => {
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
      const response = await fetch('https://share2inspire-backend.vercel.app/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPricing?.price,
          phone: phone,
          email: email,
          name: 'Cliente Marlene Ruivo',
          description: `Consulta Marlene Ruivo: ${selectedPricing?.name} (${selectedPricing?.description})`,
          paymentMethod: 'mbway',
          orderId: `MR-${Date.now()}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Pedido de pagamento enviado com sucesso!\n\nValor: €${selectedPricing?.price}\nTelemóvel: ${phone}\n\nPor favor, confirme na sua aplicação MB WAY.`);
        setPhone('');
        setEmail('');
      } else {
        alert(`Erro ao processar pagamento: ${result.error || 'Erro desconhecido'}`);
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
      <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Pagamento Seguro</span>
          <h1 className="text-4xl font-serif text-[#2C4A3E] mt-4 mb-4">Finalizar Agendamento</h1>
          <p className="text-gray-500 text-sm font-light">Escolha o tipo de consulta e realize o pagamento através de MB WAY.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Seleção de Preços */}
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#2C4A3E] mb-6">Escolha a Consulta</h2>
            
            {/* Consultas Avulsas */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Consultas Avulsas</p>
              {pricingOptions.filter(opt => opt.type === 'avulso').map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedOption === option.id
                      ? 'border-[#6FA89E] bg-[#6FA89E]/5'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-[#2C4A3E] text-lg">{option.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-serif text-[#2C4A3E]">{option.price}€</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Packs */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Packs de Consultas</p>
              {pricingOptions.filter(opt => opt.type === 'pack').map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedOption === option.id
                      ? 'border-[#6FA89E] bg-[#6FA89E]/5'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-[#2C4A3E] text-lg">{option.name}</h3>
                      <p className="text-xs text-[#6FA89E] font-medium mt-1">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-serif text-[#2C4A3E]">{option.price}€</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de Pagamento */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm h-fit sticky top-32">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 flex items-center justify-center mb-4 overflow-hidden">
              <img 
                src="/assets/mbway-logo.png" 
                alt="MB WAY" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl font-serif text-[#2C4A3E]">MB WAY</h2>
            <p className="text-xs text-gray-400 mt-1 font-light">Pagamento instantâneo e seguro</p>
          </div>

            {/* Resumo */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Valor a Pagar:</span>
                <span className="text-3xl font-serif text-[#2C4A3E]">{selectedPricing?.price}€</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">{selectedPricing?.name} - {selectedPricing?.description}</p>
            </div>

          <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Telemóvel MB WAY</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XXXXXXXX" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 bg-[#6FA89E] text-white rounded-2xl font-medium text-sm hover:bg-[#5d8d84] transition-all shadow-sm flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Confirmar Pagamento'}
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-4 text-gray-300 border-t border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest">Pagamento 100% Seguro</span>
              </div>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default PagamentoPage;
