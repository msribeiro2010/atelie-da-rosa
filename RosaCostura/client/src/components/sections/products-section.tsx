import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingBag } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
};

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch products with filter
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory, searchQuery],
    queryFn: async () => {
      let url = "/api/products";
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append("categoryId", selectedCategory.toString());
      }
      
      if (searchQuery) {
        params.append("q", searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  return (
    <section id="produtos" className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-playfair sm:text-4xl">
            Nossos Produtos
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Confira nossos produtos artesanais feitos com carinho e atenção aos detalhes.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories?.map((category: any) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full h-64 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-sm text-gray-700 font-medium hover:text-rose-500">
                        {product.name}
                      </h3>
                      {product.category && (
                        <Badge variant="outline" className="mt-1">
                          {product.category.name}
                        </Badge>
                      )}
                      <p className="mt-1 text-sm text-gray-500">{product.description.substring(0, 60)}...</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-medium text-gray-900">
                        R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                      </p>
                      <Button size="icon" variant="ghost" className="rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? `Nenhum resultado encontrado para "${searchQuery}"` : "Tente ajustar os filtros ou volte mais tarde."}
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="mt-8 text-center">
            <Button>
              Ver mais produtos
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
