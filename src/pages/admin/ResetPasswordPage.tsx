import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate email
      if (!email.trim()) {
        toast.error("Please enter your email address");
        setIsLoading(false);
        return;
      }

      // Send password reset email through Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });

      if (error) {
        throw error;
      }

      // Show success message
      setResetSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/login')} 
              className="mr-2 text-gray-500 hover:text-threadGold transition-colors"
              aria-label="Back to login"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <CardTitle className="text-2xl font-playfair">Reset Password</CardTitle>
              <CardDescription>
                Enter your email to receive password reset instructions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {resetSent ? (
          <CardContent className="pt-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
              <CheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-green-800">Reset email sent</h3>
                <p className="text-green-700 text-sm mt-1">
                  We've sent password reset instructions to <strong>{email}</strong>. 
                  Please check your email inbox and follow the instructions to reset your password.
                </p>
                <p className="text-green-700 text-sm mt-3">
                  Don't see the email? Check your spam folder or click the button below to try again.
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/login')}
              >
                Back to login
              </Button>
              <Button 
                onClick={() => setResetSent(false)}
                className="bg-threadGold hover:bg-threadGold/90"
              >
                Try again
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <p className="text-amber-700 text-sm">
                  Enter the email address associated with your account and we'll send you instructions to reset your password.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-threadGold hover:bg-threadGold/90" 
                disabled={isLoading}
              >
                {isLoading ? "Sending instructions..." : "Send reset instructions"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
