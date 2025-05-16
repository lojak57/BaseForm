import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend';

// Create Resend client with API key (this will be server-side only, not exposed to client)
const API_KEY = 're_WppnL2k6_HmVY91iFaxqHcruzebZ2frr5';
const resend = new Resend(API_KEY);

// Configure email addresses
const SHOP_OWNER_EMAIL = 'vcarring@gmail.com';
const ORDER_EMAIL = 'orders@vcsews.com';
const CONTACT_EMAIL = 'contact@vcsews.com';

// Log that we're using this API key (for debugging)
console.log(`Using Resend with API key: ${API_KEY.substring(0, 5)}...`);

// Dev mode to just log emails instead of sending them
const DEV_MODE = false;

// Utility function to handle CORS preflight checks
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Types for order data
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  fabricChoice?: string;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  orderItems: OrderItem[];
  orderTotal: number;
  shippingAddress: string;
  orderNotes?: string;
  orderNumber: string;
}

// Types for contact form data
interface ContactData {
  name: string;
  email: string;
  message: string;
}

// Function to send order confirmation email to customer
async function sendOrderConfirmationToCustomer(data: OrderData): Promise<any> {
  console.log('Sending order confirmation to customer:', data.customerEmail);
  
  // Generate order item HTML
  let orderItemsHtml = '';
  data.orderItems.forEach(item => {
    const fabricInfo = item.fabricChoice ? `<p style="margin: 0; color: #666;">Fabric: ${item.fabricChoice}</p>` : '';
    orderItemsHtml += `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <p style="margin: 0; font-weight: bold;">${item.name}</p>
          ${fabricInfo}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `;
  });

  const totalAmount = `$${data.orderTotal.toFixed(2)}`;

  if (DEV_MODE) {
    console.log('Would send customer order confirmation email with:', { data, orderItemsHtml, totalAmount });
    return { id: 'dev-mode-no-send' };
  }

  return await resend.emails.send({
    from: ORDER_EMAIL,
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderNumber} - VC Sews`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - VC Sews</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #606c38;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .order-details {
              margin-top: 20px;
              background-color: white;
              padding: 20px;
              border-radius: 5px;
            }
            .order-table {
              width: 100%;
              border-collapse: collapse;
            }
            .order-table th {
              text-align: left;
              padding: 10px 0;
              border-bottom: 2px solid #ddd;
            }
            .order-total {
              margin-top: 20px;
              text-align: right;
              font-weight: bold;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #777;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You For Your Order!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for your order with VC Sews. We've received your order and will begin processing it right away.</p>
              
              <div class="order-details">
                <h2>Order #${data.orderNumber}</h2>
                
                <table class="order-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style="text-align: center;">Quantity</th>
                      <th style="text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHtml}
                  </tbody>
                </table>
                
                <div class="order-total">
                  <p>Total: ${totalAmount}</p>
                </div>
              </div>
              
              <div class="shipping-info">
                <h3>Shipping Address:</h3>
                <p>${data.shippingAddress.replace(/\n/g, '<br>')}</p>
              </div>
              
              ${data.orderNotes ? `
              <div class="notes">
                <h3>Order Notes:</h3>
                <p>${data.orderNotes}</p>
              </div>
              ` : ''}
              
              <p>If you have any questions about your order, please contact us at ${SHOP_OWNER_EMAIL}.</p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} VC Sews. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  });
}

// Function to send order notification to shop owner
async function sendOrderNotificationToOwner(data: OrderData): Promise<any> {
  console.log('Sending order notification to shop owner:', SHOP_OWNER_EMAIL);
  
  // Generate order item HTML
  let orderItemsList = '';
  data.orderItems.forEach(item => {
    const fabricInfo = item.fabricChoice ? `Fabric: ${item.fabricChoice}` : 'No fabric selected';
    orderItemsList += `
      <li>${item.name} - $${item.price.toFixed(2)} x ${item.quantity} (${fabricInfo})</li>
    `;
  });

  if (DEV_MODE) {
    console.log('Would send shop owner order notification with:', { data, orderItemsList });
    return { id: 'dev-mode-no-send' };
  }

  return await resend.emails.send({
    from: ORDER_EMAIL,
    to: SHOP_OWNER_EMAIL,
    subject: `New Order #${data.orderNumber} - VC Sews`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order - VC Sews</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Order from ${data.customerName}</h1>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Customer Name:</strong> ${data.customerName}</p>
            <p><strong>Customer Email:</strong> ${data.customerEmail}</p>
            <p><strong>Total Amount:</strong> $${data.orderTotal.toFixed(2)}</p>
            
            <h2>Items Ordered:</h2>
            <ul>
              ${orderItemsList}
            </ul>
            
            <h2>Shipping Address:</h2>
            <p>${data.shippingAddress.replace(/\n/g, '<br>')}</p>
            
            ${data.orderNotes ? `
            <h2>Order Notes:</h2>
            <p>${data.orderNotes}</p>
            ` : ''}
          </div>
        </body>
      </html>
    `
  });
}

// Function to send contact form submission to shop owner
async function sendContactEmailToOwner(data: ContactData): Promise<any> {
  console.log('Sending contact form submission to shop owner:', SHOP_OWNER_EMAIL);
  
  if (DEV_MODE) {
    console.log('Would send contact form notification with:', data);
    return { id: 'dev-mode-no-send' };
  }

  return await resend.emails.send({
    from: CONTACT_EMAIL,
    to: SHOP_OWNER_EMAIL,
    subject: `New Contact Form Submission - VC Sews`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .message-content {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Contact Form Submission</h1>
            
            <h2>Contact Information:</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            
            <h2>Message:</h2>
            <div class="message-content">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
            
            <p>This message was sent from the contact form on your website.</p>
          </div>
        </body>
      </html>
    `
  });
}

