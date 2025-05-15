
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, Building, Calculator, Calendar, Settings2, Star, 
  School, Building2, Banknote, RefreshCw, Users, Euro, 
  PieChart, BarChart, Globe, LayoutDashboard, Home,
  LineChart, Shield, FileText, ArrowLeftRight, Map, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMarketFilter } from '@/hooks/use-market-filter';

// Define navigation item type for better type safety
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  new?: boolean;
  hide?: boolean;
  marketSpecific?: string | string[];
  priority?: number;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const AppSidebar = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { preferences } = useUserPreferences();
  const { userMarket } = useMarketFilter();
  
  const isGermanMarket = userMarket === 'germany' || userMarket === 'austria';

  // Organize navigation items by category for better structure
  const navigationCategories: NavCategory[] = [
    {
      title: t('mainNavigation'),
      items: [
        {
          name: language === 'de' ? 'CRM' : 'CRM',
          href: '/crm',
          icon: <Users className="h-5 w-5" />,
          priority: 10
        },
        {
          name: t('dashboard'),
          href: '/dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />,
          priority: 20
        },
        {
          name: t('investorDashboard'),
          href: '/investor-dashboard',
          icon: <Building2 className="h-5 w-5" />,
          priority: 30
        },
        {
          name: t('properties'),
          href: '/properties',
          icon: <Building className="h-5 w-5" />,
          priority: 40
        }
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
          marketSpecific: ['germany', 'austria', 'usa']
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
          name: isGermanMarket ? 
            (language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools') : 
            (language === 'de' ? 'Alle Tools' : 'All Tools'),  
          href: isGermanMarket ? '/deutsche-immobilien-tools' : '/tools',
          icon: <Banknote className="h-5 w-5" />,
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
        {
          name: t('education'),
          href: '/education',
          icon: <School className="h-5 w-5" />,
        },
        {
          name: language === 'de' ? 'Steuerplanung' : 'Tax Planning',
          href: '/tax-planning',
          icon: <Euro className="h-5 w-5" />,
          marketSpecific: ['germany', 'austria']
        }
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
          name: t('profile'),
          href: '/profile',
          icon: <User className="h-5 w-5" />,
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
  const renderNavItem = (item: NavItem) => {
    // Skip hidden items
    if (item.hide) return null;
    
    // Skip items that are not relevant for the current market
    if (item.marketSpecific) {
      const marketSpecific = Array.isArray(item.marketSpecific) 
        ? item.marketSpecific 
        : [item.marketSpecific];
      
      if (!marketSpecific.includes(userMarket) && userMarket) {
        return null;
      }
    }
    
    return (
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
        role="menuitem"
        tabIndex={0}
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
  };

  // Sort main navigation items based on priority
  const sortNavItems = (items: NavItem[]) => {
    return [...items].sort((a, b) => {
      const priorityA = a.priority || 100;
      const priorityB = b.priority || 100;
      return priorityA - priorityB;
    });
  };

  // Render a category with its items
  const renderCategory = (category: NavCategory, idx: number) => {
    // Sort items if it's the main navigation category
    const categoryItems = idx === 0 ? sortNavItems(category.items) : category.items;
    
    // Filter items based on market specificity
    const visibleItems = categoryItems.filter(item => !item.hide);
    
    if (visibleItems.length === 0) return null;
    
    return (
      <div key={idx} className="mb-6" role="menu" aria-label={category.title}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          {category.title}
        </h3>
        <div className="space-y-1">
          {visibleItems.map(renderNavItem)}
        </div>
      </div>
    );
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <Link to="/dashboard" className="flex items-center mb-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md">
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
