import { Gem, Heart, Clock, Shirt } from "lucide-react";

const features = [
  {
    name: 'Qualidade premium',
    description: 'Utilizamos tecidos e materiais de alta qualidade para garantir durabilidade e acabamento perfeito.',
    icon: Gem
  },
  {
    name: 'Atendimento personalizado',
    description: 'Cada cliente recebe atenção especial, com serviços adaptados às suas necessidades específicas.',
    icon: Heart
  },
  {
    name: 'Prazo de entrega',
    description: 'Compromisso com prazos, garantindo que suas peças estejam prontas quando você precisar.',
    icon: Clock
  },
  {
    name: 'Exclusividade',
    description: 'Criações únicas e exclusivas, para quem busca peças que não encontrará em outro lugar.',
    icon: Shirt
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-rose-500 font-semibold tracking-wide uppercase">NOSSOS DIFERENCIAIS</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 font-playfair sm:text-4xl">
            Por que escolher o Ateliê da Rosa?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Oferecemos serviços de alta qualidade com atendimento personalizado para cada cliente.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
