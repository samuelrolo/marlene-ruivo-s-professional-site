import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const PagamentoPage = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('60.00');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      alert('Pedido de pagamento MB WAY enviado para o número ' + phone + '. Por favor, confirme na sua aplicação MB WAY.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Pagamento Seguro</span>
          <h1 className="text-4xl font-serif text-[#2C4A3E] mt-4 mb-4">Finalizar Agendamento</h1>
          <p className="text-gray-500 text-sm font-light">Realize o pagamento da sua consulta de forma rápida através de MB WAY.</p>
        </div>

        <div className="bg-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6 overflow-hidden border border-red-100">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MB_Way_logo.svg/1200px-MB_Way_logo.svg.png" 
                alt="MB WAY" 
                className="w-12 h-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-serif text-[#2C4A3E]">MB WAY</h2>
            <p className="text-xs text-gray-400 mt-1 font-light">Pagamento instantâneo e seguro</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
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
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Valor a Pagar</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm font-medium text-[#2C4A3E]"
                    required
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email para Recibo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com" 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                required
              />
            </div>

            <div className="pt-6">
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
              <div className="flex items-center justify-center gap-2 mt-6 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest">Pagamento 100% Seguro</span>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default PagamentoPage;
