import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, LogOut, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

type NavbarProps = {
  user: any;
};

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logoutMutation } = useAuth();
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <span className="sr-only">Ateliê da Rosa</span>
              <Scissors className="h-6 w-6 text-rose-500 mr-2" />
              <h1 className="font-playfair text-2xl font-bold text-rose-600">Ateliê da Rosa</h1>
            </Link>
          </div>

          <div className="-mr-2 -my-2 md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <span className="sr-only">Abrir menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                    Início
                  </Link>
                  <Link href="/#produtos" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                    Produtos
                  </Link>
                  <Link href="/#servicos" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                    Serviços
                  </Link>
                  <Link href="/#sobre" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                    Sobre
                  </Link>
                  <Link href="/#contato" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                    Contato
                  </Link>

                  {user ? (
                    <>
                      {user.isAdmin && (
                        <Link href="/admin" className="text-base font-medium text-gray-700 hover:text-rose-500 p-2">
                          Painel Admin
                        </Link>
                      )}
                      <Button
                        variant="destructive"
                        className="mt-4"
                        onClick={() => {
                          logoutMutation.mutate();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <Link href="/auth" className="w-full">
                        <Button variant="outline" className="w-full">
                          Entrar
                        </Button>
                      </Link>
                      <Link href="/auth?tab=register" className="w-full">
                        <Button className="w-full">
                          Cadastrar
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-base font-medium text-gray-700 hover:text-rose-500">
              Início
            </Link>
            <Link href="/#produtos" className="text-base font-medium text-gray-700 hover:text-rose-500">
              Produtos
            </Link>
            <Link href="/#servicos" className="text-base font-medium text-gray-700 hover:text-rose-500">
              Serviços
            </Link>
            <Link href="/#sobre" className="text-base font-medium text-gray-700 hover:text-rose-500">
              Sobre
            </Link>
            <Link href="/#contato" className="text-base font-medium text-gray-700 hover:text-rose-500">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                      <User className="h-4 w-4 text-rose-600" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                      <User className="h-4 w-4 text-rose-600" />
                    </div>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Painel Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth" className="whitespace-nowrap text-base font-medium text-gray-700 hover:text-rose-500">
                  Entrar
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-rose-500 hover:bg-rose-600"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
