// Comprehensive test script for the Supabase Edge Function email sending

// Configuration
const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';

// Test contact email (using contact@vcsews.com domain)
const testContactEmail = {
  emailType: 'contact',
  to: 'vcarring@gmail.com',
  subject: 'TEST - Contact Form Email',
  html: '<h1>Test Contact Email</h1><p>This is a test email from the diagnostic script using the contact domain.</p>',
  text: 'Test Contact Email\nThis is a test email from the diagnostic script using the contact domain.'
};

// Test order email (using orders@vcsews.com domain)
const testOrderEmail = {
  emailType: 'orders',
  to: 'vcarring@gmail.com',
  subject: 'TEST - Order Confirmation Email',
  html: '<h1>Test Order Email</h1><p>This is a test email from the diagnostic script using the orders domain.</p>',
  text: 'Test Order Email\nThis is a test email from the diagnostic script using the orders domain.'
};

// Direct Resend test (to check if API key is working)
const directResendPayload = {
  from: 'contact@vcsews.com',
  to: 'vcarring@gmail.com',
  subject: 'TEST - Direct Resend API Call',
  html: '<h1>Direct Resend Test</h1><p>This is a direct test of the Resend API.</p>',
};

async function sendTestEmail(testData, testName) {
  console.log(`\n--- Running test: ${testName} ---`);
  console.log('Test data:', JSON.stringify(testData, null, 2));

  try {
    console.log('Sending request to Edge Function...');
    
    // Make the request to the Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(testData)
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Get the response body
    const responseText = await response.text();
    
    try {
      // Try to parse as JSON
      const responseJson = JSON.parse(responseText);
      console.log('Response body:', JSON.stringify(responseJson, null, 2));
      return {
        success: response.ok,
        data: responseJson,
        status: response.status
      };
    } catch (e) {
      // If not JSON, just show the text
      console.log('Response body (text):', responseText);
      return {
        success: response.ok,
        data: responseText,
        status: response.status
      };
    }
  } catch (error) {
    console.error('Error making request:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('\n====================================');
  console.log('STARTING COMPREHENSIVE EMAIL TESTS');
  console.log('====================================');
  
  console.log('\nTest configuration:');
  console.log(`- Supabase URL: ${SUPABASE_URL}`);
  console.log(`- Using Anonymous key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);
  
  // Test 1: Contact Email
  const contactResult = await sendTestEmail(testContactEmail, 'Contact Email Domain');
  
  // Test 2: Order Email 
  const orderResult = await sendTestEmail(testOrderEmail, 'Order Email Domain');

  // Summary
  console.log('\n====================================');
  console.log('TEST RESULTS SUMMARY');
  console.log('====================================');
  console.log(`Contact Email Test: ${contactResult.success ? '✅ SUCCESS' : '❌ FAILED'} (Status: ${contactResult.status})`);
  console.log(`Order Email Test: ${orderResult.success ? '✅ SUCCESS' : '❌ FAILED'} (Status: ${orderResult.status})`);
  
  console.log('\n--- TROUBLESHOOTING TIPS ---');
  if (contactResult.success && orderResult.success) {
    console.log('✅ Both tests returned successful responses from the Edge Function.');
    console.log('However, emails are still not being delivered, which suggests:');
    console.log('1. The Resend API key might be incorrect in Supabase secrets');
    console.log('2. The Edge Function might not be properly forwarding to Resend');
    console.log('3. There might be an issue with the verified domains');
    console.log('\nRecommended next steps:');
    console.log('- Check the Supabase logs for the Edge Function in the dashboard');
    console.log('- Verify the RESEND_API_KEY value in Supabase secrets');
    console.log('- Confirm domain verification status in Resend dashboard');
  } else {
    console.log('❌ One or more tests failed at the Edge Function level.');
    console.log('Check the specific error responses above.');
  }
}

runAllTests();
