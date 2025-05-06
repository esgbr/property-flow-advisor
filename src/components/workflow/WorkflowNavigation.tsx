import React from 'react';
import { WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface WorkflowNavigationProps {
  workflowType: string;
  currentStep?: string;
  workflow?: string;
  previousPath?: string;
  nextPath?: string;
  previousLabel?: string;
  nextLabel?: string;
  title?: string;
}

const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  workflowType,
  currentStep,
  workflow,
  previousPath,
  nextPath,
  previousLabel,
  nextLabel,
  title
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const handlePrevious = () => {
    if (previousPath) {
      navigate(previousPath);
    }
  };
  
  const handleNext = () => {
    if (nextPath) {
      navigate(nextPath);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {title || (language === 'de' ? 'Workflow Navigation' : 'Workflow Navigation')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!previousPath}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {previousLabel || (language === 'de' ? 'Zurück' : 'Previous')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!nextPath}
          >
            {nextLabel || (language === 'de' ? 'Weiter' : 'Next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowNavigation;
