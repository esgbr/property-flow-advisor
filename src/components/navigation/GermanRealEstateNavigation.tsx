
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Euro, 
  Calculator, 
  Map, 
  FileText, 
  Receipt, 
  PieChart, 
  Globe,
  Landmark,
  PiggyBank,
  BarChart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  isGerman?: boolean;
}

export const GermanRealEstateNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  
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
    }
  ];

  return (
    <div className="my-4">
      <h3 className={cn("text-sm font-medium mb-2", isMobile ? "px-2" : "px-3")}>
        {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
      </h3>
      <div className={cn("grid gap-2", isMobile ? "grid-cols-1 px-1" : "grid-cols-2 px-2")}>
        {germanInvestorTools.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default GermanRealEstateNavigation;
