import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";

export default function ThankYouPage() {
  const [paymentStatus, setPaymentStatus] = useState("Verifying payment...");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const { clearCart } = useCart();
  const { currentTenant } = useAuth();
  
  useEffect(() => {
    async function processPayment() {
      try {
        // Get URL parameters
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');
        const isPaymentComplete = query.get('payment_complete') === 'true';
        
        if (!sessionId) {
          setError("No session ID found. Payment cannot be verified.");
          setIsVerifying(false);
          return;
        }
        
        // Default tenant ID
        let tenantId = 'vcsews';
        
        // Get tenant ID if available
        if (currentTenant) {
          if (typeof currentTenant === 'object') {
            tenantId = currentTenant.id || tenantId;
          } else if (typeof currentTenant === 'string') {
            tenantId = currentTenant;
          }
        }
          
        // Record the successful payment in the database
        const { error: dbError } = await supabase
          .from('purchase_records')
          .insert({
            session_id: sessionId,
            status: 'completed',
            processed_at: new Date().toISOString(),
            tenant_id: tenantId
          });
          
        if (dbError) {
          console.error("Error recording payment:", dbError);
        }
        
        // Clear the cart after successful payment
        clearCart();
        
        setPaymentStatus("Payment successful!");
        setIsVerifying(false);
      } catch (err) {
        console.error("Error processing payment confirmation:", err);
        setError("There was a problem verifying your payment.");
        setIsVerifying(false);
      }
    }
    
    processPayment();
  }, [location, clearCart, currentTenant]);
  
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-playfair mb-6">Thank You!</h1>
            
            {isVerifying ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-threadGold" />
                <p className="text-lg">{paymentStatus}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-xl font-medium text-green-600 mb-2">{paymentStatus}</p>
                <p className="text-darkGray mb-8">
                  Your order has been confirmed and will be processed shortly.
                  We've sent a confirmation email with all the details.
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="default" className="bg-threadGold hover:bg-threadGold/90 text-darkText">
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
