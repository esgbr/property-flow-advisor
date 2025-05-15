import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  BarChart2, 
  ChevronsRight, 
  Bell, 
  LineChart, 
  BarChart, 
  ChevronRight,
  Phone,
  Calendar,
  User
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import PropertySummary from '@/components/property/PropertySummary';
import PropertyValueChart from '@/components/charts/PropertyValueChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import MarketUpdateCard from '@/components/market/MarketUpdateCard';
import PortfolioAllocationChart from '@/components/charts/PortfolioAllocationChart';
import MarketTrendsChart from '@/components/charts/MarketTrendsChart';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardPortfolioStats from '@/components/dashboard/DashboardPortfolioStats';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardUpcomingEvents from '@/components/dashboard/DashboardUpcomingEvents';
import DashboardPropertiesGrid from '@/components/dashboard/DashboardPropertiesGrid';
import DashboardMarketSummary from '@/components/dashboard/DashboardMarketSummary';
import DashboardContactNetwork from '@/components/dashboard/DashboardContactNetwork';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  const properties = [
    { id: 1, name: 'Apartment 12B', value: 350000, location: 'Berlin', rental_yield: 4.2, ownership: 100 },
    { id: 2, name: 'Commercial Space', value: 520000, location: 'Frankfurt', rental_yield: 5.8, ownership: 100 },
    { id: 3, name: 'Residential Building', value: 1250000, location: 'Munich', rental_yield: 3.9, ownership: 75 }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-8 pb-20">
          
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

          {/* Add any additional sections / feature integrations here */}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
