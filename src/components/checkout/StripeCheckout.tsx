import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
}

interface StripeCheckoutProps {
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: {
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  orderNotes?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

const StripeCheckout = ({
  customerEmail = "",
  customerName = "",
  customerPhone = "",
  customerAddress = {},
  orderNotes = "",
  onSuccess,
  onError,
  buttonText = "Proceed to Payment",
  className = "",
  disabled = false
}: StripeCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, cartTotal } = useCart();
  
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    // Don't proceed if cart is empty
    if (cart.length === 0) {
      setError("Your cart is empty");
      setIsLoading(false);
      return;
    }

    try {
      // Create a summary of cart items
      const itemsSummary = cart.map(item => `${item.quantity}x ${item.name} (${item.fabricLabel})`).join(", ");
      const totalAmount = cartTotal();
      
      // Format the full address
      const fullAddress = customerAddress.street ? [
        customerAddress.street,
        customerAddress.apartment,
        customerAddress.city,
        customerAddress.state,
        customerAddress.zipCode,
        customerAddress.country
      ].filter(Boolean).join(", ") : "";
      
      console.log("Starting checkout process for:", {
        itemsSummary,
        totalAmount,
        customerEmail,
        customerName,
        customerPhone,
        fullAddress,
        orderNotes
      });

      // Call the Stripe checkout Edge Function
      const { data, error: apiError } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          customerName,
          customerEmail,
          customerPhone,
          customerAddress: fullAddress,
          productName: cart.length > 1 ? `VCSews Order (${cart.length} items)` : cart[0].name,
          amount: totalAmount,
          fullAmount: totalAmount,
          isRetailPurchase: true,
          cartItems: cart.map(item => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            fabricCode: item.fabricCode,
            fabricLabel: item.fabricLabel
          })),
          notes: orderNotes,
          metadata: {
            customerPhone,
            address: customerAddress,
            notes: orderNotes
          }
        }
      });

      if (apiError) {
        throw new Error(apiError.message || "Failed to create checkout session");
      }

      if (!data || !data.url) {
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to create checkout session");
      
      if (onError) onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if required fields are completed
  const isFormComplete = customerEmail && customerName;

  return (
    <div className={className}>
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-center">
          {error}
        </div>
      )}
      
      <Button 
        onClick={handleCheckout}
        disabled={isLoading || cart.length === 0 || disabled || !isFormComplete}
        className="w-full bg-threadGold hover:bg-threadGold/90 text-darkText"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {buttonText} ({formatCurrency(cartTotal())})
          </>
        )}
      </Button>
      
      {!isFormComplete && (
        <p className="text-sm text-amber-600 mt-2 text-center">
          Please complete the required fields before checkout
        </p>
      )}
    </div>
  );
};

export default StripeCheckout; 