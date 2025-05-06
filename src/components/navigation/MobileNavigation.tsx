
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Home, 
  Building, 
  Calculator, 
  Settings, 
  BarChart3,
  Menu,
  User,
  Search,
  Bell,
  Compass,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Badge } from '@/components/ui/badge';

// Define correct type for navigation items with optional badge
interface NavItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  badge?: number;
}

export const MobileNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences, isAuthenticated } = useUserPreferences();
  const { highContrast, largeText } = useAccessibility();
  const { userMarket } = useMarketFilter();
  const [showQuickActions, setShowQuickActions] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(2);
  
  // Market-aware navigation items
  const getNavItems = () => {
    const baseItems: NavItem[] = [
      { icon: <Home className="h-5 w-5" />, label: t('dashboard'), path: '/dashboard' },
      { icon: <Building className="h-5 w-5" />, label: t('properties'), path: '/properties' },
      { icon: <BarChart3 className="h-5 w-5" />, label: t('investorDashboard'), path: '/investor-dashboard' }
    ];
    
    // Add market-specific tools
    baseItems.push({ 
      icon: <Calculator className="h-5 w-5" />, 
      label: t('tools'), 
      path: '/tools'
    });
    
    // Add profile or notifications item
    if (isAuthenticated) {
      baseItems.push({ 
        icon: <Bell className="h-5 w-5" />, 
        label: t('notifications'), 
        path: '/notifications',
        badge: unreadNotifications > 0 ? unreadNotifications : undefined
      });
    } else {
      baseItems.push({ 
        icon: <User className="h-5 w-5" />, 
        label: t('profile'), 
        path: '/profile'
      });
    }
    
    return baseItems;
  };
  
  const navItems = getNavItems();

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg",
        highContrast ? "border-t-2" : "border-t"
      )}>
        <div className={cn("grid grid-cols-5", largeText ? "h-20" : "h-16")}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors relative",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={cn(
                  "rounded-full p-1",
                  isActive ? "bg-primary/10" : ""
                )}>
                  {React.cloneElement(item.icon, { 
                    className: cn(
                      item.icon.props.className,
                      isActive ? "text-primary" : "text-muted-foreground"
                    )
                  })}
                </div>
                <span className={cn(
                  "truncate max-w-[90%]", 
                  largeText ? "text-sm" : "text-xs"
                )}>
                  {item.label}
                </span>
                
                {item.badge && (
                  <span className="absolute top-0 right-1/4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Quick actions panel */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div 
              className="absolute bottom-full left-0 right-0 bg-background border-t border-l border-r rounded-t-lg shadow-lg p-4"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mb-2 flex justify-between items-center">
                <h3 className="font-medium text-sm">
                  {language === 'de' ? 'Schnellzugriffe' : 'Quick Actions'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-auto"
                  onClick={() => setShowQuickActions(false)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center h-auto py-2"
                  onClick={() => navigate('/calculators')}
                >
                  <Calculator className="h-4 w-4 mb-1" />
                  <span className="text-xs">{t('calculators')}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center h-auto py-2"
                  onClick={() => navigate('/market-explorer')}
                >
                  <Search className="h-4 w-4 mb-1" />
                  <span className="text-xs">
                    {language === 'de' ? 'Markt' : 'Market'}
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center h-auto py-2"
                  onClick={() => navigate(isAuthenticated ? '/profile' : '/auth')}
                >
                  <User className="h-4 w-4 mb-1" />
                  <span className="text-xs">
                    {isAuthenticated ? t('profile') : t('login')}
                  </span>
                </Button>
              </div>
              
              {/* Market indicator */}
              {userMarket !== 'global' && (
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-xs">
                    {language === 'de' ? 'Markt' : 'Market'}: {userMarket.toUpperCase()}
                  </Badge>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* More button */}
      <Button
        variant="secondary" 
        size="sm" 
        className={cn(
          "fixed bottom-20 right-4 shadow-md rounded-full",
          highContrast ? "border-2" : "border"
        )}
        onClick={() => setShowQuickActions(!showQuickActions)}
      >
        <Menu className="h-4 w-4 mr-2" />
        <span className={largeText ? "text-base" : ""}>
          {t('more')}
        </span>
      </Button>
      
      {/* Extended options sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost" 
            size="sm" 
            className={cn(
              "fixed left-4 bottom-20 bg-background shadow-md rounded-full",
              highContrast ? "border-2" : "border"
            )}
          >
            <Menu className="h-4 w-4 mr-2" />
            <span className={largeText ? "text-base" : ""}>
              {t('menu')}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={highContrast ? "border-r-2" : ""}>
          <SheetHeader>
            <SheetTitle className={largeText ? "text-xl" : ""}>
              {preferences.name || t('menu')}
            </SheetTitle>
            <SheetDescription className={largeText ? "text-base" : ""}>
              {t('accessAdditionalFeatures')}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 flex flex-col gap-1">
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="mr-2 h-5 w-5" />
              {t('dashboard')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/investor-dashboard')}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              {t('investorDashboard')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/properties')}
            >
              <Building className="mr-2 h-5 w-5" />
              {t('properties')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/tools')}
            >
              <Calculator className="mr-2 h-5 w-5" />
              {t('tools')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-5 w-5" />
              {t('settings')}
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => navigate('/regional-analysis')}
            >
              <Compass className="mr-2 h-5 w-5" />
              {language === 'de' ? 'Regionale Analyse' : 'Regional Analysis'}
            </Button>
          </div>
          
          {isAuthenticated && (
            <div className="pt-2 border-t">
              <div className="py-4 text-sm text-muted-foreground">
                {preferences.email}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/profile')}
              >
                {t('profile')}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNavigation;
