
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Workflow, CheckCircle } from 'lucide-react';
import { WorkflowType } from '@/hooks/use-workflow';
import { getCommonNextSteps } from '@/utils/workflowUtils';

interface WorkflowConnectorProps {
  currentTool?: string;
  currentFeature?: string;
  relatedWorkflows?: WorkflowType[];
  className?: string;
  compact?: boolean;
}

/**
 * Component that connects features with related workflows
 * Provides contextual navigation to guide users through logical paths
 */
const WorkflowConnector: React.FC<WorkflowConnectorProps> = ({
  currentTool,
  currentFeature,
  relatedWorkflows,
  className,
  compact = false
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Get suggested next steps based on current context
  const nextSteps = getCommonNextSteps(currentTool || '', []);
  
  // Skip rendering if no related workflows or next steps
  if (!relatedWorkflows?.length && !nextSteps?.length) {
    return null;
  }
  
  // Compact version for mobile or space-constrained UIs
  if (compact) {
    return (
      <div className={`mt-4 ${className || ''}`}>
        <h4 className="text-sm font-medium mb-2">{t('relatedWorkflows')}</h4>
        <div className="flex flex-wrap gap-2">
          {nextSteps.slice(0, 2).map((item) => (
            <Button 
              key={item.step.id} 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(item.step.path)}
              className="text-xs flex items-center"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {item.step.label[language as keyof typeof item.step.label] || item.step.label.en}
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  // Full version with more details
  return (
    <Card className={`mt-6 border border-muted/40 ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Workflow className="h-5 w-5 mr-2" />
          {t('continueYourWorkflow')}
        </CardTitle>
        <CardDescription>
          {t('suggestedNextStepsBasedOnYourActivity')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {nextSteps.slice(0, 3).map((item) => (
            <li key={item.step.id} className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">
                  {item.step.label[language as keyof typeof item.step.label] || item.step.label.en}
                </h4>
                {item.step.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.step.description[language as keyof typeof item.step.description] || 
                     item.step.description.en}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-between" 
          onClick={() => navigate('/workflows')}
        >
          {t('viewAllWorkflows')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkflowConnector;
