
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, Building, Calculator, Calendar, Settings2, Star, 
  School, Building2, Banknote, RefreshCw, Users, Euro, 
  PieChart, BarChart, Globe, LayoutDashboard, Home,
  LineChart, Shield, FileText, ArrowLeftRight, Map
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

// Define navigation item type for better type safety
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  new?: boolean;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const AppSidebar = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { preferences } = useUserPreferences();

  // Organize navigation items by category for better structure
  const navigationCategories: NavCategory[] = [
    {
      title: t('mainNavigation'),
      items: [
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
          name: t('properties'),
          href: '/properties',
          icon: <Building className="h-5 w-5" />,
        },
      ]
    },
    {
      title: language === 'de' ? 'Markt & Analyse' : 'Market & Analysis',
      items: [
        {
          name: language === 'de' ? 'Marktexplorer' : 'Market Explorer',
          href: '/market-explorer',
          icon: <Globe className="h-5 w-5" />,
        },
        {
          name: language === 'de' ? 'Marktvergleich' : 'Market Comparison',
          href: '/market-comparison',
          icon: <ArrowLeftRight className="h-5 w-5" />,
          new: true,
        },
        {
          name: language === 'de' ? 'Regionale Analyse' : 'Regional Analysis',
          href: '/regional-analysis',
          icon: <Map className="h-5 w-5" />,
          new: true,
        },
        {
          name: language === 'de' ? 'Erweiterte Analysen' : 'Advanced Analytics',
          href: '/advanced-analytics',
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ]
    },
    {
      title: t('tools'),
      items: [
        {
          name: t('investorTools'),
          href: '/investor-tools',
          icon: <Banknote className="h-5 w-5" />,
          new: true,
        },
        {
          name: t('calculators'),
          href: '/calculators',
          icon: <Calculator className="h-5 w-5" />,
        },
        {
          name: t('investmentCalculator'),
          href: '/investment-calculator',
          icon: <PieChart className="h-5 w-5" />,
          new: true,
        },
        {
          name: t('portfolioOptimization'),
          href: '/portfolio-optimization',
          icon: <BarChart className="h-5 w-5" />,
          new: true,
        },
      ]
    },
    {
      title: t('specializedTools'),
      items: [
        {
          name: t('exchangeTracker'),
          href: '/exchange-tracker',
          icon: <RefreshCw className="h-5 w-5" />,
          new: true,
        },
        {
          name: t('partnerMatching'),
          href: '/partner-matching',
          icon: <Users className="h-5 w-5" />,
          new: true,
        },
        {
          name: t('deutscheImmobilienTools'),
          href: '/deutsche-immobilien-tools',
          icon: <Euro className="h-5 w-5" />,
          new: true,
        },
      ]
    },
    {
      title: t('planning'),
      items: [
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
      ]
    },
    {
      title: t('more'),
      items: [
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
          name: t('features'),
          href: '/features',
          icon: <Globe className="h-5 w-5" />,
          new: true,
        },
        {
          name: t('settings'),
          href: '/settings',
          icon: <Settings2 className="h-5 w-5" />,
        },
        {
          name: t('security'),
          href: '/settings?tab=security',
          icon: <Shield className="h-5 w-5" />,
          new: true,
        },
      ]
    }
  ];

  // Render a nav item
  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.href}
      to={item.href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md group transition-colors",
        location.pathname === item.href
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
      aria-current={location.pathname === item.href ? "page" : undefined}
    >
      {item.icon}
      <span className="ml-3 flex-1">{item.name}</span>
      {item.new && (
        <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
          {t('new')}
        </span>
      )}
    </Link>
  );

  // Render a category with its items
  const renderCategory = (category: NavCategory, idx: number) => (
    <div key={idx} className="mb-6">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
        {category.title}
      </h3>
      <div className="space-y-1">
        {category.items.map(renderNavItem)}
      </div>
    </div>
  );

  return (
    <Sidebar>
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <Link to="/" className="flex items-center mb-6">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold ml-2">PropertyFlow</span>
          </Link>
          
          {navigationCategories.map(renderCategory)}
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
