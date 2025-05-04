
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
  id: string;
  titleEn: string;
  titleDe: string;
  path: string;
  icon: React.ElementType;
  descriptionEn?: string;
  descriptionDe?: string;
  isGerman?: boolean;
}

// Export the tools array so it can be used by other components
export const germanInvestmentTools: NavigationItem[] = [
  { 
    id: 'grunderwerbsteuer',
    titleEn: 'Transfer Tax', 
    titleDe: 'Grunderwerbsteuer',
    path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer', 
    icon: Euro, 
    descriptionEn: 'Tax calculation for each German state',
    descriptionDe: 'Steuerberechnung für jedes Bundesland',
    isGerman: true 
  },
  { 
    id: 'mietkauf',
    titleEn: 'Rent-to-Own',
    titleDe: 'Mietkauf',
    path: '/deutsche-immobilien-tools?tab=mietkauf', 
    icon: Landmark,
    descriptionEn: 'Calculation for rent-to-own options',
    descriptionDe: 'Berechnung für Mietkauf-Optionen',
    isGerman: true 
  },
  { 
    id: 'afa',
    titleEn: 'Depreciation',
    titleDe: 'AfA-Rechner',
    path: '/deutsche-immobilien-tools?tab=afa', 
    icon: PiggyBank,
    descriptionEn: 'Calculate tax depreciation',
    descriptionDe: 'Steuerabschreibungen berechnen',
    isGerman: true 
  },
  { 
    id: 'mietspiegel',
    titleEn: 'Rent Index',
    titleDe: 'Mietspiegel',
    path: '/deutsche-immobilien-tools?tab=mietspiegel', 
    icon: Map,
    descriptionEn: 'Compare rental prices in German cities',
    descriptionDe: 'Mietpreise in deutschen Städten vergleichen',
    isGerman: true 
  },
  { 
    id: 'energieausweis',
    titleEn: 'Energy Certificate',
    titleDe: 'Energieausweis',
    path: '/deutsche-immobilien-tools?tab=energieausweis', 
    icon: FileText,
    descriptionEn: 'Analyze energy efficiency',
    descriptionDe: 'Energieeffizienz analysieren',
    isGerman: true 
  },
  { 
    id: 'nebenkosten',
    titleEn: 'Additional Costs',
    titleDe: 'Nebenkosten',
    path: '/deutsche-immobilien-tools?tab=nebenkosten', 
    icon: Receipt,
    descriptionEn: 'Calculate additional costs and operating expenses',
    descriptionDe: 'Nebenkosten und Betriebskosten berechnen',
    isGerman: true 
  },
  { 
    id: 'kfw',
    titleEn: 'KfW Funding',
    titleDe: 'KfW-Förderung',
    path: '/deutsche-immobilien-tools?tab=kfw', 
    icon: Briefcase,
    descriptionEn: 'Find KfW funding for real estate',
    descriptionDe: 'KfW-Fördermittel für Immobilien finden',
    isGerman: true 
  },
  { 
    id: 'mietpreisbremse',
    titleEn: 'Rent Control',
    titleDe: 'Mietpreisbremse',
    path: '/deutsche-immobilien-tools?tab=mietpreisbremse', 
    icon: Shield,
    descriptionEn: 'Check rent control regulations',
    descriptionDe: 'Mietpreisregulierung prüfen',
    isGerman: true 
  },
  { 
    id: 'baufinanzierung',
    titleEn: 'Construction Financing',
    titleDe: 'Baufinanzierung',
    path: '/deutsche-immobilien-tools?tab=baufinanzierung', 
    icon: Home,
    descriptionEn: 'Calculate construction financing',
    descriptionDe: 'Baufinanzierung berechnen',
    isGerman: true 
  },
  { 
    id: 'grundbuchauszug',
    titleEn: 'Land Registry',
    titleDe: 'Grundbuch-Analyse',
    path: '/deutsche-immobilien-tools?tab=grundbuchauszug', 
    icon: FileCheck,
    descriptionEn: 'Understand land registry extracts',
    descriptionDe: 'Grundbuchauszüge verstehen',
    isGerman: true 
  },
  { 
    id: 'renditerechner',
    titleEn: 'Yield Calculator',
    titleDe: 'Renditerechner',
    path: '/deutsche-immobilien-tools?tab=renditerechner', 
    icon: Calculator,
    descriptionEn: 'Calculate ROI for German properties',
    descriptionDe: 'Berechne die Rendite für deutsche Immobilien',
    isGerman: true 
  },
  { 
    id: 'wertermittlung',
    titleEn: 'Property Valuation',
    titleDe: 'Wertermittlung',
    path: '/deutsche-immobilien-tools?tab=wertermittlung', 
    icon: LineChart,
    descriptionEn: 'Calculate property value estimates',
    descriptionDe: 'Immobilienwert schätzen',
    isGerman: true 
  }
];

interface GermanInvestorNavigationProps {
  variant?: 'grid' | 'list'; 
  maxItems?: number;
}

export const GermanInvestorNavigation: React.FC<GermanInvestorNavigationProps> = ({
  variant = 'grid', 
  maxItems = germanInvestmentTools.length
}) => {
  const { language } = useLanguage();
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
  
  const displayedTools = germanInvestmentTools.slice(0, maxItems);

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {displayedTools.map((item) => {
          const isActive = location.pathname.includes('/deutsche-immobilien-tools') && 
                          currentTab === item.id;
          return (
            <NavLink 
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "flex items-center p-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )
              }
              title={language === 'de' ? item.descriptionDe : item.descriptionEn}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span className="truncate">{language === 'de' ? item.titleDe : item.titleEn}</span>
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
                        currentTab === item.id;
        return (
          <NavLink 
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-start p-4 rounded-md transition-colors border",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "hover:bg-muted border-muted"
              )
            }
            title={language === 'de' ? item.descriptionDe : item.descriptionEn}
          >
            <div className="mb-2">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-lg font-medium truncate">
              {language === 'de' ? item.titleDe : item.titleEn}
            </span>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {language === 'de' ? item.descriptionDe : item.descriptionEn}
            </p>
          </NavLink>
        );
      })}
    </div>
  );
};

export default GermanInvestorNavigation;
