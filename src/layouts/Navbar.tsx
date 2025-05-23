
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Building, PhoneCall } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import EnhancedLanguageSwitcher from '@/components/language/EnhancedLanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from '@/components/auth/UserMenu';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import CRMMenuButton from '@/components/navigation/CRMMenuButton';

interface NavbarProps {
  className?: string;
  showMobileMenu?: boolean;
}

// A separated CRM NavButton for reusability and clarity
const CRMNavButton: React.FC<{ active: boolean; label: string }> = ({ active, label }) => (
  <Link to="/crm" className="ml-2">
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-2"
      aria-label={label}
      data-testid="crm-menu"
    >
      <PhoneCall className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  </Link>
);

const Navbar: React.FC<NavbarProps> = ({ className, showMobileMenu = true }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useUserPreferences();
  const location = useLocation();
  const isCrmActive = location.pathname.startsWith('/crm');

  const handleToggleSidebar = () => {
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) sidebar.classList.toggle('sidebar-open');
  };

  return (
    <header className={cn('border-b flex items-center justify-between px-4 h-14 sticky top-0 z-50 bg-background', className)} role="banner">
      <div className="flex items-center">
        {showMobileMenu && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleSidebar}
            className="md:hidden"
            aria-label={t ? t('toggleMenu') : 'Toggle Menu'}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="flex items-center mr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          aria-label={t ? t('home') : 'Home'}
        >
          <Building className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold hidden md:block">PropertyFlow</span>
        </Link>
        {/* Always show CRM menu button and keep styling consistent */}
        <CRMNavButton active={isCrmActive} label={t ? t('crm') : 'CRM'} />
      </div>

      <div className="flex items-center space-x-2">
        <EnhancedLanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
