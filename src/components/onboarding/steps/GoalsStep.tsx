
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const GoalsStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();
  
  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      updateData({ 
        ...data, 
        investmentGoals: [...data.investmentGoals, goal] 
      });
    } else {
      updateData({
        ...data,
        investmentGoals: data.investmentGoals.filter(g => g !== goal)
      });
    }
  };
  
  const goals = [
    { id: 'passive-income', label: t('passiveIncome') },
    { id: 'capital-growth', label: t('capitalGrowth') },
    { id: 'portfolio-diversification', label: t('portfolioDiversification') },
    { id: 'tax-benefits', label: t('taxBenefits') }
  ];
  
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center space-x-3">
          <Checkbox 
            id={goal.id} 
            checked={data.investmentGoals.includes(goal.id)}
            onCheckedChange={(checked) => handleGoalChange(goal.id, checked === true)}
            aria-labelledby={`label-${goal.id}`}
          />
          <Label 
            htmlFor={goal.id} 
            id={`label-${goal.id}`}
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {goal.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default GoalsStep;
