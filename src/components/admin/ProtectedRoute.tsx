import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isRefreshTokenError, resetAuthState } from "@/lib/auth-utils";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Set up an error handler that redirects to login when refresh token errors occur
  useEffect(() => {
    const handleGlobalError = async (event: ErrorEvent) => {
      if (isRefreshTokenError(event.error || event.message)) {
        console.warn("Refresh token error detected in protected route");
        
        // Reset auth state
        await resetAuthState();
        
        // Notify the user
        toast.error("Your session has expired. Please log in again.");
        
        // Redirect to login
        navigate("/admin/login", { replace: true });
      }
    };

    // Add the event listener
    window.addEventListener('error', handleGlobalError as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError as EventListener);
    };
  }, [navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
} 