import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Building, PhoneCall } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from '@/components/auth/UserMenu';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface NavbarProps {
  className?: string;
  showMobileMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ className, showMobileMenu = true }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useUserPreferences();
  const location = useLocation();

  // Ensure CRM tab always visible and highlighted when on CRM routes
  const crmActive = location.pathname.startsWith("/crm");

  // Cleaned up toggleSidebar logic for clarity
  const toggleSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      sidebar.classList.toggle('sidebar-open');
    }
  };

  return (
    <header className={cn('border-b flex items-center justify-between px-4 h-14', className)} role="banner">
      <div className="flex items-center">
        {showMobileMenu && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              const sidebar = document.querySelector('[data-sidebar]');
              if (sidebar) sidebar.classList.toggle('sidebar-open');
            }}
            className="md:hidden"
            aria-label={t('toggleMenu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="flex items-center mr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          aria-label={t('home')}
        >
          <Building className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold hidden md:block">PropertyFlow</span>
        </Link>
        {/* CRM button always visible and clearly styled */}
        <Link to="/crm" className="ml-2">
          <Button
            variant={crmActive ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            aria-label={t('crm') || "CRM"}
            data-testid="crm-menu"
          >
            <PhoneCall className="h-4 w-4" />
            <span className="hidden sm:inline">{t('crm') || "CRM"}</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
