
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BellIcon, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="ml-auto flex items-center space-x-3">
          {!isMobile && <LanguageSwitcher />}
          <AccessibilitySettingsButton />
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label={t('notifications') || 'Notifications'}
          >
            <BellIcon className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full" 
                aria-label={t('userMenu') || 'User menu'}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">{t('settings') || 'Settings'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">{t('profile') || 'Profile'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/accessibility">{t('accessibility') || 'Accessibility'}</Link>
              </DropdownMenuItem>
              {isMobile && (
                <DropdownMenuItem>
                  <LanguageSwitcher />
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('lock') || 'Lock'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('logout') || 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
