import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to completely reset the authentication state
 * Use this when encountering refresh token errors
 */
export const resetAuthState = async (): Promise<void> => {
  try {
    // Clear client-side session
    await supabase.auth.signOut();
    
    // Clear all auth-related items from local storage
    localStorage.removeItem('supabase.auth.token');
    
    // Find and remove any other Supabase-related items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });

    console.log('Auth state has been reset');
  } catch (error) {
    console.error('Error resetting auth state:', error);
  }
};

/**
 * Check if the current error is a refresh token error
 */
export const isRefreshTokenError = (error: any): boolean => {
  if (!error) return false;
  
  // Check error message
  if (typeof error === 'string') {
    return error.includes('Invalid Refresh Token') || 
           error.includes('Refresh Token Not Found');
  }
  
  // Check error object
  if (error.message) {
    return error.message.includes('Invalid Refresh Token') || 
           error.message.includes('Refresh Token Not Found');
  }
  
  return false;
}; 