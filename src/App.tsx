// Force Vercel rebuild - App.tsx modified on May 15, 2024
// This is the main app component for White-Label-Webshop
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductManagementProvider } from "@/context/ProductManagementContext";
import { ProductProvider } from "@/context/ProductContext";
import { FabricProvider } from "@/context/FabricContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import AnalyticsSkeleton from "./components/admin/AnalyticsSkeleton";

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
import Demo from "./pages/Demo";
import Signup from "./pages/Signup";

// Admin Pages
import LoginPage from "./pages/admin/LoginPage";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import UpdatePasswordPage from "./pages/admin/UpdatePasswordPage";
import DashboardPage from "./pages/admin/DashboardPage";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductsPage from "./pages/admin/ProductsPage";
import ProductWizard from "./pages/admin/ProductWizard";
import FabricsPage from "./pages/admin/FabricsPage";
import FabricEditor from "./pages/admin/FabricEditor";
import DiagnosticsPage from "./pages/admin/DiagnosticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminGuidePage from "./pages/admin/AdminGuidePage";

// Lazy-loaded analytics page
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductManagementProvider>
          <ProductProvider>
            <FabricProvider>
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
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/admin/update-password" element={<UpdatePasswordPage />} />
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
                    <Route path="fabrics" element={<FabricsPage />} />
                    <Route path="fabrics/new" element={<FabricEditor />} />
                    <Route path="fabrics/edit/:fabricId" element={<FabricEditor />} />
                    <Route path="analytics" element={
                      <Suspense fallback={<AnalyticsSkeleton />}>
                        <AnalyticsPage />
                      </Suspense>
                    } />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="guide" element={<AdminGuidePage />} />
                    <Route path="diagnostics" element={<DiagnosticsPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
            </FabricProvider>
          </ProductProvider>
        </ProductManagementProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
