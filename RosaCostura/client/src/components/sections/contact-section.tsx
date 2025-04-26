import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaPinterest } from "react-icons/fa";
import ContactForm from "@/components/forms/contact-form";

export default function ContactSection() {
  return (
    <section id="contato" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-playfair sm:text-4xl">
            Entre em Contato
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Estamos à disposição para atender suas dúvidas e solicitações.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="relative">
            <h3 className="text-2xl font-extrabold text-gray-900 font-playfair">
              Informações de Contato
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Visite nosso ateliê ou entre em contato pelos canais abaixo.
            </p>

            <dl className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">Endereço</dt>
                  <dd className="mt-1 text-base text-gray-500">
                    Rua das Flores, 123 - Centro<br />
                    São Paulo - SP, 01234-567
                  </dd>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">Telefone</dt>
                  <dd className="mt-1 text-base text-gray-500">
                    (11) 98765-4321<br />
                    (11) 3456-7890
                  </dd>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">Email</dt>
                  <dd className="mt-1 text-base text-gray-500">
                    contato@ateliedarosa.com.br
                  </dd>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <dt className="text-lg leading-6 font-medium text-gray-900">Horário de Funcionamento</dt>
                  <dd className="mt-1 text-base text-gray-500">
                    Segunda a Sexta: 9h às 18h<br />
                    Sábado: 9h às 13h
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900">Redes Sociais</h4>
              <div className="flex space-x-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-rose-500">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-500">
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-500">
                  <span className="sr-only">WhatsApp</span>
                  <FaWhatsapp className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-500">
                  <span className="sr-only">Pinterest</span>
                  <FaPinterest className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <h3 className="text-xl font-medium text-gray-900 font-playfair">Envie uma mensagem</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
