
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LiquidityPlanning: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const handleNotifyAvailability = () => {
    // This would normally trigger an email subscription or notification setting
    console.log('User notified about liquidity planning feature availability');
    
    // Show a toast notification for better user feedback
    toast({
      title: t('notificationSaved') || 'Notification saved',
      description: t('liquidityPlanningNotifyConfirmation') || "We'll notify you when liquidity planning becomes available.",
      duration: 3000,
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" aria-hidden="true" />
          {t('liquidityPlanning')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4 overflow-auto">
        <div className="text-center space-y-2 max-w-md">
          <AlertCircle 
            className="mx-auto h-12 w-12 text-amber-500 mb-2" 
            aria-hidden="true" 
          />
          <p className="text-lg font-medium">{t('comingSoon')}</p>
          <p className="text-muted-foreground">
            {t('liquidityPlanningDescription') || 
             'Plan your real estate cash flow and optimize your liquidity with our advanced planning tools.'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleNotifyAvailability}
            aria-label={t('notifyMeWhenLiquidityPlanningIsAvailable') || 'Notify me when liquidity planning is available'}
          >
            {t('notifyWhenAvailable') || 'Notify me when available'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidityPlanning;
