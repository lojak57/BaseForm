#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check for environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  console.error('Create a .env file with these values or provide them in the environment');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function applyTenantFix() {
  try {
    console.log('Applying tenant filtering fix...');

    // Read and execute each migration file
    const migrationFiles = [
      '02-fix-tenant-rls.sql',
      '03-add-tenant-fix-function.sql'
    ];

    for (const file of migrationFiles) {
      console.log(`\nApplying migration: ${file}`);
      const filePath = path.join(__dirname, '..', 'migrations', file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`Migration file not found: ${filePath}`);
        continue;
      }
      
      const sql = fs.readFileSync(filePath, 'utf8');
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error executing ${file}:`, error);
      } else {
        console.log(`✅ Successfully applied ${file}`);
      }
    }
    
    // Verify tenant products
    console.log('\nVerifying tenant products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else {
      const tenants = [...new Set(products.map(p => p.tenant_id))];
      console.log(`Found ${products.length} total products across ${tenants.length} tenants:`);
      
      for (const tenant of tenants) {
        const tenantProducts = products.filter(p => p.tenant_id === tenant);
        console.log(`- ${tenant}: ${tenantProducts.length} products`);
      }
    }
    
    console.log('\nTenant fix completed!');
    
  } catch (error) {
    console.error('Error applying tenant fix:', error);
    process.exit(1);
  }
}

// Execute the function
applyTenantFix(); 