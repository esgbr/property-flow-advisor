
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';

interface PortfolioSummary {
  totalValue: number;
  equity: number;
  cashFlow: number;
  roi: number;
  appreciation: number;
  debt: number;
}

interface PortfolioSummaryCardsProps {
  portfolioSummary: PortfolioSummary;
}

const PortfolioSummaryCards: React.FC<PortfolioSummaryCardsProps> = ({ portfolioSummary }) => {
  const { t } = useLanguage();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-2">{t('portfolioValue')}</div>
          <div className="text-3xl font-bold">€{portfolioSummary.totalValue.toLocaleString()}</div>
          <div className="flex justify-between mt-2">
            <div className="text-sm text-muted-foreground">{t('equity')}: €{portfolioSummary.equity.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{t('debt')}: €{portfolioSummary.debt.toLocaleString()}</div>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${(portfolioSummary.equity / portfolioSummary.totalValue) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-2">{t('cashFlow')}</div>
          <div className="text-3xl font-bold">€{portfolioSummary.cashFlow.toLocaleString()}<span className="text-base text-muted-foreground">/mo</span></div>
          <div className="text-sm text-green-500 font-medium mt-2">
            <TrendingUp className="inline-block mr-1 h-4 w-4" />
            {t('positive')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-2">{t('returnsAndGrowth')}</div>
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-sm text-muted-foreground">{t('cashOnCashROI')}</div>
              <div className="text-xl font-semibold">{portfolioSummary.roi}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t('appreciation')}</div>
              <div className="text-xl font-semibold">{portfolioSummary.appreciation}%</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">{t('totalReturn')}</div>
            <div className="font-medium">{(portfolioSummary.roi + portfolioSummary.appreciation).toFixed(1)}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummaryCards;