// Function to send confirmation to contact form submitter
async function sendContactConfirmationToCustomer(data: ContactData): Promise<any> {
  console.log('Sending contact form confirmation to customer:', data.email);
  
  if (DEV_MODE) {
    console.log('Would send contact confirmation with:', data);
    return { id: 'dev-mode-no-send' };
  }

  return await resend.emails.send({
    from: CONTACT_EMAIL,
    to: data.email,
    subject: `Thank You for Contacting VC Sews`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Confirmation</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #606c38;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #777;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>Thank you for reaching out to VC Sews. We've received your message and will respond as soon as possible.</p>
              
              <p>For your reference, here is a copy of your message:</p>
              <div style="background-color: #efefef; padding: 15px; border-radius: 5px;">
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p>If you have any further questions, please don't hesitate to contact us again.</p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} VC Sews. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  });
}

// Main function to process order emails
async function sendOrderEmails(data: OrderData) {
  console.log('Processing order emails for order number:', data.orderNumber);
  try {
    const customerEmailResult = await sendOrderConfirmationToCustomer(data);
    const ownerEmailResult = await sendOrderNotificationToOwner(data);
    
    console.log('Order emails sent successfully:', { 
      customerEmail: customerEmailResult?.id, 
      ownerEmail: ownerEmailResult?.id 
    });
    
    return { 
      success: true, 
      customerEmail: customerEmailResult?.id, 
      ownerEmail: ownerEmailResult?.id 
    };
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw error;
  }
}

// Main function to process contact form emails
async function sendContactEmails(data: ContactData) {
  console.log('Processing contact form emails from:', data.email);
  try {
    const ownerEmailResult = await sendContactEmailToOwner(data);
    const customerEmailResult = await sendContactConfirmationToCustomer(data);
    
    console.log('Contact emails sent successfully:', { 
      ownerEmail: ownerEmailResult?.id, 
      customerEmail: customerEmailResult?.id 
    });
    
    return { 
      success: true, 
      ownerEmail: ownerEmailResult?.id, 
      customerEmail: customerEmailResult?.id 
    };
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw error;
  }
}

// Main server handler
serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log the request for debugging
    console.log(`Received ${req.method} request to /send-emails`);
    
    // Parse the request body
    const requestData = await req.json();
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    const { emailType } = requestData;
    let result;
    
    // Process based on email type
    switch (emailType) {
      case 'contact':
        result = await sendContactEmails(requestData);
        break;
      case 'order':
      case 'both':
        result = await sendOrderEmails(requestData);
        break;
      default:
        throw new Error(`Unknown email type: ${emailType}`);
    }
    
    // Return the result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
