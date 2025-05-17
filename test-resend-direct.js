// Direct test of Resend API to isolate the issue
const https = require('https');

// Use the Resend API key from the Edge Function (the hardcoded fallback value)
const API_KEY = 're_WppnL2k6_HmVY91iFaxqHcruzebZ2frr5';

const data = JSON.stringify({
  from: 'contact@vcsews.com',
  to: 'vcarring@gmail.com',
  subject: 'Test Direct to Resend API',
  html: '<h1>Direct Test</h1><p>This email bypasses the Edge Function and tests the Resend API directly.</p>',
});

const options = {
  hostname: 'api.resend.com',
  port: 443,
  path: '/emails',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
};

console.log('Sending direct request to Resend API...');

const req = https.request(options, (res) => {
  console.log(`Response status code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Response:', JSON.stringify(parsedData, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ Direct API test succeeded! Check if you received the email.');
        console.log('If you did NOT receive the email, this suggests domain verification issues.');
      } else {
        console.log('\n❌ Direct API test failed! See error details above.');
        
        if (parsedData.message && parsedData.message.includes('api_key')) {
          console.log('The API key appears to be invalid or unauthorized.');
          console.log('Check if the key has been rotated or revoked in the Resend dashboard.');
        }
      }
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.write(data);
req.end();
