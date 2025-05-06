
import { useState, useCallback, useMemo } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';

export interface MarketMetric {
  averagePrice: number;
  averageRent: number;
  rentalYield: number;
  yearOverYearGrowth: number;
  vacancy: number;
  affordabilityIndex: number;
  investmentVolume: number;
  salesVolume: number;
  constructionActivity: number;
  marketSentiment: number;
}

export interface MarketOption {
  id: InvestmentMarket;
  name: string;
  recommendedScore?: number;
}

export const useMarketComparison = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  
  const [primaryMarket, setPrimaryMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'germany'
  );
  const [comparisonMarket, setComparisonMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket === 'germany' ? 'austria' : 'germany'
  );
  const [selectedMarkets, setSelectedMarkets] = useState<InvestmentMarket[]>([
    primaryMarket, comparisonMarket
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample market metrics
  const marketMetrics: Record<InvestmentMarket, MarketMetric> = {
    germany: {
      averagePrice: 4280,
      averageRent: 12.8,
      rentalYield: 3.5,
      yearOverYearGrowth: 3.7,
      vacancy: 2.1,
      affordabilityIndex: 6.2,
      investmentVolume: 78500000000,
      salesVolume: 240000,
      constructionActivity: 3.2,
      marketSentiment: 7.4
    },
    austria: {
      averagePrice: 3950,
      averageRent: 11.2,
      rentalYield: 3.4,
      yearOverYearGrowth: 3.9,
      vacancy: 2.4,
      affordabilityIndex: 5.8,
      investmentVolume: 28300000000,
      salesVolume: 82000,
      constructionActivity: 2.8,
      marketSentiment: 7.1
    },
    switzerland: {
      averagePrice: 7820,
      averageRent: 22.5,
      rentalYield: 3.1,
      yearOverYearGrowth: 2.8,
      vacancy: 1.7,
      affordabilityIndex: 9.3,
      investmentVolume: 41200000000,
      salesVolume: 68000,
      constructionActivity: 2.4,
      marketSentiment: 8.2
    },
    usa: {
      averagePrice: 3620,
      averageRent: 16.8,
      rentalYield: 4.8,
      yearOverYearGrowth: 4.5,
      vacancy: 4.2,
      affordabilityIndex: 5.1,
      investmentVolume: 495000000000,
      salesVolume: 5200000,
      constructionActivity: 4.8,
      marketSentiment: 6.9
    },
    canada: {
      averagePrice: 3950,
      averageRent: 16.2,
      rentalYield: 4.3,
      yearOverYearGrowth: 3.8,
      vacancy: 3.8,
      affordabilityIndex: 6.7,
      investmentVolume: 87300000000,
      salesVolume: 520000,
      constructionActivity: 3.9,
      marketSentiment: 6.5
    },
    global: {
      averagePrice: 4120,
      averageRent: 15.4,
      rentalYield: 4.1,
      yearOverYearGrowth: 3.6,
      vacancy: 3.5,
      affordabilityIndex: 6.4,
      investmentVolume: 987000000000,
      salesVolume: 9500000,
      constructionActivity: 3.6,
      marketSentiment: 7.0
    },
    uk: {
      averagePrice: 4580,
      averageRent: 18.2,
      rentalYield: 4.0,
      yearOverYearGrowth: 3.2,
      vacancy: 2.8,
      affordabilityIndex: 7.5,
      investmentVolume: 65400000000,
      salesVolume: 1200000,
      constructionActivity: 2.9,
      marketSentiment: 6.8
    },
    europe: {
      averagePrice: 4050,
      averageRent: 14.5,
      rentalYield: 3.7,
      yearOverYearGrowth: 3.4,
      vacancy: 2.6,
      affordabilityIndex: 6.8,
      investmentVolume: 295000000000,
      salesVolume: 3800000,
      constructionActivity: 3.0,
      marketSentiment: 7.2
    }
  };

  // Set the market for comparison
  const setMarket = useCallback((market: InvestmentMarket, isPrimary: boolean) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (isPrimary) {
        setPrimaryMarket(market);
      } else {
        setComparisonMarket(market);
      }
      
      // Ensure the market is in the selected markets list
      setSelectedMarkets((prev) => {
        if (!prev.includes(market)) {
          return [...prev, market];
        }
        return prev;
      });
      
      setIsLoading(false);
    }, 500); // Simulate API delay
  }, []);

  // Get metric for specific market
  const getMarketMetric = useCallback((market: InvestmentMarket): MarketMetric => {
    return marketMetrics[market] || marketMetrics.global;
  }, []);

  // Add a market to the comparison list
  const addMarketToComparison = useCallback((market: InvestmentMarket) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setSelectedMarkets((prev) => {
        if (!prev.includes(market)) {
          return [...prev, market];
        }
        return prev;
      });
      
      setIsLoading(false);
      
      toast({
        title: language === 'de' ? 'Markt hinzugefügt' : 'Market added',
        description: language === 'de' 
          ? `${market.charAt(0).toUpperCase() + market.slice(1)} zum Vergleich hinzugefügt`
          : `Added ${market.charAt(0).toUpperCase() + market.slice(1)} to comparison`
      });
    }, 300);
  }, [language]);

  // Remove a market from the comparison list
  const removeMarketFromComparison = useCallback((market: InvestmentMarket) => {
    setSelectedMarkets((prev) => {
      // Don't remove if it would leave fewer than 1 market
      if (prev.length <= 1) {
        toast({
          title: language === 'de' ? 'Fehler' : 'Error',
          description: language === 'de' 
            ? 'Mindestens ein Markt muss ausgewählt sein'
            : 'At least one market must be selected',
          variant: 'destructive'
        });
        return prev;
      }
      
      return prev.filter(m => m !== market);
    });
  }, [language]);

  // Calculate the difference between metrics for two markets
  const getMetricDifference = useCallback((marketA: InvestmentMarket, marketB: InvestmentMarket, metric: keyof MarketMetric): number => {
    const valueA = marketMetrics[marketA]?.[metric] || 0;
    const valueB = marketMetrics[marketB]?.[metric] || 0;
    return valueA - valueB;
  }, []);

  // Calculate percentage difference between markets for a metric
  const getMetricPercentageDifference = useCallback((marketA: InvestmentMarket, marketB: InvestmentMarket, metric: keyof MarketMetric): string => {
    const valueA = marketMetrics[marketA]?.[metric] || 0;
    const valueB = marketMetrics[marketB]?.[metric] || 0;
    
    if (valueB === 0) return '0%';
    
    const diff = ((valueA - valueB) / valueB) * 100;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
  }, []);

  // Get available markets that are recommended but not yet selected
  const getAvailableRecommendedMarkets = useCallback((): MarketOption[] => {
    // These would come from an analysis algorithm in a real app
    const recommendedMarkets: MarketOption[] = [
      { id: 'austria', name: 'Austria', recommendedScore: 92 },
      { id: 'switzerland', name: 'Switzerland', recommendedScore: 89 },
      { id: 'germany', name: 'Germany', recommendedScore: 87 },
      { id: 'usa', name: 'USA', recommendedScore: 85 },
      { id: 'uk', name: 'United Kingdom', recommendedScore: 82 }
    ];
    
    // Filter out already selected markets
    return recommendedMarkets.filter(market => !selectedMarkets.includes(market.id));
  }, [selectedMarkets]);

  // All market metrics in one place
  const comparisonMetrics = useMemo(() => {
    const result: Record<string, MarketMetric> = {};
    selectedMarkets.forEach(market => {
      result[market] = marketMetrics[market];
    });
    return result;
  }, [selectedMarkets]);

  return {
    primaryMarket,
    comparisonMarket,
    setMarket,
    getMarketMetric,
    marketMetrics,
    
    // Add required properties used by components
    comparisonMetrics,
    isLoading,
    selectedMarkets,
    addMarketToComparison,
    removeMarketFromComparison,
    getAvailableRecommendedMarkets,
    getMetricDifference,
    getMetricPercentageDifference
  };
};
