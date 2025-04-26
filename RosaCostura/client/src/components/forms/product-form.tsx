import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: number;
  inStock: boolean;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.string().refine((value) => {
    const num = parseFloat(value.replace(",", "."));
    return !isNaN(num) && num > 0;
  }, { message: "Preço deve ser um número positivo" }),
  imageUrl: z.string().url("URL de imagem inválida"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  inStock: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({ product, categories, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(product?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isEditing = !!product;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ? parseFloat(product.price).toString() : "",
      imageUrl: product?.imageUrl || "",
      categoryId: product?.categoryId ? product.categoryId.toString() : "",
      inStock: product?.inStock ?? true,
    },
  });
  
  // Atualiza a pré-visualização quando a URL da imagem mudar manualmente
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'imageUrl' && value.imageUrl) {
        setPreviewImage(value.imageUrl as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Upload da imagem para o servidor
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta do servidor:', errorText);
        throw new Error(`Erro ao fazer upload da imagem: ${response.status} ${response.statusText}`);
      }

      // Lê a resposta como texto primeiro
      const responseText = await response.text();
      console.log('Resposta bruta do servidor:', responseText);
      
      // Tenta fazer o parse do texto para JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Erro ao fazer parse do JSON:', jsonError);
        throw new Error('Erro ao processar resposta do servidor. A resposta não é um JSON válido.');
      }
      
      // Atualiza o formulário com a URL da imagem
      form.setValue('imageUrl', data.imageUrl);
      setPreviewImage(data.imageUrl);
      
      toast({
        title: 'Upload realizado com sucesso',
        description: 'A imagem foi enviada e associada ao produto.',
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload da imagem',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Formatando o preço como string para compatibilidade com o esquema do servidor
      const formattedData = {
        ...data,
        // Mantendo o preço como string, apenas normalizando separador decimal
        price: data.price.replace(",", "."),
        categoryId: parseInt(data.categoryId),
      };

      // Log para depuração
      console.log('Dados do formulário a serem enviados:', formattedData);

      if (isEditing && product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data: formattedData,
        });
      } else {
        await createProductMutation.mutateAsync(formattedData);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        {/* Navegação interna por seções */}
        <div className="sticky top-0 z-10 bg-white pb-2 pt-1 -mr-4 pr-4 border-b mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <a href="#info-basica" className="text-xs font-medium px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20">
                Informações Básicas
              </a>
              <a href="#preco-categoria" className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200">
                Preço e Categoria
              </a>
              <a href="#imagem" className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200">
                Imagem
              </a>
              <a href="#disponibilidade" className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200">
                Disponibilidade
              </a>
            </div>
            <Button type="submit" disabled={loading} className="h-7 text-xs px-2">
              {loading ? "Salvando..." : isEditing ? "Salvar" : "Publicar"}
            </Button>
          </div>
        </div>
        
        {/* Seção 1: Informações Básicas */}
        <div id="info-basica">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o produto"
                    {...field}
                    rows={4}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção 2: Preço e Categoria */}
        <div id="preco-categoria" className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0,00"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  Use vírgula ou ponto como separador decimal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção 3: Imagem */}
        <div id="imagem">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do Produto</FormLabel>
                <div className="space-y-4">
                  {/* Input URL da imagem */}
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      {...field}
                      disabled={loading || uploading}
                    />
                  </FormControl>
                  
                  {/* Ou separador */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">OU</span>
                    </div>
                  </div>
                  
                  {/* Upload de imagem */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      disabled={loading || uploading}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading || uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Fazer upload de imagem
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Prévia da imagem */}
                  {previewImage && (
                    <div className="mt-4 border rounded-md p-2">
                      <p className="text-sm text-gray-500 mb-2">Prévia da imagem:</p>
                      <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={previewImage}
                          alt="Prévia do produto"
                          className="object-contain w-full h-full"
                          onError={() => {
                            toast({
                              title: "Erro ao carregar imagem",
                              description: "A URL da imagem parece inválida ou inacessível.",
                              variant: "destructive",
                            });
                            setPreviewImage(null);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <FormDescription>
                  Insira a URL de uma imagem pública ou faça upload diretamente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção 4: Disponibilidade */}
        <div id="disponibilidade">
          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Disponibilidade</FormLabel>
                  <FormDescription>
                    O produto está disponível em estoque?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Salvando..." : "Criando..."}
              </>
            ) : (
              <>{isEditing ? "Salvar Alterações" : "Criar Produto"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}