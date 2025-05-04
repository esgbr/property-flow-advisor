
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Home, 
  Loader2,
  BarChart3,
  Calculator,
  Euro,
  Briefcase,
  Globe,
  TrendingUp,
  Users,
  FileText,
  MapPin
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Badge } from '@/components/ui/badge';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/ui/page-loader';
import { useComponentPerformance } from '@/utils/performanceUtils';
import useLazyComponent from '@/hooks/use-lazy-load';

// Lazy load components for better initial loading performance
const FeatureGrid = lazy(() => import('@/components/home/FeatureGrid'));

// Define Feature type for better type safety
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  markets: InvestmentMarket[];
}

const Index: React.FC = () => {
  useComponentPerformance('IndexPage');
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { shouldShowFeature, userMarket } = useMarketFilter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Properly typed features array
  const features: Feature[] = [
    {
      id: 'portfolio',
      title: t('Portfolio Management'),
      description: t('Portfolio Management Description'),
      icon: <Building className="h-8 w-8 text-primary" />,
      action: () => navigate('/properties'),
      markets: ['global']
    },
    {
      id: 'investment',
      title: t('Investment Analysis'),
      description: t('Investment Analysis Description'),
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      action: () => navigate('/investor-dashboard'),
      markets: ['global']
    },
    {
      id: 'calculators',
      title: t('Financial Calculators'),
      description: t('Financial Calculators Description'),
      icon: <Calculator className="h-8 w-8 text-primary" />,
      action: () => navigate('/calculators'),
      markets: ['global']
    },
    {
      id: 'german-tools',
      title: language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools',
      description: language === 'de' 
        ? 'Spezielle Tools für den deutschen Immobilienmarkt, inkl. Grunderwerbsteuer, Mietkauf und AfA-Rechner.'
        : 'Specialized tools for the German real estate market, including transfer tax, rent-to-own and depreciation calculators.',
      icon: <Euro className="h-8 w-8 text-primary" />,
      action: () => navigate('/deutsche-immobilien-tools'),
      markets: ['germany', 'austria', 'switzerland']
    },
    {
      id: 'us-tools',
      title: language === 'de' ? 'US-Immobilien-Tools' : 'US Real Estate Tools',
      description: language === 'de'
        ? 'Spezielle Tools für den US-Immobilienmarkt, inkl. 1031 Exchange, Property Tax und Depreciation Calculator.'
        : 'Specialized tools for the US real estate market, including 1031 exchange, property tax and depreciation calculators.',
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      action: () => navigate('/us-real-estate-tools'),
      markets: ['usa', 'canada']
    },
    {
      id: 'market',
      title: t('Market Explorer'),
      description: t('Market Explorer Description'),
      icon: <MapPin className="h-8 w-8 text-primary" />,
      action: () => navigate('/market-explorer'),
      markets: ['global']
    },
    {
      id: 'insights',
      title: t('Global Insights'),
      description: t('Global Insights Description'),
      icon: <Globe className="h-8 w-8 text-primary" />,
      action: () => navigate('/market-analysis'),
      markets: ['global']
    },
    {
      id: 'performance',
      title: t('Performance Analytics'),
      description: t('Track and analyze the performance of your real estate investments'),
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      action: () => navigate('/portfolio-analytics'),
      markets: ['global']
    },
    {
      id: 'tenant',
      title: t('Tenant Management'),
      description: t('Manage tenant relationships, leases, and communications'),
      icon: <Users className="h-8 w-8 text-primary" />,
      action: () => navigate('/tenant-management'),
      markets: ['global']
    },
    {
      id: 'documents',
      title: t('Document Center'),
      description: t('Store and organize all your real estate documents securely'),
      icon: <FileText className="h-8 w-8 text-primary" />,
      action: () => navigate('/documents'),
      markets: ['global']
    }
  ];

  // Filter features based on user's market preference
  const filteredFeatures = features.filter(feature => 
    !feature.markets || shouldShowFeature({ id: feature.id, markets: feature.markets })
  );
  
  if (isLoading) {
    return <PageLoader message={t('Loading PropertyFlow...')} size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Building className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Welcome to PropertyFlow')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('Property Flow Description')}
          </p>
          
          {userMarket && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm font-medium">
                {t('Market')}: {userMarket.charAt(0).toUpperCase() + userMarket.slice(1)}
              </Badge>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              <Home className="mr-2 h-5 w-5" />
              {t('Go to Dashboard')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/properties')}>
              <Building className="mr-2 h-5 w-5" />
              {t('View Properties')}
            </Button>
          </div>
        </header>

        <ErrorBoundary>
          <Suspense fallback={<PageLoader size="md" />}>
            <FeatureGrid features={filteredFeatures} />
          </Suspense>
        </ErrorBoundary>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">{t('Invest With Confidence')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('Invest With Confidence Description')}
          </p>
          <Button 
            size="lg" 
            className="mt-6"
            onClick={() => navigate('/investor-dashboard')}
          >
            {t('Start Investing')}
          </Button>
        </section>

        <footer className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 PropertyFlow. {t('All Rights Reserved')}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
