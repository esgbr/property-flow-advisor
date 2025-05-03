
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PortfolioGoalsProps {
  onEditGoals: (action: string) => void;
}

const PortfolioGoals: React.FC<PortfolioGoalsProps> = ({ onEditGoals }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">{t('investmentGoals')}</div>
          <Button variant="outline" size="sm" onClick={() => onEditGoals(t('editGoals'))}>{t('edit')}</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">{t('cashflowGoal')}</div>
            <div className="text-sm">€15,000 / €25,000</div>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">{t('equityTarget')}</div>
            <div className="text-sm">€950,000 / €1,500,000</div>
          </div>
          <Progress value={63} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">{t('totalPropertiesGoal')}</div>
            <div className="text-sm">6 / 10</div>
          </div>
          <Progress value={60} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioGoals;
