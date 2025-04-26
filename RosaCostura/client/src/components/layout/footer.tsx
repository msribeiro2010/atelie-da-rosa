import { Link } from "wouter";
import { Scissors } from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center">
              <Scissors className="h-6 w-6 text-rose-500 mr-2" />
              <h1 className="font-playfair text-2xl font-bold text-rose-600">Ateliê da Rosa</h1>
            </Link>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Criações exclusivas e serviços de reparos com a dedicação e o carinho que suas peças merecem.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navegação</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/" className="text-base text-gray-500 hover:text-rose-500">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/#produtos" className="text-base text-gray-500 hover:text-rose-500">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href="/#servicos" className="text-base text-gray-500 hover:text-rose-500">
                    Serviços
                  </Link>
                </li>
                <li>
                  <Link href="/#sobre" className="text-base text-gray-500 hover:text-rose-500">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="/#contato" className="text-base text-gray-500 hover:text-rose-500">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contato</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-base text-gray-500">
                  Rua das Flores, 123 - Centro
                </li>
                <li className="text-base text-gray-500">
                  São Paulo - SP, 01234-567
                </li>
                <li className="text-base text-gray-500">
                  (11) 98765-4321
                </li>
                <li className="text-base text-gray-500">
                  contato@ateliedarosa.com.br
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Horário</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-base text-gray-500">
                  Segunda a Sexta: 9h às 18h
                </li>
                <li className="text-base text-gray-500">
                  Sábado: 9h às 13h
                </li>
                <li className="text-base text-gray-500">
                  Domingo: Fechado
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
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
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Ateliê da Rosa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
