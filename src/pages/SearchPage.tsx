import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductCard from "@/components/blocks/ProductCard";
import { Product } from "@/context/CartContext";

export default function SearchPage() {
  const location = useLocation();
  const { products, loading } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Get the search query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);
    
    // Filter products based on search query
    if (query && products) {
      const filteredProducts = products.filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const queryLower = query.toLowerCase();
        
        return name.includes(queryLower) || description.includes(queryLower);
      });
      
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  }, [location.search, products]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL with the new search query
    if (searchQuery.trim()) {
      window.history.pushState(
        {}, 
        "", 
        `/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      
      // Filter products based on new search query
      if (products) {
        const query = searchQuery.toLowerCase();
        const filteredProducts = products.filter(product => {
          const name = product.name.toLowerCase();
          const description = product.description.toLowerCase();
          
          return name.includes(query) || description.includes(query);
        });
        
        setSearchResults(filteredProducts);
      }
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-playfair mb-6">Search Results</h1>
        
        <form onSubmit={handleSearch} className="mb-8 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-threadGold hover:bg-threadGold/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-threadGold border-opacity-50 border-t-threadGold rounded-full"></div>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <>
                <p className="mb-6 text-darkGray">
                  Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 p-8 rounded-lg inline-block">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-xl font-medium mb-2">No results found</h2>
                  <p className="text-darkGray mb-6">
                    We couldn't find any products matching "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-500">
                    Try checking your spelling or using more general terms
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
} 