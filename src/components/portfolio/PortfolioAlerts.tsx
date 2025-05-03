
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
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
            <Badge className="mt-2" variant="outline">{t('northDistrict')}</Badge>
            <Button size="sm" variant="link" className="p-0 h-auto mt-1 block" onClick={() => onActionClick(t('viewProperty'))}>{t('viewProperty')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAlerts;
