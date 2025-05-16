// Force Vercel rebuild - App.tsx modified on May 15, 2024
// This is the main app component for VCSews
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductManagementProvider } from "@/context/ProductManagementContext";
import { ProductProvider } from "@/context/ProductContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

// Admin Pages
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductsPage from "./pages/admin/ProductsPage";
import ProductWizard from "./pages/admin/ProductWizard";
import DiagnosticsPage from "./pages/admin/DiagnosticsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductManagementProvider>
          <ProductProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Customer-facing routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="/thanks" element={<ThankYouPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DashboardHome />} />
                    <Route path="dashboard" element={<DashboardHome />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/new" element={<ProductWizard />} />
                    <Route path="products/edit/:productId" element={<ProductWizard />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="diagnostics" element={<DiagnosticsPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </ProductProvider>
        </ProductManagementProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
