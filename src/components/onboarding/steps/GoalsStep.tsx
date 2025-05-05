
import React from 'react';
import { Label } from '@/components/ui/label';
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
  
  const goals = ['passive-income', 'capital-growth', 'portfolio-diversification', 'tax-benefits'];
  
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal} className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id={goal} 
            className="checkbox"
            checked={data.investmentGoals.includes(goal)}
            onChange={(e) => handleGoalChange(goal, e.target.checked)}
          />
          <Label htmlFor={goal} className="cursor-pointer">{t(goal)}</Label>
        </div>
      ))}
    </div>
  );
};

export default GoalsStep;
