
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';

/**
 * Now consumes centralized portfolio stats.
 */
const DashboardPortfolioStats: React.FC = () => {
  const { t } = useLanguage();
  const { stats } = usePortfolioData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>{t('portfolioValue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">€{stats.totalValue.toLocaleString()}</div>
          <p className="text-sm text-green-600 flex items-center">
            +5.2% <span className="text-muted-foreground ml-1">{t('fromLastMonth')}</span>
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>{t('monthlyIncome')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">€{stats.monthlyIncome.toLocaleString()}</div>
          <p className="text-sm text-green-600 flex items-center">
            +2.1% <span className="text-muted-foreground ml-1">{t('fromLastMonth')}</span>
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>{t('averageYield')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.averageYield}%</div>
          <p className="text-sm text-muted-foreground">{t('acrossAllProperties')}</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>{t('contacts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.contactsCount}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('manageRealEstateContacts')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPortfolioStats;
