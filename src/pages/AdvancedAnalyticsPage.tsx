
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/FixedLanguageContext';

const AdvancedAnalyticsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <BarChart3 className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">{t('Advanced Analytics')}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('Market Trends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('Detailed analysis of market trends and fluctuations.')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Performance Metrics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('In-depth performance metrics for your investments.')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
