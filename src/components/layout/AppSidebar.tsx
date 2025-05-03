
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, Book, Building, Calculator, Calendar, FileText, Home, 
  LayoutDashboard, LineChart, Map, Settings2, Star, School, Building2, Banknote, RefreshCw, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const AppSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { preferences } = useUserPreferences();

  // Define navigation items
  const navigationItems = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: t('investorDashboard'),
      href: '/investor-dashboard',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      name: t('investorTools'),
      href: '/investor-tools',
      icon: <Banknote className="h-5 w-5" />,
      new: true,
    },
    {
      name: t('properties'),
      href: '/properties',
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: t('calculators'),
      href: '/calculators',
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: "1031 Exchange Tracker",
      href: '/exchange-tracker',
      icon: <RefreshCw className="h-5 w-5" />,
      new: true,
    },
    {
      name: "Partner Matching",
      href: '/partner-matching',
      icon: <Users className="h-5 w-5" />,
      new: true,
    },
    {
      name: t('schedule'),
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: t('decision'),
      href: '/decision',
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      name: t('refurbishment'),
      href: '/refurbishment',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: t('rewards'),
      href: '/rewards',
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: t('education'),
      href: '/education',
      icon: <School className="h-5 w-5" />,
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: <Settings2 className="h-5 w-5" />,
    },
  ];

  return (
    <Sidebar>
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <Link to="/" className="flex items-center mb-10">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold ml-2">PropertyFlow</span>
          </Link>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md group transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                <span className="ml-3 flex-1">{item.name}</span>
                {item.new && (
                  <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {t('new')}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3">
          {preferences.name && (
            <div className="border-t pt-4 flex items-center">
              <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                {preferences.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{preferences.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{preferences.experienceLevel}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
