
import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { 
  availableMarkets, 
  getMarketDisplayName, 
  getLocalizedMarketName,
  getFilteredMarketOptions,
  getMarketSimilarity,
  calculateMarketPotentialScore
} from '@/utils/marketHelpers';
import { toast } from '@/components/ui/use-toast';

interface MarketPerformance {
  market: InvestmentMarket;
  yearlyGrowth: number;
  fiveYearGrowth: number;
  rentalYield: number;
  affordability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Enhanced hook to handle market-related functionality
 */
export function useEnhancedMarket() {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the user's current market
  const currentMarket = useMemo(() => 
    preferences.investmentMarket || 'global', 
  [preferences.investmentMarket]);
  
  // Set the user's market preference
  const setMarket = (market: InvestmentMarket) => {
    updatePreferences({ investmentMarket: market });
  };
  
  // Get all available markets
  const getAllMarkets = () => availableMarkets;
  
  // Get the display name for the current market
  const getCurrentMarketDisplayName = () => getMarketDisplayName(currentMarket);
  
  // Get the localized name for the current market
  const getCurrentMarketLocalizedName = () => getLocalizedMarketName(currentMarket, language);
  
  // Get markets filtered by region
  const getMarketsByRegion = (region: string) => getFilteredMarketOptions(region);
  
  // Check if a market is compatible with the user's selected market
  const isMarketCompatible = (market: InvestmentMarket) => {
    if (market === 'global' || currentMarket === 'global') return true;
    return getMarketSimilarity(market, currentMarket) >= 0.5;
  };
  
  // Get recommended markets based on the user's current market
  const getRecommendedMarkets = () => {
    return availableMarkets
      .filter(market => market.id !== currentMarket)
      .sort((a, b) => {
        const simA = getMarketSimilarity(a.id, currentMarket);
        const simB = getMarketSimilarity(b.id, currentMarket);
        return simB - simA;
      })
      .slice(0, 3);
  };
  
  // Track a visit to a specific market page for analytics
  const trackMarketVisit = (market: InvestmentMarket) => {
    // Get current visited markets array or initialize if it doesn't exist
    const recentlyVisitedMarkets = preferences.recentMarkets || [];
    
    // Only add if not already in the list
    if (!recentlyVisitedMarkets.includes(market)) {
      updatePreferences({
        recentMarkets: [...recentlyVisitedMarkets, market]
      });
    }
  };
  
  // Mock market performance data - in a real app this would come from an API
  const getMarketPerformanceData = (market: InvestmentMarket): MarketPerformance => {
    const mockData: Record<InvestmentMarket, MarketPerformance> = {
      'germany': {
        market: 'germany',
        yearlyGrowth: 3.4,
        fiveYearGrowth: 17.5,
        rentalYield: 3.8,
        affordability: 6.2,
        riskLevel: 'low'
      },
      'austria': {
        market: 'austria',
        yearlyGrowth: 2.9,
        fiveYearGrowth: 15.2,
        rentalYield: 3.5,
        affordability: 7.1,
        riskLevel: 'low'
      },
      'switzerland': {
        market: 'switzerland',
        yearlyGrowth: 1.8,
        fiveYearGrowth: 9.3,
        rentalYield: 2.7,
        affordability: 9.5,
        riskLevel: 'low'
      },
      'usa': {
        market: 'usa',
        yearlyGrowth: 4.2,
        fiveYearGrowth: 21.3,
        rentalYield: 5.4,
        affordability: 4.8,
        riskLevel: 'medium'
      },
      'canada': {
        market: 'canada',
        yearlyGrowth: 3.7,
        fiveYearGrowth: 18.9,
        rentalYield: 4.9,
        affordability: 5.3,
        riskLevel: 'medium'
      },
      'global': {
        market: 'global',
        yearlyGrowth: 3.2,
        fiveYearGrowth: 16.5,
        rentalYield: 4.1,
        affordability: 6.5,
        riskLevel: 'medium'
      }
    };
    
    return mockData[market] || mockData.global;
  };
  
  // Compare two markets and return differential metrics
  const compareMarkets = (marketA: InvestmentMarket, marketB: InvestmentMarket) => {
    const dataA = getMarketPerformanceData(marketA);
    const dataB = getMarketPerformanceData(marketB);
    
    return {
      yearlyGrowthDiff: dataA.yearlyGrowth - dataB.yearlyGrowth,
      fiveYearGrowthDiff: dataA.fiveYearGrowth - dataB.fiveYearGrowth,
      rentalYieldDiff: dataA.rentalYield - dataB.rentalYield,
      affordabilityDiff: dataA.affordability - dataB.affordability,
      similarityScore: getMarketSimilarity(marketA, marketB),
      potentialScoreDiff: calculateMarketScore(marketA) - calculateMarketScore(marketB)
    };
  };
  
  // Calculate an overall market score for ranking
  const calculateMarketScore = (market: InvestmentMarket): number => {
    const data = getMarketPerformanceData(market);
    
    // Mock score calculation - in a real app this would be more sophisticated
    return calculateMarketPotentialScore(market, {
      priceGrowth: data.yearlyGrowth,
      rentalYield: data.rentalYield,
      economicStability: data.riskLevel === 'low' ? 85 : data.riskLevel === 'medium' ? 70 : 50,
      regulatoryEnvironment: data.riskLevel === 'low' ? 90 : data.riskLevel === 'medium' ? 75 : 60
    });
  };
  
  // Get market ranking based on specific criteria
  const rankMarketsByMetric = (metric: 'growth' | 'yield' | 'affordability' | 'risk' | 'overall'): InvestmentMarket[] => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    const markets = availableMarkets.map(m => m.id);
    
    switch(metric) {
      case 'growth':
        return [...markets].sort((a, b) => 
          getMarketPerformanceData(b).yearlyGrowth - getMarketPerformanceData(a).yearlyGrowth
        );
      case 'yield':
        return [...markets].sort((a, b) => 
          getMarketPerformanceData(b).rentalYield - getMarketPerformanceData(a).rentalYield
        );
      case 'affordability':
        return [...markets].sort((a, b) => 
          getMarketPerformanceData(a).affordability - getMarketPerformanceData(b).affordability
        );
      case 'risk':
        return [...markets].sort((a, b) => {
          const riskMap = { 'low': 1, 'medium': 2, 'high': 3 };
          return riskMap[getMarketPerformanceData(a).riskLevel] - riskMap[getMarketPerformanceData(b).riskLevel];
        });
      case 'overall':
      default:
        return [...markets].sort((a, b) => calculateMarketScore(b) - calculateMarketScore(a));
    }
  };
  
