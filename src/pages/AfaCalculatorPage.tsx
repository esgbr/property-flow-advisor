
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GermanAfaCalculator } from '@/components/german/GermanAfaCalculator';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useMarketFilter } from '@/hooks/use-market-filter';

const AfaCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { setUserMarket } = useMarketFilter();
  
  // Setze den Markt auf Deutschland für diese Seite
  React.useEffect(() => {
    setUserMarket('germany');
  }, [setUserMarket]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate('/deutsche-immobilien-tools')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Zurück zu Tools' : 'Back to Tools'}
        </Button>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">
          {language === 'de' ? 'AfA-Rechner für Deutsche Immobilien' : 'Depreciation Calculator for German Properties'}
        </AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          {language === 'de' 
            ? 'Berechnen Sie die Abschreibung für Abnutzung (AfA) für Ihre deutschen Immobilieninvestitionen.'
            : 'Calculate the depreciation (AfA) for your German real estate investments.'}
        </AlertDescription>
      </Alert>
      
      <GermanAfaCalculator className="max-w-4xl mx-auto" />
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        {language === 'de'
          ? 'Hinweis: Diese Berechnung dient nur zu Informationszwecken und ersetzt keine professionelle Steuerberatung.'
          : 'Note: This calculation is for informational purposes only and does not replace professional tax advice.'}
      </div>
    </div>
  );
};

export default AfaCalculatorPage;
