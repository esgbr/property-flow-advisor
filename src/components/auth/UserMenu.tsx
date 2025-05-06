
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
  CheckCircle,
  Home,
  LineChart,
  BookOpen
} from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Refactored components for better organization
const SecurityBadge = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3 border border-background"></div>
  );
};

const SecurityStatus = ({ isSecure }: { isSecure: boolean }) => {
  const { t } = useLanguage();
  
  if (isSecure) {
    return (
      <div className="px-2 py-1.5 mx-2 my-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded border border-green-200 dark:border-green-800 flex items-center gap-2">
        <CheckCircle className="h-3 w-3" />
        <span>{t('securityEnabled')}</span>
      </div>
    );
  }
  
  return (
    <div className="px-2 py-1.5 mx-2 my-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-2">
      <AlertCircle className="h-3 w-3" />
      <span>{t('securityNotConfigured')}</span>
    </div>
  );
};

const LoginButtons = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
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
};

const UserMenu = () => {
  const { preferences, logoutUser, isAuthenticated } = useUserPreferences();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
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

  // Improved getNavItems function to organize navigation items
  const getNavItems = () => {
    return [
      {
        group: 'main',
        items: [
          { icon: <User className="mr-2 h-4 w-4" />, label: t('profile'), path: '/profile' },
          { icon: <Home className="mr-2 h-4 w-4" />, label: t('dashboard'), path: '/dashboard' },
          { icon: <LineChart className="mr-2 h-4 w-4" />, label: t('investorDashboard'), path: '/investor-dashboard' },
          { icon: <Globe className="mr-2 h-4 w-4" />, label: t('marketAnalysis'), path: '/market-analysis' },
          { icon: <BookOpen className="mr-2 h-4 w-4" />, label: t('education'), path: '/education' }
        ]
      },
      {
        group: 'settings',
        items: [
          { icon: <Settings className="mr-2 h-4 w-4" />, label: t('settings'), path: '/settings' },
          { 
            icon: <ShieldCheck className="mr-2 h-4 w-4" />, 
            label: t('security'), 
            path: '/security',
            badge: !preferences.appLockEnabled ? t('recommended') : null,
            badgeVariant: 'amber'
          },
          { icon: <Bell className="mr-2 h-4 w-4" />, label: t('notifications'), path: '/notifications' }
        ]
      },
      {
        group: 'help',
        items: [
          { 
            icon: <LifeBuoy className="mr-2 h-4 w-4" />, 
            label: t('helpSupport'), 
            path: '/help',
            className: 'text-indigo-600 dark:text-indigo-400'
          }
        ]
      },
      {
        group: 'account',
        items: [
          { 
            icon: <Lock className="mr-2 h-4 w-4" />, 
            label: t('lock'), 
            action: handleLock,
            condition: isAuthenticated && lockApp
          },
          { 
            icon: <LogOut className="mr-2 h-4 w-4" />, 
            label: t('logout'), 
            action: handleLogout,
            className: 'text-red-600 dark:text-red-400'
          }
        ]
      }
    ];
  };

  // Not authenticated, show improved login buttons
  if (!isAuthenticated) {
    return <LoginButtons />;
  }

  // Enhanced user menu for authenticated users with better organization
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
          
          <SecurityBadge show={showSecurityBadge} />
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
              <p className="text-xs text-primary mt-1 flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1" />
                {t('adminAccount')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        <SecurityStatus isSecure={isSessionSecure} />
        
        {!isSessionSecure && (
          <div className="px-2 mb-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs mt-1"
              onClick={handleSecuritySetup}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              {t('setup')}
            </Button>
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Main navigation items */}
        {getNavItems().map((group, index) => (
          <React.Fragment key={`group-${index}`}>
            <DropdownMenuGroup>
              {group.items.map((item, itemIndex) => (
                item.condition !== false && (
                  <DropdownMenuItem 
                    key={`item-${index}-${itemIndex}`}
                    onClick={item.action || (() => navigate(item.path))}
                    className={item.className}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant || "outline"}
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuGroup>
            {index < getNavItems().length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
