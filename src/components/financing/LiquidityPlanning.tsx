
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertCircle, Bell } from 'lucide-react';
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
      title: t('notificationSaved'),
      description: t('liquidityPlanningNotifyConfirmation'),
      duration: 3000,
    });
  };
  
  return (
    <Card className="h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="mr-2 h-5 w-5" aria-hidden="true" />
          {t('liquidityPlanning')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4 overflow-auto">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle 
            className="mx-auto h-12 w-12 text-amber-500 mb-2" 
            aria-hidden="true" 
          />
          <h3 className="text-lg font-medium">{t('comingSoon')}</h3>
          <p className="text-muted-foreground">
            {t('liquidityPlanningDescription')}
          </p>
          <Button 
            variant="outline" 
            className="mt-4 gap-2 group"
            onClick={handleNotifyAvailability}
            aria-label={t('notifyMeWhenLiquidityPlanningIsAvailable')}
          >
            <Bell className="h-4 w-4 group-hover:animate-pulse" aria-hidden="true" />
            {t('notifyWhenAvailable')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidityPlanning;
