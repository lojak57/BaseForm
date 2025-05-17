import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, LockKeyhole } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify that we have a hash fragment (which indicates a valid password reset link)
    const hash = window.location.hash;
    
    if (!hash || !hash.includes('type=recovery')) {
      toast.error("Invalid or expired password reset link");
      
      // Give user time to see the toast before redirecting
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    }
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate passwords
      if (!password.trim()) {
        toast.error("Please enter a new password");
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        setIsLoading(false);
        return;
      }

      // Update password through Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Show success message
      setPasswordUpdated(true);
      toast.success("Your password has been updated successfully");
      
      // Clear the password fields
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-threadGold/10 flex items-center justify-center text-threadGold">
              <LockKeyhole size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-playfair text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Create a strong password for your account
          </CardDescription>
        </CardHeader>

        {passwordUpdated ? (
          <CardContent className="pt-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <h3 className="font-medium text-green-800 text-lg mb-2">Password Updated Successfully</h3>
              <p className="text-green-700 mb-6">
                Your password has been changed. You can now log in with your new password.
              </p>
              <Button 
                onClick={() => navigate('/admin/login')}
                className="bg-threadGold hover:bg-threadGold/90"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-blue-700 text-sm">
                  Create a strong password that's at least 8 characters long. Using a combination of letters, numbers, and special characters increases security.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>Passwords don't match</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-threadGold hover:bg-threadGold/90" 
                disabled={isLoading || (password !== confirmPassword)}
              >
                {isLoading ? "Updating password..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
