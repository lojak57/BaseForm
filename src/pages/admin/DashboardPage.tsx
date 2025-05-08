import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
          <nav className="space-y-2">
            <Link to="/admin" className="block py-2 px-4 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
            <Link to="/admin/products" className="block py-2 px-4 hover:bg-gray-100 rounded">
              All Products
            </Link>
            <Link to="/admin/products/new" className="block py-2 px-4 hover:bg-gray-100 rounded text-threadGold font-medium">
              Add New Product
            </Link>
            <Separator className="my-4" />
            <p className="px-4 text-xs text-gray-500 mb-2">Help</p>
            <Link to="/admin/help" className="block py-2 px-4 hover:bg-gray-100 rounded text-sm">
              Admin Guide
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