
import React, { useState } from 'react';
import AfaCalculator from '@/components/calculators/AfaCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Calculator } from 'lucide-react';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import { Button } from '@/components/ui/button';
import { WorkflowType } from '@/hooks/use-workflow';

const AfaCalculatorPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [showWorkflowSteps, setShowWorkflowSteps] = useState(false);
  
  // For this page, we're part of the tax workflow
  const workflowType: WorkflowType = 'steuer';
  const currentStep = 'afa';
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-2 h-6 w-6 text-primary" />
            {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'de' 
              ? 'Berechnen Sie die Abschreibung für Ihr Gebäude' 
              : 'Calculate the depreciation for your building'
            }
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            {t('afaCalculator')}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Berechnen Sie die steuerliche Abschreibung für Ihre Immobilie'
              : 'Calculate the tax depreciation for your property'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AfaCalculator />
        </CardContent>
      </Card>
      
      <div className="mt-8 space-y-4">
        <WorkflowNavigation 
          workflowType={workflowType} 
          currentStep={currentStep}
          variant="compact"
        />

        <WorkflowSuggestions
          currentTool={currentStep}
          workflowType={workflowType}
          maxSuggestions={2}
        />
      </div>
    </div>
  );
};

export default AfaCalculatorPage;
