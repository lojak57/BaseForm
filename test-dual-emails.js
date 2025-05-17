// Test script to verify both customer and shop owner emails are sent correctly
const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';

// Test email addresses - replace with your test email if needed
const YOUR_TEST_EMAIL = 'mitch.mechelay573@gmail.com'; // Your test email
const SHOP_OWNER_EMAIL = 'vcarring@gmail.com'; // Shop owner email

// Generate a random order number for the test
const generateOrderNumber = () => {
  const prefix = 'VC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

async function testDualEmails() {
  console.log('=== TESTING DUAL EMAIL SENDING ===');
  console.log(`Customer email: ${YOUR_TEST_EMAIL}`);
  console.log(`Shop owner email: ${SHOP_OWNER_EMAIL}`);
  
  const orderNumber = generateOrderNumber();
  console.log(`Test order #: ${orderNumber}`);
  
  // Create mock order data
  const orderData = {
    orderNumber,
    customerName: 'Test Customer',
    customerEmail: YOUR_TEST_EMAIL,
    customerPhone: '555-123-4567',
    shippingAddress: {
      street: '123 Test Street',
      apartment: 'Apt 4B',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      country: 'United States'
    },
    orderNotes: 'This is a test order to verify both emails are sent',
    items: [
      {
        name: 'Test Product',
        price: 49.99,
        quantity: 2,
        attributes: { 'Fabric': 'Test Fabric' }
      }
    ],
    subtotal: 99.98,
    shipping: 0,
    total: 99.98
  };
  
  try {
    console.log('\nSending test emails directly through Edge Function...');
    
    // Format HTML for customer email
    const orderItemsHtml = orderData.items.map(item => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    // Format shipping address
    const shippingAddressStr = [
      orderData.shippingAddress.street,
      orderData.shippingAddress.apartment,
      `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}`,
      orderData.shippingAddress.country
    ].filter(Boolean).join('\n');
    
    // Create HTML content for customer email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Thank you for your order with VC Sews!</p>
        <p>Your order #${orderData.orderNumber} has been received and is being processed.</p>
        
        <h2>Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${orderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${orderData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>$${orderData.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <h2>Shipping Address</h2>
        <p style="white-space: pre-line;">${shippingAddressStr}</p>
        
        <div style="margin-top: 30px;">
          <p>If you have any questions about your order, please contact us at ${SHOP_OWNER_EMAIL} or (303) 870-7873.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
          <p>Thank you for shopping with VC Sews!</p>
        </div>
      </div>
    `;
    
    // Prepare email data for customer
    const customerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: orderData.customerEmail,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html: customerHtml,
      text: `Order Confirmation\n\nThank you for your order with VC Sews!\nYour order #${orderData.orderNumber} has been received and is being processed.\n\nTotal: $${orderData.total.toFixed(2)}`
    };
    
    // Send customer email
    console.log(`Sending customer confirmation email to: ${orderData.customerEmail}`);
    const customerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(customerEmailData)
    });
    
    if (customerResponse.ok) {
      const result = await customerResponse.json();
      console.log(`✅ Customer email sent successfully! ID: ${result.data?.id}`);
    } else {
      console.error(`❌ Failed to send customer email: ${customerResponse.status} ${customerResponse.statusText}`);
      const errorText = await customerResponse.text();
      console.error(errorText);
    }
    
    // Create HTML content for shop owner email
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Order Received</h1>
        <p><strong>Order #:</strong> ${orderData.orderNumber}</p>
        
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        
        <h2>Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${orderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${orderData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>$${orderData.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <h2>Shipping Address</h2>
        <p style="white-space: pre-line;">${shippingAddressStr}</p>
        
        ${orderData.orderNotes ? `
          <h2>Order Notes</h2>
          <p>${orderData.orderNotes}</p>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center; color: #d4af37; font-weight: bold;">
          <p>Please process this order at your earliest convenience.</p>
        </div>
      </div>
    `;
    
    // Prepare email data for shop owner
    const ownerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: SHOP_OWNER_EMAIL,
      subject: `New Order - #${orderData.orderNumber}`,
      html: ownerHtml,
      text: `New Order Received\nOrder #${orderData.orderNumber}\n\nCustomer: ${orderData.customerName}\nEmail: ${orderData.customerEmail}\nTotal: $${orderData.total.toFixed(2)}`
    };
    
    // Send shop owner email
    console.log(`\nSending shop owner notification email to: ${SHOP_OWNER_EMAIL}`);
    const ownerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(ownerEmailData)
    });
    
    if (ownerResponse.ok) {
      const result = await ownerResponse.json();
      console.log(`✅ Shop owner notification email sent successfully! ID: ${result.data?.id}`);
    } else {
      console.error(`❌ Failed to send shop owner email: ${ownerResponse.status} ${ownerResponse.statusText}`);
      const errorText = await ownerResponse.text();
      console.error(errorText);
    }
    
    console.log('\n=== TEST COMPLETED ===');
    if (customerResponse.ok && ownerResponse.ok) {
      console.log('✅ Both emails sent successfully!');
      console.log(`\nPlease check both email addresses for the test emails:\n1. Customer email (${YOUR_TEST_EMAIL})\n2. Shop owner email (${SHOP_OWNER_EMAIL})\n`);
    } else {
      console.log('❌ One or more emails failed to send. See errors above.');
    }
    
  } catch (error) {
    console.error('Error in dual email test:', error);
  }
}

testDualEmails();
