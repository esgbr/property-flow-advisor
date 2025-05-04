
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Calculator, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PortfolioAlertsProps {
  onActionClick: (action: string) => void;
}

const PortfolioAlerts: React.FC<PortfolioAlertsProps> = ({ onActionClick }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="text-xl font-semibold">{t('portfolioAlerts')}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 border rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{t('refinancingOpportunity')}</div>
            <p className="text-sm text-muted-foreground">
              {t('propertyEligibleRefinancing')}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                5.2% → 4.1% {t('potentialRate')}
              </Badge>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                +€350 {t('monthlyCashflow')}
              </Badge>
            </div>
            <Button size="sm" variant="link" className="p-0 h-auto mt-1" onClick={() => onActionClick(t('viewDetails'))}>{t('viewDetails')}</Button>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 border rounded-lg">
          <AlertCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{t('marketOpportunity')}</div>
            <p className="text-sm text-muted-foreground">
              {t('newPropertyMatchingCriteria')}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="mt-2" variant="outline">{t('northDistrict')}</Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                6.8% {t('projectedCapRate')}
              </Badge>
            </div>
            <Button size="sm" variant="link" className="p-0 h-auto mt-1 block" onClick={() => onActionClick(t('viewProperty'))}>{t('viewProperty')}</Button>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 border rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{t('marketTrendAlert')}</div>
            <p className="text-sm text-muted-foreground">
              {t('interestRateChangeImpact')}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                -0.25% {t('rateChange')}
              </Badge>
            </div>
            <Button size="sm" variant="link" className="p-0 h-auto mt-1 block" onClick={() => onActionClick(t('analyzeImpact'))}>{t('analyzeImpact')}</Button>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 border rounded-lg">
          <Search className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{t('portfolioDiversificationAlert')}</div>
            <p className="text-sm text-muted-foreground">
              {t('portfolioConcentrationRisk')}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                72% {t('residentialConcentration')}
              </Badge>
            </div>
            <Button size="sm" variant="link" className="p-0 h-auto mt-1 block" onClick={() => onActionClick(t('diversificationOptions'))}>{t('viewDiversificationOptions')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAlerts;
