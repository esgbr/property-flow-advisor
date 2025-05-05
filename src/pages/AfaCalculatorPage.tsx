
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GermanAfaCalculator } from '@/components/german/GermanAfaCalculator';
import { ArrowLeft, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '@/hooks/use-workflow';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';
import RelatedGermanTools from '@/components/german/RelatedGermanTools';
import { useIsMobile } from '@/hooks/use-mobile';

const AfaCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow('steuer');
  const isMobile = useIsMobile();
  
  // Set the document title for better SEO and user experience
  useEffect(() => {
    document.title = language === 'de' 
      ? 'AfA-Rechner | Immobilien Abschreibung berechnen' 
      : 'Depreciation Calculator | Calculate Property Depreciation';
  }, [language]);

  // Get next workflow step
  const nextStep = workflow.getNextSteps('afa', 1)[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkflowNavigation 
        workflow="steuern" 
        currentStep="afa" 
      />
      
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
      
      {/* Add a next step button when there are next steps */}
      {nextStep && (
        <div className={`${isMobile ? 'mt-8' : 'mt-10'} flex justify-center`}>
          <Button
            onClick={() => workflow.goToStep(nextStep.id)}
            size={isMobile ? "sm" : "default"}
            className="gap-2"
          >
            {language === 'de' ? 'Nächster Schritt: ' : 'Next Step: '}
            <span>{workflow.getStepLabel(nextStep.id)}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <WorkflowSuggestions currentTool="afa" />
        <RelatedGermanTools currentToolId="afa" maxTools={2} />
      </div>
    </div>
  );
};

export default AfaCalculatorPage;
