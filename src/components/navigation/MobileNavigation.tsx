
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Home, 
  Building, 
  Calculator, 
  Settings, 
  Euro,
  BarChart3,
  Landmark,
  PiggyBank,
  Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: t('dashboard'), path: '/dashboard' },
    { icon: <Building className="h-5 w-5" />, label: t('properties'), path: '/properties' },
    { icon: <BarChart3 className="h-5 w-5" />, label: t('investorDashboard'), path: '/investor-dashboard' },
    { icon: <Euro className="h-5 w-5" />, label: language === 'de' ? 'DE Tools' : 'DE Tools', path: '/german-investor' },
    { icon: <Settings className="h-5 w-5" />, label: t('settings'), path: '/settings' }
  ];

  // Add quick access to popular German tools if on German investor page
  const isGermanInvestorPage = location.pathname === '/german-investor' || location.pathname === '/deutsche-immobilien-tools';
  
  // German quick access tools shown when on German pages
  const germanQuickTools = [
    { icon: <Euro className="h-5 w-5" />, 
      label: language === 'de' ? 'Steuer' : 'Tax', 
      path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer' 
    },
    { icon: <Landmark className="h-5 w-5" />, 
      label: language === 'de' ? 'Mietkauf' : 'Rent-to-Own', 
      path: '/deutsche-immobilien-tools?tab=mietkauf' 
    },
    { icon: <PiggyBank className="h-5 w-5" />, 
      label: language === 'de' ? 'AfA' : 'Deprec.', 
      path: '/deutsche-immobilien-tools?tab=afa' 
    },
    { icon: <Map className="h-5 w-5" />, 
      label: language === 'de' ? 'Mietspiegel' : 'Rent Index', 
      path: '/deutsche-immobilien-tools?tab=mietspiegel' 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      {isGermanInvestorPage && (
        <div className="grid grid-cols-4 h-12 border-b border-border/30">
          {germanQuickTools.map((item) => {
            const isActive = location.pathname + location.search === item.path;
            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-0.5 transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
              >
                {React.cloneElement(item.icon, { 
                  className: cn(
                    item.icon.props.className,
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                })}
                <span className="text-xs truncate max-w-[90%]">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-5 h-16">
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
            >
              {React.cloneElement(item.icon, { 
                className: cn(
                  item.icon.props.className,
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              })}
              <span className="text-xs truncate max-w-[90%]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
