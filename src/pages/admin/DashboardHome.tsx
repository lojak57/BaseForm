import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Settings, Edit, BarChart3, Plus, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <Loader2 className="h-6 w-6 animate-spin text-threadGold" />
        <span className="ml-2 text-sm md:text-base">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-3 md:p-4 rounded-md text-sm md:text-base flex flex-col md:flex-row md:items-center">
        <span>{error}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchData()}
          className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold font-playfair">Dashboard</h2>
        
        {/* Quick action buttons */}
        <div className="flex flex-col xs:flex-row gap-2 md:gap-3 w-full md:w-auto">
          {/* Mobile-specific quick action buttons */}
          <div className="grid grid-cols-2 gap-2 md:hidden w-full">
            <Link to="/admin/settings" className="w-full">
              <Button variant="outline" className="w-full justify-center items-center gap-1 h-10 px-2 text-sm">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
            <Link to="/admin/products/new" className="w-full">
              <Button className="bg-threadGold hover:bg-threadGold/90 w-full justify-center items-center gap-1 h-10 px-2 text-sm">
                <Plus className="h-4 w-4" />
                <span>New Product</span>
              </Button>
            </Link>
          </div>
          
          {/* Desktop quick action buttons */}
          <div className="hidden md:flex gap-3">
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
      </div>
      
      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Package className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span>Total Products</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Current product catalog size</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold">{productCount}</p>
            <div className="mt-3 md:mt-4">
              <Link to="/admin/products" className="text-xs md:text-sm text-threadGold hover:underline inline-flex items-center">
                <span>Manage Products</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 md:space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded text-sm md:text-base">
                  <span className="truncate mr-2">{category.name}</span>
                  <span className="font-medium bg-gray-100 py-0.5 px-2 rounded-full text-xs md:text-sm flex-shrink-0">
                    {categoryStats[category.id] || 0}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 md:mt-4">
              <Link to="/admin/settings" className="text-xs md:text-sm text-threadGold hover:underline inline-flex items-center">
                <span>Manage Categories</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span>Sales Analytics</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Track revenue and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">View detailed reports on:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-1 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-threadGold"></span>
                    Sales trends and metrics
                  </li>
                  <li className="flex items-center gap-1 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-threadGold"></span>
                    Top selling products
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <Link to="/admin/analytics" className="text-xs md:text-sm text-threadGold hover:underline inline-flex items-center">
                <span>View Analytics</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links grid for mobile */}
      <div className="md:hidden mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-500">Quick Access</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/admin/products" className="bg-white p-3 rounded-lg border border-gray-200 hover:border-threadGold/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Package className="h-5 w-5 mb-1 text-threadGold" />
              <span className="text-sm font-medium">Products</span>
              <span className="text-xs text-gray-500 mt-1">Manage inventory</span>
            </div>
          </Link>
          <Link to="/admin/fabrics" className="bg-white p-3 rounded-lg border border-gray-200 hover:border-threadGold/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Scissors className="h-5 w-5 mb-1 text-threadGold" />
              <span className="text-sm font-medium">Fabrics</span>
              <span className="text-xs text-gray-500 mt-1">Material library</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
