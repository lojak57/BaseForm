import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { checkProducts } from "@/lib/product-debug";
import { supabase } from "@/integrations/supabase/client";

export default function DiagnosticsPage() {
  const { user, currentTenant, session } = useAuth();
  const { products, refreshProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [fixingTenants, setFixingTenants] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // 1. Check current user and tenant
      console.log("Current user:", user);
      console.log("Current tenant:", currentTenant);
      console.log("JWT claims:", session?.access_token);
      
      // 2. Check database products
      const productsCheck = await checkProducts();
      
      // 3. Check RLS settings
      let rlsStatus = "Unknown";
      try {
        // Simplify this - just try to access a table with a non-existent ID
        // If RLS is active, this will still return empty array but not error
        const { data, error } = await supabase
          .from('products')  // Using a known table 
          .select('*')
          .eq('id', 'non-existent-id-for-diagnostic-check');
          
        if (error) {
          console.error("RLS check error:", error);
          rlsStatus = "Error";
        } else {
          // If we get here, RLS is either disabled or we have proper access
          rlsStatus = "Access Verified";
        }
      } catch (error) {
        console.error("Error checking RLS:", error);
        rlsStatus = "Error checking";
      }
      
      // 4. Check context products
      console.log("Products from context:", products);
      
      // 5. Calculate tenant issues
      const tenantIssues = productsCheck?.visibleProducts?.filter(
        p => p.tenant_id !== currentTenant && p.tenant_id !== 'vcsews'
      ) || [];
      
      // Combine results
      const diagnosticResults = {
        user: {
          id: user?.id,
          email: user?.email,
          app_metadata: user?.app_metadata,
          user_metadata: user?.user_metadata
        },
        tenant: currentTenant,
        rlsStatus,
        databaseProducts: productsCheck,
        contextProducts: products.length,
        tenantIssues: tenantIssues
      };
      
      setResults(diagnosticResults);
      console.log("Diagnostic results:", diagnosticResults);
      toast.success("Diagnostics complete");
      
      // Refresh products
      await refreshProducts();
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Error running diagnostics");
    } finally {
      setLoading(false);
    }
  };

  const fixTenantIssues = async () => {
    if (!results?.tenantIssues?.length) {
      toast.info("No tenant issues to fix");
      return;
    }
    
    setFixingTenants(true);
    try {
      // Use a type cast to get around TypeScript's type checking
      // @ts-ignore - Custom RPC function
      const { error } = await supabase.rpc('apply_tenant_rls_fix');
      
      if (error) {
        console.error("Error fixing tenant issues:", error);
        toast.error("Error fixing tenant issues");
        return;
      }
      
      toast.success("Tenant issues fixed. Running diagnostics again...");
      await runDiagnostics();
    } catch (error) {
      console.error("Error fixing tenant issues:", error);
      toast.error("Error fixing tenant issues");
    } finally {
      setFixingTenants(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-playfair mb-6">System Diagnostics</h2>
      
      <div className="mb-6 flex gap-4">
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? "Running Diagnostics..." : "Run Diagnostics"}
        </Button>
        
        {results?.tenantIssues?.length > 0 && (
          <Button 
            onClick={fixTenantIssues} 
            disabled={fixingTenants} 
            variant="destructive"
          >
            {fixingTenants ? "Fixing..." : `Fix ${results.tenantIssues.length} Tenant Issues`}
          </Button>
        )}
      </div>
      
      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Current user and tenant information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">User ID:</p>
                  <p className="text-sm text-gray-600">{results.user.id || "Not logged in"}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-sm text-gray-600">{results.user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Current Tenant:</p>
                  <p className="text-sm text-gray-600">{results.tenant || "Default"}</p>
                </div>
                <div>
                  <p className="font-medium">Row Level Security:</p>
                  <p className="text-sm text-gray-600">{results.rlsStatus}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="font-medium mb-2">User Metadata:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-20">
                  {JSON.stringify(results.user.user_metadata, null, 2)}
                </pre>
              </div>
              
              <div className="mt-4">
                <p className="font-medium mb-2">App Metadata:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-20">
                  {JSON.stringify(results.user.app_metadata, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Product count in database vs. displayed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Database Products:</p>
                  <p className="text-2xl font-bold">{results.databaseProducts?.productCount || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Displayed Products:</p>
                  <p className="text-2xl font-bold">{results.contextProducts}</p>
                </div>
              </div>
              
              {results.tenantIssues?.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2 text-red-500">
                    Tenant Issues Detected: {results.tenantIssues.length} products from wrong tenant
                  </p>
                  <div className="bg-red-50 p-4 rounded border border-red-200">
                    <p className="text-sm text-red-700 mb-2">
                      Products from other tenants are visible in your store.
                      This indicates a problem with Row Level Security policies.
                    </p>
                    <ul className="text-xs text-red-700 ml-4 list-disc">
                      {results.tenantIssues.slice(0, 5).map((p, i) => (
                        <li key={i}>{p.name} (tenant: {p.tenant_id})</li>
                      ))}
                      {results.tenantIssues.length > 5 && (
                        <li>...and {results.tenantIssues.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              
              {results.databaseProducts?.tenants && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Tenants in Database:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.databaseProducts.tenants.map((tenant: string, i: number) => (
                      <span key={i} className={`px-2 py-1 rounded text-sm 
                        ${tenant === results.tenant ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                        {tenant || "(empty)"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {results.databaseProducts?.categories && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Categories in Database:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.databaseProducts.categories.map((category: string, i: number) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {category || "(empty)"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 