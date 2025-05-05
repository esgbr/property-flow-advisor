
import React from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  LifeBuoy
} from 'lucide-react';
import { useAppLock } from '@/contexts/AppLockContext';

const UserMenu = () => {
  const { preferences, logoutUser, isAuthenticated } = useUserPreferences();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { lockApp, isLocked, supportsFaceId } = useAppLock();
  
  // Sicherheitsfunktion: Abkürzung für Name anzeigen, wenn verfügbar
  const getInitials = () => {
    if (preferences.name) {
      return preferences.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fallback auf Email, wenn kein Name verfügbar
    if (preferences.email) {
      return preferences.email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Ausloggen mit Bestätigung
  const handleLogout = () => {
    logoutUser();
    toast({
      title: t('success'),
      description: t('loggedOutSuccessfully'),
    });
    navigate('/');
  };

  // Sperrfunktion
  const handleLock = () => {
    if (lockApp) {
      lockApp();
      toast({
        title: t('security'),
        description: t('appLocked'),
      });
    }
  };

  // Wenn nicht authentifiziert, Login-Button anzeigen
  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2"
        onClick={() => navigate('/auth')}
      >
        {t('login')}
      </Button>
    );
  }

  // Benutzermenü für authentifizierte Benutzer
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
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
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
              <p className="text-xs text-primary mt-1">
                {t('adminAccount')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
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
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/security')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>{t('security')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>{t('notifications')}</span>
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
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
