
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Euro, 
  Calculator, 
  Map, 
  FileText, 
  BarChart, 
  PieChart, 
  Globe
} from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  isGerman?: boolean;
}

export const GermanRealEstateNavigation: React.FC = () => {
  const { t, language } = useLanguage();
  
  const germanInvestorTools: NavigationItem[] = [
    { 
      name: language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax', 
      path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer', 
      icon: <Euro className="h-4 w-4 mr-2" />, 
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Mietkauf' : 'Rent-to-Own', 
      path: '/deutsche-immobilien-tools?tab=mietkauf', 
      icon: <Building className="h-4 w-4 mr-2" />, 
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'AfA-Rechner' : 'Depreciation', 
      path: '/deutsche-immobilien-tools?tab=afa', 
      icon: <Calculator className="h-4 w-4 mr-2" />, 
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Mietspiegel' : 'Rent Index', 
      path: '/deutsche-immobilien-tools?tab=mietspiegel', 
      icon: <Map className="h-4 w-4 mr-2" />, 
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Energieausweis' : 'Energy Certificate', 
      path: '/deutsche-immobilien-tools?tab=energieausweis', 
      icon: <FileText className="h-4 w-4 mr-2" />, 
      isGerman: true 
    },
    { 
      name: language === 'de' ? 'Nebenkosten' : 'Additional Costs', 
      path: '/deutsche-immobilien-tools?tab=nebenkosten', 
      icon: <Calculator className="h-4 w-4 mr-2" />, 
      isGerman: true 
    }
  ];

  return (
    <div className="my-4">
      <h3 className="text-sm font-medium px-3 mb-2">
        {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
      </h3>
      <div className="grid grid-cols-2 gap-2 px-2">
        {germanInvestorTools.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center p-2 rounded-md text-sm ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`
            }
          >
            {item.icon}
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
