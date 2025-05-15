# VCSews Platform: Architecture & Development Guide

## Table of Contents

1. [Overview & Ethos](#overview--ethos)
2. [Technical Architecture](#technical-architecture)
3. [Multi-Tenant Infrastructure](#multi-tenant-infrastructure)
4. [Core Components](#core-components)
5. [Data Flow & State Management](#data-flow--state-management)
6. [User Journeys](#user-journeys)
7. [Recent Developments](#recent-developments)
8. [Integration Points](#integration-points)
9. [Future Development Guidelines](#future-development-guidelines)
10. [Performance Considerations](#performance-considerations)
11. [Security Practices](#security-practices)

## Overview & Ethos

The VCSews platform is a multi-tenant e-commerce solution that enables artisanal crafters and small businesses to showcase and sell handcrafted products. Built upon TrueForm's multi-tenant architecture, the platform prioritizes:

- **Tenant Isolation**: Strict separation between different shops' data and products
- **Customization**: Flexible product configurations, especially fabric selection
- **User Experience**: Clean, intuitive interfaces that highlight artisanal products
- **Accessibility**: Responsive design that works well across all devices
- **Simplicity**: Streamlined checkout process with minimal friction

The platform serves two primary user types:
1. **Shop Owners/Admins**: Who manage their product catalog and view sales
2. **Customers**: Who browse products, make selections, and complete purchases

## Technical Architecture

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: ShadcnUI component library
- **Routing**: React Router v6
- **State Management**: React Context API
- **API Client**: Tanstack React Query

### Backend

- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for product images
- **Functions**: Supabase Edge Functions for serverless operations
- **Security**: Row Level Security (RLS) for tenant isolation
- **Payment Processing**: Stripe integration

### Deployment

- **Hosting**: Vercel
- **Environment Config**: Environment variables for different environments
- **CI/CD**: Automatic deployment through Vercel's GitHub integration

## Multi-Tenant Infrastructure

The multi-tenant architecture is a cornerstone of the VCSews platform, enabling multiple independent shops to operate within a single codebase and database.

### Tenant Identification

- Each tenant is identified by a unique `tenant_id`
- The default tenant for VCSews uses the source identifier `vcsews`
- Tenant isolation is enforced at multiple levels:
  - Database: Via Row Level Security policies
  - Application: Through context-aware data fetching
  - API: By passing tenant identifiers in requests

### Row Level Security Implementation

All database tables with tenant-specific data have RLS policies applied. Key tables include:

- `products`: Contains all shop products with tenant segregation
- `fabrics`: Stores fabric options for products
- `purchase_records`: Tracks completed purchases by tenant

The RLS policies typically follow this pattern:

```sql
CREATE POLICY "Tenants can only see their own products" 
ON products FOR SELECT 
TO authenticated, anon
USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

### Tenant Context Management

The application manages tenant context through:

1. `AuthContext.tsx`: Handles authentication and current tenant state
2. `ProductContext.tsx`: Fetches tenant-specific products
3. `ProductManagementContext.tsx`: Provides admin tools scoped to the current tenant

## Core Components

### Directory Structure

```
src/
├── components/            # UI components
│   ├── admin/             # Admin-specific components
│   ├── blocks/            # Content blocks (product cards, etc.)
│   ├── checkout/          # Checkout flow components
│   ├── layout/            # Layout components (Header, Footer)
│   └── ui/                # Base UI components
├── context/               # React Context providers
├── data/                  # Static data (categories, etc.)
├── hooks/                 # Custom React hooks
├── integrations/          # Third-party integrations
│   └── supabase/          # Supabase client and types
├── lib/                   # Utility functions
└── pages/                 # Page components
    └── admin/             # Admin pages
```

### Key Components

- `Header.tsx`: Main navigation with search functionality
- `ProductCard.tsx`: Displays product information in listings
- `ProductPage.tsx`: Detailed product view with fabric selection
- `CheckoutPage.tsx`: Multi-step checkout process
- `ImagesStep.tsx`: Image upload with progress indicators
- `StripeCheckout.tsx`: Stripe payment integration

### Context Providers

- `AuthContext.tsx`: User authentication and tenant information
- `CartContext.tsx`: Shopping cart state and operations
- `ProductContext.tsx`: Product data fetching and filtering
- `ProductManagementContext.tsx`: Admin product management tools

## Data Flow & State Management

### Product Data Flow

1. Products are fetched in `ProductContext.tsx` based on the current tenant
2. Products are displayed in listings via `ProductCard.tsx`
3. Detailed view in `ProductPage.tsx` shows full product information
4. When added to cart, product data is stored in `CartContext.tsx`
5. Checkout process uses product data from cart to calculate totals

### Auth Flow

1. Admin authentication occurs in `LoginPage.tsx`
2. Authentication state is managed in `AuthContext.tsx`
3. Protected routes are wrapped with `ProtectedRoute.tsx`
4. Tenant context is established upon login and maintained throughout the session

### Cart Flow

1. Products are added to cart with optional fabric selection
2. Cart state is persisted in localStorage
3. Cart items are displayed in `CartPage.tsx`
4. Checkout collects user information in `CheckoutPage.tsx`
5. Payment is processed via Stripe through the Edge Function
6. Order confirmation is shown in `ThankYouPage.tsx`

## User Journeys

### Customer Journey

1. Browse products by category or search
2. View detailed product information
3. Select fabric options (when available)
4. Add products to cart
5. Complete checkout with shipping information
6. Process payment through Stripe
7. Receive order confirmation

### Admin Journey

1. Log in to admin dashboard
2. View sales data and product inventory
3. Add new products with the product wizard
4. Configure product details and fabric options
5. Upload product images
6. Edit existing products
7. View diagnostic information

## Recent Developments

### Tenant Isolation Implementation

- Applied Row Level Security to prevent cross-tenant data access
- Added explicit tenant filtering in database queries
- Implemented tenant context in application state

### Fabric Selection Enhancements

- Made fabric selection conditional based on product settings
- Added default fabric handling for products without fabric selection
- Fixed cart and pricing logic for different product types
- Improved messaging about product availability

### Payment Integration

- Implemented Stripe serverless checkout function
- Created database tables for tracking purchases
- Built customer information collection forms
- Designed order confirmation experience

### Search Functionality

- Added product search bar in Header component
- Created SearchPage for displaying search results
- Implemented client-side search filtering 
- Added visual feedback for search operations

### Image Upload Improvements

- Enhanced progress indicators with percentage display
- Added file validation for type and size
- Improved error handling and user feedback
- Implemented image preview and management tools

## Integration Points

### Supabase Integration

- `src/integrations/supabase/client.ts`: Main Supabase client configuration
- `src/integrations/supabase/types.ts`: TypeScript definitions for database schema

### Stripe Integration

- `supabase/functions/stripe-checkout/index.ts`: Serverless function for Stripe checkout
- Stripe session creation and management
- Support for multiple payment methods

## Future Development Guidelines

### Code Style & Conventions

- Use TypeScript for all new components
- Follow existing naming conventions:
  - PascalCase for components
  - camelCase for functions and variables
  - kebab-case for CSS classes
- Maintain component isolation with clear props interfaces
- Use React Context for global state, props for component-specific state

### Adding New Features

1. **Tenant Awareness**: All new features must respect tenant isolation
2. **Component Structure**: Follow the established component hierarchy
3. **State Management**: Prefer Context API for shared state
4. **Data Fetching**: Use consistent patterns with proper error handling
5. **UI Consistency**: Maintain the established design system

### Extending Multi-Tenant Features

When adding new multi-tenant functionality:

1. Ensure database tables have a `tenant_id` column
2. Apply appropriate RLS policies
3. Filter queries by tenant in application code
4. Test with multiple tenant accounts to verify isolation

## Performance Considerations

### Image Optimization

- Use responsive images with appropriate sizing
- Implement lazy loading for product images
- Consider WebP format for better compression
- Maintain image organization in storage buckets

### Application Optimization

- Use React.memo() for expensive components
- Implement virtualization for long lists
- Consider code-splitting for admin functionality
- Minimize unnecessary re-renders with useCallback and useMemo

## Security Practices

### Data Protection

- Never expose tenant data across boundaries
- Validate all user inputs on both client and server
- Use prepared statements for database queries
- Implement proper CORS policies for API endpoints

### Authentication & Authorization

- Use Supabase Auth for user management
- Implement proper role-based access control
- Secure admin routes with ProtectedRoute component
- Regularly rotate service keys and credentials

---

This guide serves as a comprehensive reference for understanding and extending the VCSews platform. All development should adhere to these principles to maintain code quality, security, and the multi-tenant architecture. 