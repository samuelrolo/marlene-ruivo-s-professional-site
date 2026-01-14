import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const PagamentoPage = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('60.00');
  const [email, setEmail] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Processando pagamento MB WAY para ' + phone + ' no valor de ' + amount + '€...');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#2C4A3E] mb-4">Pagamento de Consultas</h1>
          <p className="text-gray-600">Realize o pagamento da sua consulta de forma rápida e segura através de MB WAY</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 rounded-2xl bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#2C4A3E]">Pagamento MB WAY</h2>
              <p className="text-sm text-gray-400">Pague a sua consulta de forma rápida e segura</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Número de Telemóvel *</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XXXXXXXX" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E] focus:ring-0 transition-all"
                  required
                />
                <p className="text-[10px] text-gray-400 ml-1">Número associado à sua conta MB WAY</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Valor (€) *</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="60.00" 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E] focus:ring-0 transition-all"
                  required
                />
                <p className="text-[10px] text-gray-400 ml-1">Valor da consulta ou serviço</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Email (opcional)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E] focus:ring-0 transition-all"
              />
              <p className="text-[10px] text-gray-400 ml-1">Para receber confirmação do pagamento</p>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full py-5 bg-[#6FA89E] text-white rounded-2xl font-bold text-lg hover:bg-[#5d8d84] transition-all shadow-lg shadow-[#6FA89E]/30 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagar com MB WAY
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">Ao prosseguir, receberá uma notificação MB WAY no seu telemóvel</p>
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
