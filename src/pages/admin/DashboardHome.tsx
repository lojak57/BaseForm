import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Settings, Edit, BarChart3 } from "lucide-react";

export default function DashboardHome() {
  const { getAllProducts, loading: contextLoading } = useProductManagement();
  const [productCount, setProductCount] = useState(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetch function to prevent it from changing on each render
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const products = await getAllProducts();
      
      // Count products by category
      const stats: Record<string, number> = {};
      categories.forEach(cat => {
        stats[cat.id] = products.filter(p => p.categoryId === cat.id).length;
      });
      
      // Batch state updates to prevent multiple re-renders
      setProductCount(products.length);
      setCategoryStats(stats);
    } catch (err) {
      console.error("Error fetching products for dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [getAllProducts]);

  useEffect(() => {
    fetchData();
    // This effect should run once when the component mounts and when fetchData changes
  }, [fetchData]);

  // Combine loading states to prevent flicker
  const isLoading = loading || contextLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-threadGold" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchData()}
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-playfair">Dashboard</h2>
        <div className="flex gap-3">
          <Link to="/admin/settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </Button>
          </Link>
          <Link to="/admin/products/new">
            <Button className="bg-threadGold hover:bg-threadGold/90 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Total Products</span>
            </CardTitle>
            <CardDescription>Current product catalog size</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{productCount}</p>
            <div className="mt-4">
              <Link to="/admin/products" className="text-sm text-threadGold hover:underline">
                Manage Products →
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                  <span>{category.name}</span>
                  <span className="font-medium bg-gray-100 py-0.5 px-2 rounded-full text-sm">
                    {categoryStats[category.id] || 0}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link to="/admin/settings" className="text-sm text-threadGold hover:underline">
                Manage Categories →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
