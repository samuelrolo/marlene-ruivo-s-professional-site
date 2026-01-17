import Header from "../components/Header";
import Footer from "../components/Footer";
import { Star, StarHalf, Quote } from 'lucide-react';

const TestemunhosPage = () => {
  const testemunhos = [
    {
      nome: "Ana S.",
      texto: "Depois de anos a sofrer com problemas digestivos, finalmente encontrei alívio. A Marlene ajudou-me a identificar os alimentos que me faziam mal e hoje vivo muito melhor.",
      rating: 5,
      data: "Janeiro 2026"
    },
    {
      nome: "Pedro M.",
      texto: "Profissional excepcional. O acompanhamento personalizado fez toda a diferença. Recomendo a todos que sofrem de SII.",
      rating: 4,
      data: "Dezembro 2025"
    },
    {
      nome: "Carla R.",
      texto: "A dieta FODMAP mudou a minha vida. Agradeço à Marlene por toda a paciência e dedicação durante o processo.",
      rating: 5,
      data: "Novembro 2025"
    },
    {
      nome: "João L.",
      texto: "Finalmente consigo comer sem medo. O conhecimento e a empatia da Marlene são incomparáveis.",
      rating: 4,
      data: "Outubro 2025"
    },
    {
      nome: "Marta G.",
      texto: "Excelente acompanhamento. Sinto-me muito mais leve e com energia para o dia-a-dia.",
      rating: 4,
      data: "Setembro 2025"
    },
    {
      nome: "Ricardo F.",
      texto: "A Marlene é uma profissional de excelência. Ajudou-me a resolver problemas que tinha há anos.",
      rating: 5,
      data: "Agosto 2025"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => {
          if (i < Math.floor(rating)) {
            return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
          } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            return <StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
          }
          return <Star key={i} className="w-4 h-4 text-gray-200" />;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <main className="pt-40 lg:pt-48 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header Section with Average */}
        <div className="text-center mb-20">
          <span className="text-[#6FA89E] font-medium tracking-[0.2em] uppercase text-[10px]">Feedback dos Pacientes</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C4A3E] mt-4 mb-8">Testemunhos</h1>
          
          <div className="inline-flex flex-col items-center bg-white px-8 py-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-serif text-[#2C4A3E]">4.35</span>
              <div className="flex flex-col items-start">
                <div className="flex gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Média de Avaliações</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-light">Baseado em experiências reais de pacientes</p>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testemunhos.map((testemunho, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#6FA89E]/20 transition-all duration-500 group relative"
            >
              <Quote className="absolute top-6 right-8 w-8 h-8 text-[#6FA89E]/5 group-hover:text-[#6FA89E]/10 transition-colors" />
              
              <div className="mb-6">
                {renderStars(testemunho.rating)}
              </div>
              
              <p className="text-gray-600 mb-8 italic leading-relaxed font-light text-sm">
                "{testemunho.texto}"
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[#2C4A3E] font-serif font-medium">
                  {testemunho.nome}
                </span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest">
                  {testemunho.data}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center bg-[#2C4A3E] rounded-3xl p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">Pronto para começar a sua jornada?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto font-light text-sm">
              Junte-se a dezenas de pacientes que recuperaram a sua qualidade de vida e o prazer de comer sem medos.
            </p>
            <a
              href="/contactos"
              className="inline-block px-10 py-4 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-all font-medium shadow-xl shadow-black/10"
            >
              Agendar a Minha Consulta
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestemunhosPage;
