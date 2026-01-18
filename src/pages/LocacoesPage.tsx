import Footer from '../components/Footer';

const LocacoesPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <main className="pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Locais de Consulta</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-6">Onde Atendo</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed font-light">Escolha o local mais conveniente para si: consultas presenciais em Mafra, Lisboa e Sintra, ou consultas online.</p>
        </div>

        {/* Horário Semanal - Invertido (Períodos nas Linhas, Dias nas Colunas) */}
        <div className="mb-20">
          <h2 className="text-xl font-serif text-[#2C4A3E] mb-8 text-center">Horário Semanal</h2>
          <div className="max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100">Período</th>
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 text-center">Segunda</th>
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 text-center">Terça</th>
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 text-center">Quarta</th>
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 text-center">Quinta</th>
                  <th className="py-5 px-8 text-[#6FA89E] font-bold uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 text-center">Sexta</th>
                </tr>
              </thead>
              <tbody className="text-gray-500 text-sm font-light">
                <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-8 font-serif text-[#2C4A3E] bg-gray-50/30 font-medium">Manhã</td>
                  <td className="py-6 px-8 text-center">Clínica Hygeia</td>
                  <td className="py-6 px-8 text-center">Instituto Bettencourt</td>
                  <td className="py-6 px-8 text-center">Clínica Sousi</td>
                  <td className="py-6 px-8 text-center">Online</td>
                  <td className="py-6 px-8 text-center">Online</td>
                </tr>
                <tr className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-8 font-serif text-[#2C4A3E] bg-gray-50/30 font-medium">Tarde</td>
                  <td className="py-6 px-8 text-center">Clínica Sousi</td>
                  <td className="py-6 px-8 text-center">Instituto Bettencourt</td>
                  <td className="py-6 px-8 text-center">Online</td>
                  <td className="py-6 px-8 text-center">Online</td>
                  <td className="py-6 px-8 text-center">Online</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Presencial - Cards Minimalistas */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-[1px] w-12 bg-gray-100"></div>
            <h2 className="text-2xl font-serif text-[#2C4A3E]">Presencial</h2>
            <div className="h-[1px] w-12 bg-gray-100"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Clínica Hygeia', loc: 'Mafra', day: 'Segunda-feira', time: '9:00 - 13:00', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3108.9765!2d-9.3258!3d38.9369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDU2JzEyLjgiTiA5wrAxOSczMi45Ilc!5e0!3m2!1spt-PT!2spt!4v1234567890' },
              { name: 'Instituto Bettencourt', loc: 'Lisboa', day: 'Terça-feira', time: '9:00 - 16:00', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.6!2d-9.1667!3d38.7223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzIwLjMiTiA5wrAxMCcwMC4xIlc!5e0!3m2!1spt-PT!2spt!4v1234567890' },
              { name: 'Clínica Sousi', loc: 'Sintra', day: 'Quarta-feira', time: '9:00 - 13:00', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.9!2d-9.3897!3d38.7975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQ3JzUxLjAiTiA5wrAyMyczMy4wIlc!5e0!3m2!1spt-PT!2spt!4v1234567890' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#6FA89E]/20 transition-all duration-500 group">
                <div className="h-48 w-full overflow-hidden">
                  <iframe
                    src={item.mapUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${item.name}`}
                  ></iframe>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-serif text-[#2C4A3E] mb-1">{item.name}</h3>
                  <p className="text-[#6FA89E] text-xs font-medium mb-4 tracking-wide">{item.loc}</p>
                  <div className="space-y-1 text-gray-400 text-xs font-light">
                    <p>{item.day}</p>
                    <p>{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online - Minimalista */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-[1px] w-12 bg-gray-100"></div>
            <h2 className="text-2xl font-serif text-[#2C4A3E]">Online</h2>
            <div className="h-[1px] w-12 bg-gray-100"></div>
          </div>
          <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#6FA89E]/5 flex items-center justify-center text-[#6FA89E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif text-[#2C4A3E] mb-2">Consulta Online</h3>
              <p className="text-[#6FA89E] text-xs font-medium mb-4 tracking-wide">Quarta (tarde), Quinta e Sexta</p>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-md">Consultas por videochamada com total flexibilidade de horário, ideal para quem não se pode deslocar.</p>
            </div>
          </div>
        </div>

        {/* Packs - Minimalistas */}
        <div className="mb-20">
          <h2 className="text-2xl font-serif text-[#2C4A3E] mb-2 text-center">Packs de Consultas Online</h2>
          <p className="text-gray-400 text-center text-xs font-light mb-16">Consultas Online: 60€ (1ª consulta) | 50€ (acompanhamento)</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Pack 3 meses', price: '145€', save: 'Poupa 15€', desc: 'Ideal para quem quer experimentar e criar hábito' },
              { name: 'Pack 6 meses', price: '270€', save: 'Poupa 40€', desc: 'Muito bom para resultados sólidos', popular: true },
              { name: 'Pack 12 meses', price: '499€', save: 'Poupa 111€', desc: 'Excelente para fidelização e estabilidade' }
            ].map((pack, i) => (
              <div key={i} className={`bg-white rounded-2xl p-10 border ${pack.popular ? 'border-[#6FA89E]/30 shadow-sm' : 'border-gray-100'} relative flex flex-col text-center`}>
                {pack.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6FA89E] text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">Recomendado</span>}
                <h3 className="text-lg font-serif text-[#2C4A3E] mb-6">{pack.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-serif text-[#2C4A3E]">{pack.price}</span>
                  <p className="text-[#6FA89E] text-[10px] font-medium mt-2 uppercase tracking-widest">{pack.save}</p>
                </div>
                <p className="text-gray-400 text-xs font-light mb-10 flex-1 leading-relaxed">{pack.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocacoesPage;
