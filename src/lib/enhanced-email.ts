import { supabase } from '@/integrations/supabase/client';

// Shop owner email for receiving notifications
const SHOP_EMAIL = 'vcarring@gmail.com';
export const SHOP_PHONE = '(303) 870-7873';

// Supabase URL for Edge Function
const SUPABASE_URL = 'https://mpltvzpsgijpjcdacicp.supabase.co';

// Supabase anon key - this is public, so it's okay to include it here
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbHR2enBzZ2lqcGpjZGFjaWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTkzMDcsImV4cCI6MjA2MjI5NTMwN30.x3TPJhG33AJz5y621daKZi98oJMOEJ0oVVAuXNyQvaQ';

// Types
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNotes?: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    attributes?: Record<string, string>;
    imageUrl?: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Sends a contact form submission email to the shop owner
 */
export const sendContactFormEmail = async (data: ContactFormData) => {
  console.log('Sending contact form email with data:', data);
  
  // Create a simple HTML email
  const html = `
    <h1>New Contact Form Submission</h1>
    <p><strong>From:</strong> ${data.name} (${data.email})</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <h2>Message:</h2>
    <p>${data.message.replace(/\n/g, '<br/>')}</p>
  `;
  
  // Create plain text version
  const text = `
New Contact Form Submission

From: ${data.name} (${data.email})
Phone: ${data.phone || 'Not provided'}

Message:
${data.message}
`;
  
  // Prepare data for simplified Edge Function
  const emailData = {
    emailType: 'contact',  // This will use contact@vcsews.com as the from address
    to: SHOP_EMAIL, // Send to shop owner
    subject: 'New Contact Form Submission',
    html,
    text
  };

  try {
    // Use the hardcoded anon key directly instead of relying on the session
    // This ensures we always have a valid token for the Edge Function call
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Contact form email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};

/**
 * Sends order confirmation emails to both the customer and the shop owner
 */
export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  console.log('Sending order confirmation email with data:', data);
  
  // Format shipping address for display
  const shippingAddressStr = [
    data.shippingAddress.street,
    data.shippingAddress.apartment,
    `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}`,
    data.shippingAddress.country
  ].filter(Boolean).join('\n');
  
  // Generate HTML for the order items - Standard version for customer email
  const customerOrderItemsHtml = data.items.map(item => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  // Generate enhanced HTML for the order items - Detailed version for shop owner with fabric info
  const ownerOrderItemsHtml = data.items.map(item => {
    // Format attributes as a list if they exist
    const attributesList = item.attributes ? 
      Object.entries(item.attributes)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('') : '';
    
    // Include image if available
    const imageSection = item.imageUrl ? 
      `<div style="margin-top: 8px;"><img src="${item.imageUrl}" alt="${item.name}" style="max-width: 120px; max-height: 120px; border: 1px solid #eee;"/></div>` : '';
    
    return `
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">
        <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
        ${attributesList ? 
          `<ul style="margin: 5px 0; padding-left: 20px; font-size: 14px;">${attributesList}</ul>` : ''}
        ${imageSection}
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `}).join('');

  // Create HTML email for customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Order Confirmation</h1>
      <p>Thank you for your order with VC Sews!</p>
      <p>Your order #${data.orderNumber} has been received and is being processed.</p>
      
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
          ${customerOrderItemsHtml}
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">$${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">$${data.shipping.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>$${data.total.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <h2>Shipping Address</h2>
      <p style="white-space: pre-line;">${shippingAddressStr}</p>
      
      ${data.orderNotes ? `
        <h2>Order Notes</h2>
        <p>${data.orderNotes}</p>
      ` : ''}
      
      <div style="margin-top: 30px; text-align: center;">
        <p>If you have any questions about your order, please contact us at ${SHOP_EMAIL} or ${SHOP_PHONE}.</p>
      </div>
      
      <div style="margin-top: 20px; text-align: center; color: #d4af37;">
        <p>Thank you for shopping with VC Sews!</p>
      </div>
    </div>
  `;

  // Create plain text email for customer
  const customerText = `
Order Confirmation

Thank you for your order with VC Sews!
Your order #${data.orderNumber} has been received and is being processed.

Order Summary:
${data.items.map(item => `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Shipping: $${data.shipping.toFixed(2)}
Total: $${data.total.toFixed(2)}

Shipping Address:
${shippingAddressStr}

If you have any questions about your order, please contact us at ${SHOP_EMAIL} or ${SHOP_PHONE}.

Thank you for shopping with VC Sews!
`;

  // Create enhanced HTML email for shop owner with detailed product information
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; background-color: #f8f4e5; padding: 15px; text-align: center; border-bottom: 3px solid #d4af37;">
        New Order Received
      </h1>
      <p style="font-size: 18px; text-align: center;"><strong>Order #:</strong> ${data.orderNumber}</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 3px solid #d4af37;">
        <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Phone:</strong> ${data.customerPhone || 'Not provided'}</p>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #d4af37; color: #333;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item Details</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Price</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Qty</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${ownerOrderItemsHtml}
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="border: 1px solid #ddd; padding: 10px;">$${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
            <td style="border: 1px solid #ddd; padding: 10px;">$${data.shipping.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="border: 1px solid #ddd; padding: 10px;"><strong>$${data.total.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 3px solid #d4af37;">
        <h2 style="color: #333; margin-top: 0;">Shipping Address</h2>
        <p style="white-space: pre-line;">${shippingAddressStr}</p>
      </div>
      
      ${data.orderNotes ? `
        <div style="background-color: #fff4e0; padding: 15px; margin: 20px 0; border: 1px dashed #d4af37;">
          <h2 style="color: #333; margin-top: 0;">Order Notes</h2>
          <p>${data.orderNotes}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; text-align: center; background-color: #f8f4e5; padding: 15px; border-top: 3px solid #d4af37;">
        <p style="font-weight: bold; color: #333;">This order has been automatically recorded in your orders database.</p>
        <p style="color: #333;">Please process this order at your earliest convenience.</p>
      </div>
    </div>
  `;

  // Create enhanced plain text email for shop owner with detailed product information
  const ownerText = `
NEW ORDER RECEIVED
Order #${data.orderNumber}

--- CUSTOMER INFORMATION ---
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone || 'Not provided'}

--- DETAILED ORDER SUMMARY ---
${data.items.map(item => {
  // Format attributes in a readable way
  const attributes = item.attributes ? 
    Object.entries(item.attributes)
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join('\n') : 'No special attributes';

  return `PRODUCT: ${item.name}
PRICE: $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
DETAILS:\n${attributes}\n`;
}).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Shipping: $${data.shipping.toFixed(2)}
Total: $${data.total.toFixed(2)}

--- SHIPPING ADDRESS ---
${shippingAddressStr}

${data.orderNotes ? `--- ORDER NOTES ---\n${data.orderNotes}\n\n` : ''}This order has been automatically recorded in your orders database.
Please process this order at your earliest convenience.
`;

  try {
    // Using the hardcoded anon key for authentication
    // Prepare data for customer email
    const customerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: data.customerEmail,
      subject: `Order Confirmation - #${data.orderNumber}`,
      html: customerHtml,
      text: customerText
    };
    
    console.log('Sending customer order confirmation email...');
    
    // Send email to customer
    const customerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(customerEmailData)
    });
    
    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error('Error sending customer email:', errorText);
      throw new Error(`Error: ${customerResponse.status} ${customerResponse.statusText}`);
    }
    
    console.log('Customer email sent successfully!');
    
    // Prepare data for shop owner email
    const ownerEmailData = {
      emailType: 'orders',  // This will use orders@vcsews.com as the from address
      to: SHOP_EMAIL,
      subject: `New Order - #${data.orderNumber} - ${data.customerName}`,
      html: ownerHtml,
      text: ownerText
    };
    
    // Send notification to shop owner
    console.log('Sending shop owner notification email...');
    
    const ownerResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(ownerEmailData)
    });
    
    if (!ownerResponse.ok) {
      const errorText = await ownerResponse.text();
      console.error('Error sending shop owner email:', errorText);
      console.warn('Customer email was sent but shop owner notification failed');
      throw new Error(`Error: ${ownerResponse.status} ${ownerResponse.statusText}`);
    }
    
    console.log('Shop owner notification email sent successfully!');
    console.log('All order emails sent successfully!');
    
    return { success: true, message: 'Order confirmation emails sent successfully' };
  } catch (error) {
    console.error('Failed to send order emails:', error);
    throw error;
  }
};

// Helper function to generate random order number
export const generateOrderNumber = (): string => {
  const prefix = 'VC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};
