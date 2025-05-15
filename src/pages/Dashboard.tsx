
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardPortfolioStats from '@/components/dashboard/DashboardPortfolioStats';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardUpcomingEvents from '@/components/dashboard/DashboardUpcomingEvents';
import DashboardPropertiesGrid from '@/components/dashboard/DashboardPropertiesGrid';
import DashboardMarketSummary from '@/components/dashboard/DashboardMarketSummary';
import DashboardContactNetwork from '@/components/dashboard/DashboardContactNetwork';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-8 pb-20 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {t('welcomeBack')}, {preferences.name || t('investor')}
              </h1>
              <p className="text-muted-foreground">
                {t('dashboardDescription')}
              </p>
            </div>
            <DashboardQuickActions />
          </div>
          <DashboardPortfolioStats />
          <DashboardPropertiesGrid />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardUpcomingEvents />
            <DashboardContactNetwork />
          </div>
          <DashboardMarketSummary />
        </div>
      </ScrollArea>
    </div>
  );
};
export default Dashboard;
