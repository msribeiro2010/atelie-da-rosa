import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { Scissors } from "lucide-react";
import { Link } from "wouter";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    if (user && !isLoading) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || user) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center mb-6">
            <Scissors className="h-6 w-6 text-rose-500 mr-2" />
            <h1 className="font-playfair text-2xl font-bold text-rose-600">Ateliê da Rosa</h1>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Bem-vindo(a)</CardTitle>
              <CardDescription>
                Faça login ou crie uma conta para acessar recursos exclusivos e solicitar serviços personalizados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block bg-rose-50">
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
          <div className="max-w-md text-center">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
              Ateliê da Rosa
            </h2>
            <p className="text-gray-600 mb-6">
              Artesanato e costura de alta qualidade. Criamos peças exclusivas e oferecemos serviços de reparos com a dedicação e o carinho que suas peças merecem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-rose-500 rounded-full p-2 mr-3">
                  <Scissors className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">Produtos artesanais exclusivos</p>
              </div>
              <div className="flex items-center">
                <div className="bg-rose-500 rounded-full p-2 mr-3">
                  <Scissors className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">Reparos e ajustes com qualidade</p>
              </div>
              <div className="flex items-center">
                <div className="bg-rose-500 rounded-full p-2 mr-3">
                  <Scissors className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">Peças sob medida personalizadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
