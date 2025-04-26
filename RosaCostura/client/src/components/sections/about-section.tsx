import { Heart, Leaf } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="sobre" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-playfair sm:text-4xl">
            Sobre o Ateliê da Rosa
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Conheça nossa história e filosofia de trabalho
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl font-playfair">
                Nossa História
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                O Ateliê da Rosa nasceu em 2015, com a paixão de Rosa por costura e criação. 
                O que começou como um pequeno hobby se transformou em um negócio de sucesso, 
                especializado em peças exclusivas e serviços de alta qualidade.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                      <Heart className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Paixão pelo artesanal</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Valorizamos o trabalho manual e dedicamos tempo e cuidado a cada peça que produzimos.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Compromisso com a sustentabilidade</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Utilizamos materiais de qualidade e buscamos práticas sustentáveis em nossa produção.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 lg:mt-0 relative">
              <div className="aspect-w-5 aspect-h-6 rounded-lg overflow-hidden shadow-xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Equipe do Ateliê da Rosa trabalhando" 
                  className="w-full h-full object-center object-cover" 
                />
              </div>
              <div className="absolute inset-0 bg-rose-100 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg hidden md:block" style={{ zIndex: 0 }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
