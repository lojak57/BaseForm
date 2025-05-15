import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@12.1.1?target=deno";

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
    // Get the stripe secret key from environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Check if the key starts with sk_test_ or sk_live_
    if (!stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
      throw new Error("Invalid Stripe key format. Must start with sk_test_ or sk_live_");
    }

    // Parse the request body
    const body = await req.json();
    const { customerName, customerEmail, productName, amount, fullAmount, opportunityId, isRetailPurchase } = body;
    
    // Use the amount provided - special handling for retail purchases vs deposits
    const paymentAmount = Math.round(Number(amount) * 100); // Convert dollars to cents
    const totalAmount = fullAmount ? Math.round(Number(fullAmount) * 100) : paymentAmount; // Optional full amount
    
    console.log("Payment request received:", { 
      customerName, 
      customerEmail, 
      productName, 
      paymentAmount: paymentAmount / 100, 
      totalAmount: totalAmount / 100,
      opportunityId,
      isRetailPurchase
    });
    
    // Determine the success and cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:5173";
    let successUrl = `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`;
    
    // If opportunityId is provided, include it in the success URL
    if (opportunityId) {
      successUrl += `&opportunity_id=${opportunityId}`;
    }
    
    // Add payment_complete flag to indicate successful payment
    successUrl += `&payment_complete=true`;
    
    const cancelUrl = `${origin}/checkout?canceled=true`;

    // Initialize Stripe client
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a Stripe Checkout Session with multiple payment methods
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'afterpay_clearpay'],
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session',
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName || 'Product Purchase',
              description: isRetailPurchase 
                ? `Complete payment for ${productName}`
                : `Initial payment for project proposal. ${fullAmount ? `Total project value: $${fullAmount/100}` : ''}`,
            },
            unit_amount: paymentAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      // Enable automatic tax calculation
      automatic_tax: { enabled: false },
    });

    console.log("Created Stripe session:", { 
      id: session.id,
      url: session.url
    });

    // Return a success response with the checkout URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        fullAmount: totalAmount,
        preAuthAmount: paymentAmount / 100
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in payment processing:", error);
    
    // Return a detailed error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "Error processing payment request",
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}); 