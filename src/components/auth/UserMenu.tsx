
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

const UserMenu: React.FC = () => {
  const { isAuthenticated, preferences, logoutUser } = useUserPreferences();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleLogout = () => {
    logoutUser();
    toast({
      title: t('success'),
      description: t('loggedOutSuccessfully'),
    });
    navigate('/auth');
  };
  
  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/auth')}
        className="ml-2"
      >
        <LogIn className="mr-2 h-4 w-4" />
        {t('login')}
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <User className="mr-2 h-4 w-4" />
          {preferences.name || preferences.email || t('account')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {preferences.name || t('account')}
          {preferences.email && (
            <span className="block text-xs text-muted-foreground mt-1">
              {preferences.email}
            </span>
          )}
          {preferences.role === 'admin' && (
            <span className="block text-xs font-medium text-primary mt-1">
              {t('adminAccount')}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
