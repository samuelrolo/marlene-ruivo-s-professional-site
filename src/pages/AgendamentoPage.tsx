import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";
import Footer from '../components/Footer';
import { User, LogIn, Info, MessageCircle, Clock, Calendar } from 'lucide-react';

type PricingOption = {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'avulso' | 'pack';
};

const AgendamentoPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>('avulso-60');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nif, setNif] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const WHATSAPP_NUMBER = '351915089256';

  const pricingOptions: PricingOption[] = [
    { id: 'avulso-60', name: 'Consulta Avulso', price: 60, description: '1ª consulta', type: 'avulso' },
    { id: 'avulso-50', name: 'Consulta Avulso', price: 50, description: 'Acompanhamento', type: 'avulso' },
    { id: 'pack-3', name: 'Pack 3 Meses', price: 145, description: 'Poupe 15€', type: 'pack' },
    { id: 'pack-6', name: 'Pack 6 Meses', price: 270, description: 'Poupe 40€', type: 'pack' },
    { id: 'pack-12', name: 'Pack 12 Meses', price: 499, description: 'Poupe 111€', type: 'pack' }
  ];

  const selectedPricing = pricingOptions.find(opt => opt.id === selectedOption);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
      setEmail(user.email || '');
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile);
        setName(profile.full_name || '');
        setPhone(profile.phone || '');
        setNif(profile.nif || '');
      }
    }
  };

  const openWhatsApp = () => {
    const message = `Olá Dr.ª Marlene!\nGostaria de marcar uma consulta de nutrição.\nPodemos combinar um horário?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !email || !name) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    
    try {
      if (email === 'samuelrolo@gmail.com') {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error: appointmentError } = await supabase
          .from('appointments')
          .insert({
            user_id: user?.id,
            consultation_type: selectedOption === 'avulso-60' ? 'first' : 'followup',
            amount: selectedPricing?.price || 0,
            payment_status: 'completed',
            payment_reference: 'TEST-' + Date.now()
          });

        if (appointmentError) throw appointmentError;

        alert(`Agendamento criado com sucesso (modo teste)!\n\nValor: €${selectedPricing?.price}\n\nAceda ao dashboard para ver os detalhes.`);
        setLoading(false);
        return;
      }
      const response = await fetch('/api/mbway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phoneNumber: phone,
          amount: selectedPricing?.price.toFixed(2),
          email: email,
          nif: nif
        }),
      });

      const result = await response.json();

      if (result.Estado === '000' || result.Estado === '0') {
        alert(`Pedido de pagamento enviado com sucesso!\n\nValor: €${selectedPricing?.price}\nTelemóvel: ${phone}\n\nPor favor, confirme na sua aplicação MB WAY.`);
        if (!isLoggedIn) {
          setName('');
          setPhone('');
          setEmail('');
          setNif('');
        }
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
      <main className="pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Agendamento Online</span>
          <h1 className="text-4xl font-serif text-[#2C4A3E] mt-4 mb-4">Marque a sua Consulta</h1>
          <p className="text-gray-500 text-sm font-light max-w-2xl mx-auto">
            Entre em contacto connosco pelo WhatsApp para agendar a sua consulta e finalize o pagamento via MB WAY para confirmar a sua vaga.
          </p>
        </div>

        {/* Banner de Incentivo ao Login */}
        {!isLoggedIn && (
          <div className="mb-10 bg-[#6FA89E]/5 border border-[#6FA89E]/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2C4A3E]">Já tem conta de paciente?</p>
                <p className="text-xs text-gray-500">Faça login para preencher os seus dados automaticamente.</p>
              </div>
            </div>
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#6FA89E]/30 text-[#6FA89E] rounded-xl text-sm font-medium hover:bg-[#6FA89E]/5 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Entrar na Conta
            </Link>
          </div>
        )}

        {isLoggedIn && (
          <div className="mb-10 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Sessão iniciada como {userProfile?.full_name || 'Paciente'}</p>
              <p className="text-xs text-green-600/80">Os seus dados foram preenchidos automaticamente.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna 1 & 2: WhatsApp CTA + Passos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center min-h-[480px]">
              
              {/* Ícone WhatsApp */}
              <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#25D366]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>

              {/* Título e descrição */}
              <h2 className="text-2xl font-serif text-[#2C4A3E] mb-3 text-center">Fale Connosco pelo WhatsApp</h2>
              <p className="text-gray-500 text-sm font-light text-center max-w-md mb-8">
                Converse diretamente com a Dr.ª Marlene Ruivo para escolher o melhor horário para a sua consulta de nutrição.
              </p>

              {/* Botão WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="group flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-medium text-base hover:bg-[#1da851] transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar Conversa no WhatsApp
              </button>

              <p className="text-[10px] text-gray-400 mt-4 text-center">
                Será redirecionado para o WhatsApp com uma mensagem pré-preenchida
              </p>

              {/* Vantagens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-lg">
                <div className="flex flex-col items-center text-center gap-2 p-3">
                  <div className="w-9 h-9 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-medium text-[#2C4A3E]">Resposta Rápida</p>
                  <p className="text-[10px] text-gray-400">Atendimento personalizado</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3">
                  <div className="w-9 h-9 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-medium text-[#2C4A3E]">Horário Flexível</p>
                  <p className="text-[10px] text-gray-400">Combinamos consigo</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3">
                  <div className="w-9 h-9 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-medium text-[#2C4A3E]">Confirmação Imediata</p>
                  <p className="text-[10px] text-gray-400">Sem esperas desnecessárias</p>
                </div>
              </div>
            </div>

            {/* Passos */}
            <div className="flex flex-col gap-4 p-6 bg-[#6FA89E]/5 rounded-2xl border border-[#6FA89E]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6FA89E] flex items-center justify-center text-white text-xs font-bold">1</div>
                <p className="text-sm font-medium text-[#2C4A3E]">Contacte-nos pelo WhatsApp para combinar o horário da consulta.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6FA89E] flex items-center justify-center text-white text-xs font-bold">2</div>
                <p className="text-sm font-medium text-[#2C4A3E]">Preencha os seus dados e clique em "Confirmar e Pagar" para finalizar.</p>
              </div>
              <p className="text-[10px] text-[#6FA89E] uppercase tracking-widest font-bold mt-2">A vaga só fica garantida após a confirmação do pagamento MB WAY.</p>
            </div>
          </div>

          {/* Coluna 3: Pagamento */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-[#6FA89E] flex items-center justify-center text-white text-xs font-bold">2</div>
                <h2 className="text-lg font-serif text-[#2C4A3E]">Finalizar e Pagar</h2>
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
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block">Nome Completo *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="O seu nome" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block">Telemóvel MB WAY *</label>
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
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block">Email *</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 block">NIF (Opcional)</label>
                  <input 
                    type="text" 
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    placeholder="Contribuinte para fatura" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6FA89E]/30 focus:ring-0 transition-all text-sm"
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
    </div>
  );
};

export default AgendamentoPage;
