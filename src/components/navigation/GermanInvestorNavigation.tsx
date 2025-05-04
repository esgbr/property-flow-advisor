
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building,
  Euro,
  Calculator,
  Map,
  FileText,
  Receipt,
  PiggyBank,
  Landmark,
  BarChart,
  LineChart,
  Shield,
  Briefcase,
  Home,
  Scale,
  Hammer,
  FileCheck,
  PanelLeft,
  Handshake,
  Users,
  BadgePound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define all German real estate investment tools
const germanInvestmentTools = [
  {
    id: 'grunderwerbsteuer',
    titleDe: 'Grunderwerbsteuer-Rechner',
    titleEn: 'Transfer Tax Calculator',
    descriptionDe: 'Berechnung der Grunderwerbsteuer für verschiedene Bundesländer',
    descriptionEn: 'Calculate property transfer tax for different German states',
    icon: Euro,
    path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer'
  },
  {
    id: 'mietkauf',
    titleDe: 'Mietkauf-Rechner',
    titleEn: 'Rent-to-Own Calculator',
    descriptionDe: 'Analyse von Mietkauf-Modellen für Immobilien',
    descriptionEn: 'Analysis of rent-to-own models for properties',
    icon: Landmark,
    path: '/deutsche-immobilien-tools?tab=mietkauf'
  },
  {
    id: 'afa',
    titleDe: 'AfA-Rechner',
    titleEn: 'Depreciation Calculator',
    descriptionDe: 'Berechnung der steuerlichen Absetzung für Immobilien',
    descriptionEn: 'Calculate tax depreciation for real estate',
    icon: PiggyBank,
    path: '/deutsche-immobilien-tools?tab=afa'
  },
  {
    id: 'mietspiegel',
    titleDe: 'Mietspiegel-Analyse',
    titleEn: 'Rent Index Analysis',
    descriptionDe: 'Vergleich von Mietpreisen mit lokalen Mietspiegeln',
    descriptionEn: 'Compare rental prices with local rent indices',
    icon: Map,
    path: '/deutsche-immobilien-tools?tab=mietspiegel'
  },
  {
    id: 'energieausweis',
    titleDe: 'Energieausweis-Analyse',
    titleEn: 'Energy Certificate Analysis',
    descriptionDe: 'Analyse und Vergleich von Energieausweisen',
    descriptionEn: 'Analysis and comparison of energy certificates',
    icon: FileText,
    path: '/deutsche-immobilien-tools?tab=energieausweis'
  },
  {
    id: 'nebenkosten',
    titleDe: 'Nebenkosten-Rechner',
    titleEn: 'Additional Costs Calculator',
    descriptionDe: 'Berechnung von Nebenkosten für Mietobjekte',
    descriptionEn: 'Calculate additional costs for rental properties',
    icon: Receipt,
    path: '/deutsche-immobilien-tools?tab=nebenkosten'
  },
  {
    id: 'kfw',
    titleDe: 'KfW-Förderassistent',
    titleEn: 'KfW Funding Assistant',
    descriptionDe: 'Identifizierung von KfW-Fördermöglichkeiten',
    descriptionEn: 'Identify KfW funding opportunities',
    icon: Briefcase,
    path: '/deutsche-immobilien-tools?tab=kfw'
  },
  {
    id: 'mietpreisbremse',
    titleDe: 'Mietpreisbremse-Prüfer',
    titleEn: 'Rent Control Compliance Tool',
    descriptionDe: 'Überprüfung der Einhaltung der Mietpreisbremse',
    descriptionEn: 'Check compliance with German rent control regulations',
    icon: Shield,
    path: '/deutsche-immobilien-tools?tab=mietpreisbremse'
  },
  {
    id: 'steueroptimierung',
    titleDe: 'Steueroptimierung',
    titleEn: 'Tax Optimization',
    descriptionDe: 'Optimierung von Immobilieninvestitionen unter deutschem Steuerrecht',
    descriptionEn: 'Optimize real estate investments under German tax law',
    icon: BarChart,
    path: '/deutsche-immobilien-tools?tab=steueroptimierung'
  },
  {
    id: 'renditerechner',
    titleDe: 'Renditerechner',
    titleEn: 'Yield Calculator',
    descriptionDe: 'Berechnung der Rendite für verschiedene Immobilientypen',
    descriptionEn: 'Calculate yield for different property types',
    icon: LineChart,
    path: '/deutsche-immobilien-tools?tab=renditerechner'
  },
  // New tools (additional German real estate investor features)
  {
    id: 'baufinanzierung',
    titleDe: 'Baufinanzierungsrechner',
    titleEn: 'Construction Financing',
    descriptionDe: 'Berechnung von Baufinanzierungen und Darlehensvergleich',
    descriptionEn: 'Calculate construction financing and loan comparison',
    icon: Home,
    path: '/deutsche-immobilien-tools?tab=baufinanzierung'
  },
  {
    id: 'grundbuchauszug',
    titleDe: 'Grundbuchauszug-Analyse',
    titleEn: 'Land Registry Analysis',
    descriptionDe: 'Unterstützung beim Verstehen von Grundbuchauszügen',
    descriptionEn: 'Help with understanding German land registry extracts',
    icon: FileCheck,
    path: '/deutsche-immobilien-tools?tab=grundbuchauszug'
  },
  {
    id: 'wertermittlung',
    titleDe: 'Immobilienbewertung',
    titleEn: 'Property Valuation',
    descriptionDe: 'Wertermittlung für Immobilien nach deutschen Standards',
    descriptionEn: 'Property valuation according to German standards',
    icon: Scale,
    path: '/deutsche-immobilien-tools?tab=wertermittlung'
  },
  {
    id: 'sanierungskostenrechner',
    titleDe: 'Sanierungskostenrechner',
    titleEn: 'Renovation Cost Calculator',
    descriptionDe: 'Berechnung der Kosten für Renovierung und Sanierung',
    descriptionEn: 'Calculate renovation and refurbishment costs',
    icon: Hammer,
    path: '/deutsche-immobilien-tools?tab=sanierungskostenrechner'
  },
  {
    id: 'sozialwohnungen',
    titleDe: 'Sozialwohnungen-Analyse',
    titleEn: 'Social Housing Analysis',
    descriptionDe: 'Informationen zu Sozialwohnungen und Fördermöglichkeiten',
    descriptionEn: 'Information on social housing and funding opportunities',
    icon: Users,
    path: '/deutsche-immobilien-tools?tab=sozialwohnungen'
  },
  {
    id: 'zwangsversteigerungen',
    titleDe: 'Zwangsversteigerungen',
    titleEn: 'Foreclosure Opportunities',
    descriptionDe: 'Analyse von Zwangsversteigerungen und Chancenbewertung',
    descriptionEn: 'Analysis of foreclosure opportunities in Germany',
    icon: Handshake,
    path: '/deutsche-immobilien-tools?tab=zwangsversteigerungen'
  },
  {
    id: 'teilungserklaerung',
    titleDe: 'Teilungserklärung-Analyse',
    titleEn: 'Declaration of Division Analysis',
    descriptionDe: 'Verständnis und Analyse von Teilungserklärungen',
    descriptionEn: 'Understanding and analysis of German property division declarations',
    icon: PanelLeft,
    path: '/deutsche-immobilien-tools?tab=teilungserklaerung'
  },
  {
    id: 'wohngeld',
    titleDe: 'Wohngeld-Rechner',
    titleEn: 'Housing Allowance Calculator',
    descriptionDe: 'Berechnung von Wohngeld und Zuschüssen',
    descriptionEn: 'Calculate housing allowance and subsidies',
    icon: BadgePound,
    path: '/deutsche-immobilien-tools?tab=wohngeld'
  },
];

