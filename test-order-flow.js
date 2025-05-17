// This script simulates a complete order flow to test the email confirmation functionality

const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';
const SHOP_OWNER_EMAIL = 'vcarring@gmail.com';

// Step 1: Create a mock session ID to simulate a completed order
async function simulateCompleteOrderFlow() {
  console.log('=== SIMULATING COMPLETE ORDER FLOW ===');
  
  // Generate a random session ID
  const mockSessionId = `mock_session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  console.log(`Generated mock session ID: ${mockSessionId}`);
  
  // Step 2: Create a mock purchase record in the database
  try {
    console.log('\nCreating mock purchase record...');
    const { data: purchaseRecord, error: purchaseError } = await fetch(`${SUPABASE_URL}/rest/v1/purchase_records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        session_id: mockSessionId,
        status: 'completed',
        processed_at: new Date().toISOString(),
        tenant_id: 'vcsews'
      })
    }).then(res => res.json());
    
    if (purchaseError) {
      console.error('Error creating mock purchase record:', purchaseError);
    } else {
      console.log('Mock purchase record created successfully');
    }
  } catch (error) {
    console.error('Failed to create mock purchase record:', error);
  }
  
  // Step 3: Store mock customer data in localStorage
  const mockCustomerData = {
    customerName: 'Test Customer',
    customerEmail: SHOP_OWNER_EMAIL, // Use shop owner email for testing
    customerPhone: '555-123-4567',
    streetAddress: '123 Test Street',
    apartment: 'Apt 4B',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    country: 'United States',
    orderNotes: 'This is a test order from the simulation script'
  };
  
  console.log('\nMock customer data:', mockCustomerData);
  
  // Step 4: Simulate a request to the ThankYou page with the session ID
  console.log('\nSimulating request to ThankYou page with session ID...');
  console.log(`IMPORTANT: The next step requires manual testing:\n\n1. Open this URL in your browser:\n   http://localhost:5173/thanks?session_id=${mockSessionId}&payment_complete=true\n\n2. The ThankYou page will process this simulated order\n\n3. Check the browser console for detailed logs\n\n4. Verify that order confirmation emails are sent to ${SHOP_OWNER_EMAIL}\n`);
}

simulateCompleteOrderFlow();
