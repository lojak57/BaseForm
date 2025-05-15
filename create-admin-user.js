// Script to create a VCSews-specific admin user
// Run with: node create-admin-user.js

const { createClient } = require('@supabase/supabase-js');

// Supabase URL and service role key (this needs to be a service_role key, not anon key)
// You can find this in Supabase dashboard > Project Settings > API
const SUPABASE_URL = "https://mpltvzpsgijpjcdacicp.supabase.co";

// ⚠️ IMPORTANT: Replace with your service_role key
// Don't worry, this file won't be committed to git
const SUPABASE_SERVICE_KEY = "YOUR_SERVICE_ROLE_KEY_HERE";

// Admin user details
const ADMIN_EMAIL = "admin@vcsews.com";  // Replace with desired admin email
const ADMIN_PASSWORD = "vcseues2024";     // Replace with desired password

// Create Supabase client with service role for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createAdminUser() {
  try {
    // 1. Create a new user
    console.log(`Creating user: ${ADMIN_EMAIL}...`);
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Skip email confirmation
      app_metadata: {
        vcsews_access: true,  // App-specific flag
        app_name: "vcsews"    // Tenant identifier - critical for multi-tenant isolation
      },
      user_metadata: {
        apps: ["vcsews"],    // List of accessible apps
        role: "admin",
        appName: "VCSews"
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

    const createdUser = users.find(u => u.email === ADMIN_EMAIL);
    if (createdUser) {
      console.log(`Verification successful! User ID: ${createdUser.id}`);
      console.log(`\nLogin credentials:`);
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log(`\nThis user has specific access to the VCSews application only.`);
      console.log(`Tenant: ${createdUser.app_metadata?.app_name || 'vcsews'}`);
    } else {
      console.log('User verification failed. Please check the Supabase dashboard.');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 