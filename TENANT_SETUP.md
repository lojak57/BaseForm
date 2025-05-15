# Tenant Setup Guide

This guide provides step-by-step instructions for setting up new tenants/webshops in the multi-tenant VCSews platform.

## Prerequisites

1. Supabase project with service role key (available in Project Settings > API)
2. Node.js installed on your computer

## Initial Setup

1. Create a `.env` file in the project root with:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_from_dashboard
   ```

2. Install required dependencies:
   ```
   npm install dotenv
   ```

## Creating a New Tenant/Webshop

1. Run the tenant user creation script:
   ```
   node create-webshop-user.js <shop-name> <admin-email> <password>
   ```
   
   Example:
   ```
   node create-webshop-user.js trueform admin@trueform.com securepassword123
   ```

2. This creates a user with:
   - Tenant access limited to the specified shop
   - JWT token containing the tenant identifier
   - Admin permissions for the shop

3. Initialize sample products for the tenant (optional):
   ```
   node init-tenant-products.js <shop-name>
   ```
   
   This will create sample products and fabric options for the new tenant.

4. Verify the tenant is correctly configured:
   ```
   node verify-tenant.js <shop-name>
   ```
   
   This will check for users, products, and fabrics associated with the tenant.

5. Log in using these credentials in the admin panel to create or manage products for this specific tenant.

## Adding Tenant-Specific Products

After creating the tenant user:

1. Log in to the admin panel with the tenant admin credentials
2. Go to Products > Add New Product
3. Create products as needed - they will automatically be associated with the correct tenant

## Testing Multi-Tenant Functionality

To verify everything works correctly:

1. Create at least two tenant users using the script
2. Initialize sample products for each tenant or create them manually
3. Log in with each user and verify they only see their own products
4. Check that frontend stores display only their own products

## Troubleshooting

If products aren't showing up correctly:

1. Run the verification script to check the tenant setup:
   ```
   node verify-tenant.js <shop-name>
   ```

2. Verify the tenant_id is correctly set in the database:
   ```sql
   SELECT * FROM products WHERE tenant_id = 'shop-name';
   ```

3. Check JWT claims extraction:
   ```sql
   SELECT get_tenant_from_jwt() as current_tenant;
   ```

4. Verify Row Level Security is enabled and working:
   ```sql
   SHOW row_level_security;
   ```

## Complete Tenant Setup Workflow

For a new tenant (example: fashionfirst):

1. Create the tenant user:
   ```
   node create-webshop-user.js fashionfirst admin@fashionfirst.com securepassword
   ```

2. Initialize products (optional):
   ```
   node init-tenant-products.js fashionfirst
   ```

3. Verify the setup:
   ```
   node verify-tenant.js fashionfirst
   ```

4. Log in at `/admin/login` with the new credentials
5. Review and customize the sample products or add new ones
6. Your tenant-specific webshop is now ready! 