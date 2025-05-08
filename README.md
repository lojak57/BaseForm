# VCSEUES PURSES E-Commerce Website

An e-commerce website for handcrafted bags built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Responsive design that works well on all devices
- Product catalog with multiple categories
- Detailed product pages with fabric selection options
- Shopping cart functionality
- Checkout process
- Image gallery with fabric variations
- Admin dashboard for product management

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
