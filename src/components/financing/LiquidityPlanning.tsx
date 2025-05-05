
import React from 'react';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const LiquidityPlanning: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          {t('liquidityPlanning')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
        <p>{t('comingSoon')}</p>
      </CardContent>
    </Card>
  );
}

export default LiquidityPlanning;