interface GermanInvestorNavigationProps {
  variant?: 'grid' | 'list' | 'compact';
  maxItems?: number;
  className?: string;
  onItemClick?: (path: string) => void;
}

const GermanInvestorNavigation: React.FC<GermanInvestorNavigationProps> = ({ 
  variant = 'grid', 
  maxItems = 20,
  className,
  onItemClick
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use all tools or limit based on maxItems
  const displayedTools = germanInvestmentTools.slice(0, maxItems);

  const handleItemClick = (path: string) => {
    if (onItemClick) {
      onItemClick(path);
    } else {
      navigate(path);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {displayedTools.map((tool) => (
          <Button
            key={tool.id}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleItemClick(tool.path)}
          >
            <tool.icon className="h-4 w-4" />
            <span className="truncate">
              {language === 'de' ? tool.titleDe : tool.titleEn}
            </span>
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("space-y-2", className)}>
        {displayedTools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            className="w-full justify-start h-auto py-2 px-3"
            onClick={() => handleItemClick(tool.path)}
          >
            <tool.icon className="h-5 w-5 mr-2 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium">{language === 'de' ? tool.titleDe : tool.titleEn}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                {language === 'de' ? tool.descriptionDe : tool.descriptionEn}
              </div>
            </div>
          </Button>
        ))}
      </div>
    );
  }

  // Default grid view
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {displayedTools.map((tool) => (
        <Card 
          key={tool.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleItemClick(tool.path)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <tool.icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{language === 'de' ? tool.titleDe : tool.titleEn}</CardTitle>
            </div>
            <CardDescription className="text-xs line-clamp-2">
              {language === 'de' ? tool.descriptionDe : tool.descriptionEn}
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              {language === 'de' ? 'Öffnen' : 'Open'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GermanInvestorNavigation;
export { germanInvestmentTools };
