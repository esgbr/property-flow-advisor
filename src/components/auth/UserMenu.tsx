
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  User,
  Settings,
  LogOut,
  Lock,
  Bell,
  UserCog,
  ShieldCheck,
  Building,
  LifeBuoy,
  UserPlus,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';
import { toast } from 'sonner';

const UserMenu = () => {
  const { preferences, logoutUser, isAuthenticated } = useUserPreferences();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { lockApp, isLocked, supportsFaceId } = useAppLock();
  const [showSecurityBadge, setShowSecurityBadge] = useState(!preferences.appLockEnabled);
  
  // Enhanced security check for user session
  const isSessionSecure = preferences.appLockEnabled || !!localStorage.getItem('secureSession');
  
  // Enhanced function for name display with better initials algorithm
  const getInitials = () => {
    if (preferences.name) {
      return preferences.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fallback to Email, when no name available
    if (preferences.email) {
      return preferences.email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Enhanced logout with confirmation and security check
  const handleLogout = () => {
    logoutUser();
    
    // Clear any sensitive data
    localStorage.removeItem('secureSession');
    sessionStorage.clear();
    
    toast({
      title: t('success'),
      description: t('loggedOutSuccessfully'),
    });
    navigate('/');
  };

  // Enhanced lock function with activity tracking
  const handleLock = () => {
    if (lockApp) {
      // Track last user activity before locking
      localStorage.setItem('lastActivity', new Date().toISOString());
      
      lockApp();
      toast({
        title: t('security'),
        description: t('appLocked'),
      });
    }
  };
  
  // Handle security setup
  const handleSecuritySetup = () => {
    navigate('/settings?tab=security');
    setShowSecurityBadge(false);
    localStorage.setItem('securityNoticeShown', 'true');
  };

  // If not authenticated, show improved login button
  if (!isAuthenticated) {
    return (
      <div className="flex gap-2 items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/auth')}
          className="flex items-center gap-1"
        >
          <User className="h-4 w-4 mr-1" />
          {t('login')}
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="hidden sm:flex items-center gap-1"
          onClick={() => navigate('/auth?mode=register')}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          {t('register')}
        </Button>
      </div>
    );
  }

  // Enhanced user menu for authenticated users
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 rounded-full"
          aria-label={t('userMenu')}
        >
          <Avatar className="h-8 w-8">
            {preferences.profileImage && (
              <AvatarImage src={preferences.profileImage} alt={preferences.name || "User"} />
            )}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          {/* Security indicator for accounts without 2FA/PIN */}
          {showSecurityBadge && (
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3 border border-background"></div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {preferences.name || t('user')}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {preferences.email || ''}
            </p>
            {preferences.role === 'admin' && (
              <p className="text-xs text-primary mt-1">
                {t('adminAccount')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        {/* Security status indicator */}
        {!isSessionSecure && (
          <div className="px-2 py-1.5 mx-2 my-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            <span>{t('securityNotConfigured')}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 ml-auto text-xs"
              onClick={handleSecuritySetup}
            >
              {t('setup')}
            </Button>
          </div>
        )}
        
        {isSessionSecure && (
          <div className="px-2 py-1.5 mx-2 my-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded border border-green-200 dark:border-green-800 flex items-center gap-2">
            <CheckCircle className="h-3 w-3" />
            <span>{t('securityEnabled')}</span>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>{t('profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <Building className="mr-2 h-4 w-4" />
            <span>{t('dashboard')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/investor-dashboard')}>
            <Globe className="mr-2 h-4 w-4" />
            <span>{t('investorDashboard')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/security')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>{t('security')}</span>
            {!preferences.appLockEnabled && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                {t('recommended')}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>{t('notifications')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => navigate('/help')}
            className="text-indigo-600 dark:text-indigo-400"
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>{t('helpSupport')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAuthenticated && lockApp && (
            <DropdownMenuItem onClick={handleLock}>
              <Lock className="mr-2 h-4 w-4" />
              <span>{t('lock')}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
