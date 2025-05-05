
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Euro, Map, Building, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RelatedGermanToolsProps {
  currentToolId?: string;
  className?: string;
  maxTools?: number;
}

interface Tool {
  id: string;
  title: {
    de: string;
    en: string;
  };
  description: {
    de: string;
    en: string;
  };
  path: string;
  icon: React.ReactNode;
}

const germanTools: Tool[] = [
  {
    id: 'grunderwerbsteuer',
    title: { 
      de: 'Grunderwerbsteuer-Rechner', 
      en: 'Transfer Tax Calculator' 
    },
    description: { 
      de: 'Berechnen Sie die Grunderwerbsteuer für alle Bundesländer', 
      en: 'Calculate the real estate transfer tax for all German states' 
    },
    path: '/calculators/grunderwerbsteuer',
    icon: <Euro className="h-5 w-5 text-primary" />
  },
  {
    id: 'afa',
    title: { 
      de: 'AfA-Rechner', 
      en: 'Depreciation Calculator' 
    },
    description: { 
      de: 'Berechnen Sie die optimale Abschreibung für Ihre Immobilie', 
      en: 'Calculate the optimal depreciation for your property' 
    },
    path: '/calculators/afa',
    icon: <Calculator className="h-5 w-5 text-primary" />
  },
  {
    id: 'marktanalyse',
    title: { 
      de: 'Marktanalyse', 
      en: 'Market Analysis' 
    },
    description: { 
      de: 'Aktuelle Daten zum deutschen Immobilienmarkt', 
      en: 'Current data on the German real estate market' 
    },
    path: '/market-explorer',
    icon: <Map className="h-5 w-5 text-primary" />
  },
  {
    id: 'portfolio',
    title: { 
      de: 'Portfolio-Analyse', 
      en: 'Portfolio Analysis' 
    },
    description: { 
      de: 'Analysieren Sie Ihr Immobilienportfolio', 
      en: 'Analyze your real estate portfolio' 
    },
    path: '/portfolio-analytics',
    icon: <Building className="h-5 w-5 text-primary" />
  },
  {
    id: 'rendite',
    title: { 
      de: 'Renditerechner', 
      en: 'Yield Calculator' 
    },
    description: { 
      de: 'Berechnen Sie die Rendite Ihrer Immobilieninvestition', 
      en: 'Calculate the return on your real estate investment' 
    },
    path: '/calculators',
    icon: <BarChart3 className="h-5 w-5 text-primary" />
  }
];

const RelatedGermanTools: React.FC<RelatedGermanToolsProps> = ({
  currentToolId,
  className,
  maxTools = 3
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Filter out the current tool
  const filteredTools = germanTools
    .filter(tool => tool.id !== currentToolId)
    .slice(0, maxTools);
    
  if (filteredTools.length === 0) return null;
  
  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">
        {language === 'de' ? 'Verwandte Tools' : 'Related Tools'}
      </h2>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(tool.path)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center">
                {tool.icon}
                <CardTitle className="ml-2 text-lg">
                  {tool.title[language as keyof typeof tool.title]}
                </CardTitle>
              </div>
              <CardDescription>
                {tool.description[language as keyof typeof tool.description]}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="ml-auto">
                {language === 'de' ? 'Öffnen' : 'Open'} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedGermanTools;
