
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
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const MobileNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { highContrast, largeText } = useAccessibility();
  
  // Simplified navigation items
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: t('dashboard'), path: '/dashboard' },
    { icon: <Building className="h-5 w-5" />, label: t('properties'), path: '/properties' },
    { icon: <BarChart3 className="h-5 w-5" />, label: t('investorDashboard'), path: '/investor-dashboard' },
    { icon: <Search className="h-5 w-5" />, label: t('search'), path: '/search' },
    { icon: <User className="h-5 w-5" />, label: t('profile'), path: '/profile' }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg",
      highContrast ? "border-t-2" : "border-t"
    )}>
      <div className={cn("grid grid-cols-5 h-16", largeText ? "h-20" : "h-16")}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
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
            </button>
          );
        })}
      </div>
      
      {/* More button sheet for additional options */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost" 
            size="sm" 
            className={cn(
              "absolute right-4 -top-10 bg-background shadow-md rounded-t-md border-t border-l border-r",
              highContrast ? "border-2" : ""
            )}
          >
            <Menu className="h-4 w-4 mr-2" />
            <span className={largeText ? "text-base" : ""}>
              {t('more')}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className={highContrast ? "border-t-2" : ""}>
          <SheetHeader>
            <SheetTitle className={largeText ? "text-xl" : ""}>
              {t('moreOptions')}
            </SheetTitle>
            <SheetDescription className={largeText ? "text-base" : ""}>
              {t('accessAdditionalFeatures')}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4 py-6">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col"
              onClick={() => {
                navigate('/settings');
              }}
            >
              <Settings className="h-6 w-6 mb-2" />
              {t('settings')}
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col"
              onClick={() => {
                navigate('/calculators');
              }}
            >
              <Calculator className="h-6 w-6 mb-2" />
              {t('calculators')}
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col"
              onClick={() => {
                navigate('/accessibility');
              }}
            >
              <Settings className="h-6 w-6 mb-2" />
              {t('accessibility')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
