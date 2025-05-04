
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, ChevronDown, ChevronUp, DollarSign, Home, Percent, Coins, Building } from 'lucide-react';
import { useMarketFilter, MarketSpecificFeature } from '@/hooks/use-market-filter';
import AdvancedROICalculator from '@/components/calculators/AdvancedROICalculator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

const AdvancedCalculatorsPage: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, shouldShowFeature } = useMarketFilter();
  const [activeTab, setActiveTab] = useState('roi');
  const [expandedCalculator, setExpandedCalculator] = useState<string | null>(null);

  // Define calculators with market specificity
  const calculators: MarketSpecificFeature[] = [
    {
      id: 'roi',
      title: t('advancedROICalculator'),
      description: t('calculateInvestmentReturns'),
      icon: <Calculator />,
      markets: ['global'],
    },
    {
      id: 'dcf',
      title: t('discountedCashFlow'),
      description: t('calculatePresentValue'),
      icon: <DollarSign />,
      markets: ['global'],
    },
    {
      id: 'depreciation',
      title: t('depreciationCalculator'),
      description: t('calculateTaxBenefits'),
      icon: <Building />,
      markets: ['global', 'usa', 'canada'],
    },
    {
      id: 'afa',
      title: 'AfA Rechner',
      description: 'Berechnung der Abschreibung für Abnutzung',
      icon: <Building />,
      markets: ['germany', 'austria'],
    },
    {
      id: '1031',
      title: '1031 Exchange Calculator',
      description: 'Calculate tax deferral on property exchanges',
      icon: <Coins />,
      markets: ['usa'],
    },
    {
      id: 'grunderwerbsteuer',
      title: 'Grunderwerbsteuer Rechner',
      description: 'Berechnung der Grunderwerbsteuer in Deutschland',
      icon: <Home />,
      markets: ['germany'],
    },
    {
      id: 'mortgage',
      title: t('advancedMortgageCalculator'),
      description: t('compareFinancingOptions'),
      icon: <Percent />,
      markets: ['global'],
    }
  ];

  // Filter calculators based on user's market
  const filteredCalculators = calculators.filter(calc => 
    shouldShowFeature(calc)
  );

  const toggleCalculator = (id: string) => {
    if (expandedCalculator === id) {
      setExpandedCalculator(null);
    } else {
      setExpandedCalculator(id);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setExpandedCalculator(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Calculator className="mr-2 h-6 w-6" />
          {t('advancedCalculators')}
        </h1>
        <p className="text-muted-foreground">{t('precisionToolsForInvestors')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          {filteredCalculators.map(calc => (
            <TabsTrigger key={calc.id} value={calc.id}>
              {calc.icon && <span className="mr-2 h-4 w-4">{calc.icon}</span>}
              {calc.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ROI Calculator Tab */}
        <TabsContent value="roi" className="space-y-6">
          <AdvancedROICalculator />
        </TabsContent>

        {/* Other calculator tabs */}
        {filteredCalculators.filter(calc => calc.id !== 'roi').map(calc => (
          <TabsContent key={calc.id} value={calc.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {calc.icon}
                  <span className="ml-2">{calc.title}</span>
                </CardTitle>
                <CardDescription>{calc.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Calculator className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">{t('calculatorComingSoon')}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t('calculatorInDevelopment')}
                  </p>
                  <Button onClick={() => toast.info(t('calculatorNotification'))}>
                    {t('notifyWhenReady')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold">{t('quickCalculators')}</h2>
        
        {filteredCalculators.map(calc => (
          <Card key={calc.id} className="overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-accent/10"
              onClick={() => toggleCalculator(calc.id)}
            >
              <div className="flex items-center">
                {calc.icon && <span className="mr-3 h-5 w-5 text-primary">{calc.icon}</span>}
                <div>
                  <h3 className="font-medium">{calc.title}</h3>
                  <p className="text-sm text-muted-foreground">{calc.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                {expandedCalculator === calc.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {expandedCalculator === calc.id && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  {calc.id === 'roi' ? (
                    <div className="p-4 max-h-96 overflow-auto">
                      <AdvancedROICalculator />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-2">
                        <Calculator className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {t('calculatorInDevelopment')}
                        </p>
                        <Button size="sm" variant="outline">
                          {t('openFullCalculator')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedCalculatorsPage;
