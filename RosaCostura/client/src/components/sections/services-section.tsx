import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import ServiceRequestForm from "@/components/forms/service-request-form";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const serviceTypes = [
  {
    title: "Ajustes e Reparos",
    description: "Bainhas, zíperes, botões e mais",
    image: "https://images.unsplash.com/photo-1604335398980-ededb77069b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    price: "A partir de R$ 25"
  },
  {
    title: "Peças Sob Medida",
    description: "Roupas feitas especialmente para você",
    image: "https://images.unsplash.com/photo-1596939082030-27a08a2e2a42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    price: "Consulte preços"
  },
  {
    title: "Bordados Personalizados",
    description: "Bordados manuais e à máquina",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    price: "A partir de R$ 50"
  }
];

export default function ServicesSection() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  return (
    <section id="servicos" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-playfair sm:text-4xl">
            Nossos Serviços
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Oferecemos diversos serviços de costura e reparos para atender suas necessidades.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceTypes.map((service) => (
              <div key={service.title} className="relative group">
                <div className="rounded-lg h-60 overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-center object-cover" 
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      <Dialog open={dialogOpen && selectedService === service.title} onOpenChange={(open) => {
                        if (!open) setDialogOpen(false);
                        setSelectedService(service.title);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-lg text-gray-900 hover:text-rose-500"
                            onClick={() => {
                              setSelectedService(service.title);
                              setDialogOpen(true);
                            }}
                          >
                            {service.title}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                          <DialogHeader>
                            <DialogTitle className="text-center">{service.title}</DialogTitle>
                          </DialogHeader>
                          <ServiceRequestForm 
                            serviceType={service.title}
                            onSuccess={() => setDialogOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  </div>
                  <p className="text-sm font-medium text-rose-500">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Request Form */}
        <div className="mt-16 bg-rose-50 rounded-lg shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 font-playfair">Solicite um Serviço</h3>
            <p className="mt-2 text-gray-600">Preencha o formulário abaixo para solicitar um orçamento</p>
          </div>

          <ServiceRequestForm />
        </div>
      </div>
    </section>
  );
}
