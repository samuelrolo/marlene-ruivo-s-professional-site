import Header from "../components/Header";
import Footer from "../components/Footer";

const SintomasPage = () => {
  const sintomas = [
    { titulo: "Inchaço Abdominal", descricao: "Sensação de barriga inchada, especialmente após as refeições." },
    { titulo: "Dor Abdominal", descricao: "Desconforto ou dor na região do abdómen." },
    { titulo: "Alterações Intestinais", descricao: "Diarreia, obstipação ou alternância entre ambos." },
    { titulo: "Gases Excessivos", descricao: "Flatulência frequente e desconfortável." },
    { titulo: "Náuseas", descricao: "Sensação de enjoo, especialmente após comer." },
    { titulo: "Fadiga", descricao: "Cansaço persistente relacionado com problemas digestivos." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
              Sintomas
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Identifique os sinais que o seu corpo lhe está a dar.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sintomas.map((sintoma, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100"
                >
                  <h3 className="text-xl font-semibold text-teal-700 mb-3">
                    {sintoma.titulo}
                  </h3>
                  <p className="text-gray-600">
                    {sintoma.descricao}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Se identifica algum destes sintomas, uma consulta de nutrição pode ajudá-lo a encontrar alívio.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SintomasPage;
