import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Euro, 
  Calculator, 
  Map, 
  FileText, 
  Receipt, 
  Globe,
  Landmark,
  PiggyBank,
  BarChart,
  Home,
  Scale,
  Hammer,
  FileCheck,
  PanelLeft,
  Handshake,
  Users,
  Briefcase,
  Shield,
  LineChart
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
  isGerman?: boolean;
}

export const GermanInvestorNavigation: React.FC<{variant: 'grid' | 'list', maxItems?: number}> = ({variant, maxItems}) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { preferences } = useUserPreferences();
  
  // Get current active tab from URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || '';
  
  // Check if user selected Germany as their investment market
  const showGermanTools = !preferences.investmentMarket || 
                          preferences.investmentMarket === 'germany' || 
                          preferences.investmentMarket === 'austria';
  
  // If user has selected a different market, don't show German-specific tools
  if (!showGermanTools) {
    return null;
  }
  
  const germanInvestorTools: NavigationItem[] = [
    { 
      name: language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax', 
      path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer', 
      icon: <Euro className="h-4 w-4 mr-2" />, 
      description: language === 'de' ? 'Steuerberechnung für jedes Bundesland' : 'Tax calculation for each German state',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Mietkauf' : 'Rent-to-Own', 
      path: '/deutsche-immobilien-tools?tab=mietkauf', 
      icon: <Landmark className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Berechnung für Mietkauf-Optionen' : 'Calculation for rent-to-own options',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'AfA-Rechner' : 'Depreciation', 
      path: '/deutsche-immobilien-tools?tab=afa', 
      icon: <PiggyBank className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Steuerabschreibungen berechnen' : 'Calculate tax depreciation',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Mietspiegel' : 'Rent Index', 
      path: '/deutsche-immobilien-tools?tab=mietspiegel', 
      icon: <Map className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Mietpreise in deutschen Städten vergleichen' : 'Compare rental prices in German cities',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Energieausweis' : 'Energy Certificate', 
      path: '/deutsche-immobilien-tools?tab=energieausweis', 
      icon: <FileText className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Energieeffizienz analysieren' : 'Analyze energy efficiency',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Nebenkosten' : 'Additional Costs', 
      path: '/deutsche-immobilien-tools?tab=nebenkosten', 
      icon: <Receipt className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Nebenkosten und Betriebskosten berechnen' : 'Calculate additional costs and operating expenses',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'KfW-Förderung' : 'KfW Funding', 
      path: '/deutsche-immobilien-tools?tab=kfw', 
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'KfW-Fördermittel für Immobilien finden' : 'Find KfW funding for real estate',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Mietpreisbremse' : 'Rent Control', 
      path: '/deutsche-immobilien-tools?tab=mietpreisbremse', 
      icon: <Shield className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Mietpreisregulierung prüfen' : 'Check rent control regulations',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Baufinanzierung' : 'Construction Financing', 
      path: '/deutsche-immobilien-tools?tab=baufinanzierung', 
      icon: <Home className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Baufinanzierung berechnen' : 'Calculate construction financing',
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Grundbuch-Analyse' : 'Land Registry', 
      path: '/deutsche-immobilien-tools?tab=grundbuchauszug', 
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      description: language === 'de' ? 'Grundbuchauszüge verstehen' : 'Understand land registry extracts',
      isGerman: true 
    }
  ];

  const displayedTools = germanInvestorTools.slice(0, maxItems);

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {displayedTools.map((item) => {
          const isActive = location.pathname.includes('/deutsche-immobilien-tools') && 
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
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {displayedTools.map((item) => {
        const isActive = location.pathname.includes('/deutsche-immobilien-tools') && 
                        currentTab === item.path.split('tab=')[1];
        return (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-start p-4 rounded-md transition-colors border",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "hover:bg-muted border-muted"
              )
            }
            title={item.description}
          >
            <div className="mb-2">{item.icon}</div>
            <span className="text-lg font-medium truncate">{item.name}</span>
            <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
          </NavLink>
        );
      })}
    </div>
  );
};

export default GermanInvestorNavigation;
