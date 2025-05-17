import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
  currentTenant: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);

  // We can't use useNavigate directly in the context because it's outside of Router
  // Instead, we'll handle navigation in the components that use this context

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        
        if (event === 'TOKEN_REFRESHED') {
          // Token was successfully refreshed
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setIsAuthenticated(!!newSession);
          
          // Extract tenant from user metadata if available
          if (newSession?.user) {
            const tenant = newSession.user.app_metadata?.app_name || 'default';
            setCurrentTenant(tenant);
          }
        } 
        else if (event === 'SIGNED_OUT') {
          // User signed out
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setCurrentTenant(null);
        }
        else if (event === 'SIGNED_IN') {
          // New sign in
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setIsAuthenticated(!!newSession);
          
          // Extract tenant from user metadata if available
          if (newSession?.user) {
            const tenant = newSession.user.app_metadata?.app_name || 'default';
            setCurrentTenant(tenant);
          }
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setCurrentTenant(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Extract tenant from user metadata if available
        if (session?.user) {
          const tenant = session.user.app_metadata?.app_name || 'default';
          setCurrentTenant(tenant);
        }
      }
      
      setLoading(false);
    });

    // Setup refresh token error handler
    const refreshTokenErrorHandler = () => {
      window.addEventListener('error', (event) => {
        // Check if the error contains refresh token errors
        if (
          event.message && (
            event.message.includes('Invalid Refresh Token') || 
            event.message.includes('Refresh Token Not Found')
          )
        ) {
          console.warn('Refresh token error detected, logging out');
          // Clear local storage and force logout
          supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          
          // Redirect to login page - will need to be handled by components using this context
          if (window.location.pathname.startsWith('/admin') && 
              window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        }
      });
    };
    
    refreshTokenErrorHandler();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Clear any existing sessions first to prevent token conflicts
      await supabase.auth.signOut();
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Check if user has access to this specific app
        const appAccess = data.user.app_metadata?.webshop_access === true || 
                         data.user.user_metadata?.apps?.includes('webshop');

        if (!appAccess) {
          // User doesn't have access to this specific app
          toast.error("You don't have access to this application");
          await supabase.auth.signOut();
          return false;
        }

        // Set current tenant from metadata
        const tenant = data.user.app_metadata?.app_name || 'default';
        setCurrentTenant(tenant);

        toast.success("Successfully logged in");
        return true;
      }

      return false;
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear any stored tokens
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      } else {
        setCurrentTenant(null);
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        toast.info("You have been logged out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
      
      // Force reset auth state even if there was an error
      setCurrentTenant(null);
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      session, 
      currentTenant 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 