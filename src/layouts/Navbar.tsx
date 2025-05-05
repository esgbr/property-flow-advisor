
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Building } from 'lucide-react';
import { useSidebarState } from '@/components/ui/sidebar';
import ThemeToggle from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from '@/components/auth/UserMenu';

interface NavbarProps {
  className?: string;
  showMobileMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ className, showMobileMenu = true }) => {
  const { toggleSidebar } = useSidebarState();
  const { t } = useLanguage();

  return (
    <div className={cn('border-b flex items-center justify-between px-4 h-14', className)}>
      <div className="flex items-center">
        {showMobileMenu && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label={t('toggleMenu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link 
          to="/" 
          className="flex items-center mr-4"
          aria-label={t('home')}
        >
          <Building className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold hidden md:block">{t('propertyFlow')}</span>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  );
};

export default Navbar;
