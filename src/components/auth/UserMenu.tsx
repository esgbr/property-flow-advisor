
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
  ShieldCheck,
  LifeBuoy,
  UserPlus,
} from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  action?: () => void;
  condition?: boolean;
  className?: string;
  badge?: string | null;
  badgeVariant?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const UserMenu = () => {
  const { preferences, logoutUser, isAuthenticated } = useUserPreferences();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const { t } = useLanguage();
  const { lockApp, isLocked } = useAppLock();
  const [showSecurityBadge, setShowSecurityBadge] = useState(!preferences.appLockEnabled);
  
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

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('secureSession');
    sessionStorage.clear();
    
    toastHook({
      title: t('success'),
      description: t('loggedOutSuccessfully'),
    });
    navigate('/');
  };

  const handleLock = () => {
    if (lockApp) {
      localStorage.setItem('lastActivity', new Date().toISOString());
      lockApp();
      toast.success(t('appLocked'));
    }
  };
  
  const handleSecuritySetup = () => {
    navigate('/security');
    setShowSecurityBadge(false);
    localStorage.setItem('securityNoticeShown', 'true');
  };
  
  const navigationGroups: NavGroup[] = [
    {
      name: 'account',
      items: [
        { icon: <User className="mr-2 h-4 w-4" />, label: t('profile'), path: '/profile' },
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
      name: 'help',
      items: [
        { icon: <LifeBuoy className="mr-2 h-4 w-4" />, label: t('helpSupport'), path: '/help' }
      ]
    },
    {
      name: 'actions',
      items: [
        { 
          icon: <Lock className="mr-2 h-4 w-4" />, 
          label: t('lock'), 
          action: handleLock,
          condition: isAuthenticated && !!lockApp && !isLocked
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

  // Show login buttons for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex gap-2 items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/auth')}
        >
          <User className="h-4 w-4 mr-1" />
          {t('login')}
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="hidden sm:flex"
          onClick={() => navigate('/auth?mode=register')}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          {t('register')}
        </Button>
      </div>
    );
  }

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
          
          {showSecurityBadge && (
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3 border border-background"></div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
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
        
        {!preferences.appLockEnabled && (
          <div className="px-2 mb-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs mt-1"
              onClick={handleSecuritySetup}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              {t('setupSecurity')}
            </Button>
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        {navigationGroups.map((group, groupIndex) => (
          <React.Fragment key={`group-${groupIndex}`}>
            <DropdownMenuGroup>
              {group.items.map((item, itemIndex) => (
                (item.condition !== false) && (
                  <DropdownMenuItem 
                    key={`item-${groupIndex}-${itemIndex}`}
                    onClick={item.action || (item.path ? () => navigate(item.path!) : undefined)}
                    className={item.className}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant as any || "outline"}
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuGroup>
            {groupIndex < navigationGroups.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
