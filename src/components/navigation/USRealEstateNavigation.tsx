
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Calculator, 
  FileText,
  Home,
  Landmark,
  Scale,
  FileCheck,
  BarChart,
  PiggyBank,
  Briefcase,
  Shield,
  Map,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  isUSA?: boolean;
}

export const USRealEstateNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { preferences } = useUserPreferences();
  
  // Get current active tab from URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || '';
  
  // Check if user selected USA as their investment market
  const showUSTools = preferences.investmentMarket === 'usa' || preferences.investmentMarket === 'canada';
  
  // If user has selected a different market, don't show US-specific tools
  if (!showUSTools) {
    return null;
  }
  
  const usInvestorTools: NavigationItem[] = [
    { 
      name: '1031 Exchange', 
      path: '/us-real-estate-tools?tab=1031-exchange', 
      icon: <Calculator className="h-4 w-4 mr-2" />, 
      description: 'Calculate tax-deferred exchanges',
      isUSA: true 
    },
    { 
      name: 'Property Tax', 
      path: '/us-real-estate-tools?tab=property-tax', 
      icon: <Home className="h-4 w-4 mr-2" />,
      description: 'Property tax calculations by state',
      isUSA: true 
    },
    { 
      name: 'Depreciation Schedule', 
      path: '/us-real-estate-tools?tab=depreciation', 
      icon: <PiggyBank className="h-4 w-4 mr-2" />,
      description: 'Calculate property depreciation',
      isUSA: true 
    },
    { 
      name: 'Market Data', 
      path: '/us-real-estate-tools?tab=market-data', 
      icon: <Map className="h-4 w-4 mr-2" />,
      description: 'Real estate market analytics',
      isUSA: true 
    },
    { 
      name: 'Mortgage Calculator', 
      path: '/us-real-estate-tools?tab=mortgage', 
      icon: <Calculator className="h-4 w-4 mr-2" />,
      description: 'Calculate mortgage payments',
      isUSA: true 
    },
    { 
      name: 'REITs Analysis', 
      path: '/us-real-estate-tools?tab=reits', 
      icon: <BarChart className="h-4 w-4 mr-2" />,
      description: 'Analyze Real Estate Investment Trusts',
      isUSA: true 
    },
    { 
      name: 'LLC Formation', 
      path: '/us-real-estate-tools?tab=llc', 
      icon: <FileText className="h-4 w-4 mr-2" />,
      description: 'Guide to forming an LLC for real estate',
      isUSA: true 
    },
    { 
      name: 'Title Insurance', 
      path: '/us-real-estate-tools?tab=title-insurance', 
      icon: <Shield className="h-4 w-4 mr-2" />,
      description: 'Title insurance calculator and information',
      isUSA: true 
    },
    { 
      name: 'Fannie Mae/Freddie Mac', 
      path: '/us-real-estate-tools?tab=fannie-freddie', 
      icon: <Landmark className="h-4 w-4 mr-2" />,
      description: 'Information on federal mortgage programs',
      isUSA: true 
    },
    { 
      name: 'HOA Analysis', 
      path: '/us-real-estate-tools?tab=hoa', 
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      description: 'Understand and analyze HOA terms',
      isUSA: true 
    }
  ];

  // Display compact list on smaller screens
  if (isMobile) {
    return (
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {usInvestorTools.map((item) => {
          const isActive = location.pathname.includes('/us-real-estate-tools') && 
                          currentTab === item.path.split('tab=')[1];
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "outline"}
              size="sm"
              asChild
              className="flex-shrink-0"
            >
              <NavLink 
                to={item.path}
                title={item.description}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </NavLink>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="my-4">
      <h3 className={cn("text-sm font-medium mb-2", isMobile ? "px-2" : "px-3")}>
        US Real Estate Tools
      </h3>
      <div className={cn("grid gap-2", isMobile ? "grid-cols-1 px-1" : "grid-cols-2 px-2")}>
        {usInvestorTools.map((item) => {
          const isActive = location.pathname.includes('/us-real-estate-tools') && 
                          currentTab === item.path.split('tab=')[1];
          return (
            <NavLink 
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "flex items-center p-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )
              }
              title={item.description}
            >
              {item.icon}
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default USRealEstateNavigation;
