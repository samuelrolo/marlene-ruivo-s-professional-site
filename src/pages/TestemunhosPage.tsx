import Header from "../components/Header";
import Footer from "../components/Footer";

const TestemunhosPage = () => {
  const testemunhos = [
    {
      nome: "Ana S.",
      texto: "Depois de anos a sofrer com problemas digestivos, finalmente encontrei alívio. A Marlene ajudou-me a identificar os alimentos que me faziam mal e hoje vivo muito melhor.",
      rating: 5,
    },
    {
      nome: "Pedro M.",
      texto: "Profissional excepcional. O acompanhamento personalizado fez toda a diferença. Recomendo a todos que sofrem de SII.",
      rating: 5,
    },
    {
      nome: "Carla R.",
      texto: "A dieta FODMAP mudou a minha vida. Agradeço à Marlene por toda a paciência e dedicação durante o processo.",
      rating: 5,
    },
    {
      nome: "João L.",
      texto: "Finalmente consigo comer sem medo. O conhecimento e a empatia da Marlene são incomparáveis.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
              Testemunhos
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              O que dizem os nossos pacientes.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {testemunhos.map((testemunho, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md border border-teal-100"
                >
                  <div className="flex mb-4">
                    {[...Array(testemunho.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testemunho.texto}"
                  </p>
                  <p className="text-teal-700 font-semibold">
                    — {testemunho.nome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestemunhosPage;
