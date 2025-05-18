import React, { useState, useCallback, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  className?: string;
  showStepIndicator?: boolean;
  allowSkip?: boolean;
  validateStep?: (stepId: string, data: Record<string, any>) => boolean | Promise<boolean>;
}

/**
 * Multi-step form component for complex forms
 */
export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onComplete,
  initialData = {},
  className = '',
  showStepIndicator = true,
  allowSkip = false,
  validateStep
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentStep = steps[currentStepIndex];
  
  // Update form data
  const updateFormData = useCallback((newData: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);
  
  // Handle next step
  const handleNext = async () => {
    // Validate current step if validateStep function is provided
    if (validateStep) {
      const isValid = await validateStep(currentStep.id, formData);
      if (!isValid) return;
    }
    
    // If this is the last step, complete the form
    if (currentStepIndex === steps.length - 1) {
      handleComplete();
      return;
    }
    
    // Otherwise, go to the next step
    setCurrentStepIndex(prev => prev + 1);
  };
  
  // Handle previous step
  const handlePrevious = () => {
    setCurrentStepIndex(prev => prev - 1);
  };
  
  // Go to a specific step
  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    if (index > currentStepIndex && !allowSkip) return;
    
    setCurrentStepIndex(index);
  };
  
  // Handle form completion
  const handleComplete = async () => {
    // Validate the final step if needed
    if (validateStep) {
      const isValid = await validateStep(currentStep.id, formData);
      if (!isValid) return;
    }
    
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className={cn('w-full', className)}>
      {showStepIndicator && (
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center"
                aria-current={currentStepIndex === index ? 'step' : undefined}
              >
                <button
                  onClick={() => goToStep(index)}
                  disabled={!allowSkip && index > currentStepIndex}
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 h-8 w-8 text-sm font-medium transition-colors',
                    currentStepIndex === index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : index < currentStepIndex
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                      : 'border-muted-foreground/30 text-muted-foreground',
                    !allowSkip && index > currentStepIndex && 'cursor-not-allowed opacity-50'
                  )}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </button>
                
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      'w-full h-1 mx-2',
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    )}
                    style={{ width: '3rem' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{currentStep.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Render the current step component with form data and update function */}
        {React.isValidElement(currentStep.component)
          ? React.cloneElement(currentStep.component as React.ReactElement, {
              formData,
              updateFormData
            })
          : currentStep.component}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0 || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStepIndex === steps.length - 1 ? (
            isSubmitting ? 'Submitting...' : 'Complete'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultiStepForm;
