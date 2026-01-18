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
              Devolver o prazer de comer e a liberdade de viver a quem sofre de problemas digestivos.
              Através de uma abordagem personalizada e baseada em evidência científica, ajudo os meus
              pacientes a recuperar a sua qualidade de vida.
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
                Anos de experiência a ajudar pacientes com síndrome do intestino irritável,
                intolerâncias alimentares e outros problemas digestivos a encontrar alívio
                através da alimentação adequada.
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
