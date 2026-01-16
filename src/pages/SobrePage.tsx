import Header from "../components/Header";
import Footer from "../components/Footer";

const SobrePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
              Sobre Mim
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sou a Marlene Ruivo, nutricionista especializada em saúde digestiva e dieta FODMAP.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">A Minha Missão</h2>
              <p className="text-gray-600 mb-6">
                Devolver o prazer de comer e a liberdade de viver a quem sofre de problemas digestivos.
                Através de uma abordagem personalizada e baseada em evidência científica, ajudo os meus
                pacientes a recuperar a sua qualidade de vida.
              </p>
              
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Formação</h2>
              <p className="text-gray-600 mb-6">
                Licenciada em Ciências da Nutrição, com especialização em gastroenterologia e dieta FODMAP.
                Formação contínua nas mais recentes evidências científicas sobre saúde digestiva.
              </p>
              
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Experiência</h2>
              <p className="text-gray-600">
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
