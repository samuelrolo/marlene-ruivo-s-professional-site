import Header from "../components/Header";
import Footer from "../components/Footer";

const FodmapPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-48 lg:pt-56 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Saúde Digestiva</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-6">Dieta FODMAP</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed font-light">
            Uma abordagem científica para o alívio de sintomas digestivos.
          </p>
        </div>
        
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">O que são FODMAPs?</h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              FODMAP é um acrónimo para Fermentable Oligosaccharides, Disaccharides, 
              Monosaccharides And Polyols. São hidratos de carbono de cadeia curta que 
              podem ser mal absorvidos no intestino delgado.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">Como funciona a dieta?</h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              A dieta FODMAP é implementada em três fases: eliminação, reintrodução e 
              personalização. Cada fase é cuidadosamente monitorizada para identificar 
              os gatilhos individuais de cada paciente.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">Para quem é indicada?</h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              A dieta FODMAP é especialmente indicada para pessoas com síndrome do 
              intestino irritável (SII), mas também pode beneficiar quem sofre de 
              outros problemas digestivos funcionais.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FodmapPage;
