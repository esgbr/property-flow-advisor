
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardPortfolioStats from '@/components/dashboard/DashboardPortfolioStats';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardPropertiesGrid from '@/components/dashboard/DashboardPropertiesGrid';
import DashboardMarketSummary from '@/components/dashboard/DashboardMarketSummary';
import DashboardContactNetwork from '@/components/dashboard/DashboardContactNetwork';
import DashboardUpcomingEvents from '@/components/dashboard/DashboardUpcomingEvents';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SectionTitle from "@/components/dashboard/SectionTitle"; // NEW

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-8 pb-20 animate-fade-in">
          {/* Header with Welcome and Quick Actions */}
          <DashboardHeader />

          {/* Key Portfolio Stats */}
          <section aria-labelledby="portfolio-stats" id="main-content" tabIndex={-1}>
            <SectionTitle id="portfolio-stats">{t('keyPortfolioStats') || "Key Portfolio Stats"}</SectionTitle>
            <DashboardPortfolioStats />
          </section>

          {/* Properties / Workflow */}
          <section aria-labelledby="properties-workflow">
            <SectionTitle id="properties-workflow">{t('yourProperties') || "Your Properties"}</SectionTitle>
            <DashboardPropertiesGrid />
          </section>

          {/* Events + Contacts */}
          <section aria-labelledby="upcoming-events-contacts">
            <SectionTitle id="upcoming-events-contacts">{t('eventsAndContacts') || "Events & Contacts"}</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <DashboardUpcomingEvents />
              <DashboardContactNetwork />
            </div>
          </section>

          {/* Market Summary Block */}
          <section aria-labelledby="market-summary">
            <SectionTitle id="market-summary">{t('marketSummary') || "Market Summary"}</SectionTitle>
            <DashboardMarketSummary />
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
