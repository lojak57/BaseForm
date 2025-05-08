import fs from 'fs';
import path from 'path';

// Define the colors we'll use
const colors = {
  natural: { bg: '#e9e7df', text: '#8b7355', name: 'Natural Canvas' },
  navy: { bg: '#1d3557', text: '#e9e7df', name: 'Navy Canvas' },
  rustic: { bg: '#8a6645', text: '#e9e7df', name: 'Rustic Leather' },
  floral: { bg: '#e76f51', text: '#e9e7df', name: 'Floral Pattern' },
  denim: { bg: '#375c8b', text: '#e9e7df', name: 'Denim' },
  sage: { bg: '#677e6a', text: '#e9e7df', name: 'Sage Waxed Canvas' },
  stripe: { bg: '#dda15e', text: '#e9e7df', name: 'Mountain Stripe' },
  black: { bg: '#1a1a1a', text: '#e9e7df', name: 'Black Velvet' },
  silver: { bg: '#c0c0c0', text: '#1a1a1a', name: 'Silver Metallic' },
  embroidered: { bg: '#ffd6ba', text: '#1a1a1a', name: 'Embroidered Floral' },
  waxed: { bg: '#704214', text: '#e9e7df', name: 'Brown Waxed Canvas' },
  olive: { bg: '#606c38', text: '#e9e7df', name: 'Olive Canvas' },
  burgundy: { bg: '#a62539', text: '#e9e7df', name: 'Burgundy Canvas' },
  mountain: { bg: '#53687e', text: '#e9e7df', name: 'Mountain Print' }
};

// Create HTML files for each color that contain a div with the background color
// and text in the center with the name of the color
function generateHtmlFiles() {
  if (!fs.existsSync('placeholder-images')) {
    fs.mkdirSync('placeholder-images');
  }

  // Create a basic HTML file for each color variant
  Object.entries(colors).forEach(([key, color]) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${color.bg};
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
            padding: 20px;
            border: 10px solid rgba(0,0,0,0.1);
            width: 760px;
            height: 560px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          h1 {
            color: ${color.text};
            font-size: 48px;
            margin-bottom: 20px;
          }
          p {
            color: ${color.text};
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${color.name}</h1>
          <p>Handcrafted in Colorado</p>
        </div>
      </body>
      </html>
    `;

    fs.writeFileSync(`placeholder-images/${key}.html`, html);
    console.log(`Created placeholder-images/${key}.html`);
  });

  // Also create some special variants
  const detail = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f1ed;
          font-family: Arial, sans-serif;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 10px solid rgba(0,0,0,0.1);
          width: 760px;
          height: 560px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        h1 {
          color: #1a1a1a;
          font-size: 48px;
          margin-bottom: 20px;
        }
        p {
          color: #1a1a1a;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Detail View</h1>
        <p>Close-up of craftsmanship</p>
      </div>
    </body>
    </html>
  `;

  const inside = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f1ed;
          font-family: Arial, sans-serif;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 10px solid rgba(0,0,0,0.1);
          width: 760px;
          height: 560px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        h1 {
          color: #1a1a1a;
          font-size: 48px;
          margin-bottom: 20px;
        }
        p {
          color: #1a1a1a;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Inside View</h1>
        <p>Functional interior pockets</p>
      </div>
    </body>
    </html>
  `;

  const placeholder = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e9e7df;
          font-family: Arial, sans-serif;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 10px solid rgba(0,0,0,0.1);
          width: 760px;
          height: 560px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        h1 {
          color: #8b7355;
          font-size: 48px;
          margin-bottom: 20px;
        }
        p {
          color: #8b7355;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Handcrafted Bag</h1>
        <p>Made with care in Colorado</p>
      </div>
    </body>
    </html>
  `;

  fs.writeFileSync('placeholder-images/detail.html', detail);
  fs.writeFileSync('placeholder-images/inside.html', inside);
  fs.writeFileSync('placeholder-images/placeholder.html', placeholder);

  console.log('Created placeholder-images/detail.html');
  console.log('Created placeholder-images/inside.html');
  console.log('Created placeholder-images/placeholder.html');

  console.log('\nAll HTML files generated successfully.');
  console.log('To convert them to images, open each file in a browser and take a screenshot,');
  console.log('or use a tool like "wkhtmltoimage" to batch convert them.');
}

generateHtmlFiles(); 