import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, Building, Calculator, Euro, Map, PiggyBank, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/hooks/use-workflow';
import { toast } from 'sonner';
import { useMarketFilter } from '@/hooks/use-market-filter';

// Updated WorkflowStep interface to include progress and estimatedTime
export interface EnhancedWorkflowStep {
  id: string;
  path: string;
  label: { de: string; en: string };
  icon?: React.ReactNode;
  description?: { de: string; en: string };
  isComplete?: boolean;
  progress?: number;
  estimatedTime?: number;
}

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
  const { userMarket } = useMarketFilter();
  
  // Fixed: Pass the workflowType parameter to the useWorkflow hook
  const workflow = useWorkflow(workflowType);
  
  // Get next steps from the workflow - pass currentTool parameter
  const nextSteps = workflow.getNextSteps(currentTool, maxSuggestions) as EnhancedWorkflowStep[];
  
  // Get user's progress in this workflow
  const workflowProgress = workflow.getWorkflowProgress();

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

  // Helper functions to mimic missing API methods
  const getAllSteps = () => {
    return workflow.steps as EnhancedWorkflowStep[];
  };
  
  const isStepCompleted = (stepId: string) => {
    const step = workflow.steps.find(s => s.id === stepId);
    return step?.isComplete || false;
  };

  return (
    <div className={cn("mt-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ArrowRightCircle className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">
            {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
          </h2>
        </div>
        
        {workflowProgress > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {language === 'de' 
                ? `${workflowProgress}% abgeschlossen`
                : `${workflowProgress}% completed`
              }
            </span>
          </div>
        )}
      </div>
      
      {/* Market-aware workflow recommendations */}
      {userMarket !== 'global' && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm">
          <p>
            {language === 'de'
              ? `Empfehlungen angepasst für ${userMarket === 'germany' ? 'deutschen' : userMarket === 'usa' ? 'US' : userMarket} Markt`
              : `Recommendations customized for ${userMarket === 'germany' ? 'German' : userMarket === 'usa' ? 'US' : userMarket} market`
            }
          </p>
        </div>
      )}
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'sm:grid-cols-2 md:grid-cols-' + Math.min(nextSteps.length, 3)} gap-4`}>
        {nextSteps.map((step) => (
          <Card 
            key={step.id} 
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 hover:bg-primary/5"
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
            {step.progress !== undefined && (
              <CardContent className="pb-0">
                <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                  <span>{step.progress}% {language === 'de' ? 'fertig' : 'complete'}</span>
                  {step.estimatedTime && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.estimatedTime} {language === 'de' ? 'Min.' : 'min.'}
                    </span>
                  )}
                </div>
              </CardContent>
            )}
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
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-4 w-4 text-primary mr-2" />
            <h3 className="text-sm font-medium">
              {language === 'de' ? 'Intelligenter Workflow' : 'Smart Workflow'}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {getAllSteps().slice(0, 5).map((step, index) => (
              <React.Fragment key={step.id}>
                <Button 
                  variant={step.id === currentTool ? "default" : "outline"} 
                  size="sm"
                  className={cn(
                    "whitespace-nowrap",
                    isStepCompleted(step.id) && "border-green-500 bg-green-500/10"
                  )}
                  onClick={() => handleStepSelection(step.id)}
                >
                  {isStepCompleted(step.id) && (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  )}
                  {step.label[language as keyof typeof step.label]}
                </Button>
                {index < getAllSteps().slice(0, 5).length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
            
            {getAllSteps().length > 5 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={() => navigate(`/workflows/${workflowType}`)}
              >
                {language === 'de' ? 'Alle anzeigen' : 'View all'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowSuggestions;
