# VCSews E-Commerce Platform

This is a multi-tenant e-commerce platform built for VCSews, featuring a modern UI, comprehensive product management, and seamless checkout experience.

## Key Features

### Multi-tenant Architecture
- Secure tenant isolation using Row Level Security (RLS)
- Separate product catalogs for each tenant
- Tenant-specific product management

### Shop Features
- Product browsing by category
- Product search functionality
- Detailed product pages
- Customized fabric selection
- Responsive design for all devices
- Cart management
- Secure checkout flow

### Admin Features
- Secure admin login
- Dashboard with sales insights
- Product management (add, edit, delete)
- Image upload with progress indicators
- Optional fabric selection configuration

### Payment Processing
- Stripe integration for secure payments
- Support for multiple payment methods (credit card, Klarna, Afterpay)
- Order confirmation and thank-you page
- Purchase records in database

## Technical Architecture

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- ShadcnUI for UI components
- React Router for navigation
- React Context for state management

### Backend
- Supabase for database and authentication
- Postgres with Row Level Security
- Serverless Edge Functions for payment processing
- Storage buckets for image uploads

### Deployment
- Vercel for hosting and deployment
- Environment variables for configuration

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Create a `.env` file with your environment variables (see `.env.example`)
4. Start the development server
```bash
npm run dev
```

### Configuration
The application requires the following environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `STRIPE_SECRET_KEY`: Your Stripe secret key for payment processing

## Recent Enhancements

### Tenant Isolation
- Fixed tenant isolation using Row Level Security (RLS)
- Prevented products from another tenant appearing in the VCSews shop

### Fabric Selection
- Made fabric selection UI conditional based on product settings
- Added default fabric handling for products without fabric selection
- Fixed cart and pricing logic for different product types
- Added clear messaging about product availability

### Payment Integration
- Created a serverless Edge Function for Stripe checkout
- Implemented database tables for tracking purchases
- Built checkout components with customer information collection
- Created a confirmation thank-you page

### UI/UX Improvements
- Increased logo size and improved responsive layout
- Fixed product creation workflow to make fabric selection optional
- Added pre-populated product description template
- Implemented better image upload indicators with progress bar
- Enhanced search functionality for products
- Improved image management with better visual feedback

### Technical Improvements
- Enhanced error handling throughout the application
- Implemented proper tenant ID handling
- Fixed inconsistent currency formatting
- Added better loading indicators
- Improved form validation

## License
Proprietary - All rights reserved

## Product Images

The website features high-quality product images for:

- Crossbody bags
- Tote bags
- Clutch purses
- Mini backpacks

Each product has multiple fabric options with corresponding images. All images are sourced from Unsplash under their free-to-use license.

### Image Structure

Images are organized in the following directories:

- `/public/images/products/{category}/{product-name}-{fabric}.jpg` - Product images
- `/public/images/swatches/{fabric}.jpg` - Fabric swatches
- `/public/images/categories/{category}.jpg` - Category images

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm run dev
```

### Image Generation

The realistic product images were implemented using the `download-images.js` script, which:

1. Creates necessary image directories
2. Downloads high-quality images from Unsplash
3. Places them in the appropriate folders based on product and fabric type

To re-run the image download script:

```bash
node download-images.js
```

## Deployment

This project is configured for easy deployment to Vercel.

### Deploying to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Install the Vercel CLI:
```bash
npm install -g vercel
```
3. Run the following command from the project directory:
```bash
vercel
```
4. Follow the prompts to connect to your Vercel account and configure your project
5. Once deployed, your site will be available at a Vercel URL

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

### Admin Access

The admin dashboard can be accessed at `/admin/login` with these default credentials:
- Username: `admin`
- Password: `vcseues2024`

Make sure to change these credentials in a production environment.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI Components

## License

This project is licensed under the MIT License.

## Credits

All product images are from [Unsplash](https://unsplash.com) and are used under the Unsplash License.
