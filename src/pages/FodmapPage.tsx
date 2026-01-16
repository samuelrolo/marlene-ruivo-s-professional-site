import Header from "../components/Header";
import Footer from "../components/Footer";

const FodmapPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
              Dieta FODMAP
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Uma abordagem científica para o alívio de sintomas digestivos.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">O que são FODMAPs?</h2>
              <p className="text-gray-600 mb-6">
                FODMAP é um acrónimo para Fermentable Oligosaccharides, Disaccharides, 
                Monosaccharides And Polyols. São hidratos de carbono de cadeia curta que 
                podem ser mal absorvidos no intestino delgado.
              </p>
              
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Como funciona a dieta?</h2>
              <p className="text-gray-600 mb-6">
                A dieta FODMAP é implementada em três fases: eliminação, reintrodução e 
                personalização. Cada fase é cuidadosamente monitorizada para identificar 
                os gatilhos individuais de cada paciente.
              </p>
              
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Para quem é indicada?</h2>
              <p className="text-gray-600">
                A dieta FODMAP é especialmente indicada para pessoas com síndrome do 
                intestino irritável (SII), mas também pode beneficiar quem sofre de 
                outros problemas digestivos funcionais.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FodmapPage;
