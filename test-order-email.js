// Test script for diagnosing order confirmation email issues
const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';

// Mock order data that mimics a completed checkout
const mockOrderData = {
  orderNumber: 'VC123456789',
  customerName: 'Test Customer',
  customerEmail: 'vcarring@gmail.com', // Using the shop owner email for testing
  customerPhone: '555-555-5555',
  shippingAddress: {
    street: '123 Test Street',
    apartment: 'Apt 4',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    country: 'United States'
  },
  orderNotes: 'This is a test order',
  items: [
    {
      name: 'Test Product 1',
      price: 39.99,
      quantity: 2,
      attributes: {
        'Fabric': 'Test Fabric'
      },
      imageUrl: 'https://example.com/image.jpg'
    },
    {
      name: 'Test Product 2',
      price: 19.99,
      quantity: 1,
      attributes: {
        'Fabric': 'Another Test Fabric'
      },
      imageUrl: 'https://example.com/image2.jpg'
    }
  ],
  subtotal: 99.97,
  shipping: 0,
  total: 99.97
};

// Helper function to format order items for HTML display
function formatOrderItemsHtml(items) {
  return items.map(item => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
}

// Format the shipping address
function formatShippingAddress(address) {
  return [
    address.street,
    address.apartment,
    `${address.city}, ${address.state} ${address.zipCode}`,
    address.country
  ].filter(Boolean).join('\n');
}

async function sendTestOrderEmails() {
  console.log('=== ORDER EMAIL TEST ===\n');
  console.log('Preparing to send test order confirmation emails...');
  console.log('Order data:', JSON.stringify(mockOrderData, null, 2));
  
  const { orderNumber, customerName, customerEmail } = mockOrderData;
  
  try {
    // Format the shipping address
    const shippingAddressStr = formatShippingAddress(mockOrderData.shippingAddress);
    
    // Generate HTML for order items
    const orderItemsHtml = formatOrderItemsHtml(mockOrderData.items);
    
    // Create HTML for customer email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Thank you for your order with VC Sews!</p>
        <p>Your order #${orderNumber} has been received and is being processed.</p>
        
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
              <td style="border: 1px solid #ddd; padding: 8px;">$${mockOrderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${mockOrderData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>$${mockOrderData.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <h2>Shipping Address</h2>
        <p style="white-space: pre-line;">${shippingAddressStr}</p>
        
        <div style="margin-top: 30px;">
          <p>If you have any questions about your order, please contact us at vcarring@gmail.com or (303) 870-7873.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
          <p>Thank you for shopping with VC Sews!</p>
        </div>
      </div>
    `;

    // Create plain text email for customer
    const customerText = `
Order Confirmation

Thank you for your order with VC Sews!
Your order #${orderNumber} has been received and is being processed.

Order Summary:
${mockOrderData.items.map(item => `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${mockOrderData.subtotal.toFixed(2)}
Shipping: $${mockOrderData.shipping.toFixed(2)}
Total: $${mockOrderData.total.toFixed(2)}

Shipping Address:
${shippingAddressStr}

If you have any questions about your order, please contact us at vcarring@gmail.com or (303) 870-7873.

Thank you for shopping with VC Sews!
`;
    
    // Prepare data for customer email
    const customerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: customerEmail,
      subject: `Order Confirmation - #${orderNumber}`,
      html: customerHtml,
      text: customerText
    };
    
    console.log('\nSending customer order confirmation email...');
    
    // Send email to customer
    const customerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(customerEmailData)
    });
    
    const customerResponseData = await customerResponse.json();
    console.log(`Customer email response (${customerResponse.status}):`); 
    console.log(JSON.stringify(customerResponseData, null, 2));
    
    if (customerResponse.ok) {
      console.log('✅ Customer email sent successfully!');
    } else {
      console.log('❌ Failed to send customer email!');
    }
    
    // Create HTML for shop owner
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Order Received</h1>
        <p><strong>Order #:</strong> ${orderNumber}</p>
        
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${mockOrderData.customerPhone || 'Not provided'}</p>
        
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
              <td style="border: 1px solid #ddd; padding: 8px;">$${mockOrderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${mockOrderData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>$${mockOrderData.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <h2>Shipping Address</h2>
        <p style="white-space: pre-line;">${shippingAddressStr}</p>
        
        ${mockOrderData.orderNotes ? `
          <h2>Order Notes</h2>
          <p>${mockOrderData.orderNotes}</p>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center; color: #d4af37; font-weight: bold;">
          <p>Please process this order at your earliest convenience.</p>
        </div>
      </div>
    `;

    // Create plain text email for shop owner
    const ownerText = `
New Order Received
Order #${orderNumber}

Customer Information:
Name: ${customerName}
Email: ${customerEmail}
Phone: ${mockOrderData.customerPhone || 'Not provided'}

Order Summary:
${mockOrderData.items.map(item => `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${mockOrderData.subtotal.toFixed(2)}
Shipping: $${mockOrderData.shipping.toFixed(2)}
Total: $${mockOrderData.total.toFixed(2)}

Shipping Address:
${shippingAddressStr}

${mockOrderData.orderNotes ? `Order Notes:\n${mockOrderData.orderNotes}\n\n` : ''}Please process this order at your earliest convenience.
`;
    
    // Prepare data for shop owner email
    const ownerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: 'vcarring@gmail.com', // Shop owner email
      subject: `New Order - #${orderNumber}`,
      html: ownerHtml,
      text: ownerText
    };
    
    console.log('\nSending shop owner notification email...');
    
    // Send notification to shop owner
    const ownerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(ownerEmailData)
    });
    
    const ownerResponseData = await ownerResponse.json();
    console.log(`Shop owner email response (${ownerResponse.status}):`);
    console.log(JSON.stringify(ownerResponseData, null, 2));
    
    if (ownerResponse.ok) {
      console.log('✅ Shop owner notification email sent successfully!');
    } else {
      console.log('❌ Failed to send shop owner notification email!');
    }
    
    console.log('\n=== TEST COMPLETED ===');
    if (customerResponse.ok && ownerResponse.ok) {
      console.log('✅ All test emails sent successfully!\n');
      console.log('Next steps:');
      console.log('1. Check if you received both emails at vcarring@gmail.com');
      console.log('2. Verify that the emails are properly formatted and contain all the expected information');
      console.log('3. Check the Resend dashboard to confirm the emails were delivered successfully');
    } else {
      console.log('❌ One or more test emails failed to send.\n');
      console.log('Please check the error responses above for details on why the emails failed to send.');
    }
  } catch (error) {
    console.error('Error in sending test emails:', error);
  }
}

// Run the test
sendTestOrderEmails();
