
import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences, InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { 
  getLocalizedMarketName,
  getFilteredMarketOptions, 
  getMarketSimilarity, 
  calculateMarketPotentialScore 
} from '@/utils/marketHelpers';

export interface MarketPerformance {
  market: InvestmentMarket;
  yearlyGrowth: number;
  fiveYearGrowth: number;
  rentalYield: number;
  affordability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// This hook provides enhanced market information and management
export const useEnhancedMarket = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language, t } = useLanguage();
  
  // Track the current market (set from user preferences or default to 'germany')
  const [currentMarket, setCurrentMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'germany'
  );
  
  // Use the user's preferred market as default
  const userMarket: InvestmentMarket = preferences.investmentMarket || 'germany';
  
  // Track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Market comparison
  const [marketSimilarity, setMarketSimilarity] = useState(0);
  const [marketPotential, setMarketPotential] = useState(0);

  // Update market and save to preferences
  const setMarket = useCallback((market: InvestmentMarket) => {
    setCurrentMarket(market);
    updatePreferences({ investmentMarket: market });
    
    // Track this market visit
    trackMarketVisit(market);
    
    toast({
      title: t('marketUpdated'),
      description: `${getLocalizedMarketName(market, language)} ${t('setAsCurrentMarket')}`,
    });
  }, [updatePreferences, language, t]);

  // Track market visits for user history
  const trackMarketVisit = useCallback((market: InvestmentMarket) => {
    const recentMarkets = preferences.recentMarkets || [];
    
    // Add to recent markets if not already there
    if (!recentMarkets.includes(market)) {
      const updatedRecentMarkets = [market, ...recentMarkets].slice(0, 5); // Keep last 5
      updatePreferences({ recentMarkets: updatedRecentMarkets });
    }
  }, [preferences.recentMarkets, updatePreferences]);

  // Sample market performance data (in a real app, this would come from an API)
  const marketPerformanceData: Record<InvestmentMarket, MarketPerformance> = {
    germany: {
      market: 'germany',
      yearlyGrowth: 3.8,
      fiveYearGrowth: 24.5,
      rentalYield: 3.9,
      affordability: 5.8,
      riskLevel: 'low'
    },
    austria: {
      market: 'austria',
      yearlyGrowth: 4.2,
      fiveYearGrowth: 22.1,
      rentalYield: 3.7,
      affordability: 6.2,
      riskLevel: 'low'
    },
    switzerland: {
      market: 'switzerland',
      yearlyGrowth: 2.9,
      fiveYearGrowth: 16.3,
      rentalYield: 3.2,
      affordability: 9.5,
      riskLevel: 'low'
    },
    usa: {
      market: 'usa',
      yearlyGrowth: 5.1,
      fiveYearGrowth: 28.7,
      rentalYield: 4.8,
      affordability: 4.9,
      riskLevel: 'medium'
    },
    canada: {
      market: 'canada',
      yearlyGrowth: 4.5,
      fiveYearGrowth: 26.2,
      rentalYield: 4.1,
      affordability: 7.3,
      riskLevel: 'medium'
    },
    global: {
      market: 'global',
      yearlyGrowth: 3.9,
      fiveYearGrowth: 21.8,
      rentalYield: 4.2,
      affordability: 6.4,
      riskLevel: 'medium'
    },
    uk: {
      market: 'uk',
      yearlyGrowth: 3.5,
      fiveYearGrowth: 20.5,
      rentalYield: 4.0,
      affordability: 7.8,
      riskLevel: 'medium'
    },
    europe: {
      market: 'europe',
      yearlyGrowth: 3.2,
      fiveYearGrowth: 18.9,
      rentalYield: 3.8,
      affordability: 6.9,
      riskLevel: 'medium'
    }
  };

  // Get market performance for current or specified market
  const getMarketPerformanceData = useCallback((market: InvestmentMarket = currentMarket): MarketPerformance => {
    return marketPerformanceData[market] || marketPerformanceData.global;
  }, [currentMarket]);

  // Generate a market recommendation based on comparison between two markets
  const getMarketRecommendation = useCallback((marketA: InvestmentMarket, marketB: InvestmentMarket): string => {
    const perfA = marketPerformanceData[marketA];
    const perfB = marketPerformanceData[marketB];
    
    if (!perfA || !perfB) return '';
    
    const betterYield = perfA.rentalYield > perfB.rentalYield ? marketA : marketB;
    const betterGrowth = perfA.yearlyGrowth > perfB.yearlyGrowth ? marketA : marketB;
    const lowerRisk = perfA.riskLevel === 'low' && perfB.riskLevel !== 'low' ? marketA :
                       perfB.riskLevel === 'low' && perfA.riskLevel !== 'low' ? marketB : null;
    
    if (language === 'de') {
      if (lowerRisk) {
        return `${getLocalizedMarketName(lowerRisk, language)} bietet ein besseres Risikoprofil, was es zu einer stabileren Investition macht.`;
      } else if (betterYield === betterGrowth) {
        return `${getLocalizedMarketName(betterYield, language)} zeigt sowohl eine bessere Rendite als auch ein stärkeres Wachstum.`;
      } else {
        return `${getLocalizedMarketName(betterYield, language)} bietet bessere Mietrenditen, während ${getLocalizedMarketName(betterGrowth, language)} ein höheres Wachstumspotenzial aufweist.`;
      }
    } else {
      if (lowerRisk) {
        return `${getLocalizedMarketName(lowerRisk, language)} offers a better risk profile, making it a more stable investment.`;
      } else if (betterYield === betterGrowth) {
        return `${getLocalizedMarketName(betterYield, language)} shows both better yield and stronger growth.`;
      } else {
        return `${getLocalizedMarketName(betterYield, language)} offers better rental yields, while ${getLocalizedMarketName(betterGrowth, language)} has higher growth potential.`;
      }
    }
  }, [language]);

  // List of available market options
  const marketOptions: InvestmentMarketOption[] = getFilteredMarketOptions(language);

  // Market performance data for current market
  const marketPerformance = getMarketPerformanceData(currentMarket);

  useEffect(() => {
    // Calculate similarity between user's preferred market and current market
    const similarity = getMarketSimilarity(userMarket, currentMarket);
    setMarketSimilarity(similarity);
    
    // Calculate market potential score
    const potential = calculateMarketPotentialScore(currentMarket);
    setMarketPotential(potential);
  }, [currentMarket, userMarket]);

  return {
    // Core data
    userMarket,
    marketPerformance,
    marketOptions,
    marketSimilarity,
    marketPotential,
    
    // Methods
    setMarket,
    getMarketPerformanceData,
    getMarketRecommendation,
    
    // Properties needed by components
    currentMarket,
    trackMarketVisit,
    isLoading,
    
    // Helpers
    getMarketDisplayName: getLocalizedMarketName
  };
};
