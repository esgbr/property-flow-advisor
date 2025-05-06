
import { useState, useMemo, useEffect } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { getLocalizedMarketName } from '@/utils/marketHelpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';

interface MarketMetric {
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

interface MarketComparisonMarket {
  id: InvestmentMarket;
  name: string;
}

interface MarketComparison {
  comparisonMetrics: Record<InvestmentMarket, MarketMetric>;
  isLoading: boolean;
  getMetricDifference: (market1: InvestmentMarket, market2: InvestmentMarket, metric: keyof MarketMetric) => number;
  getMetricPercentageDifference: (market1: InvestmentMarket, market2: InvestmentMarket, metric: keyof MarketMetric) => string;
  compareMarketOverall: (market1: InvestmentMarket, market2: InvestmentMarket) => {
    betterMarket: InvestmentMarket;
    differenceScore: number;
    evaluationText: string;
  };
  selectedMarkets: InvestmentMarket[];
  addMarketToComparison: (market: InvestmentMarket) => void;
  removeMarketFromComparison: (market: InvestmentMarket) => void;
  getAvailableRecommendedMarkets: () => MarketComparisonMarket[];
}

const generateDummyData = (): Record<InvestmentMarket, MarketMetric> => {
  // For demo purposes, these are mock values
  return {
    'germany': {
      averagePrice: 3500,
      averageRent: 12.5,
      rentalYield: 3.8,
      yearOverYearGrowth: 4.2,
      vacancy: 2.1,
      affordabilityIndex: 6.2,
      investmentVolume: 85000,
      salesVolume: 32500,
      constructionActivity: 8.7,
      marketSentiment: 7.2
    },
    'austria': {
      averagePrice: 3200,
      averageRent: 11.2,
      rentalYield: 3.5,
      yearOverYearGrowth: 3.8,
      vacancy: 2.3,
      affordabilityIndex: 5.9,
      investmentVolume: 42000,
      salesVolume: 18200,
      constructionActivity: 7.3,
      marketSentiment: 6.8
    },
    'switzerland': {
      averagePrice: 7800,
      averageRent: 25.3,
      rentalYield: 3.2,
      yearOverYearGrowth: 2.1,
      vacancy: 1.4,
      affordabilityIndex: 8.5,
      investmentVolume: 63000,
      salesVolume: 24600,
      constructionActivity: 5.8,
      marketSentiment: 7.9
    },
    'usa': {
      averagePrice: 3200,
      averageRent: 18.7,
      rentalYield: 5.8,
      yearOverYearGrowth: 6.3,
      vacancy: 4.2,
      affordabilityIndex: 5.1,
      investmentVolume: 320000,
      salesVolume: 156000,
      constructionActivity: 12.5,
      marketSentiment: 8.1
    },
    'canada': {
      averagePrice: 3700,
      averageRent: 19.5,
      rentalYield: 5.3,
      yearOverYearGrowth: 5.8,
      vacancy: 3.8,
      affordabilityIndex: 5.7,
      investmentVolume: 95000,
      salesVolume: 42600,
      constructionActivity: 9.2,
      marketSentiment: 7.5
    },
    'global': {
      averagePrice: 4200,
      averageRent: 17.2,
      rentalYield: 4.1,
      yearOverYearGrowth: 4.5,
      vacancy: 3.0,
      affordabilityIndex: 6.3,
      investmentVolume: 121000,
      salesVolume: 54800,
      constructionActivity: 8.7,
      marketSentiment: 7.4
    }
  };
};

export const useMarketComparison = (): MarketComparison => {
  const { preferences } = useUserPreferences();
  const { language } = useLanguage();
  const { currentMarket } = useEnhancedMarket();
  const [comparisonMetrics, setComparisonMetrics] = useState<Record<InvestmentMarket, MarketMetric>>(generateDummyData());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<InvestmentMarket[]>(['germany', 'austria']);

  // Simulate API fetch
  useEffect(() => {
    // setIsLoading(true);
    // In a real app, we would fetch this data from an API
    // setTimeout(() => {
    //   setComparisonMetrics(generateDummyData());
    //   setIsLoading(false);
    // }, 1000);
    
    // For now, just use the dummy data directly
  }, []);

  // Add market to comparison
  const addMarketToComparison = (market: InvestmentMarket) => {
    if (!selectedMarkets.includes(market)) {
      setSelectedMarkets(prev => [...prev, market]);
    }
  };

  // Remove market from comparison
  const removeMarketFromComparison = (market: InvestmentMarket) => {
    setSelectedMarkets(prev => prev.filter(m => m !== market));
  };

  // Get available recommended markets
  const getAvailableRecommendedMarkets = (): MarketComparisonMarket[] => {
    const availableMarkets: MarketComparisonMarket[] = [
      { id: 'germany', name: language === 'de' ? 'Deutschland' : 'Germany' },
      { id: 'austria', name: language === 'de' ? 'Österreich' : 'Austria' },
      { id: 'switzerland', name: language === 'de' ? 'Schweiz' : 'Switzerland' },
      { id: 'usa', name: language === 'de' ? 'USA' : 'USA' },
      { id: 'canada', name: language === 'de' ? 'Kanada' : 'Canada' },
      { id: 'global', name: language === 'de' ? 'Global' : 'Global' }
    ];
    
    return availableMarkets.filter(market => !selectedMarkets.includes(market.id));
  };

  // Calculate difference between two markets for a specific metric
  const getMetricDifference = (market1: InvestmentMarket, market2: InvestmentMarket, metric: keyof MarketMetric): number => {
    if (!comparisonMetrics[market1] || !comparisonMetrics[market2]) return 0;
    
    return comparisonMetrics[market1][metric] - comparisonMetrics[market2][metric];
  };

  // Get percentage difference between markets
  const getMetricPercentageDifference = (market1: InvestmentMarket, market2: InvestmentMarket, metric: keyof MarketMetric): string => {
    if (!comparisonMetrics[market1] || !comparisonMetrics[market2]) return '0%';
    
    const value1 = comparisonMetrics[market1][metric];
    const value2 = comparisonMetrics[market2][metric];
    
    if (value2 === 0) return '0%';
    
    const diff = ((value1 - value2) / value2) * 100;
    const sign = diff > 0 ? '+' : '';
    
    return `${sign}${diff.toFixed(1)}%`;
  };

  // Compare markets overall
  const compareMarketOverall = (market1: InvestmentMarket, market2: InvestmentMarket) => {
    if (!comparisonMetrics[market1] || !comparisonMetrics[market2]) {
      return {
        betterMarket: market1,
        differenceScore: 0,
        evaluationText: language === 'de' ? 'Keine Daten verfügbar' : 'No data available'
      };
    }
    
    // Calculate a weighted score for each market
    const metrics = ['rentalYield', 'yearOverYearGrowth', 'vacancy', 'affordabilityIndex', 'marketSentiment'] as const;
    const weights = {
      rentalYield: 0.25,
      yearOverYearGrowth: 0.3,
      vacancy: -0.15, // negative since lower is better
      affordabilityIndex: -0.1, // negative since lower is better
      marketSentiment: 0.2
    };
    
    let score1 = 0;
    let score2 = 0;
    
    metrics.forEach(metric => {
      const value1 = comparisonMetrics[market1][metric];
      const value2 = comparisonMetrics[market2][metric];
      
      score1 += value1 * weights[metric];
      score2 += value2 * weights[metric];
    });
    
    const differenceScore = score1 - score2;
    const betterMarket = differenceScore > 0 ? market1 : market2;
    
    // Generate evaluation text
    let evaluationText = '';
    if (Math.abs(differenceScore) < 0.5) {
      evaluationText = language === 'de' 
        ? `${getLocalizedMarketName(market1, language)} und ${getLocalizedMarketName(market2, language)} sind ähnlich attraktiv für Investoren.`
        : `${getLocalizedMarketName(market1, language)} and ${getLocalizedMarketName(market2, language)} are similarly attractive for investors.`;
    } else {
      evaluationText = language === 'de'
        ? `${getLocalizedMarketName(betterMarket, language)} bietet derzeit bessere Investitionsmöglichkeiten.`
        : `${getLocalizedMarketName(betterMarket, language)} currently offers better investment opportunities.`;
    }
    
    return {
      betterMarket,
      differenceScore: Math.abs(differenceScore),
      evaluationText
    };
  };

  return {
    comparisonMetrics,
    isLoading,
    getMetricDifference,
    getMetricPercentageDifference,
    compareMarketOverall,
    selectedMarkets,
    addMarketToComparison,
    removeMarketFromComparison,
    getAvailableRecommendedMarkets
  };
};
