// Script to apply migration directly
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase connection
const SUPABASE_URL = "https://mpltvzpsgijpjcdacicp.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ""; // Set this as an environment variable

if (!SUPABASE_SERVICE_KEY) {
  console.error("Please set SUPABASE_SERVICE_KEY environment variable");
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  try {
    console.log("Reading migration SQL...");
    const sql = fs.readFileSync('./migrations/01-add-tenant-architecture.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i+1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      
      if (error) {
        console.error(`Error executing statement ${i+1}:`, error);
        console.error("SQL:", stmt);
      } else {
        console.log(`Statement ${i+1} executed successfully`);
      }
    }
    
    console.log("Migration completed!");
    
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

applyMigration(); 