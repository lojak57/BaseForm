import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { sendOrderConfirmationEmail, generateOrderNumber, OrderEmailData } from "@/lib/email";

// The shop owner email - always ensure they get notifications
const SHOP_OWNER_EMAIL = 'vcarring@gmail.com';

export default function ThankYouPage() {
  const [paymentStatus, setPaymentStatus] = useState("Verifying payment...");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const location = useLocation();
  const { cart, clearCart, cartTotal } = useCart();
  const { currentTenant } = useAuth();
  const cartCleared = useRef(false);
  const emailSent = useRef(false);
  
  // Get customer data from localStorage
  const getCustomerData = () => {
    try {
      const customerData = localStorage.getItem('checkout-customer-data');
      if (customerData) {
        return JSON.parse(customerData);
      }
    } catch (e) {
      console.error('Error parsing customer data from localStorage', e);
    }
    return null;
  };
  
  // Send order confirmation emails
  const sendOrderEmails = async (sessionId: string) => {
    if (emailSent.current) {
      console.log("Emails already sent, skipping");
      return;
    }
    
    try {
      console.log("Starting to send order confirmation emails");
      setEmailStatus("Sending order confirmation...");
      
      // First, check if we have cart items available
      const hasCartItems = cart && cart.length > 0;
      console.log(`Cart check: ${hasCartItems ? 'Cart has items' : 'Cart is empty'}`, cart);
      
      // Try to get customer data from localStorage
      const customerData = getCustomerData();
      console.log("Customer data retrieved from localStorage:", customerData);
      
      // Generate an order number
      const orderNumber = generateOrderNumber();
      
      // Create a backup order item if cart is empty
      const backupOrderItems = [
        { 
          name: 'Order items', 
          price: 0, 
          quantity: 1,
          attributes: { 'Note': 'Order details unavailable' }
        }
      ];
      
      // Prepare order items from cart if available
      const orderItems = hasCartItems 
        ? cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            attributes: {
              'Fabric': item.fabricLabel || 'Default'
            },
            imageUrl: item.image
          }))
        : backupOrderItems;
      
      // Calculate totals, with fallbacks
      const subtotal = hasCartItems ? cartTotal() : 0;
      const shipping = 0; // Free shipping
      const total = subtotal;
      
      // Extract customer info from localStorage data, with fallbacks
      const {
        customerName = 'Customer',
        customerEmail = '',
        customerPhone = '',
        streetAddress = '',
        apartment = '',
        city = '',
        state = '',
        zipCode = '',
        country = 'United States',
        orderNotes = ''
      } = customerData || {};
      
      // Create the order email data object
      const orderEmailData: OrderEmailData = {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          street: streetAddress,
          apartment,
          city,
          state,
          zipCode,
          country
        },
        orderNotes,
        items: orderItems,
        subtotal,
        shipping,
        total
      };
      
      console.log("Order email data prepared:", {
        orderNumber,
        customerName,
        customerEmail,
        items: orderItems.length,
        total
      });

      // Always send to shop owner, and to customer if email available and different
      const sendToCustomer = customerEmail && customerEmail !== SHOP_OWNER_EMAIL;
      
      if (sendToCustomer) {
        console.log(`Sending order confirmation to both customer (${customerEmail}) and shop owner`);
        await sendOrderConfirmationEmail(orderEmailData);
      } else {
        console.log(`Sending order confirmation only to shop owner (${SHOP_OWNER_EMAIL})`);
        // Override customer email to ensure shop owner gets the notification
        const ownerOnlyData = {
          ...orderEmailData,
          customerEmail: SHOP_OWNER_EMAIL
        };
        await sendOrderConfirmationEmail(ownerOnlyData);
      }
      
      console.log("Order confirmation emails sent successfully");
      emailSent.current = true;
      setEmailStatus(null); // Clear the status message on success
      
      // Clear the customer data from localStorage
      localStorage.removeItem('checkout-customer-data');
      
      // Save the order to the database if not already saved
      try {
        // Check if order exists
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('order_number')
          .eq('session_id', sessionId)
          .maybeSingle();
          
        if (!existingOrder) {
          // Save new order
          const { error: saveError } = await supabase
            .from('orders')
            .insert({
              order_number: orderNumber,
              session_id: sessionId,
              customer_name: customerName,
              customer_email: customerEmail || SHOP_OWNER_EMAIL,
              customer_phone: customerPhone,
              shipping_address: {
                street: streetAddress,
                apartment,
                city,
                state,
                zipCode,
                country
              },
              order_notes: orderNotes,
              items: orderItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                attributes: item.attributes || {}
              })),
              subtotal,
              shipping,
              total,
              status: 'new',
              created_at: new Date().toISOString()
            });
              
          if (saveError) {
            console.error("Error saving order to database:", saveError);
          } else {
            console.log("Order saved to database successfully");
          }
        } else {
          console.log("Order already exists in database, skipping save");
        }
      } catch (dbError) {
        console.error("Error in database operations:", dbError);
      }
    } catch (err) {
      console.error("Error in email sending process:", err);
      setEmailStatus("We couldn't send order confirmation emails, but your order was processed successfully.");
    }
  };
  
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
        
        console.log("Processing payment for session ID:", sessionId);
        
        // Default tenant ID
        const tenantId = currentTenant || 'vcsews';
          
        // Record the successful payment in the database
        try {
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
          } else {
            console.log("Payment record saved successfully");
          }
        } catch (recordError) {
          console.error("Failed to record payment:", recordError);
        }
        
        // Clear the cart after successful payment - only once
        if (!cartCleared.current) {
          clearCart();
          cartCleared.current = true;
          console.log("Cart cleared successfully");
        }
        
        // Send order confirmation emails
        await sendOrderEmails(sessionId);
        
        setPaymentStatus("Payment successful!");
        setIsVerifying(false);
      } catch (err) {
        console.error("Error processing payment confirmation:", err);
        setError("There was a problem verifying your payment.");
        setIsVerifying(false);
      }
    }
    
    processPayment();
  }, [location, clearCart, currentTenant, cart, cartTotal]);
  
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
                {emailStatus && <p className="text-sm text-darkGray">{emailStatus}</p>}
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
                <p className="text-darkGray mb-4">
                  Your order has been confirmed and will be processed shortly.
                </p>
                {emailStatus ? (
                  <p className="text-amber-600 mb-6 text-sm">{emailStatus}</p>
                ) : (
                  <p className="text-darkGray mb-6 text-sm">
                    We've sent a confirmation email with all the details.
                  </p>
                )}
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
