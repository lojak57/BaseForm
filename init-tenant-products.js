// Script to initialize basic products for a new tenant
// Run with: node init-tenant-products.js <shop-name>

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
  console.error('Usage: node init-tenant-products.js <shop-name>');
  console.error('Example: node init-tenant-products.js trueform');
  process.exit(1);
}

// Create Supabase client with service role for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample products to create
const sampleProducts = [
  {
    name: "The Essential Tote",
    slug: "essential-tote",
    price: 79.99,
    description: "A versatile tote bag for everyday use, featuring durable canvas construction and ample storage.",
    category_id: "bags",
    has_fabric_selection: true,
    default_images: [
      "/images/products/tote-1.jpg",
      "/images/products/tote-2.jpg"
    ],
    tenant_id: tenantId,
    source: tenantId
  },
  {
    name: "Classic Crossbody",
    slug: "classic-crossbody",
    price: 59.99,
    description: "A stylish crossbody bag that transitions seamlessly from day to night, with adjustable strap and secure closures.",
    category_id: "purses",
    has_fabric_selection: true,
    default_images: [
      "/images/products/crossbody-1.jpg",
      "/images/products/crossbody-2.jpg"
    ],
    tenant_id: tenantId,
    source: tenantId
  },
  {
    name: "Minimalist Wallet",
    slug: "minimalist-wallet",
    price: 34.99,
    description: "A sleek, compact wallet designed to hold your essentials without the bulk. Features card slots and a bill compartment.",
    category_id: "wallets",
    has_fabric_selection: true,
    default_images: [
      "/images/products/wallet-1.jpg",
      "/images/products/wallet-2.jpg"
    ],
    tenant_id: tenantId,
    source: tenantId
  }
];

// Sample fabrics to create
const sampleFabrics = [
  {
    code: "classic-canvas",
    label: "Classic Canvas",
    upcharge: 0,
    swatch: "/images/fabrics/classic-canvas.jpg",
    tenant_id: tenantId
  },
  {
    code: "premium-leather",
    label: "Premium Leather",
    upcharge: 20,
    swatch: "/images/fabrics/premium-leather.jpg",
    tenant_id: tenantId
  },
  {
    code: "organic-cotton",
    label: "Organic Cotton",
    upcharge: 10,
    swatch: "/images/fabrics/organic-cotton.jpg",
    tenant_id: tenantId
  }
];

async function initializeTenantProducts() {
  try {
    console.log(`Initializing products for tenant: ${tenantId}`);
    
    // Create fabrics
    console.log("Creating fabric options...");
    const { data: fabricsData, error: fabricsError } = await supabase
      .from('fabrics')
      .insert(sampleFabrics)
      .select();
    
    if (fabricsError) {
      throw fabricsError;
    }
    console.log(`✅ Created ${fabricsData.length} fabric options`);
    
    // Create products
    console.log("Creating sample products...");
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();
    
    if (productsError) {
      throw productsError;
    }
    console.log(`✅ Created ${productsData.length} products`);
    
    console.log(`\nTenant initialization complete for: ${tenantId}`);
    console.log(`You can now log in as the tenant admin to view and manage these products.`);
    
  } catch (error) {
    console.error('Error initializing tenant products:', error);
  }
}

initializeTenantProducts(); 