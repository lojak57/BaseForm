import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend';

// Create Resend client with API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY') || 're_WppnL2k6_HmVY91iFaxqHcruzebZ2frr5');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    // Extract email data from body
    const { to, subject, html, text } = body;
    
    // Set from address based on request type
    const from = body.emailType === 'contact' ? 'contact@vcsews.com' : 'orders@vcsews.com';
    
    // Send a simple email to verify configuration
    const email = await resend.emails.send({
      from,
      to: to || 'vcarring@gmail.com',
      subject: subject || 'Test Email from VC Sews',
      html: html || '<h1>Hello</h1><p>This is a test email to verify the configuration.</p>',
      text: text || 'Hello, this is a test email to verify the configuration.',
    });
    
    console.log('Resend response:', email);
    
    return new Response(JSON.stringify(email), { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  }
});
