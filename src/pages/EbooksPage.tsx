import { useState } from 'react';
import { Download, BookOpen, X, CheckCircle, AlertCircle, Loader2, ShoppingCart, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  pdfPath?: string;
  purchaseUrl?: string;
  isPaid: boolean;
  tags: string[];
}

const ebooks: Ebook[] = [
  {
    id: 'energia-para-liderar',
    title: 'Energia para Liderar',
    subtitle: 'O Guia Prático de Performance Mental e Física',
    description:
      'Liderar em ambientes de elevada exigência requer mais do que competências técnicas. Este guia prático foi concebido para líderes que procuram optimizar a sua performance de forma integral, com base em quatro dimensões de energia: física, mental, emocional e espiritual. Ao longo destas páginas, partilhamos estratégias e conhecimentos fundamentados para gerir o stress, aumentar a vitalidade e liderar com maior impacto e propósito.',
    coverImage: '/assets/ebook-energia-liderar-capa.jpg',
    purchaseUrl: 'https://go.hotmart.com/Q104764153P?dp=1',
    isPaid: true,
    tags: ['Nutrição', 'Performance', 'Liderança', 'Bem-estar'],
  },
  {
    id: 'sopas-low-fodmap',
    title: 'Sopas Low FODMAP',
    subtitle: 'Receitas Seguras para a Fase de Eliminação',
    description:
      'Um guia prático com receitas de sopas especialmente concebidas para a fase de eliminação da dieta Low FODMAP. Cada receita foi cuidadosamente elaborada pela Drª Marlene Ruivo, nutricionista especialista em Dieta FODMAP, para garantir que são seguras, nutritivas e saborosas para quem sofre de síndrome do intestino irritável ou outras perturbações digestivas funcionais.',
    coverImage: '/assets/ebook-sopas-low-fodmap-capa.jpg',
    purchaseUrl: 'https://go.hotmart.com/L104352596A?dp=1',
    isPaid: true,
    tags: ['FODMAP', 'Receitas', 'Nutrição', 'Digestão'],
  },
];

interface DownloadModalProps {
  ebook: Ebook;
  onClose: () => void;
}

const DownloadModal = ({ ebook, onClose }: DownloadModalProps) => {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, introduza um endereço de e-mail válido.');
      return;
    }
    if (!gdprConsent) {
      setError('É necessário aceitar a política de privacidade para efectuar o download.');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase.from('ebook_downloads').insert({
        email: email.toLowerCase().trim(),
        ebook_id: ebook.id,
        ebook_title: ebook.title,
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
        downloaded_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      setSuccess(true);

      // Iniciar download automático após registo
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = ebook.pdfPath!;
        link.download = `${ebook.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 800);
    } catch (err) {
      console.error('Erro ao registar download:', err);
      setError('Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-[#6FA89E]" />
            </div>
            <h3 className="text-2xl font-serif text-[#2C4A3E] mb-3">Download iniciado!</h3>
            <p className="text-gray-600 mb-2">
              O seu e-book está a ser transferido. Obrigada pelo interesse!
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Se o download não iniciar automaticamente,{' '}
              <a
                href={ebook.pdfPath}
                download
                className="text-[#6FA89E] underline hover:text-[#5d8d84]"
              >
                clique aqui
              </a>
              .
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#6FA89E] text-white rounded-xl hover:bg-[#5d8d84] transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6FA89E]/10 rounded-xl">
                <Download className="w-6 h-6 text-[#6FA89E]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#2C4A3E] leading-tight">
                  Descarregar e-book
                </h3>
                <p className="text-sm text-gray-500">{ebook.title}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Introduza o seu e-mail para receber o e-book gratuitamente. Os seus dados são
              tratados com total confidencialidade, em conformidade com o RGPD.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2C4A3E] mb-1.5"
                >
                  Endereço de e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.seu@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/50 focus:border-[#6FA89E] text-sm transition-all"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  id="gdpr"
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#6FA89E] cursor-pointer flex-shrink-0"
                  required
                />
                <label htmlFor="gdpr" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                  Consinto que os meus dados pessoais (endereço de e-mail) sejam tratados pela
                  Drª Marlene Ruivo para envio do e-book solicitado e comunicações relacionadas
                  com nutrição e bem-estar, em conformidade com o{' '}
                  <strong>Regulamento Geral sobre a Protecção de Dados (RGPD)</strong>. Posso
                  revogar este consentimento a qualquer momento através de{' '}
                  <a
                    href="/contactos"
                    className="text-[#6FA89E] underline hover:text-[#5d8d84]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    contacto directo
                  </a>
                  . <span className="text-red-500">*</span>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#6FA89E] text-white font-medium rounded-xl hover:bg-[#5d8d84] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descarregar gratuitamente
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const EbooksPage = () => {
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#2C4A3E]/5 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6FA89E]/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-[#6FA89E]" />
            <span className="text-sm font-medium text-[#6FA89E]">Recursos</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#2C4A3E] mb-6 leading-tight">
            E-books
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Conteúdo especializado em nutrição, bem-estar e performance. Explore os recursos
            disponíveis e transforme a sua saúde.
          </p>
        </div>
      </section>

      {/* E-books Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {ebooks.map((ebook) => (
              <div
                key={ebook.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                {/* Capa do e-book */}
                <div className="relative overflow-hidden bg-[#1a2744] aspect-[3/4]">
                  <img
                    src={ebook.coverImage}
                    alt={`Capa do e-book: ${ebook.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge Pago / Gratuito */}
                  <div className="absolute top-3 right-3">
                    {ebook.isPaid ? (
                      <span className="px-2.5 py-1 bg-[#2C4A3E] text-white text-xs font-semibold rounded-full shadow">
                        Pago
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#6FA89E] text-white text-xs font-semibold rounded-full shadow">
                        Gratuito
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ebook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[#6FA89E]/10 text-[#6FA89E] text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-serif text-[#2C4A3E] mb-1 leading-tight">
                    {ebook.title}
                  </h2>
                  <p className="text-sm text-[#6FA89E] font-medium mb-3 italic">
                    {ebook.subtitle}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-4">
                    {ebook.description}
                  </p>

                  {/* Botão de ação */}
                  {ebook.isPaid ? (
                    <>
                      <a
                        href={ebook.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#2C4A3E] text-white font-medium rounded-xl hover:bg-[#3d6357] transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Comprar e-book
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                      <p className="text-center text-xs text-gray-400 mt-2">Disponível na Hotmart · PDF</p>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedEbook(ebook)}
                        className="w-full py-3 bg-[#2C4A3E] text-white font-medium rounded-xl hover:bg-[#3d6357] transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                        Fazer Download
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-2">Gratuito · PDF</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem de mais e-books em breve */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 bg-white rounded-2xl border border-dashed border-[#6FA89E]/40 max-w-md">
              <BookOpen className="w-10 h-10 text-[#6FA89E]/40 mx-auto mb-3" />
              <h3 className="text-lg font-serif text-[#2C4A3E] mb-2">Mais conteúdo em breve</h3>
              <p className="text-sm text-gray-500">
                Novos e-books e guias práticos serão disponibilizados regularmente. Fique atento!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Download (apenas para e-books gratuitos) */}
      {selectedEbook && !selectedEbook.isPaid && (
        <DownloadModal ebook={selectedEbook} onClose={() => setSelectedEbook(null)} />
      )}
    </div>
  );
};

export default EbooksPage;
