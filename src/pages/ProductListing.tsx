
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Product } from "@/context/CartContext";

export default function ProductListing() {
  const { products, loading, error } = useProductManagement();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (products) {
      if (!searchQuery.trim()) {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(
          product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }
  }, [products, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold font-playfair">Product Catalog</h2>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Link to="/admin/products/new">
            <Button className="bg-threadGold hover:bg-threadGold/90 whitespace-nowrap">
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-threadGold" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Try a different search term" : "Start by adding your first product"}
          </p>
          {!searchQuery && (
            <Link to="/admin/products/new">
              <Button className="bg-threadGold hover:bg-threadGold/90">
                Add Your First Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative bg-gray-100">
                <img
                  src={product.defaultImages[0] || "/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.categoryId}</p>
                    <p className="font-medium mt-1">${product.price}</p>
                  </div>
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
