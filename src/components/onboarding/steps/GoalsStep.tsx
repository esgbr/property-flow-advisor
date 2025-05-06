
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const GoalsStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();
  const [error, setError] = React.useState<string | null>(null);
  
  const goals = [
    { id: 'passive-income', label: language === 'de' ? 'Passives Einkommen' : 'Passive Income' },
    { id: 'wealth-building', label: language === 'de' ? 'Vermögensaufbau' : 'Wealth Building' },
    { id: 'retirement', label: language === 'de' ? 'Altersvorsorge' : 'Retirement Planning' },
    { id: 'tax-benefits', label: language === 'de' ? 'Steuervorteile' : 'Tax Benefits' },
    { id: 'diversification', label: language === 'de' ? 'Diversifikation' : 'Portfolio Diversification' },
    { id: 'flipping', label: language === 'de' ? 'Immobilien flippen' : 'Property Flipping' }
  ];
  
  const toggleGoal = (goalId: string) => {
    setError(null);
    const currentGoals = [...(data.investmentGoals || [])];
    const index = currentGoals.indexOf(goalId);
    
    if (index === -1) {
      updateData('investmentGoals', [...currentGoals, goalId]);
    } else {
      currentGoals.splice(index, 1);
      updateData('investmentGoals', currentGoals);
    }
  };
  
  const handleContinue = () => {
    if ((data.investmentGoals || []).length === 0) {
      setError(language === 'de' 
        ? 'Bitte wählen Sie mindestens ein Ziel aus' 
        : 'Please select at least one goal');
      return;
    }
    
    setError(null);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-3">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className="flex items-center space-x-2 hover:bg-accent p-2 rounded-md cursor-pointer w-full"
            onClick={() => toggleGoal(goal.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleGoal(goal.id);
              }
            }}
            tabIndex={0}
            role="checkbox"
            aria-checked={(data.investmentGoals || []).includes(goal.id)}
          >
            <Checkbox 
              id={goal.id} 
              checked={(data.investmentGoals || []).includes(goal.id)}
              onCheckedChange={() => toggleGoal(goal.id)}
            />
            <Label htmlFor={goal.id} className="cursor-pointer w-full">{goal.label}</Label>
          </div>
        ))}
      </div>
      
      <Button onClick={handleContinue} className="w-full">
        {language === 'de' ? 'Fortfahren' : 'Continue'}
      </Button>
    </div>
  );
};

export default GoalsStep;
