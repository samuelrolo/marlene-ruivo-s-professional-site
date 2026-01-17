import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-2">
              <span className="px-4 py-1 rounded-full bg-[#6FA89E]/10 text-[#6FA89E] text-xs font-medium uppercase tracking-widest">Saúde intestinal</span>
              <span className="px-4 py-1 rounded-full bg-[#6FA89E]/10 text-[#6FA89E] text-xs font-medium uppercase tracking-widest">Dieta FODMAP</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#2C4A3E] leading-tight">
              Nutrição especializada em <span className="text-[#6FA89E]">saúde intestinal</span> e dieta FODMAP
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Apoio clínico baseado em ciência para reduzir sintomas e recuperar o bem-estar digestivo. A Marlene estreia-se como nutricionista freelance em dezembro de 2025, mantendo o acompanhamento próximo e humano que marca a sua carreira.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 border border-gray-200 text-gray-600 rounded-xl hover:border-[#6FA89E] hover:text-[#6FA89E] transition-all font-medium">
                Saber mais
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img src="/assets/Foto Marlene 1.png" alt="Marlene Ruivo - Nutricionista" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 max-w-[240px]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6FA89E]/10 flex items-center justify-center text-[#6FA89E]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monash Certified</span>
              </div>
              <p className="text-sm font-medium text-[#2C4A3E]">Plano FODMAP personalizado</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { title: 'Dieta FODMAP', desc: 'Sabe como a dieta FODMAP te pode ajudar', btn: 'Saber mais →', link: '/fodmap' },
            { title: 'Testemunhos', desc: 'Vê o que os pacientes dizem', btn: 'Ver testemunhos →', link: '/testemunhos' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-[#6FA89E]/30 transition-all group">
              <h3 className="text-2xl font-serif text-[#2C4A3E] mb-4">{item.title}</h3>
              <p className="text-gray-500 mb-8">{item.desc}</p>
              <button className="text-[#6FA89E] font-medium group-hover:translate-x-2 transition-transform">{item.btn}</button>
            </div>
          ))}
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default HomePage;
