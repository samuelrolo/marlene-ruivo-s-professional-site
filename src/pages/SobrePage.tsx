import Footer from "../components/Footer";

const SobrePage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <main className="pb-20 px-4 max-w-6xl mx-auto">
        {/* Photo Placard */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
              <img src="/assets/Foto Marlene 1.png" alt="Marlene Ruivo 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
              <img src="/assets/Foto Marlene 2.png" alt="Marlene Ruivo 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
              <img src="/assets/Foto Marlene 3.png" alt="Marlene Ruivo 3" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
              <img src="/assets/fotoprofissional.jpg" alt="Marlene Ruivo Profissional" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-6">Sobre Mim</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed font-light">
            Sou a Marlene Ruivo, nutricionista especializada em saúde digestiva e dieta FODMAP.
          </p>
        </div>
        
        <section className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">A Minha Missão</h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Com uma carreira de cerca de 15 anos como Nutricionista Clínica, desenvolvi uma prática consolidada em clínica privada, onde tive o privilégio de acompanhar centenas de pessoas em diferentes fases da vida. A minha abordagem é pautada por um atendimento personalizado, sempre baseado na mais recente evidência científica e no respeito pela individualidade de cada paciente. A minha principal área de foco tem sido a perda de peso e a obesidade, onde ajudo os pacientes a alcançar os seus objetivos de forma saudável e sustentável, promovendo uma relação equilibrada com a alimentação. Para além desta área, trabalhei também com pessoas ligadas ao desporto, bem como em contextos de gravidez e pós-parto, a adaptar a intervenção nutricional às necessidades específicas de cada fase.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">Formação</h2>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Licenciada em Ciências da Nutrição, com especialização em gastroenterologia e dieta FODMAP.
                Formação contínua nas mais recentes evidências científicas sobre saúde digestiva.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">Experiência</h2>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Nos últimos cinco anos, dediquei-me de forma mais aprofundada à área da saúde gastrointestinal, a realizar várias formações especializadas em Síndrome do Intestino Irritável, SIBO, entre outras patologias digestivas. Esta especialização permitiu-me desenvolver uma abordagem mais completa e integrada, a ajudar pessoas que convivem diariamente com sintomas digestivos a melhorar significativamente a sua qualidade de vida. A minha experiência estende-se ainda à nutrição comunitária, onde integro a elaboração de ementas escolares e fichas técnicas, a colaborar com instituições na promoção de hábitos alimentares mais equilibrados e adequados. Acredito que a nutrição vai muito além de planos alimentares. É um processo de acompanhamento, educação e mudança sustentável, ajustado à realidade, aos objetivos e ao estilo de vida de cada pessoa. O meu compromisso é capacitar cada paciente com as ferramentas necessárias para tomar decisões informadas e alcançar um bem-estar duradouro.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SobrePage;
