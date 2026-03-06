import { ShoppingCart, ExternalLink, BookOpen, Tag } from 'lucide-react';
import Footer from '../components/Footer';

interface Produto {
  id: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagem: string;
  preco?: string;
  linkCompra: string;
  tags: string[];
  destaque?: boolean;
}

const produtos: Produto[] = [
  {
    id: 'energia-para-liderar',
    categoria: 'E-book',
    titulo: 'Energia para Liderar',
    subtitulo: 'O Guia Prático de Performance Mental e Física',
    descricao:
      'Liderar em ambientes de elevada exigência requer mais do que competências técnicas. Este guia prático foi concebido para líderes que procuram optimizar a sua performance de forma integral, com base em quatro dimensões de energia: física, mental, emocional e espiritual. Estratégias fundamentadas para gerir o stress, aumentar a vitalidade e liderar com maior impacto e propósito.',
    imagem: '/assets/ebook-energia-liderar-capa.jpg',
    linkCompra: 'https://go.hotmart.com/Q104764153P?dp=1',
    tags: ['Nutrição', 'Performance', 'Liderança', 'Bem-estar'],
    destaque: true,
  },
  {
    id: 'sopas-low-fodmap',
    categoria: 'E-book',
    titulo: 'Sopas Low FODMAP',
    subtitulo: 'Receitas Seguras para a Fase de Eliminação',
    descricao:
      'Um guia prático com receitas de sopas especialmente concebidas para a fase de eliminação da dieta Low FODMAP. Cada receita foi elaborada pela Drª Marlene Ruivo, nutricionista especialista em Dieta FODMAP, para garantir que são seguras, nutritivas e saborosas para quem sofre de síndrome do intestino irritável ou outras perturbações digestivas funcionais.',
    imagem: '/assets/ebook-sopas-low-fodmap-capa.jpg',
    linkCompra: 'https://go.hotmart.com/L104352596A?dp=1',
    tags: ['FODMAP', 'Receitas', 'Nutrição', 'Digestão'],
  },
];

const LojaPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#2C4A3E]/5 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6FA89E]/10 rounded-full mb-6">
            <ShoppingCart className="w-4 h-4 text-[#6FA89E]" />
            <span className="text-sm font-medium text-[#6FA89E]">Loja</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#2C4A3E] mb-6 leading-tight">
            Recursos e Produtos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Conteúdo especializado em nutrição, bem-estar e dieta FODMAP, desenvolvido pela
            Drª Marlene Ruivo para o apoiar na sua jornada de saúde.
          </p>
        </div>
      </section>

      {/* Filtro de categorias */}
      <section className="py-4 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Categorias
            </span>
            <span className="px-3 py-1.5 bg-[#2C4A3E] text-white text-xs font-medium rounded-full">
              Todos
            </span>
            <span className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 text-xs font-medium rounded-full">
              E-books
            </span>
          </div>
        </div>
      </section>

      {/* Grelha de Produtos */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col"
              >
                {/* Imagem do produto */}
                <div className="relative overflow-hidden bg-[#1a2744] aspect-[3/4]">
                  <img
                    src={produto.imagem}
                    alt={`Capa: ${produto.titulo}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de categoria */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#2C4A3E] text-xs font-semibold rounded-full shadow-sm">
                      <BookOpen className="w-3 h-3" />
                      {produto.categoria}
                    </span>
                  </div>
                  {produto.destaque && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-[#6FA89E] text-white text-xs font-semibold rounded-full shadow">
                        Destaque
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Conteúdo */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {produto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[#6FA89E]/10 text-[#6FA89E] text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-serif text-[#2C4A3E] mb-1 leading-tight">
                    {produto.titulo}
                  </h2>
                  <p className="text-sm text-[#6FA89E] font-medium mb-3 italic">
                    {produto.subtitulo}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-4 flex-1">
                    {produto.descricao}
                  </p>

                  {/* Preço e botão */}
                  <div className="mt-auto">
                    {produto.preco && (
                      <p className="text-2xl font-serif text-[#2C4A3E] mb-3">{produto.preco}</p>
                    )}
                    <a
                      href={produto.linkCompra}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#2C4A3E] text-white font-medium rounded-xl hover:bg-[#3d6357] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Adquirir na Hotmart
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Disponível na Hotmart · PDF
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem de mais produtos em breve */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 bg-white rounded-2xl border border-dashed border-[#6FA89E]/40 max-w-md">
              <ShoppingCart className="w-10 h-10 text-[#6FA89E]/40 mx-auto mb-3" />
              <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">Mais produtos em breve</h3>
              <p className="text-sm text-gray-500">
                Novos recursos e guias práticos serão disponibilizados regularmente. Fique atento!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LojaPage;
