import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as mkdirp from 'mkdirp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories if they don't exist
const createDirectories = async () => {
  const dirs = [
    'public/images/products/crossbody',
    'public/images/products/tote',
    'public/images/products/clutch',
    'public/images/products/backpack',
    'public/images/swatches',
    'public/images/categories'
  ];
  
  for (const dir of dirs) {
    await mkdirp.mkdirp(dir);
    console.log(`Created directory: ${dir}`);
  }
};

// Download an image from URL
const downloadImage = (url, destination) => {
  return new Promise((resolve, reject) => {
    // Check if file already exists
    if (fs.existsSync(destination)) {
      console.log(`File already exists: ${destination}`);
      return resolve();
    }
    
    const file = fs.createWriteStream(destination);
    
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
      
      file.on('error', err => {
        fs.unlink(destination, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(destination, () => {}); // Delete the file on error
      reject(err);
    });
  });
};

// Image URLs from Unsplash (free to use under Unsplash license)
const images = {
  // Crossbody images
  crossbody: {
    // Product images for Mountain Trail Crossbody
    'mountain-trail-natural': 'https://images.unsplash.com/photo-1590739225287-bb30cf1f180d',
    'mountain-trail-navy': 'https://images.unsplash.com/photo-1604201050024-d2b6656fd2b9',
    'mountain-trail-rustic': 'https://images.unsplash.com/photo-1534361960057-19889db9621e',
    'mountain-trail-floral': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
    'mountain-trail-detail': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    'mountain-trail-inside': 'https://images.unsplash.com/photo-1628149455678-16f4a3057bd7'
  },
  
  // Tote images
  tote: {
    // Product images for Aspen Market Tote
    'aspen-tote-natural': 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5',
    'aspen-tote-denim': 'https://images.unsplash.com/photo-1560910615-5f4644521a3c',
    'aspen-tote-sage': 'https://images.unsplash.com/photo-1576285413883-a47500a7b590',
    'aspen-tote-stripe': 'https://images.unsplash.com/photo-1582738412787-2f56fe685087',
    'aspen-tote-detail': 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d',
    'aspen-tote-inside': 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa'
  },
  
  // Clutch images
  clutch: {
    // Product images for Evening Star Clutch
    'evening-star-black': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    'evening-star-navy': 'https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3',
    'evening-star-silver': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
    'evening-star-embroidered': 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa',
    'evening-star-detail': 'https://images.unsplash.com/photo-1561526116-acada3bfb2a8',
    'evening-star-inside': 'https://images.unsplash.com/photo-1544816155-12df9643f363'
  },
  
  // Backpack images
  backpack: {
    // Product images for Alpine Mini Backpack
    'alpine-backpack-waxed': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    'alpine-backpack-olive': 'https://images.unsplash.com/photo-1622560480605-d83cB38e067b',
    'alpine-backpack-burgundy': 'https://images.unsplash.com/photo-1502471602546-17554aac1160',
    'alpine-backpack-mountain': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6',
    'alpine-backpack-detail': 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa',
    'alpine-backpack-inside': 'https://images.unsplash.com/photo-1547949003-9792a18a2601'
  },
  
  // Swatches
  swatches: {
    'natural': 'https://images.unsplash.com/photo-1583318432730-a19c89692fda',
    'navy': 'https://images.unsplash.com/photo-1579726670135-2083cbaf956d',
    'rustic-leather': 'https://images.unsplash.com/photo-1553067195-efe3a1d0031d',
    'floral': 'https://images.unsplash.com/photo-1448375240586-882707db888b',
    'denim': 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e',
    'sage': 'https://images.unsplash.com/photo-1558618666-fcd25c3cd8f7',
    'stripe': 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f',
    'black-velvet': 'https://images.unsplash.com/photo-1548207800-8c16d038296f',
    'navy-satin': 'https://images.unsplash.com/photo-1579726670135-2083cbaf956d',
    'silver': 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19',
    'embroidered': 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95',
    'waxed': 'https://images.unsplash.com/photo-1553066195-efe3a1d0031d',
    'olive': 'https://images.unsplash.com/photo-1539805412841-998f6aec2b20',
    'burgundy': 'https://images.unsplash.com/photo-1558618666-fcd25c3cd8f7',
    'mountain': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'
  }
};

// Category images
const categoryImages = {
  'crossbody': 'https://images.unsplash.com/photo-1590739225287-bb30cf1f180d',
  'tote': 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5',
  'clutch': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
};

const downloadAllImages = async () => {
  try {
    await createDirectories();
    
    // Download product images
    for (const [category, categoryImages] of Object.entries(images)) {
      if (category === 'swatches') continue; // Handle swatches separately
      
      for (const [imageName, imageUrl] of Object.entries(categoryImages)) {
        const destination = path.join('public/images/products', category, `${imageName}.jpg`);
        await downloadImage(imageUrl, destination);
      }
    }
    
    // Download swatch images
    for (const [swatchName, imageUrl] of Object.entries(images.swatches)) {
      const destination = path.join('public/images/swatches', `${swatchName}.jpg`);
      await downloadImage(imageUrl, destination);
    }
    
    // Download category images
    for (const [category, imageUrl] of Object.entries(categoryImages)) {
      const destination = path.join('public/images/categories', `${category}.jpg`);
      await downloadImage(imageUrl, destination);
    }
    
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

// Run the script
downloadAllImages(); 