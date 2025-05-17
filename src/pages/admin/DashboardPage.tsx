import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cog, Home, Package, PlusCircle, Info, Scissors, BookOpen, Menu, X, LogOut, ExternalLink, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    // Handle exact match for dashboard home
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    // Handle other routes with partial matching (but not their children)
    if (path !== "/admin" && location.pathname.startsWith(path)) {
      // Special case for /admin/products/new to not be active when on /admin/products
      if (path === "/admin/products" && location.pathname === "/admin/products/new") {
        return false;
      }
      return true;
    }
    return false;
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/products", label: "Products", icon: Package },
    { 
      path: "/admin/products/new", 
      label: "Add New Product", 
      icon: PlusCircle, 
      highlight: true 
    },
    { path: "/admin/analytics", label: "Sales Analytics", icon: BarChart3 },
    { path: "/admin/fabrics", label: "Fabric Library", icon: Scissors },
    { path: "/admin/settings", label: "Store Settings", icon: Cog },
    { path: "/admin/guide", label: "Admin Guide", icon: BookOpen },
    { path: "/admin/diagnostics", label: "System Diagnostics", icon: Info, small: true }
  ];

  const NavLink = ({ link, onClick }: { link: any, onClick?: () => void }) => (
    <Link 
      to={link.path} 
      className={cn(
        "flex items-center py-2 px-4 rounded transition-colors",
        isActive(link.path) 
          ? "bg-threadGold/10 text-threadGold" 
          : "hover:bg-gray-100",
        link.highlight && !isActive(link.path) && "text-threadGold font-medium",
        link.small && "text-sm"
      )}
      onClick={onClick}
    >
      {link.icon && <link.icon className={cn(
        "h-4 w-4 mr-3", 
        isActive(link.path) 
          ? "text-threadGold" 
          : link.highlight 
            ? "text-threadGold" 
            : "text-gray-500"
      )} />}
      <span>{link.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-3 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold font-playfair">VC Sews Admin</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/" 
              className="hidden md:flex text-sm text-gray-600 hover:text-threadGold items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Store</span>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              size="sm" 
              className="flex items-center gap-1 md:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-4 md:py-8 flex flex-col md:flex-row md:gap-6">
        {/* Mobile sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 shadow-lg transform transition-transform duration-200 ease-in-out md:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg font-playfair">Menu</h2>
            <button 
              onClick={closeSidebar} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.slice(0, -1).map((link) => (
              <NavLink key={link.path} link={link} onClick={closeSidebar} />
            ))}
            
            <Separator className="my-4" />

            <Link 
              to="/" 
              className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
              onClick={closeSidebar}
            >
              <ExternalLink className="h-4 w-4 mr-3 text-gray-500" />
              <span>View Store</span>
            </Link>

            {/* Last item (usually diagnostics) */}
            {navLinks.slice(-1).map((link) => (
              <NavLink key={link.path} link={link} onClick={closeSidebar} />
            ))}
          </nav>
        </aside>
        
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-20">
            {navLinks.map((link, index) => (
              <div key={link.path}>
                <NavLink link={link} />
                {index === navLinks.length - 2 && <Separator className="my-4" />}
              </div>
            ))}
          </nav>
        </aside>
        
        {/* Main content area */}
        <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow-sm min-h-[calc(100vh-12rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 