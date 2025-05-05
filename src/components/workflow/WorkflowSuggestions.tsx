
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, Building, Calculator, Euro, Map, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/hooks/use-workflow';
import { toast } from 'sonner';

interface WorkflowSuggestionsProps {
  currentTool: string;
  className?: string;
  maxSuggestions?: number;
  workflowType?: 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';
  onSelect?: (stepId: string) => void;
}

const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  className,
  maxSuggestions = 3,
  workflowType = 'steuer',
  onSelect
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use the enhanced workflow hook
  const workflow = useWorkflow(workflowType);
  
  // Get next steps from the workflow
  const nextSteps = workflow.getNextSteps(currentTool, maxSuggestions);

  // Handle navigation and callback
  const handleStepSelection = (stepId: string) => {
    workflow.goToStep(stepId);
    
    if (onSelect) {
      onSelect(stepId);
    }
    
    // Show a toast notification for better UX
    toast.success(
      language === 'de' 
        ? `Nächster Schritt: ${workflow.getStepLabel(stepId)}` 
        : `Next step: ${workflow.getStepLabel(stepId)}`
    );
  };

  if (nextSteps.length === 0) return null;

  return (
    <div className={cn("mt-8", className)}>
      <div className="flex items-center mb-4">
        <ArrowRightCircle className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-semibold">
          {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
        </h2>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'sm:grid-cols-2 md:grid-cols-' + Math.min(nextSteps.length, 3)} gap-4`}>
        {nextSteps.map((step) => (
          <Card 
            key={step.id} 
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
            onClick={() => handleStepSelection(step.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {step.icon && <span className="mr-2">{step.icon}</span>}
                {step.label[language as keyof typeof step.label]}
              </CardTitle>
              {step.description && (
                <CardDescription>
                  {step.description[language as keyof typeof step.description]}
                </CardDescription>
              )}
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="ml-auto group">
                {language === 'de' ? 'Öffnen' : 'Open'} 
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {nextSteps.length > 0 && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleStepSelection(nextSteps[0].id)}
            className="group"
          >
            {language === 'de' ? 'Workflow fortsetzen' : 'Continue Workflow'}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkflowSuggestions;
