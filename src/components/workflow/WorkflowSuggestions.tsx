
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, Building, Calculator, Euro, Map, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/hooks/use-workflow';

interface WorkflowSuggestionsProps {
  currentTool: string;
  className?: string;
  maxSuggestions?: number;
  workflowType?: 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';
}

const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  className,
  maxSuggestions = 3,
  workflowType = 'steuer'
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use the enhanced workflow hook
  const workflow = useWorkflow(workflowType);
  
  // Get next steps from the workflow
  const nextSteps = workflow.getNextSteps(currentTool, maxSuggestions);

  if (nextSteps.length === 0) return null;

  return (
    <div className={cn("mt-8", className)}>
      <div className="flex items-center mb-4">
        <ArrowRightCircle className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-semibold">
          {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
        </h2>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-' + Math.min(nextSteps.length, 3)} gap-4`}>
        {nextSteps.map((step) => (
          <Card 
            key={step.id} 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => workflow.goToStep(step.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {step.label[language as keyof typeof step.label]}
              </CardTitle>
              {step.description && (
                <CardDescription>
                  {step.description[language as keyof typeof step.description]}
                </CardDescription>
              )}
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
