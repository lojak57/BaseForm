import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertHtmlToJpeg() {
  // Create directories for images if they don't exist
  const directories = [
    'public/images/categories',
    'public/images/products/crossbody',
    'public/images/products/tote',
    'public/images/products/clutch',
    'public/images/products/backpack',
    'public/images/swatches'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('Starting browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 800, height: 600 });

  const htmlFiles = fs.readdirSync('placeholder-images')
    .filter(file => file.endsWith('.html'));

  console.log(`Found ${htmlFiles.length} HTML files to convert`);

  // First, handle the special files
  if (htmlFiles.includes('placeholder.html')) {
    console.log('Processing placeholder.html');
    await page.goto(`file://${path.join(__dirname, 'placeholder-images', 'placeholder.html')}`);
    await page.screenshot({ path: 'public/images/hero.jpg', type: 'jpeg', quality: 90 });
    await page.screenshot({ path: 'public/images/contact.jpg', type: 'jpeg', quality: 90 });
    
    // Also use for category images
    await page.screenshot({ path: 'public/images/categories/crossbody.jpg', type: 'jpeg', quality: 90 });
    await page.screenshot({ path: 'public/images/categories/tote.jpg', type: 'jpeg', quality: 90 });
    await page.screenshot({ path: 'public/images/categories/clutch.jpg', type: 'jpeg', quality: 90 });
    await page.screenshot({ path: 'public/images/categories/backpack.jpg', type: 'jpeg', quality: 90 });
  }

  // Create swatches
  for (const htmlFile of htmlFiles) {
    if (htmlFile === 'placeholder.html' || htmlFile === 'detail.html' || htmlFile === 'inside.html') {
      continue; // Already handled or will handle separately
    }
    
    const baseName = htmlFile.replace('.html', '');
    console.log(`Processing ${htmlFile} for swatch`);
    
    await page.goto(`file://${path.join(__dirname, 'placeholder-images', htmlFile)}`);
    await page.screenshot({ path: `public/images/swatches/${baseName}.jpg`, type: 'jpeg', quality: 90 });
  }

  // Create product images for each category and fabric
  const productConfigs = [
    {
      category: 'crossbody',
      baseProduct: 'mountain-trail',
      fabrics: ['natural', 'navy', 'rustic', 'floral']
    },
    {
      category: 'tote',
      baseProduct: 'aspen-tote',
      fabrics: ['natural', 'denim', 'sage', 'stripe']
    },
    {
      category: 'clutch',
      baseProduct: 'evening-star',
      fabrics: ['black', 'navy', 'silver', 'embroidered']
    },
    {
      category: 'backpack',
      baseProduct: 'alpine-backpack',
      fabrics: ['waxed', 'olive', 'burgundy', 'mountain']
    }
  ];

  // Process each product type
  for (const config of productConfigs) {
    console.log(`Processing ${config.category} products`);
    
    // Create product images for each fabric
    for (const fabric of config.fabrics) {
      const outputPath = `public/images/products/${config.category}/${config.baseProduct}-${fabric}.jpg`;
      console.log(`Creating ${outputPath}`);
      
      await page.goto(`file://${path.join(__dirname, 'placeholder-images', `${fabric}.html`)}`);
      await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90 });
    }
    
    // Add detail and inside views
    await page.goto(`file://${path.join(__dirname, 'placeholder-images', 'detail.html')}`);
    await page.screenshot({ 
      path: `public/images/products/${config.category}/${config.baseProduct}-detail.jpg`, 
      type: 'jpeg', 
      quality: 90 
    });
    
    await page.goto(`file://${path.join(__dirname, 'placeholder-images', 'inside.html')}`);
    await page.screenshot({ 
      path: `public/images/products/${config.category}/${config.baseProduct}-inside.jpg`, 
      type: 'jpeg', 
      quality: 90 
    });
  }

  await browser.close();
  console.log('All images generated successfully!');
}

convertHtmlToJpeg().catch(console.error); 