
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { logSecurityEvent } from '@/utils/securityUtils';
import { useSecureStorage } from '@/hooks/use-secure-storage';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Provider component for authentication context
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useSecureStorage<string | null>('auth_token', null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        // In a real app, this would validate the token with an API
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedUser && authToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Log security event for session resumption
          logSecurityEvent('login', {
            userId: parsedUser.id,
            method: 'session-resume'
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Clear potentially corrupted session data
        localStorage.removeItem('auth_user');
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [authToken, setAuthToken]);
  
  // Track auth state changes
  useEffect(() => {
    // Update user preferences if authenticated
    if (isAuthenticated && user) {
      updatePreferences({
        lastActive: new Date().toISOString(),
        email: user.email,
        name: user.name,
        role: user.role
      });
    }
  }, [isAuthenticated, user, updatePreferences]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock login logic - would be replaced with actual API call
      if (email && password) {
        // Generate a mock token
        const token = `mock-token-${Date.now()}`;
        const user = { 
          id: 'user-1', 
          email, 
          name: email.split('@')[0],
          role: 'user' 
        };
        
        // Store user and token
        localStorage.setItem('auth_user', JSON.stringify(user));
        setAuthToken(token);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // Log security event
        logSecurityEvent('login', {
          userId: user.id,
          method: 'password'
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      // Log security event for failed login
      logSecurityEvent('login_failure', {
        email,
        reason: 'Invalid credentials'
      }, { severity: 'warning' });
      
      toast({
        title: t ? t('error') : 'Error',
        description: t ? t('loginFailed') : 'Login failed. Please check your credentials.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const userId = user?.id;
      
      // Log security event before clearing data
      if (userId) {
        logSecurityEvent('logout', { userId });
      }
      
      // Clear stored user data
      localStorage.removeItem('auth_user');
      setAuthToken(null);
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      navigate('/auth');
      
      toast({
        title: t ? t('success') : 'Success',
        description: t ? t('loggedOut') : 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: t ? t('error') : 'Error',
        description: t ? t('logoutFailed') : 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const register = async (name: string, email: string, password: string, role = 'user'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock registration logic - would be replaced with actual API call
      if (name && email && password) {
        // Generate mock user id and token
        const userId = `user-${Date.now()}`;
        const token = `mock-token-${Date.now()}`;
        
        const user = { id: userId, email, name, role };
        
        // Store user and token
        localStorage.setItem('auth_user', JSON.stringify(user));
        setAuthToken(token);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // Log security event
        logSecurityEvent('login', {
          userId: user.id,
          method: 'registration'
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
  
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      
      // Store updated user data
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      // Update preferences
      if (userData.name) {
        updatePreferences({ name: userData.name });
      }
      
      // Log security event
      logSecurityEvent('security_setting_change', {
        userId: user.id,
        changes: Object.keys(userData).join(',')
      });
      
      toast({
        title: t ? t('success') : 'Success',
        description: t ? t('profileUpdated') : 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Update user error:', error);
      
      toast({
        title: t ? t('error') : 'Error',
        description: t ? t('updateFailed') : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
