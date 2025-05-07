
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Link } from 'react-router-dom';
import { Building, Menu, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useIsMobile } from '@/hooks/use-mobile';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

interface StickyTopNavProps {
  onToggleSidebar?: () => void;
}

const StickyTopNav: React.FC<StickyTopNavProps> = ({ onToggleSidebar }) => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const { largeText } = useAccessibility();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isGerman = language === 'de' || preferences.investmentMarket === 'germany';
  
  const mainMenuItems = [
    { label: t('dashboard'), path: '/dashboard' },
    { label: t('properties'), path: '/properties' },
    { label: t('analytics'), path: '/market-explorer' },
  ];

  // Show German tools only for German market or language
  const toolsLabel = isGerman ? 'Immobilien-Tools' : 'Tools';
  const toolsPath = isGerman ? '/deutsche-immobilien-tools' : '/tools';

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-200 backdrop-blur-sm",
        isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent",
        largeText ? "py-3" : "py-2"
      )}
      role="navigation"
      aria-label="Top Navigation"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and hamburger */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="md:hidden"
              aria-label={t('toggleMenu')}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold text-primary"
            aria-label="Home"
          >
            <Building className="h-5 w-5" />
            {!isMobile && <span>PropertyFlow</span>}
          </Link>
        </div>

        {/* Main navigation for desktop */}
        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainMenuItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link to={item.path} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>{toolsLabel}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <Link to={toolsPath} className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {toolsLabel}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {t('toolsDescription')}
                      </p>
                    </Link>
                    <div className="grid gap-2">
                      <Link to="/calculators" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">{t('calculators')}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('calculatorsDescription')}
                        </p>
                      </Link>
                      <Link to="/market-comparison" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">{t('marketComparison')}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('compareMarketsDescription')}
                        </p>
                      </Link>
                      <Link to="/tax-planning" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">{t('taxPlanning')}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('taxPlanningDescription')}
                        </p>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label={t('search')}>
            <Search className="h-5 w-5" />
          </Button>
          {isMobile && (
            <Button variant="outline" size="sm" className="gap-1">
              {toolsLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyTopNav;
