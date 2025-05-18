
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUserPreferences } from './UserPreferencesContext';

interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      // In a real app, this would check for tokens in localStorage or cookies
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Login handler
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock login logic - would be replaced with actual API call
      // This is just for demonstration
      if (email && password) {
        const user = { id: 'user-1', email, name: email.split('@')[0] };
        
        // Store user in localStorage for session persistence
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // Update last login in preferences
        updatePreferences({
          lastActive: new Date().toISOString(),
          email
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    // Clear stored user data
    localStorage.removeItem('auth_user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register handler
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock registration logic - would be replaced with actual API call
      if (name && email && password) {
        const user = { id: 'user-' + Date.now(), email, name };
        
        // Store user in localStorage
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // Update preferences with new user info
        updatePreferences({
          name,
          email,
          lastActive: new Date().toISOString()
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
