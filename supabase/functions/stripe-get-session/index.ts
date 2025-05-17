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
    // Get the Stripe secret key from environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Parse the request body
    const body = await req.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("Retrieving Stripe session:", { sessionId });
    
    // Initialize Stripe client
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Extract the relevant customer information
    const responseData = {
      customer_email: session.customer_email || "",
      customer_details: session.customer_details || {},
      shipping: session.shipping || {},
      payment_status: session.payment_status,
      amount_total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
    };

    console.log("Retrieved session information:", {
      id: session.id,
      customer_email: responseData.customer_email,
      payment_status: responseData.payment_status
    });

    // Return the session data
    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    
    // Return a detailed error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "Error retrieving Stripe session",
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
