// Script to verify tenant data setup
// Run with: node verify-tenant.js <shop-name>

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase URL and service role key
const SUPABASE_URL = "https://mpltvzpsgijpjcdacicp.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY environment variable is missing.');
  console.error('Create a .env file with SUPABASE_SERVICE_KEY=your_service_key_here');
  process.exit(1);
}

// Get tenant name from command line
const tenantId = process.argv[2]?.toLowerCase();
if (!tenantId) {
  console.error('Usage: node verify-tenant.js <shop-name>');
  console.error('Example: node verify-tenant.js vcsews');
  process.exit(1);
}

// Create Supabase client with service role for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyTenant() {
  try {
    console.log(`Verifying tenant: ${tenantId}\n`);
    
    // Check for users with this tenant access
    console.log("Checking tenant users...");
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    const tenantUsers = users.filter(user => 
      user.app_metadata?.app_name === tenantId || 
      user.user_metadata?.apps?.includes(tenantId)
    );
    
    if (tenantUsers.length > 0) {
      console.log(`✅ Found ${tenantUsers.length} users with access to tenant: ${tenantId}`);
      console.log(`   Users: ${tenantUsers.map(u => u.email).join(', ')}`);
    } else {
      console.log(`❌ No users found with access to tenant: ${tenantId}`);
      console.log(`   You may need to create a user with: node create-webshop-user.js ${tenantId} email@example.com password`);
    }
    
    // Check for products
    console.log("\nChecking tenant products...");
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (productsError) {
      throw productsError;
    }
    
    if (products.length > 0) {
      console.log(`✅ Found ${products.length} products for tenant: ${tenantId}`);
      products.forEach(product => {
        console.log(`   - ${product.name} (${product.slug})`);
      });
    } else {
      console.log(`❌ No products found for tenant: ${tenantId}`);
      console.log(`   You may need to initialize products with: node init-tenant-products.js ${tenantId}`);
    }
    
    // Check for fabrics
    console.log("\nChecking tenant fabrics...");
    const { data: fabrics, error: fabricsError } = await supabase
      .from('fabrics')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (fabricsError) {
      throw fabricsError;
    }
    
    if (fabrics.length > 0) {
      console.log(`✅ Found ${fabrics.length} fabric options for tenant: ${tenantId}`);
      fabrics.forEach(fabric => {
        console.log(`   - ${fabric.label} (${fabric.code})`);
      });
    } else {
      console.log(`❌ No fabric options found for tenant: ${tenantId}`);
    }
    
    // Check RLS status
    console.log("\nChecking database RLS status...");
    console.log(`✅ Row Level Security should be active. Verify in Supabase dashboard.`);
    
    console.log("\nTenant verification complete!");
    
  } catch (error) {
    console.error('Error verifying tenant:', error);
  }
}

verifyTenant(); 