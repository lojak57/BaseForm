import { supabase } from "@/integrations/supabase/client";

/**
 * Debug utility to check if products exist in the database
 * Use this to troubleshoot product display issues
 */
export const checkProducts = async () => {
  try {
    console.log("⏳ Checking for products in the database...");
    
    // Get all products without tenant filtering (using service role if available)
    const { data: allProducts, error: allProductsError } = await supabase
      .from('products')
      .select('*');
    
    if (allProductsError) {
      console.error("❌ Error fetching all products:", allProductsError);
      return;
    }
    
    console.log(`✅ Found ${allProducts.length} total products in the database:`, allProducts);
    
    // Get specific tenants/sources
    const tenants = [...new Set(allProducts.map(p => p.tenant_id))];
    const sources = [...new Set(allProducts.map(p => p.source))];
    
    console.log("📊 Products by tenant_id:", tenants);
    console.log("📊 Products by source:", sources);
    
    // Check what the current user can see (with RLS applied)
    console.log("⏳ Checking what current user can see with RLS...");
    const { data: visibleProducts, error: visibleError } = await supabase
      .from('products')
      .select('*');
      
    if (visibleError) {
      console.error("❌ Error with RLS check:", visibleError);
    } else {
      console.log(`✅ Current user can see ${visibleProducts.length} products with RLS:`, 
        visibleProducts.map(p => `${p.name} (${p.tenant_id})`));
    }
    
    // Test tenant-specific queries
    if (tenants.length > 0) {
      for (const tenant of tenants) {
        console.log(`⏳ Testing query for tenant: ${tenant}`);
        const { data: tenantProducts, error: tenantError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', tenant);
          
        if (tenantError) {
          console.error(`❌ Error querying tenant ${tenant}:`, tenantError);
        } else {
          console.log(`✅ Found ${tenantProducts.length} products for tenant ${tenant}`);
        }
      }
    }
    
    // Log category distribution
    const categories = [...new Set(allProducts.map(p => p.category_id))];
    console.log("📊 Products by category:", categories);
    
    return {
      productCount: allProducts.length,
      products: allProducts,
      visibleProducts: visibleProducts || [],
      tenants,
      sources,
      categories
    };
  } catch (error) {
    console.error("❌ Error checking products:", error);
  }
}; 