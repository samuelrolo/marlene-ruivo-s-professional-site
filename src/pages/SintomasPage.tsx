import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from '../components/ChatBot';

const SintomasPage = () => {
  const sintomas = [
    {
      titulo: 'Inchaço Abdominal',
      descricao: 'Sensação de barriga inchada após refeições.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
        </svg>
      )
    },
    {
      titulo: 'Dor Abdominal',
      descricao: 'Desconforto ou dor na região do abdómen.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      )
    },
    {
      titulo: 'Alterações Intestinais',
      descricao: 'Diarreia, obstipação ou alternância entre ambos.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16M8 14l4-4 4 4" />
        </svg>
      )
    },
    {
      titulo: 'Gases Excessivos',
      descricao: 'Flatulência frequente e desconfortável.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="8" cy="16" r="2" strokeWidth="2" />
          <circle cx="12" cy="10" r="2" strokeWidth="2" />
          <circle cx="16" cy="14" r="2" strokeWidth="2" />
        </svg>
      )
    },
    {
      titulo: 'Náuseas',
      descricao: 'Sensação de enjoo, especialmente após comer.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4" />
        </svg>
      )
    },
    {
      titulo: 'Fadiga',
      descricao: 'Cansaço persistente relacionado com problemas digestivos.',
      icon: (
        <svg className="w-12 h-12 text-[#6FA89E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Sinais a Identificar</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-6">Sintomas Comuns</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed font-light">
            Identifique os sinais que o seu corpo lhe está a dar. Se reconhece algum destes sintomas, uma consulta de nutrição pode ajudá-lo a encontrar alívio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sintomas.map((sintoma, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#6FA89E]/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#6FA89E]/5 flex items-center justify-center mb-6 group-hover:bg-[#6FA89E]/10 transition-colors">
                {sintoma.icon}
              </div>
              <h3 className="text-lg font-serif text-[#2C4A3E] mb-3">
                {sintoma.titulo}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {sintoma.descricao}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-[#6FA89E]/5 to-transparent rounded-3xl p-12">
          <h2 className="text-2xl font-serif text-[#2C4A3E] mb-4">Precisa de Ajuda?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Se identifica algum destes sintomas, uma consulta de nutrição pode ajudá-lo a encontrar alívio e melhorar a sua qualidade de vida.
          </p>
          <a
            href="/contactos"
            className="inline-block px-8 py-4 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-all font-medium shadow-lg shadow-[#6FA89E]/20"
          >
            Agendar Consulta →
          </a>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default SintomasPage;
