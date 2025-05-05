
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, Building, Calculator, Euro, Map, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SuggestionItem {
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
  category: string;
}

interface WorkflowSuggestionsProps {
  currentTool: string;
  className?: string;
}

const allSuggestions: SuggestionItem[] = [
  {
    title: { de: 'AfA-Rechner', en: 'Depreciation Calculator' },
    description: { 
      de: 'Berechnen Sie die optimale Abschreibung für Ihre Immobilie',
      en: 'Calculate the optimal depreciation for your property'
    },
    path: '/calculators/afa',
    icon: <PiggyBank className="h-5 w-5 text-primary" />,
    category: 'tax'
  },
  {
    title: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' },
    description: { 
      de: 'Berechnen Sie die Grunderwerbsteuer für alle Bundesländer',
      en: 'Calculate the real estate transfer tax for all German states'
    },
    path: '/calculators/grunderwerbsteuer',
    icon: <Euro className="h-5 w-5 text-primary" />,
    category: 'tax'
  },
  {
    title: { de: 'Portfolio-Analyse', en: 'Portfolio Analysis' },
    description: { 
      de: 'Analysieren Sie Ihr Immobilienportfolio im Detail',
      en: 'Analyze your real estate portfolio in detail'
    },
    path: '/portfolio-analytics',
    icon: <Building className="h-5 w-5 text-primary" />,
    category: 'portfolio'
  },
  {
    title: { de: 'Renditerechner', en: 'Yield Calculator' },
    description: { 
      de: 'Berechnen Sie die potentielle Rendite Ihrer Immobilieninvestition',
      en: 'Calculate the potential return on your real estate investment'
    },
    path: '/calculators',
    icon: <Calculator className="h-5 w-5 text-primary" />,
    category: 'finance'
  },
  {
    title: { de: 'Marktexplorer', en: 'Market Explorer' },
    description: { 
      de: 'Entdecken Sie die aktuellen Markttrends in Deutschland',
      en: 'Explore current market trends in Germany'
    },
    path: '/market-explorer',
    icon: <Map className="h-5 w-5 text-primary" />,
    category: 'market'
  }
];

const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  className
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Filter out the current tool and get 3 suggestions
  const suggestions = allSuggestions
    .filter(item => item.path !== `/calculators/${currentTool}`)
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <div className={cn("mt-8", className)}>
      <div className="flex items-center mb-4">
        <ArrowRightCircle className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-semibold">
          {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
        </h2>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate(suggestion.path)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center">
                {suggestion.icon}
                <CardTitle className="text-lg ml-2">
                  {suggestion.title[language as keyof typeof suggestion.title]}
                </CardTitle>
              </div>
              <CardDescription>
                {suggestion.description[language as keyof typeof suggestion.description]}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="ml-auto">
                {language === 'de' ? 'Öffnen' : 'Open'} 
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSuggestions;
