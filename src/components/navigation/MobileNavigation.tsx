
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Home, 
  Building, 
  Calculator, 
  BarChart3, 
  Map, 
  Settings, 
  Euro
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              {React.cloneElement(item.icon, { 
                className: cn(
                  item.icon.props.className,
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              })}
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
