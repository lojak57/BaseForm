# Multi-Tenant Architecture for White-Label-Webshop Platform

This document explains how the multi-tenant database architecture works for the White-Label-Webshop platform, allowing you to run multiple webshops from a single database while maintaining data isolation.

## Overview

The multi-tenant architecture allows you to:

1. Host multiple webshops in a single database
2. Keep data fully isolated between tenants
3. Share the same codebase while maintaining separation
4. Create tenant-specific users with proper access controls

## How It Works

### Database Design

- Each table has a `tenant_id` column that identifies which shop owns the data
- Row Level Security (RLS) policies ensure tenants can only access their own data
- JWT claims from authentication are used to determine the current tenant

### Authentication

- Users have an `app_name` in their JWT token that identifies their tenant
- The `app_metadata` field in the JWT includes the tenant identifier
- Row Level Security uses this JWT claim to filter data automatically

## Setup Steps

1. Run the migration script to add tenant architecture:
   ```
   psql -U postgres -h your-supabase-host.supabase.co -d postgres -f migrations/01-add-tenant-architecture.sql
   ```

2. Create users for each webshop using the utility script:
   ```
   node create-webshop-user.js shopname user@example.com password123
   ```

## Adding a New Webshop

1. Choose a unique tenant identifier (e.g., "myshop")
2. Create an admin user for that shop:
   ```
   node create-webshop-user.js myshop admin@myshop.com securepassword
   ```
3. Generate initial data for the shop:
   ```sql
   INSERT INTO products (name, price, slug, category_id, tenant_id) 
   VALUES ('First Product', 99.99, 'first-product', 'some-category-id', 'myshop');
   ```

## Security Considerations

- Data is isolated through Row Level Security at the database level
- Each tenant's data is invisible to other tenants
- Users' JWT claims determine their tenant, preventing cross-tenant access
- Even if users authenticate through the same UI, they only see their tenant data

## Troubleshooting

If users can't see their data:
1. Verify the `app_name` in their JWT token matches the `tenant_id` in the database
2. Check that RLS policies are enabled on all tables
3. Ensure the JWT claim extraction is working properly

## Schema Update Process

When adding new tables:
1. Always include a `tenant_id` column
2. Enable RLS on the table
3. Create a policy that filters by tenant
4. Add a trigger to automatically set tenant_id on new rows

Example:
```sql
ALTER TABLE my_new_table ADD COLUMN tenant_id TEXT NOT NULL;
ALTER TABLE my_new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_my_new_table ON my_new_table
  USING (tenant_id = get_tenant_from_jwt());
CREATE TRIGGER set_my_new_table_tenant_id
BEFORE INSERT ON my_new_table
FOR EACH ROW
EXECUTE FUNCTION set_tenant_id();
``` 