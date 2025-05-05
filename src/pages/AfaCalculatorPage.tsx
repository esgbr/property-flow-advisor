
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GermanAfaCalculator } from '@/components/german/GermanAfaCalculator';
import { ArrowLeft, Info, ArrowRight, Check, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '@/hooks/use-workflow';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';
import RelatedGermanTools from '@/components/german/RelatedGermanTools';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AfaCalculatorPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow('steuer');
  const isMobile = useIsMobile();
  const [calculationDone, setCalculationDone] = useState(false);
  
  // Set the document title for better SEO and user experience
  useEffect(() => {
    document.title = language === 'de' 
      ? 'AfA-Rechner | Immobilien Abschreibung berechnen' 
      : 'Depreciation Calculator | Calculate Property Depreciation';
  }, [language]);

  // Get next workflow step
  const nextStep = workflow.getNextSteps('afa', 1)[0];

  // Handle calculation completion
  const handleCalculationComplete = (result: any) => {
    setCalculationDone(true);
    toast.success(language === 'de' 
      ? 'AfA-Berechnung abgeschlossen' 
      : 'Depreciation calculation completed');
  };

  // Handle continuing to next workflow step
  const handleContinueWorkflow = () => {
    if (nextStep) {
      workflow.goToStep(nextStep.id);
      toast.info(language === 'de'
        ? `Nächster Schritt: ${workflow.getStepLabel(nextStep.id)}`
        : `Next step: ${workflow.getStepLabel(nextStep.id)}`);
    }
  };

  // Handle exporting results
  const handleExportResults = () => {
    toast.info(language === 'de' 
      ? 'AfA-Berechnung wird exportiert...' 
      : 'Exporting depreciation calculation...');
    // Export logic would go here
  };

  const progress = workflow.getWorkflowProgress('afa');

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
      
      <GermanAfaCalculator className="max-w-4xl mx-auto" onCalculationComplete={handleCalculationComplete} />
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        {language === 'de'
          ? 'Hinweis: Diese Berechnung dient nur zu Informationszwecken und ersetzt keine professionelle Steuerberatung.'
          : 'Note: This calculation is for informational purposes only and does not replace professional tax advice.'}
      </div>
      
      {/* Workflow progress indicator */}
      <div className="mt-8 max-w-lg mx-auto">
        <div className="flex justify-between text-sm mb-2">
          <span>{language === 'de' ? 'Fortschritt im Workflow' : 'Workflow Progress'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Actions when calculation is done */}
      {calculationDone && (
        <Card className="mt-8 max-w-lg mx-auto border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              {language === 'de' ? 'AfA-Berechnung abgeschlossen' : 'Depreciation Calculation Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{language === 'de' 
              ? 'Sie können die Ergebnisse exportieren oder zum nächsten Schritt übergehen' 
              : 'You can export the results or proceed to the next step'}</p>
          </CardContent>
          <CardFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleExportResults}
              className="w-full sm:w-auto gap-2"
            >
              <FileDown className="h-4 w-4" />
              {language === 'de' ? 'Ergebnisse exportieren' : 'Export Results'}
            </Button>
            
            {nextStep && (
              <Button
                onClick={handleContinueWorkflow}
                className="w-full sm:w-auto gap-2 group"
              >
                {language === 'de' ? 'Nächster Schritt: ' : 'Next Step: '}
                <span>{workflow.getStepLabel(nextStep.id)}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <WorkflowSuggestions 
          currentTool="afa" 
          onSelect={(stepId) => {
            toast.info(language === 'de'
              ? `Navigation zu: ${workflow.getStepLabel(stepId)}`
              : `Navigating to: ${workflow.getStepLabel(stepId)}`);
          }}
        />
        <RelatedGermanTools currentToolId="afa" maxTools={2} />
      </div>
    </div>
  );
};

export default AfaCalculatorPage;
