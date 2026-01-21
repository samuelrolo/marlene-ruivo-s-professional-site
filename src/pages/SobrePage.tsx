import Footer from "../components/Footer";
import { GraduationCap, Briefcase, Award } from 'lucide-react';

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
        
        {/* Layout em Pilha Vertical */}
        <section className="max-w-4xl mx-auto space-y-8">
          
          {/* A Minha Missão */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">A Minha Missão</h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Com uma carreira de cerca de 15 anos como Nutricionista Clínica, desenvolvi uma prática consolidada em clínica privada, onde tive o privilégio de acompanhar centenas de pessoas em diferentes fases da vida. A minha abordagem é pautada por um atendimento personalizado, sempre baseado na mais recente evidência científica e no respeito pela individualidade de cada paciente. A minha principal área de foco tem sido a perda de peso e a obesidade, onde ajudo os pacientes a alcançar os seus objetivos de forma saudável e sustentável, promovendo uma relação equilibrada com a alimentação. Para além desta área, trabalhei também com pessoas ligadas ao desporto, bem como em contextos de gravidez e pós-parto, a adaptar a intervenção nutricional às necessidades específicas de cada fase.
            </p>
          </div>

          {/* Formação Académica */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-[#2C4A3E]" />
              <h2 className="text-2xl font-serif text-[#2C4A3E]">Formação Académica</h2>
            </div>
            
            <div className="space-y-6">
              {/* Licenciatura */}
              <div className="border-l-2 border-[#6FA89E] pl-6">
                <h3 className="text-lg font-medium text-[#2C4A3E] mb-1">Licenciatura em Ciências da Nutrição</h3>
                <p className="text-sm text-gray-600 mb-2">Universidade Atlântica</p>
                <p className="text-xs text-gray-400">2006 - 2010</p>
              </div>

              {/* Certificações */}
              <div>
                <h3 className="text-base font-medium text-[#2C4A3E] mb-4">Licenças e Certificados</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#2C4A3E]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Identification and management disordered eating in gastrointestinal disorders</p>
                      <p className="text-xs text-gray-500">Monash University · Jun 2023</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#2C4A3E]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dieta Low Fodmap</p>
                      <p className="text-xs text-gray-500">Monash University · Mai 2021</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experiência Profissional */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-[#2C4A3E]" />
              <h2 className="text-2xl font-serif text-[#2C4A3E]">Experiência Profissional</h2>
            </div>
            
            <div className="space-y-6">
              {/* Instituto Bettercourt */}
              <div className="border-l-2 border-[#6FA89E] pl-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-lg font-medium text-[#2C4A3E]">2023 - Presente</h3>
                  <span className="text-gray-400">|</span>
                  <p className="text-base text-gray-600">Instituto Bettercourt</p>
                </div>
                <p className="text-xs text-gray-400">Freelance · Lisboa, Portugal</p>
              </div>

              {/* SousClinica */}
              <div className="border-l-2 border-[#6FA89E] pl-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-lg font-medium text-[#2C4A3E]">2021 - Presente</h3>
                  <span className="text-gray-400">|</span>
                  <p className="text-base text-gray-600">SousClinica</p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Freelance · Sintra, Lisboa, Portugal</p>
                <p className="text-sm text-gray-500">Consulta de Nutrição Clínica geral e Consultas de Nutrição mais especializadas em FODMAP</p>
              </div>

              {/* Colégio Verde Água */}
              <div className="border-l-2 border-[#6FA89E] pl-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-lg font-medium text-[#2C4A3E]">2017 - 2025</h3>
                  <span className="text-gray-400">|</span>
                  <p className="text-base text-gray-600">Colégio Verde Água</p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Ensino Básico e Academias · Freelance · Mafra, Lisboa, Portugal</p>
                <p className="text-sm text-gray-500">Realização das ementas e fichas técnicas</p>
              </div>

              {/* Clínica do Tempo */}
              <div className="border-l-2 border-[#6FA89E] pl-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-lg font-medium text-[#2C4A3E]">2010 - 2015</h3>
                  <span className="text-gray-400">|</span>
                  <p className="text-base text-gray-600">Clínica do Tempo - Dr. Humberto Barbosa</p>
                </div>
                <p className="text-xs text-gray-400">Parede, Portugal</p>
              </div>
            </div>

            {/* Texto sobre Experiência */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Nos últimos cinco anos, dediquei-me de forma mais aprofundada à área da saúde gastrointestinal, a realizar várias formações especializadas em Síndrome do Intestino Irritável, SIBO, entre outras patologias digestivas. Esta especialização permitiu-me desenvolver uma abordagem mais completa e integrada, a ajudar pessoas que convivem diariamente com sintomas digestivos a melhorar significativamente a sua qualidade de vida. A minha experiência estende-se ainda à nutrição comunitária, onde integro a elaboração de ementas escolares e fichas técnicas, a colaborar com instituições na promoção de hábitos alimentares mais equilibrados e adequados. Acredito que a nutrição vai muito além de planos alimentares. É um processo de acompanhamento, educação e mudança sustentável, ajustado à realidade, aos objetivos e ao estilo de vida de cada pessoa. O meu compromisso é capacitar cada paciente com as ferramentas necessárias para tomar decisões informadas e alcançar um bem-estar duradouro.
              </p>
            </div>
          </div>

          {/* Competências */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif text-[#2C4A3E] mb-6">Competências</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Nutrição */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Nutrição</span>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">3 recomendações</span>
              </div>

              {/* Educação alimentar */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Educação alimentar</span>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">5 recomendações</span>
              </div>

              {/* Nutrição clínica */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Nutrição clínica</span>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">5 recomendações</span>
              </div>

              {/* Promoção da saúde */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Promoção da saúde</span>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">4 recomendações</span>
              </div>
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SobrePage;
