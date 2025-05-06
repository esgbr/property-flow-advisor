import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { 
  Building, 
  Home, 
  BarChart3,
  Calculator,
  Euro,
  Globe,
  TrendingUp,
  FileText,
  MapPin,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Badge } from '@/components/ui/badge';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/ui/page-loader';
import { useComponentPerformance } from '@/utils/performanceUtils';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';

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
  const { shouldShowFeature, userMarket, setUserMarket } = useMarketFilter();
  const [isLoading, setIsLoading] = useState(true);
  const { largeText } = useAccessibility();

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Fix the handleMarketChange function to use setUserMarket directly
  const handleMarketChange = (market: InvestmentMarket) => {
    setUserMarket(market);
  };

  // Consolidated features array with removed duplicates and merged similar features
  const features: Feature[] = [
    {
      id: 'portfolio',
      title: t('Portfolio Management'),
      description: t('Manage all your properties and investments in one place'),
      icon: <Building className="h-8 w-8 text-primary" />,
      action: () => navigate('/investor-dashboard'),
      markets: ['global']
    },
    {
      id: 'analytics',
      title: t('Investment Analytics'),
      description: t('Analyze performance and discover opportunities'),
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      action: () => navigate('/investor-dashboard'),
      markets: ['global']
    },
    {
      id: 'calculators',
      title: t('Financial Tools'),
      description: t('Financing, ROI, and investment calculators'),
      icon: <Calculator className="h-8 w-8 text-primary" />,
      action: () => navigate('/calculators'),
      markets: ['global']
    },
    {
      id: 'regional-tools',
      title: language === 'de' ? 'Regionale Immobilien-Tools' : 'Regional Real Estate Tools',
      description: language === 'de' 
        ? 'Spezialisierte Tools für verschiedene Immobilienmärkte'
        : 'Specialized tools for different real estate markets',
      icon: <Globe className="h-8 w-8 text-primary" />,
      action: () => navigate(userMarket === 'germany' || userMarket === 'austria' 
                ? '/deutsche-immobilien-tools' 
                : '/market-explorer'),
      markets: ['global', 'germany', 'austria', 'switzerland', 'usa', 'canada']
    },
    {
      id: 'market',
      title: t('Market Explorer'),
      description: t('Research and analyze real estate markets'),
      icon: <MapPin className="h-8 w-8 text-primary" />,
      action: () => navigate('/market-explorer'),
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

  // Add German-specific tools only for German-speaking markets
  if (userMarket === 'germany' || userMarket === 'austria' || userMarket === 'switzerland' || language === 'de') {
    features.push({
      id: 'german-tools',
      title: language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools',
      description: language === 'de' 
        ? 'Spezielle Tools für den deutschen Immobilienmarkt'
        : 'Specialized tools for the German real estate market',
      icon: <Euro className="h-8 w-8 text-primary" />,
      action: () => navigate('/deutsche-immobilien-tools'),
      markets: ['germany', 'austria', 'switzerland']
    });
  }

  // Filter features based on user's market preference
  const filteredFeatures = features.filter(feature => 
    !feature.markets || shouldShowFeature({ id: feature.id, markets: feature.markets })
  );
  
  // Quick access workflows based on user's most likely needs
  const quickAccessWorkflows = [
    {
      id: 'analyse',
      title: language === 'de' ? 'Immobilien analysieren' : 'Analyze Properties',
      action: () => navigate('/investor-dashboard')
    },
    {
      id: 'finance',
      title: language === 'de' ? 'Finanzierung berechnen' : 'Calculate Financing',
      action: () => navigate('/calculators')
    },
    {
      id: 'market',
      title: language === 'de' ? 'Markt erkunden' : 'Explore Market',
      action: () => navigate('/market-explorer')
    }
  ];
  
  if (isLoading) {
    return <PageLoader message={t('Loading PropertyFlow...')} size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Building className="h-16 w-16 text-primary" aria-hidden="true" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${largeText ? 'text-5xl md:text-6xl' : ''}`}>
            {t('Welcome to PropertyFlow')}
          </h1>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${largeText ? 'text-2xl' : ''}`}>
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
            <Button size="lg" onClick={() => navigate('/dashboard')} className="group">
              <Home className="mr-2 h-5 w-5" aria-hidden="true" />
              {t('Go to Dashboard')}
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/investor-dashboard')} className="group">
              <Building className="mr-2 h-5 w-5" aria-hidden="true" />
              {t('View Portfolio')}
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
            <AccessibilitySettingsButton variant="secondary" size="lg" />
          </div>
        </header>

        {/* Quick Access Workflow Cards */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-6 text-center ${largeText ? 'text-3xl' : ''}`}>
            {language === 'de' ? 'Schnellzugriff-Workflows' : 'Quick Access Workflows'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickAccessWorkflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 hover:bg-primary/5"
                onClick={workflow.action}
              >
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">{workflow.title}</h3>
                  <Button variant="ghost" size="sm" className="group">
                    {language === 'de' ? 'Starten' : 'Start'} 
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<PageLoader size="md" />}>
            <FeatureGrid features={filteredFeatures} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Recommended Next Steps */}
        <WorkflowSuggestions
          currentTool="home"
          workflowType="analyse"
          maxSuggestions={3}
          className="mb-16"
        />

        <section className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${largeText ? 'text-4xl' : ''}`}>
            {t('Invest With Confidence')}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-3xl mx-auto ${largeText ? 'text-2xl' : ''}`}>
            {t('Invest With Confidence Description')}
          </p>
          <Button 
            size="lg" 
            className="mt-6 group"
            onClick={() => navigate('/investor-dashboard')}
          >
            {t('Start Investing')}
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        </section>

        <footer className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 PropertyFlow. {t('All Rights Reserved')}</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="link" onClick={() => navigate('/accessibility')}>
              {t('Accessibility')}
            </Button>
            <Button variant="link" onClick={() => navigate('/settings')}>
              {t('Settings')}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
