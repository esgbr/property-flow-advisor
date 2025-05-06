import { useState, useEffect } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getLocalizedMarketName, 
  getMarketDisplayName,
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

export const useEnhancedMarket = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  const [marketPerformance, setMarketPerformance] = useState<MarketPerformance | null>(null);
  const [marketOptions, setMarketOptions] = useState(() => getFilteredMarketOptions());
  const [marketSimilarity, setMarketSimilarity] = useState<number>(0);
  const [marketPotentialScore, setMarketPotentialScore] = useState<number>(0);
  
  useEffect(() => {
    if (preferences.investmentMarket) {
      const performance = marketPerformanceData[preferences.investmentMarket];
      setMarketPerformance(performance);
      
      const similarity = getMarketSimilarity('germany', preferences.investmentMarket);
      setMarketSimilarity(similarity);
      
      const potentialScore = calculateMarketPotentialScore(preferences.investmentMarket, preferences.investmentPreference || 'balanced');
      setMarketPotentialScore(potentialScore);
    }
  }, [preferences.investmentMarket, preferences.investmentPreference]);
  
  const getMarketDetails = (market: InvestmentMarket) => {
    return marketPerformanceData[market];
  };
  
  const filterMarkets = (filter: string) => {
    const filteredOptions = getFilteredMarketOptions(filter);
    setMarketOptions(filteredOptions);
  };

  return {
    userMarket: preferences.investmentMarket,
    marketPerformance,
    marketOptions,
    marketSimilarity,
    marketPotentialScore,
    getMarketDetails,
    filterMarkets,
    getLocalizedMarketName,
    getMarketDisplayName
  };
};

const marketPerformanceData: Record<InvestmentMarket, MarketPerformance> = {
  germany: {
    market: 'germany',
    yearlyGrowth: 5.2,
    fiveYearGrowth: 28.4,
    rentalYield: 3.8,
    affordability: 7.2,
    riskLevel: 'low'
  },
  austria: {
    market: 'austria',
    yearlyGrowth: 4.8,
    fiveYearGrowth: 25.1,
    rentalYield: 3.5,
    affordability: 6.9,
    riskLevel: 'low'
  },
  switzerland: {
    market: 'switzerland',
    yearlyGrowth: 3.5,
    fiveYearGrowth: 18.7,
    rentalYield: 3.2,
    affordability: 9.8,
    riskLevel: 'low'
  },
  usa: {
    market: 'usa',
    yearlyGrowth: 6.5,
    fiveYearGrowth: 32.6,
    rentalYield: 4.2,
    affordability: 5.4,
    riskLevel: 'medium'
  },
  canada: {
    market: 'canada',
    yearlyGrowth: 5.8,
    fiveYearGrowth: 30.2,
    rentalYield: 3.9,
    affordability: 6.1,
    riskLevel: 'medium'
  },
  global: {
    market: 'global',
    yearlyGrowth: 5.5,
    fiveYearGrowth: 28.9,
    rentalYield: 4.0,
    affordability: 6.5,
    riskLevel: 'medium'
  },
  uk: {
    market: 'uk',
    yearlyGrowth: 2.8,
    fiveYearGrowth: 14.3,
    rentalYield: 4.1,
    affordability: 8.2,
    riskLevel: 'medium'
  },
  europe: {
    market: 'europe',
    yearlyGrowth: 3.2,
    fiveYearGrowth: 16.8,
    rentalYield: 3.7,
    affordability: 7.5,
    riskLevel: 'low'
  }
};
