// Script to update products with source field
import { createClient } from '@supabase/supabase-js';

// Get configuration from environment or hardcode (for development only)
const SUPABASE_URL = "https://mpltvzpsgijpjcdacicp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ";

// Site identifier
const SITE_SOURCE = "vcsews";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function updateProductsSources() {
  try {
    console.log('Starting product source update...');
    
    // 1. Update all products without a source
    console.log('Updating products without a source value...');
    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update({ source: SITE_SOURCE })
      .is('source', null);
    
    if (updateError) {
      throw new Error(`Product update failed: ${updateError.message}`);
    }
    
    console.log('Products updated successfully.');
    
    // 2. Count products by source for verification
    const { data: vcsewsProducts, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('source', SITE_SOURCE);
    
    if (countError) {
      throw new Error(`Product count failed: ${countError.message}`);
    }
    
    console.log(`${vcsewsProducts.length} products now tagged with source '${SITE_SOURCE}'`);
    
    // 3. Identify any "trueform" products - assuming they might have a different pattern in names or data
    // For example, we might look for products with names containing "TrueForm"
    const { data: potentialTrueformProducts, error: trueformQueryError } = await supabase
      .from('products')
      .select('id, name, slug')
      .ilike('name', '%trueform%')
      .is('source', null);
    
    if (trueformQueryError) {
      throw new Error(`TrueForm products query failed: ${trueformQueryError.message}`);
    }
    
    if (potentialTrueformProducts && potentialTrueformProducts.length > 0) {
      console.log(`Found ${potentialTrueformProducts.length} potential TrueForm products by name:`);
      potentialTrueformProducts.forEach(product => {
        console.log(`- ${product.id}: ${product.name} (${product.slug})`);
      });
      
      // Update these products to have trueform source
      const trueformIds = potentialTrueformProducts.map(p => p.id);
      const { error: trueformUpdateError } = await supabase
        .from('products')
        .update({ source: 'trueform' })
        .in('id', trueformIds);
      
      if (trueformUpdateError) {
        throw new Error(`TrueForm update failed: ${trueformUpdateError.message}`);
      }
      
      console.log(`Updated ${trueformIds.length} products to have 'trueform' source.`);
    } else {
      console.log('No potential TrueForm products found by name search.');
    }
    
    // 4. Count products without a source (should be fewer now)
    const { data: nullSourceProducts, error: nullCountError } = await supabase
      .from('products')
      .select('id, name, slug', { count: 'exact' })
      .is('source', null);
    
    if (nullCountError) {
      throw new Error(`Null source count failed: ${nullCountError.message}`);
    }
    
    console.log(`${nullSourceProducts.length} products still have a NULL source`);
    if (nullSourceProducts.length > 0) {
      console.log('Products with NULL source:');
      nullSourceProducts.forEach(product => {
        console.log(`- ${product.id}: ${product.name} (${product.slug})`);
      });
    }
    
    // 5. Count other sources
    const { data: sourceCounts, error: sourceCountsError } = await supabase
      .from('products')
      .select('source, count(*)')
      .not('source', 'is', null)
      .group('source');
    
    if (sourceCountsError) {
      throw new Error(`Source counts failed: ${sourceCountsError.message}`);
    }
    
    console.log('Products by source:');
    sourceCounts.forEach(row => {
      console.log(`${row.source}: ${row.count}`);
    });
    
    console.log('Update completed successfully.');
  } catch (error) {
    console.error('Error updating products:', error);
  }
}

// Run the update function
updateProductsSources(); 