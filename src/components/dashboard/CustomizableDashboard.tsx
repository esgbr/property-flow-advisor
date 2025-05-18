
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, BarChart3, Calculator, Bell, Globe, FileText } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import CustomizableDashboardLayout, { WidgetConfig } from './CustomizableDashboardLayout';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import MarketTrendsChart from '@/components/market/MarketTrendsChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CustomizableDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();

  // Define available widgets with their configurations
  const defaultWidgets: WidgetConfig[] = [
    {
      id: 'portfolio-summary',
      type: 'portfolio',
      title: {
        en: 'Portfolio Summary',
        de: 'Portfolio Zusammenfassung',
        es: 'Resumen de Cartera',
        fr: 'Résumé du Portefeuille'
      },
      visible: true,
      position: 0,
      size: 'large'
    },
    {
      id: 'market-trends',
      type: 'market',
      title: {
        en: 'Market Trends',
        de: 'Markttrends',
        es: 'Tendencias del Mercado',
        fr: 'Tendances du Marché'
      },
      visible: true,
      position: 1,
      size: 'medium'
    },
    {
      id: 'calculator',
      type: 'calculator',
      title: {
        en: 'Investment Calculator',
        de: 'Investitionsrechner',
        es: 'Calculadora de Inversiones',
        fr: 'Calculateur d\'Investissement'
      },
      visible: true,
      position: 2,
      size: 'medium'
    },
    {
      id: 'alerts',
      type: 'alerts',
      title: {
        en: 'Property Alerts',
        de: 'Immobilien-Benachrichtigungen',
        es: 'Alertas de Propiedades',
        fr: 'Alertes de Propriété'
      },
      visible: preferences.experienceLevel === 'beginner' ? false : true,
      position: 3,
      size: 'small'
    },
    {
      id: 'news',
      type: 'news',
      title: {
        en: 'Market News',
        de: 'Marktnachrichten',
        es: 'Noticias del Mercado',
        fr: 'Actualités du Marché'
      },
      visible: true,
      position: 4,
      size: 'medium'
    },
    {
      id: 'taxes',
      type: 'taxes',
      title: {
        en: 'Tax Optimization',
        de: 'Steueroptimierung',
        es: 'Optimización Fiscal',
        fr: 'Optimisation Fiscale'
      },
      visible: preferences.experienceLevel === 'beginner' ? false : true,
      position: 5,
      size: 'small'
    }
  ];

  // Use saved widget configuration or default
  const [widgets, setWidgets] = useState<WidgetConfig[]>(
    preferences.dashboardWidgets?.length ? preferences.dashboardWidgets : defaultWidgets
  );

  // Handle layout changes
  const handleLayoutChange = (updatedWidgets: WidgetConfig[]) => {
    setWidgets(updatedWidgets);
  };

  // Filter widgets that are visible
  const visibleWidgets = widgets.filter(widget => widget.visible);

  // Determine widget size class
  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-3';
      default: return 'col-span-1';
    }
  };

  // Render appropriate widget based on type
  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'portfolio':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('trackYourRealEstateInvestments')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <div className="h-full">
                <PortfolioDashboard />
              </div>
            </CardContent>
          </Card>
        );
      
      case 'market':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('compareYourInvestments')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <MarketTrendsChart />
            </CardContent>
          </Card>
        );
      
      case 'calculator':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('simulateYourPortfolioGrowth')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground text-center">
                  {t('featureComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'alerts':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('stayInformedAboutProperties')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground text-center">
                  {t('featureComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'news':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('latestRealEstateNews')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground text-center">
                  {t('featureComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'taxes':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {widget.title[language] || widget.title.en}
              </CardTitle>
              <CardDescription>{t('optimizeYourTaxStrategy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground text-center">
                  {t('featureComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  // Return customizable dashboard layout with widgets
  return (
    <div className="space-y-4">
      <CustomizableDashboardLayout
        availableWidgets={defaultWidgets}
        onLayoutChange={handleLayoutChange}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleWidgets.map((widget) => (
            <div key={widget.id} className={getWidgetSizeClass(widget.size)}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </CustomizableDashboardLayout>
    </div>
  );
};

export default CustomizableDashboard;
