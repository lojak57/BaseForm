import { supabase } from '@/integrations/supabase/client';

// Shop owner email for receiving notifications
const SHOP_EMAIL = 'vcarring@gmail.com';
export const SHOP_PHONE = '(303) 870-7873';

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

// HTML templates
const customerOrderTemplate = (data: OrderEmailData): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order Confirmation - VC Sews</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; padding: 20px 0; }
      .logo { max-width: 150px; }
      h1 { color: #1f1e1d; margin-top: 30px; }
      .order-info { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
      .order-details { margin-top: 30px; }
      table { width: 100%; border-collapse: collapse; }
      th { background-color: #f2f2f2; text-align: left; padding: 10px; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      .total-row td { font-weight: bold; border-top: 2px solid #ddd; border-bottom: none; }
      .footer { margin-top: 40px; text-align: center; color: #777; font-size: 14px; padding-top: 20px; border-top: 1px solid #eee; }
      .accent { color: #d4af37; }
      .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://your-logo-url.com" alt="VC Sews" class="logo">
        <h1>Thank You For Your Order!</h1>
        <p>We've received your order and will begin processing it right away.</p>
      </div>
      
      <div class="order-info">
        <h2>Order Summary</h2>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="order-details">
        <h3>Items Ordered</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 60px;"></th>
              <th>Item</th>
              <th>Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>
                  ${item.imageUrl ? `<img src="${item.imageUrl}" class="item-image" alt="${item.name}">` : ''}
                </td>
                <td>
                  <strong>${item.name}</strong>
                  ${item.attributes ? `
                    <br>
                    <small>${Object.entries(item.attributes).map(([key, value]) => 
                      `${key}: ${value}`
                    ).join(', ')}</small>
                  ` : ''}
                </td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align: right;">Subtotal:</td>
              <td style="text-align: right;">$${data.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">Shipping:</td>
              <td style="text-align: right;">${data.shipping > 0 ? `$${data.shipping.toFixed(2)}` : 'Free'}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total:</td>
              <td style="text-align: right;">$${data.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="shipping-info">
        <h3>Shipping Information</h3>
        <p>
          <strong>${data.customerName}</strong><br>
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.apartment ? data.shippingAddress.apartment + '<br>' : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
      
      ${data.orderNotes ? `
        <div class="notes">
          <h3>Order Notes</h3>
          <p>${data.orderNotes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>If you have any questions about your order, please contact us at:</p>
        <p>Email: <a href="mailto:${SHOP_EMAIL}">${SHOP_EMAIL}</a></p>
        <p>Phone: ${SHOP_PHONE}</p>
        <p>Thank you for shopping with <span class="accent">VC Sews</span>!</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const shopOwnerOrderTemplate = (data: OrderEmailData): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Order Notification - VC Sews</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #d4af37; color: #fff; padding: 20px; text-align: center; }
      h1 { margin-top: 0; }
      .customer-info, .order-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .order-details { margin-top: 30px; }
      table { width: 100%; border-collapse: collapse; }
      th { background-color: #f2f2f2; text-align: left; padding: 10px; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      .total-row td { font-weight: bold; border-top: 2px solid #ddd; border-bottom: none; }
      .important { color: #d4af37; font-weight: bold; }
      .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Order Received!</h1>
        <p>Order Number: ${data.orderNumber}</p>
      </div>
      
      <div class="customer-info">
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
        <p><strong>Phone:</strong> ${data.customerPhone || 'Not provided'}</p>
      </div>
      
      <div class="shipping-info">
        <h2>Shipping Address</h2>
        <p>
          ${data.customerName}<br>
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.apartment ? data.shippingAddress.apartment + '<br>' : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 60px;"></th>
              <th>Item</th>
              <th>Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>
                  ${item.imageUrl ? `<img src="${item.imageUrl}" class="item-image" alt="${item.name}">` : ''}
                </td>
                <td>
                  <strong>${item.name}</strong>
                  ${item.attributes ? `
                    <br>
                    <small>${Object.entries(item.attributes).map(([key, value]) => 
                      `${key}: ${value}`
                    ).join(', ')}</small>
                  ` : ''}
                </td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align: right;">Subtotal:</td>
              <td style="text-align: right;">$${data.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">Shipping:</td>
              <td style="text-align: right;">${data.shipping > 0 ? `$${data.shipping.toFixed(2)}` : 'Free'}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total:</td>
              <td style="text-align: right;">$${data.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      ${data.orderNotes ? `
        <div class="notes">
          <h2>Order Notes</h2>
          <p>${data.orderNotes}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; text-align: center;">
        <p class="important">Please process this order at your earliest convenience.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const contactFormTemplate = (data: ContactFormData): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Contact Form Submission - VC Sews</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #d4af37; color: #fff; padding: 20px; text-align: center; }
      h1 { margin-top: 0; }
      .message-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .message-content { white-space: pre-wrap; background-color: #f2f2f2; padding: 15px; border-radius: 5px; }
      .footer { margin-top: 20px; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      
      <div class="message-info">
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      </div>
      
      <div class="message-info">
        <h2>Message</h2>
        <div class="message-content">${data.message}</div>
      </div>
      
      <div class="footer">
        <p>This message was sent from the contact form on your website.</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Email sending functions
export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  try {
    console.log('=== PREPARING TO SEND ORDER EMAILS ===');
    console.log('Customer data:', { 
      name: data.customerName, 
      email: data.customerEmail,
      items: data.items.length,
      total: data.total
    });
    
    // Prepare data for the Edge Function
    const emailData = {
      emailType: 'both', // 'both' to send emails to both customer and shop owner
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      orderItems: data.items,
      orderTotal: data.total,
      orderDate: new Date().toISOString(),
      shippingAddress: data.shippingAddress,
      orderNotes: data.orderNotes,
      orderNumber: data.orderNumber
    };
    
    console.log('Calling Edge Function with data structure:', Object.keys(emailData));
    
    // Call the Supabase Edge Function
    console.log('Invoking send-emails Edge Function...');
    const { data: response, error } = await supabase.functions.invoke('send-emails', {
      body: emailData
    });

    console.log('Edge Function response:', response);
    
    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message);
    }
    
    console.log('Order emails sent successfully!');
    return response;
  } catch (error) {
    console.error('Failed to send order emails:', error);
    throw error;
  }
};

export const sendContactFormEmail = async (data: ContactFormData) => {
  try {
    console.log('=== PREPARING TO SEND CONTACT FORM EMAILS ===');
    console.log('Contact form data:', { 
      name: data.name, 
      email: data.email
    });
    
    // Prepare data for the Edge Function
    const emailData = {
      emailType: 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: data.message
    };
    
    console.log('Calling Edge Function with data structure:', Object.keys(emailData));
    
    // Call the Supabase Edge Function
    console.log('Invoking send-emails Edge Function...');
    const { data: response, error } = await supabase.functions.invoke('send-emails', {
      body: emailData
    });

    console.log('Edge Function response:', response);
    
    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message);
    }
    
    console.log('Contact form emails sent successfully!');
    return response;
  } catch (error) {
    console.error('Failed to send contact form email:', error);
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
