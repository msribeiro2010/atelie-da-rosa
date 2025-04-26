import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, User, Mail, Phone, Calendar } from "lucide-react";

export default function AdminCustomers() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
    enabled: !!user?.isAdmin,
  });

  const filteredCustomers = customers 
    ? customers.filter((customer: any) => 
        customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        (customer.phone && customer.phone.includes(search))
      )
    : [];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-semibold text-gray-900 font-playfair">Gerenciamento de Clientes</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">Nome</th>
                          <th scope="col" className="px-6 py-3">Email</th>
                          <th scope="col" className="px-6 py-3">Telefone</th>
                          <th scope="col" className="px-6 py-3">Data de Cadastro</th>
                          <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer: any) => (
                          <tr key={customer.id} className="bg-white border-b">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-rose-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-rose-600" />
                                </div>
                                <div className="ml-3">
                                  <div>{customer.firstName} {customer.lastName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{customer.email}</td>
                            <td className="px-6 py-4">{customer.phone || 'Não informado'}</td>
                            <td className="px-6 py-4">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    onClick={() => setSelectedCustomer(customer)}
                                  >
                                    Ver Detalhes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Detalhes do Cliente</DialogTitle>
                                  </DialogHeader>
                                  {selectedCustomer && selectedCustomer.id === customer.id && (
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-center mb-2">
                                        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center">
                                          <User className="h-8 w-8 text-rose-600" />
                                        </div>
                                      </div>
                                      
                                      <div className="text-center mb-4">
                                        <h3 className="text-lg font-medium">{customer.firstName} {customer.lastName}</h3>
                                        <p className="text-sm text-gray-500">{customer.username}</p>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                          <Mail className="h-5 w-5 text-gray-400" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p>{customer.email}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                          <Phone className="h-5 w-5 text-gray-400" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Telefone</p>
                                            <p>{customer.phone || 'Não informado'}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                          <Calendar className="h-5 w-5 text-gray-400" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Data de Cadastro</p>
                                            <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum cliente encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {search ? `Nenhum resultado para "${search}"` : "Ainda não há clientes cadastrados."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