  // Get a recommendation message based on market comparison
  const getMarketRecommendation = (marketA: InvestmentMarket, marketB: InvestmentMarket): string => {
    const comparison = compareMarkets(marketA, marketB);
    const dataA = getMarketPerformanceData(marketA);
    const dataB = getMarketPerformanceData(marketB);
    
    if (comparison.potentialScoreDiff > 10) {
      return language === 'de' 
        ? `${getLocalizedMarketName(marketA, language)} bietet derzeit bessere Investitionsmöglichkeiten als ${getLocalizedMarketName(marketB, language)}`
        : `${getLocalizedMarketName(marketA, language)} currently offers better investment opportunities than ${getLocalizedMarketName(marketB, language)}`;
    } else if (comparison.potentialScoreDiff < -10) {
      return language === 'de' 
        ? `${getLocalizedMarketName(marketB, language)} bietet derzeit bessere Investitionsmöglichkeiten als ${getLocalizedMarketName(marketA, language)}`
        : `${getLocalizedMarketName(marketB, language)} currently offers better investment opportunities than ${getLocalizedMarketName(marketA, language)}`;
    } else {
      return language === 'de' 
        ? `${getLocalizedMarketName(marketA, language)} und ${getLocalizedMarketName(marketB, language)} haben ähnliche Investitionspotenziale`
        : `${getLocalizedMarketName(marketA, language)} and ${getLocalizedMarketName(marketB, language)} have similar investment potentials`;
    }
  };
  
  // Generate an investment opportunity report for email
  const generateMarketReport = (market: InvestmentMarket) => {
    const data = getMarketPerformanceData(market);
    
    toast({
      title: language === 'de' ? 'Marktbericht generiert' : 'Market report generated',
      description: language === 'de' 
        ? `Marktbericht für ${getLocalizedMarketName(market, language)} wurde erstellt.` 
        : `Market report for ${getLocalizedMarketName(market, language)} has been created.`
    });
    
    return {
      market,
      localizedName: getLocalizedMarketName(market, language),
      data,
      score: calculateMarketScore(market),
      timestamp: new Date().toISOString()
    };
  };

  return {
    currentMarket,
    setMarket,
    getAllMarkets,
    getCurrentMarketDisplayName,
    getCurrentMarketLocalizedName,
    getMarketsByRegion,
    isMarketCompatible,
    getRecommendedMarkets,
    trackMarketVisit,
    getMarketPerformanceData,
    compareMarkets,
    calculateMarketScore,
    rankMarketsByMetric,
    getMarketRecommendation,
    generateMarketReport,
    isLoading
  };
}
