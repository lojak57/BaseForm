import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  const { getAllProducts } = useProductManagement();
  const [productCount, setProductCount] = useState(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const products = getAllProducts();
    setProductCount(products.length);
    
    // Count products by category
    const stats: Record<string, number> = {};
    categories.forEach(cat => {
      stats[cat.id] = products.filter(p => p.categoryId === cat.id).length;
    });
    setCategoryStats(stats);
  }, [getAllProducts]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-playfair">Dashboard</h2>
        <Link to="/admin/products/new">
          <Button className="bg-threadGold hover:bg-threadGold/90">Add New Product</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Current product catalog size</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{productCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Categories</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between">
                  <span>{category.name}</span>
                  <span className="font-medium">{categoryStats[category.id] || 0}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/products/new">
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-threadGold">Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a new product with our step-by-step wizard</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/products">
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View, edit or delete existing products</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/">
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>View Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <p>See how your shop looks to customers</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 