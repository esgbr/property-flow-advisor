
import { useState, useEffect } from 'react';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Define the metrics we're tracking for each market
interface MarketMetrics {
  averagePrice: number;
  rentalYield: number;
  yearOverYearGrowth: number;
  averageRent: number;
  vacancy: number;
  investmentVolume: number;
}

// Sample data for each market
const marketMetricsData: Record<InvestmentMarket, MarketMetrics> = {
  'germany': {
    averagePrice: 4200,
    rentalYield: 3.8,
    yearOverYearGrowth: 5.2,
    averageRent: 14.3,
    vacancy: 1.2,
    investmentVolume: 89500000
  },
  'austria': {
    averagePrice: 3800,
    rentalYield: 4.1,
    yearOverYearGrowth: 4.5,
    averageRent: 12.8,
    vacancy: 1.5,
    investmentVolume: 21300000
  },
  'switzerland': {
    averagePrice: 7500,
    rentalYield: 2.9,
    yearOverYearGrowth: 3.8,
    averageRent: 26.5,
    vacancy: 0.9,
    investmentVolume: 42700000
  },
  'usa': {
    averagePrice: 3200,
    rentalYield: 5.2,
    yearOverYearGrowth: 4.3,
    averageRent: 18.5,
    vacancy: 2.1,
    investmentVolume: 125000000
  },
  'canada': {
    averagePrice: 3500,
    rentalYield: 4.5,
    yearOverYearGrowth: 3.9,
    averageRent: 17.2,
    vacancy: 1.8,
    investmentVolume: 35600000
  },
  'global': {
    averagePrice: 4500,
    rentalYield: 4.0,
    yearOverYearGrowth: 4.5,
    averageRent: 18.0,
    vacancy: 1.5,
    investmentVolume: 75000000
  }
};

export const useMarketComparison = () => {
  const [comparisonMetrics, setComparisonMetrics] = useState<Record<InvestmentMarket, MarketMetrics>>(marketMetricsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate loading data
  useEffect(() => {
    // This would normally be an API call
    const loadData = async () => {
      setIsLoading(true);
      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setComparisonMetrics(marketMetricsData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Get the difference between two markets for a specific metric
  const getMetricDifference = (
    primaryMarket: InvestmentMarket,
    comparisonMarket: InvestmentMarket,
    metricKey: keyof MarketMetrics
  ): number => {
    if (!comparisonMetrics[primaryMarket] || !comparisonMetrics[comparisonMarket]) {
      return 0;
    }
    
    const primaryValue = comparisonMetrics[primaryMarket][metricKey];
    const comparisonValue = comparisonMetrics[comparisonMarket][metricKey];
    
    return primaryValue - comparisonValue;
  };

  // Get the percentage difference between two markets for a specific metric
  const getMetricPercentageDifference = (
    primaryMarket: InvestmentMarket,
    comparisonMarket: InvestmentMarket,
    metricKey: keyof MarketMetrics
  ): string => {
    if (!comparisonMetrics[primaryMarket] || !comparisonMetrics[comparisonMarket]) {
      return '0%';
    }
    
    const primaryValue = comparisonMetrics[primaryMarket][metricKey];
    const comparisonValue = comparisonMetrics[comparisonMarket][metricKey];
    
    if (comparisonValue === 0) return '∞%';
    
    const percentDiff = ((primaryValue - comparisonValue) / comparisonValue) * 100;
    const sign = percentDiff >= 0 ? '+' : '';
    
    return `${sign}${percentDiff.toFixed(1)}%`;
  };

  // Get market ranking based on specific metric
  const getMarketRanking = (metricKey: keyof MarketMetrics): InvestmentMarket[] => {
    return Object.keys(comparisonMetrics).sort((a, b) => {
      return comparisonMetrics[b as InvestmentMarket][metricKey] - 
             comparisonMetrics[a as InvestmentMarket][metricKey];
    }) as InvestmentMarket[];
  };

  // Get top performing market for a specific metric
  const getTopPerformingMarket = (metricKey: keyof MarketMetrics): InvestmentMarket => {
    const ranking = getMarketRanking(metricKey);
    return ranking[0];
  };

  return {
    comparisonMetrics,
    isLoading,
    getMetricDifference,
    getMetricPercentageDifference,
    getMarketRanking,
    getTopPerformingMarket
  };
};
