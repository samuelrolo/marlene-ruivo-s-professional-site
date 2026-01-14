import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const LocacoesPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-widest uppercase text-sm">Onde Atendo</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-6">Locais de Consulta</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Escolha o local mais conveniente para si: consultas presenciais ou online.</p>
        </div>

        {/* Horário Semanal */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-20 overflow-x-auto">
          <h2 className="text-2xl font-serif text-[#2C4A3E] mb-8 text-center">Horário Semanal</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-6 text-[#6FA89E] font-medium uppercase text-xs tracking-wider">Dia</th>
                <th className="py-4 px-6 text-[#6FA89E] font-medium uppercase text-xs tracking-wider">Manhã</th>
                <th className="py-4 px-6 text-[#6FA89E] font-medium uppercase text-xs tracking-wider">Tarde</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-50">
                <td className="py-4 px-6 font-medium">Segunda</td>
                <td className="py-4 px-6">Clínica Hygeia</td>
                <td className="py-4 px-6">Clínica Sousi</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 px-6 font-medium">Terça</td>
                <td className="py-4 px-6">Instituto Bettencourt</td>
                <td className="py-4 px-6">Instituto Bettencourt</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 px-6 font-medium">Quarta</td>
                <td className="py-4 px-6">Clínica Sousi</td>
                <td className="py-4 px-6">Online</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 px-6 font-medium">Quinta</td>
                <td className="py-4 px-6">Online</td>
                <td className="py-4 px-6">Online</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium">Sexta</td>
                <td className="py-4 px-6">Online</td>
                <td className="py-4 px-6">Online</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Presencial */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E] font-serif">1</div>
            <h2 className="text-3xl font-serif text-[#2C4A3E]">Presencial</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Clínica Hygeia', loc: 'Mafra', day: 'Segunda-feira', time: '9:00 - 13:00' },
              { name: 'Instituto Bettencourt', loc: 'Lisboa', day: 'Terça-feira', time: '9:00 - 16:00' },
              { name: 'Clínica Sousi', loc: 'Sintra', day: 'Quarta-feira', time: '9:00 - 13:00' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#6FA89E]/30 transition-all group">
                <h3 className="text-xl font-serif text-[#2C4A3E] mb-2">{item.name}</h3>
                <p className="text-[#6FA89E] font-medium mb-6">{item.loc}</p>
                <div className="space-y-2 text-gray-500 text-sm mb-8">
                  <p>{item.day}</p>
                  <p>{item.time}</p>
                </div>
                <button className="w-full py-3 rounded-xl border border-[#6FA89E] text-[#6FA89E] hover:bg-[#6FA89E] hover:text-white transition-colors font-medium">
                  Agendar no Site
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Online */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E] font-serif">2</div>
            <h2 className="text-3xl font-serif text-[#2C4A3E]">Online</h2>
          </div>
          <div className="bg-white rounded-3xl p-10 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 rounded-2xl bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-serif text-[#2C4A3E] mb-2">Consulta Online</h3>
              <p className="text-[#6FA89E] font-medium mb-4">Quarta (tarde), Quinta e Sexta</p>
              <p className="text-gray-500 max-w-xl">Consultas por videochamada com total flexibilidade de horário, ideal para quem não pode deslocar-se.</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Horário Flexível
              </div>
              <button className="px-8 py-4 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-colors font-medium shadow-lg shadow-[#6FA89E]/20">
                Agendar Videochamada
              </button>
            </div>
          </div>
        </div>

        {/* Packs */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif text-[#2C4A3E] mb-4 text-center">Packs de Consultas Online</h2>
          <p className="text-gray-500 text-center mb-12">Consultas Online: 60€ (1ª consulta) | 50€ (acompanhamento)</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Pack 3 meses', price: '145€', save: '-15€', desc: 'Ideal para quem quer experimentar e criar hábito' },
              { name: 'Pack 6 meses', price: '270€', save: '-40€', desc: 'Muito bom para resultados sólidos', popular: true },
              { name: 'Pack 12 meses', price: '499€', save: '-111€', desc: 'Excelente para fidelização e estabilidade' }
            ].map((pack, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 border ${pack.popular ? 'border-[#6FA89E] shadow-xl shadow-[#6FA89E]/5' : 'border-gray-100'} relative flex flex-col`}>
                {pack.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6FA89E] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Mais Popular</span>}
                <h3 className="text-xl font-serif text-[#2C4A3E] mb-4">{pack.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-serif text-[#2C4A3E]">{pack.price}</span>
                  <span className="text-[#6FA89E] font-medium text-sm">{pack.save}</span>
                </div>
                <p className="text-gray-500 text-sm mb-8 flex-1">{pack.desc}</p>
                <button className={`w-full py-3 rounded-xl font-medium transition-all ${pack.popular ? 'bg-[#6FA89E] text-white hover:bg-[#5d8d84]' : 'border border-gray-200 text-gray-600 hover:border-[#6FA89E] hover:text-[#6FA89E]'}`}>
                  Escolher Pack
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LocacoesPage;
