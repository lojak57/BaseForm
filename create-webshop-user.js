// Script to create users for different webshops
// Run with: node create-webshop-user.js <shop-name> <email> <password>

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load env variables from .env file

// Supabase URL and service role key (this needs to be a service_role key, not anon key)
// You can find this in Supabase dashboard > Project Settings > API
const SUPABASE_URL = "https://mpltvzpsgijpjcdacicp.supabase.co";

// Get the service role key from .env file
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY environment variable is missing.');
  console.error('Create a .env file with SUPABASE_SERVICE_KEY=your_service_key_here');
  console.error('You can find your service key in Supabase dashboard > Project Settings > API');
  process.exit(1);
}

// Get command line arguments
const shopName = process.argv[2]?.toLowerCase();
const email = process.argv[3];
const password = process.argv[4];

if (!shopName || !email || !password) {
  console.error('Usage: node create-webshop-user.js <shop-name> <email> <password>');
  console.error('Example: node create-webshop-user.js trueform admin@trueform.com password123');
  process.exit(1);
}

// Create Supabase client with service role for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createWebshopUser() {
  try {
    // 1. Create a new user
    console.log(`Creating user for shop '${shopName}': ${email}...`);
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Skip email confirmation
      app_metadata: {
        [`${shopName}_access`]: true,  // Shop-specific access flag
        app_name: shopName             // Tenant identifier for RLS policies
      },
      user_metadata: {
        apps: [shopName],              // List of accessible apps
        role: "admin",
        appName: shopName.charAt(0).toUpperCase() + shopName.slice(1) // Capitalized shop name
      }
    });

    if (userError) {
      throw userError;
    }

    console.log('User created successfully!');
    console.log('User details:', userData.user);

    // 2. Check that the user was created correctly
    console.log("\nVerifying user...");
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }

    const createdUser = users.find(u => u.email === email);
    if (createdUser) {
      console.log(`Verification successful! User ID: ${createdUser.id}`);
      console.log(`\nLogin credentials:`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`\nThis user has specific access to the ${shopName} shop only.`);
      console.log(`Tenant: ${createdUser.app_metadata?.app_name || shopName}`);
      
      // Add shop initialization guidance
      console.log('\nTo initialize data for this shop, run SQL like:');
      console.log(`INSERT INTO products (name, price, slug, category_id, tenant_id) 
  VALUES ('Example Product', 99.99, 'example-product', '12345', '${shopName}');`);
    } else {
      console.log('User verification failed. Please check the Supabase dashboard.');
    }

  } catch (error) {
    console.error('Error creating webshop user:', error);
  }
}

createWebshopUser(); 