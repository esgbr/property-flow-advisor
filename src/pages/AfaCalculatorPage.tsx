import React from 'react';
import AfaCalculator from '@/components/calculators/AfaCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';

const AfaCalculatorPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            {t('afaCalculator')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AfaCalculator />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <WorkflowNavigation 
          workflowType="steuer" 
          currentStep="afa"
          variant="compact"
          className="mb-4"
        />

        <WorkflowSuggestions
          currentTool="afa"
          workflowType="steuer"
          maxSuggestions={2}
        />
      </div>
    </div>
  );
};

export default AfaCalculatorPage;
