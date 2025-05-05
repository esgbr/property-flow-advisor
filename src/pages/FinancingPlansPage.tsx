
import React from 'react';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancingPlans from '@/components/financing/FinancingPlans';
import LiquidityPlanning from '@/components/financing/LiquidityPlanning';
import { Calendar, TrendingUp } from 'lucide-react';

const FinancingPlansPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('financialPlanning')}</h1>
        <p className="text-muted-foreground">{t('manageFinancingAndLiquidity')}</p>
      </div>
      
      <Tabs defaultValue="financing-plans" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="financing-plans">
            <Calendar className="mr-2 h-4 w-4" />
            {t('financingPlans')}
          </TabsTrigger>
          <TabsTrigger value="liquidity-planning">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('liquidityPlanning')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financing-plans">
          <FinancingPlans />
        </TabsContent>
        
        <TabsContent value="liquidity-planning">
          <LiquidityPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancingPlansPage;
