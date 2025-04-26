import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, MessageSquare, FileText, User, Package, Home } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: customers } = useQuery({
    queryKey: ["/api/admin/customers"],
    enabled: !!user?.isAdmin,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    enabled: !!user?.isAdmin,
  });

  const { data: serviceRequests } = useQuery({
    queryKey: ["/api/service-requests"],
    enabled: !!user?.isAdmin,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/admin/messages"],
    enabled: !!user?.isAdmin,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-semibold text-gray-900 font-playfair">Painel Administrativo</h1>
              <div className="flex items-center space-x-4">
                <Link href="/" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar para o Site
                </Link>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Olá, {user?.firstName}</span>
                  <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-rose-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total de Clientes</p>
                      <h3 className="text-2xl font-semibold">{customers?.length || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total de Produtos</p>
                      <h3 className="text-2xl font-semibold">{products?.length || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Solicitações</p>
                      <h3 className="text-2xl font-semibold">{serviceRequests?.length || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Mensagens</p>
                      <h3 className="text-2xl font-semibold">{messages?.length || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Últimas Solicitações de Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceRequests && serviceRequests.length > 0 ? (
                    <div className="divide-y">
                      {serviceRequests.slice(0, 5).map((request: any) => (
                        <div key={request.id} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{request.serviceType}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {request.status === 'pending' ? 'Pendente' : 
                             request.status === 'completed' ? 'Concluído' : 
                             'Em Andamento'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma solicitação ainda</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Novos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {customers && customers.length > 0 ? (
                    <div className="divide-y">
                      {customers.slice(0, 5).map((customer: any) => (
                        <div key={customer.id} className="py-3 flex items-center">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum cliente registrado ainda</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <Link href="/admin/products" className="flex-1">
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                        <Package className="h-6 w-6 text-rose-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Gerenciar Produtos</h3>
                      <p className="text-sm text-gray-500">Adicione, edite e remova produtos do catálogo</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/orders" className="flex-1">
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Gerenciar Pedidos</h3>
                      <p className="text-sm text-gray-500">Visualize e atualize o status dos pedidos</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/customers" className="flex-1">
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Gerenciar Clientes</h3>
                      <p className="text-sm text-gray-500">Visualize informações dos clientes cadastrados</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
