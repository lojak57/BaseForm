import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const shopOwnerEmail = Deno.env.get("SHOP_OWNER_EMAIL") || "vcsewsshop@gmail.com";
    const fromEmail = Deno.env.get("FROM_EMAIL") || "orders@vcsews.com";
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Parse the request body
    const body = await req.json();
    const { 
      emailType,
      customerName, 
      customerEmail, 
      customerPhone, 
      orderItems, 
      orderTotal, 
      orderDate, 
      shippingAddress,
      orderNotes,
      sessionId
    } = body;
    
    console.log(`Email request received: ${emailType}`, { 
      customerName, 
      customerEmail,
      orderTotal,
      sessionId
    });

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Format email content
    const formattedItems = orderItems.map((item: any) => 
      `${item.quantity}x ${item.name} (${item.fabricLabel}) - $${Number(item.price).toFixed(2)}`
    ).join('<br>');
    
    // Format shipping address
    const formattedAddress = [
      shippingAddress.street,
      shippingAddress.apartment,
      `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
      shippingAddress.country
    ].filter(Boolean).join('<br>');

    const responses = [];

    // Handle different email types
    if (emailType === 'order_confirmation' || emailType === 'both') {
      // Send customer order confirmation
      const { data: confirmData, error: confirmError } = await resend.emails.send({
        from: `VC Sews <${fromEmail}>`,
        to: [customerEmail],
        subject: 'Your VC Sews Order Confirmation',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D1A24B;">Order Confirmation</h1>
            <p>Dear ${customerName},</p>
            <p>Thank you for your order with VC Sews! We've received your payment and are processing your order.</p>
            
            <h2>Order Details:</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Items:</strong></p>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedItems}
            </div>
            
            <p><strong>Total:</strong> $${Number(orderTotal).toFixed(2)}</p>
            
            <h2>Shipping Address:</h2>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedAddress}
            </div>
            
            <p>We'll notify you once your order ships. If you have any questions, please contact us.</p>
            
            <p>Thank you for supporting handcrafted products!</p>
            <p>Sincerely,<br>Vicki<br>VC Sews</p>
          </div>
        `,
      });

      if (confirmError) {
        console.error("Error sending confirmation email:", confirmError);
        responses.push({ type: 'confirmation', success: false, error: confirmError });
      } else {
        console.log("Confirmation email sent:", confirmData);
        responses.push({ type: 'confirmation', success: true, data: confirmData });
      }
    }

    if (emailType === 'owner_notification' || emailType === 'both') {
      // Send owner notification
      const { data: notifyData, error: notifyError } = await resend.emails.send({
        from: `VC Sews Orders <${fromEmail}>`,
        to: [shopOwnerEmail],
        subject: `New Order from ${customerName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D1A24B;">New Order Received!</h1>
            <p>A new order has been placed on your shop.</p>
            
            <h2>Customer Information:</h2>
            <ul>
              <li><strong>Name:</strong> ${customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
              ${customerPhone ? `<li><strong>Phone:</strong> ${customerPhone}</li>` : ''}
            </ul>
            
            <h2>Order Details:</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order ID:</strong> ${sessionId}</p>
            <p><strong>Items:</strong></p>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedItems}
            </div>
            
            <p><strong>Total:</strong> $${Number(orderTotal).toFixed(2)}</p>
            
            <h2>Shipping Address:</h2>
            <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
              ${formattedAddress}
            </div>
            
            ${orderNotes ? `
              <h2>Order Notes:</h2>
              <div style="border: 1px solid #eee; padding: 15px; border-radius: 5px;">
                ${orderNotes}
              </div>
            ` : ''}
            
            <p>Please process this order at your earliest convenience.</p>
          </div>
        `,
      });

      if (notifyError) {
        console.error("Error sending owner notification email:", notifyError);
        responses.push({ type: 'notification', success: false, error: notifyError });
      } else {
        console.log("Owner notification email sent:", notifyData);
        responses.push({ type: 'notification', success: true, data: notifyData });
      }
    }

    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true,
        responses
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in email sending:", error);
    
    // Return a detailed error response
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Error processing email request",
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}); 