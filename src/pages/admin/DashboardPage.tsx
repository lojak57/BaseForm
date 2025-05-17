import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cog, Home, Package, PlusCircle, Info, Scissors, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-playfair">VC Sews Admin</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-threadGold">
              View Store
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex">
        <aside className="w-64 pr-8">
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <Home className="h-4 w-4 mr-3 text-gray-500" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/products" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <Package className="h-4 w-4 mr-3 text-gray-500" />
              <span>Products</span>
            </Link>
            <Link to="/admin/products/new" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <PlusCircle className="h-4 w-4 mr-3 text-threadGold" />
              <span className="text-threadGold font-medium">Add New Product</span>
            </Link>
            <Link to="/admin/fabrics" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <Scissors className="h-4 w-4 mr-3 text-gray-500" />
              <span>Fabric Library</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <Cog className="h-4 w-4 mr-3 text-gray-500" />
              <span>Store Settings</span>
            </Link>
            
            <Link to="/admin/guide" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
              <BookOpen className="h-4 w-4 mr-3 text-gray-500" />
              <span>Admin Guide</span>
            </Link>
            
            <Separator className="my-4" />
            
            <Link to="/admin/diagnostics" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded text-sm">
              <Info className="h-4 w-4 mr-3 text-gray-500" />
              <span>System Diagnostics</span>
            </Link>
          </nav>
        </aside>
        
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 