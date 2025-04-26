import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Search, Eye, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ["/api/service-requests"],
    enabled: !!user?.isAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await apiRequest("PUT", `/api/admin/service-requests/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredRequests = serviceRequests 
    ? serviceRequests.filter((request: any) => 
        request.serviceType.toLowerCase().includes(search.toLowerCase()) ||
        request.description.toLowerCase().includes(search.toLowerCase()) ||
        request.user?.firstName.toLowerCase().includes(search.toLowerCase()) ||
        request.user?.lastName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-semibold text-gray-900 font-playfair">Gerenciamento de Pedidos</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar solicitações..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  </div>
                ) : filteredRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">Cliente</th>
                          <th scope="col" className="px-6 py-3">Tipo de Serviço</th>
                          <th scope="col" className="px-6 py-3">Data</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request: any) => (
                          <tr key={request.id} className="bg-white border-b">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {request.user?.firstName} {request.user?.lastName}
                            </td>
                            <td className="px-6 py-4">{request.serviceType}</td>
                            <td className="px-6 py-4">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                                {getStatusLabel(request.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setSelectedOrder(request)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>Detalhes da Solicitação</DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && selectedOrder.id === request.id && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                                          <p>{request.user?.firstName} {request.user?.lastName}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">Contato</h4>
                                          <p>{request.user?.email}</p>
                                          <p>{request.user?.phone || 'Não informado'}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Tipo de Serviço</h4>
                                        <p>{request.serviceType}</p>
                                      </div>
                                      
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
                                        <p className="text-sm">{request.description}</p>
                                      </div>
                                      
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                        <Select 
                                          defaultValue={request.status}
                                          onValueChange={(value) => 
                                            updateStatusMutation.mutate({ id: request.id, status: value })
                                          }
                                        >
                                          <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Selecione o status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="in_progress">Em Andamento</SelectItem>
                                            <SelectItem value="completed">Concluído</SelectItem>
                                            <SelectItem value="cancelled">Cancelado</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">Data de Solicitação</h4>
                                          <p>{new Date(request.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-500">Última Atualização</h4>
                                          <p>{new Date(request.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Select 
                                defaultValue={request.status}
                                onValueChange={(value) => 
                                  updateStatusMutation.mutate({ id: request.id, status: value })
                                }
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                                  <SelectItem value="completed">Concluído</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma solicitação encontrada</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {search ? `Nenhum resultado para "${search}"` : "Ainda não há solicitações de serviço."}
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
