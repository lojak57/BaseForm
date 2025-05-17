// Test script for the Supabase Edge Function email sending

// Configuration
const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';

// Test data for a contact form email
const testContactEmail = {
  emailType: 'contact',
  to: 'vcarring@gmail.com',
  subject: 'TEST - Contact Form Submission',
  html: '<h1>Test Email</h1><p>This is a test email from the diagnostic script.</p>',
  text: 'Test Email\nThis is a test email from the diagnostic script.'
};

async function testEdgeFunction() {
  console.log('Starting Edge Function test...');
  console.log('Test configuration:');
  console.log(`- Supabase URL: ${SUPABASE_URL}`);
  console.log(`- Using Anonymous key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);
  console.log('- Test data:', JSON.stringify(testContactEmail, null, 2));

  try {
    console.log('\nAttempting to send test email...');
    
    // Make the request to the Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(testContactEmail)
    });

    console.log(`\nResponse status: ${response.status} ${response.statusText}`);
    
    // Get the response body
    const responseText = await response.text();
    
    try {
      // Try to parse as JSON
      const responseJson = JSON.parse(responseText);
      console.log('Response body (JSON):', JSON.stringify(responseJson, null, 2));
    } catch (e) {
      // If not JSON, just show the text
      console.log('Response body (text):', responseText);
    }

    if (response.ok) {
      console.log('\n✅ Test successful! The Edge Function responded with a success status.');
      console.log('Check the email inbox to confirm delivery.');
    } else {
      console.log('\n❌ Test failed! The Edge Function responded with an error status.');
      console.log('Check the error response above for details.');
    }

  } catch (error) {
    console.error('\n❌ Error making request to Edge Function:', error);
  }
}

// Run the test
testEdgeFunction();
