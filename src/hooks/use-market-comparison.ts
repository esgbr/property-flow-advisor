
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { InvestmentMarket, useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useEnhancedMarket } from './use-enhanced-market';
import { captureException } from '@/utils/errorTracking';

/**
 * Hook for comparing different real estate markets
 */
export function useMarketComparison() {
  const { language } = useLanguage();
  const { currentMarket, getRecommendedMarkets, getAllMarkets } = useEnhancedMarket();
  const [comparisonMetrics, setComparisonMetrics] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMarkets, setSelectedMarkets] = useState<InvestmentMarket[]>([currentMarket]);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  // Fetch market comparison data
  const fetchMarketComparison = async (markets: InvestmentMarket[]) => {
    setIsLoading(true);
    setComparisonError(null);

    try {
      // Simulate API call - in a real app this would fetch real data
      const response = await new Promise<Record<string, any>>((resolve) => {
        setTimeout(() => {
          const data: Record<string, any> = {};
          
          markets.forEach(market => {
            // Generate realistic comparison metrics for each market
            data[market] = {
              averagePrice: Math.floor(Math.random() * 500000) + 100000,
              rentalYield: (Math.random() * 5 + 2).toFixed(2),
              yearOverYearGrowth: (Math.random() * 8 - 2).toFixed(2),
              averageRent: Math.floor(Math.random() * 3000) + 500,
              vacancy: (Math.random() * 5 + 1).toFixed(2),
              constructionCosts: Math.floor(Math.random() * 2000) + 1000,
              propertyTax: (Math.random() * 2 + 0.2).toFixed(2),
              investmentVolume: Math.floor(Math.random() * 10000000000) + 500000000,
              returnOnInvestment: (Math.random() * 6 + 4).toFixed(2),
              marketLiquidity: (Math.random() * 100).toFixed(0)
            };
          });
          
          resolve(data);
        }, 800);
      });

      setComparisonMetrics(response);
    } catch (error) {
      setComparisonError('Failed to load market comparison data');
      captureException(error instanceof Error ? error : new Error('Unknown error in fetchMarketComparison'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add market to comparison
  const addMarketToComparison = (market: InvestmentMarket) => {
    if (!selectedMarkets.includes(market)) {
      const updatedMarkets = [...selectedMarkets, market];
      setSelectedMarkets(updatedMarkets);
      fetchMarketComparison(updatedMarkets);
    }
  };

  // Remove market from comparison
  const removeMarketFromComparison = (market: InvestmentMarket) => {
    if (selectedMarkets.length > 1) {
      const updatedMarkets = selectedMarkets.filter(m => m !== market);
      setSelectedMarkets(updatedMarkets);
      fetchMarketComparison(updatedMarkets);
    }
  };

  // Reset comparison to default
  const resetComparison = () => {
    setSelectedMarkets([currentMarket]);
    fetchMarketComparison([currentMarket]);
  };

  // Get difference between markets for a specific metric
  const getMetricDifference = (marketA: InvestmentMarket, marketB: InvestmentMarket, metric: string): number => {
    if (!comparisonMetrics[marketA] || !comparisonMetrics[marketB]) return 0;
    
    const valueA = parseFloat(comparisonMetrics[marketA][metric]);
    const valueB = parseFloat(comparisonMetrics[marketB][metric]);
    
    return valueA - valueB;
  };

  // Get percentage difference between markets for a specific metric
  const getMetricPercentageDifference = (marketA: InvestmentMarket, marketB: InvestmentMarket, metric: string): string => {
    if (!comparisonMetrics[marketA] || !comparisonMetrics[marketB]) return '0%';
    
    const valueA = parseFloat(comparisonMetrics[marketA][metric]);
    const valueB = parseFloat(comparisonMetrics[marketB][metric]);
    
    if (valueB === 0) return 'N/A';
    
    const percentDiff = ((valueA - valueB) / valueB) * 100;
    return `${percentDiff.toFixed(1)}%`;
  };

  // Get recommended markets that are not already in the comparison
  const getAvailableRecommendedMarkets = () => {
    const recommendedMarkets = getRecommendedMarkets();
    return recommendedMarkets.filter(market => !selectedMarkets.includes(market.id as InvestmentMarket));
  };

  // Initial data fetch
  useEffect(() => {
    fetchMarketComparison(selectedMarkets);
  }, [currentMarket]);

  return {
    comparisonMetrics,
    isLoading,
    selectedMarkets,
    comparisonError,
    addMarketToComparison,
    removeMarketFromComparison,
    resetComparison,
    getMetricDifference,
    getMetricPercentageDifference,
    getAvailableRecommendedMarkets,
    fetchMarketComparison
  };
}
