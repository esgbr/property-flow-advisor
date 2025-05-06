
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, HomeIcon, ChevronDown, ChevronUp, Share, Download, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { GrunderwerbsteuerCalculator } from '@/components/calculators/GrunderwerbsteuerCalculator';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import { WorkflowType } from '@/hooks/use-workflow';
import EnhancedWorkflowSuggestions from '@/components/workflow/EnhancedWorkflowSuggestions';
import { useAccessibility } from '@/hooks/use-accessibility';
import useAnnouncement from '@/utils/announcer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GrunderwerbsteuerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [showWorkflowSteps, setShowWorkflowSteps] = useState(false);
  const { largeText, announce } = useAccessibility();
  const { announce: announceToScreenReader } = useAnnouncement();
  
  // For this page, we're part of the tax workflow
  const workflowType: WorkflowType = 'steuer';
  const currentStep = 'grunderwerbsteuer';

  // Announce page load for screen reader users
  useEffect(() => {
    announceToScreenReader(t('grunderwerbsteuerPageLoaded'));
  }, [announceToScreenReader, t]);

  // Toggle workflow steps visibility with announcements
  const toggleWorkflowSteps = () => {
    setShowWorkflowSteps(!showWorkflowSteps);
    announceToScreenReader(
      !showWorkflowSteps 
        ? t('workflowStepsVisible') 
        : t('workflowStepsHidden')
    );
  };

  // Handle sharing the calculator
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('grunderwerbsteuerCalculator'),
          text: t('calculateGrunderwerbsteuerShareText'),
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      announceToScreenReader(t('linkCopied'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
            {t('grunderwerbsteuerCalculator')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('calculateGrunderwerbsteuer')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  aria-label={t('shareCalculator')}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t('shareCalculator')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleWorkflowSteps}
            aria-expanded={showWorkflowSteps}
            className="flex items-center"
          >
            {showWorkflowSteps 
              ? <ChevronUp className="h-4 w-4 mr-1" aria-hidden="true" />
              : <ChevronDown className="h-4 w-4 mr-1" aria-hidden="true" />
            }
            {showWorkflowSteps 
              ? (language === 'de' ? 'Workflow ausblenden' : 'Hide workflow') 
              : (language === 'de' ? 'Workflow anzeigen' : 'Show workflow')
            }
          </Button>
        </div>
      </div>
      
      {showWorkflowSteps && (
        <div className="mb-6" aria-live="polite">
          <WorkflowSteps 
            workflowType={workflowType}
            currentStep={currentStep}
          />
        </div>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('calculator')}</CardTitle>
          <CardDescription>{t('enterPropertyDetails')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GrunderwerbsteuerCalculator />
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="mt-8">
        <AccordionItem value="info">
          <AccordionTrigger className="text-lg font-medium flex items-center">
            <Info className="h-4 w-4 mr-2" aria-hidden="true" />
            {language === 'de' ? 'Informationen zur Grunderwerbsteuer' : 'Property Transfer Tax Information'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose dark:prose-invert max-w-none">
              {language === 'de' ? (
                <>
                  <p>Die Grunderwerbsteuer ist eine Steuer, die beim Kauf einer Immobilie in Deutschland anfällt. Sie wird auf den Kaufpreis erhoben und variiert je nach Bundesland zwischen 3,5% und 6,5%.</p>
                  <p>Die Steuer muss innerhalb von 30 Tagen nach Abschluss des Kaufvertrags an das zuständige Finanzamt gezahlt werden.</p>
                  <h3>Wichtige Hinweise:</h3>
                  <ul>
                    <li>Die Grunderwerbsteuer ist vom Käufer zu entrichten.</li>
                    <li>In manchen Fällen gibt es Steuerbefreiungen, z.B. bei Schenkungen oder Erbschaften.</li>
                    <li>Die Steuer wird auf den gesamten Kaufpreis inklusive Nebenkosten berechnet.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>The real estate transfer tax (Grunderwerbsteuer) is a tax that applies when purchasing property in Germany. It is levied on the purchase price and varies between 3.5% and 6.5% depending on the federal state.</p>
                  <p>The tax must be paid to the responsible tax office within 30 days after concluding the purchase contract.</p>
                  <h3>Important notes:</h3>
                  <ul>
                    <li>The real estate transfer tax is to be paid by the buyer.</li>
                    <li>In some cases, tax exemptions apply, e.g., for gifts or inheritances.</li>
                    <li>The tax is calculated on the total purchase price including additional costs.</li>
                  </ul>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-8 space-y-4">
        <WorkflowNavigation 
          workflowType={workflowType} 
          currentStep={currentStep}
          variant="compact"
        />

        <EnhancedWorkflowSuggestions
          currentTool={currentStep}
          maxSuggestions={2}
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default GrunderwerbsteuerPage;
