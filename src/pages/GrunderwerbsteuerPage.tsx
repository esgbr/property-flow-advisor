
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, HomeIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { GrunderwerbsteuerCalculator } from '@/components/calculators/GrunderwerbsteuerCalculator';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import { WorkflowSuggestions } from '@/components/workflow/WorkflowSuggestions';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import { WorkflowType } from '@/hooks/use-workflow';
import EnhancedWorkflowSuggestions from '@/components/workflow/EnhancedWorkflowSuggestions';

const GrunderwerbsteuerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [showWorkflowSteps, setShowWorkflowSteps] = useState(false);
  
  // For this page, we're part of the tax workflow
  const workflowType: WorkflowType = 'steuer';
  const currentStep = 'grunderwerbsteuer';

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-2 h-6 w-6 text-primary" />
            {t('grunderwerbsteuerCalculator')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('calculateGrunderwerbsteuer')}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWorkflowSteps(!showWorkflowSteps)}
        >
          {showWorkflowSteps 
            ? (language === 'de' ? 'Workflow ausblenden' : 'Hide workflow') 
            : (language === 'de' ? 'Workflow anzeigen' : 'Show workflow')
          }
        </Button>
      </div>
      
      {showWorkflowSteps && (
        <div className="mb-6">
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
