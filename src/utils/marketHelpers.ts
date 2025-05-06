
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';

export const availableMarkets: InvestmentMarketOption[] = [
  { id: 'germany', name: 'Germany' },
  { id: 'austria', name: 'Austria' },
  { id: 'switzerland', name: 'Switzerland' },
  { id: 'usa', name: 'USA' },
  { id: 'canada', name: 'Canada' },
  { id: 'global', name: 'Global' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'europe', name: 'Europe' }
];

export const getLocalizedMarketName = (market: InvestmentMarket, language: string): string => {
  if (language === 'de') {
    const germanNames: Record<InvestmentMarket, string> = {
      germany: 'Deutschland',
      austria: 'Österreich',
      switzerland: 'Schweiz',
      usa: 'USA',
      canada: 'Kanada',
      global: 'Global',
      uk: 'Vereinigtes Königreich',
      europe: 'Europa'
    };
    return germanNames[market] || market;
  }

  // English fallback
  const englishNames: Record<InvestmentMarket, string> = {
    germany: 'Germany',
    austria: 'Austria',
    switzerland: 'Switzerland',
    usa: 'USA',
    canada: 'Canada',
    global: 'Global',
    uk: 'United Kingdom',
    europe: 'Europe'
  };
  
  return englishNames[market] || market;
};

// Add the missing function for market display name
export const getMarketDisplayName = (market: InvestmentMarket, language: string = 'en'): string => {
  return getLocalizedMarketName(market, language);
};

// Add rental market trend function
export const getRentalMarketTrend = (market: InvestmentMarket): { trend: 'up' | 'down' | 'stable'; percentage: number } => {
  const trends: Record<InvestmentMarket, { trend: 'up' | 'down' | 'stable'; percentage: number }> = {
    germany: { trend: 'up', percentage: 3.2 },
    austria: { trend: 'up', percentage: 2.8 },
    switzerland: { trend: 'stable', percentage: 1.5 },
    usa: { trend: 'up', percentage: 4.3 },
    canada: { trend: 'up', percentage: 3.5 },
    global: { trend: 'stable', percentage: 2.7 },
    uk: { trend: 'down', percentage: 1.2 },
    europe: { trend: 'stable', percentage: 2.1 }
  };
  
  return trends[market] || { trend: 'stable', percentage: 0 };
};

// Add filtered market options function
export const getFilteredMarketOptions = (filter?: string): InvestmentMarketOption[] => {
  if (!filter) return availableMarkets;
  return availableMarkets.filter(market => 
    market.name.toLowerCase().includes(filter.toLowerCase()));
};

// Add market similarity function
export const getMarketSimilarity = (marketA: InvestmentMarket, marketB: InvestmentMarket): number => {
  const similarityMatrix: Record<InvestmentMarket, Record<InvestmentMarket, number>> = {
    germany: { germany: 1, austria: 0.8, switzerland: 0.7, usa: 0.4, canada: 0.4, global: 0.5, uk: 0.6, europe: 0.8 },
    austria: { germany: 0.8, austria: 1, switzerland: 0.8, usa: 0.3, canada: 0.3, global: 0.5, uk: 0.5, europe: 0.8 },
    switzerland: { germany: 0.7, austria: 0.8, switzerland: 1, usa: 0.4, canada: 0.4, global: 0.5, uk: 0.5, europe: 0.7 },
    usa: { germany: 0.4, austria: 0.3, switzerland: 0.4, usa: 1, canada: 0.8, global: 0.7, uk: 0.6, europe: 0.5 },
    canada: { germany: 0.4, austria: 0.3, switzerland: 0.4, usa: 0.8, canada: 1, global: 0.6, uk: 0.6, europe: 0.5 },
    global: { germany: 0.5, austria: 0.5, switzerland: 0.5, usa: 0.7, canada: 0.6, global: 1, uk: 0.6, europe: 0.7 },
    uk: { germany: 0.6, austria: 0.5, switzerland: 0.5, usa: 0.6, canada: 0.6, global: 0.6, uk: 1, europe: 0.8 },
    europe: { germany: 0.8, austria: 0.8, switzerland: 0.7, usa: 0.5, canada: 0.5, global: 0.7, uk: 0.8, europe: 1 }
  };
  
  return similarityMatrix[marketA]?.[marketB] || 0;
};

// Add market potential score calculation
export const calculateMarketPotentialScore = (market: InvestmentMarket, userPreference: string): number => {
  // Mock implementation - in reality would use more complex factors
  const baseScores: Record<InvestmentMarket, number> = {
    germany: 85,
    austria: 80,
    switzerland: 82,
    usa: 87,
    canada: 83,
    global: 75,
    uk: 81,
    europe: 79
  };
  
  // Adjust score based on user preference
  let adjustmentFactor = 0;
  
  if (userPreference === 'growth' && ['usa', 'germany', 'uk'].includes(market)) {
    adjustmentFactor = 10;
  } else if (userPreference === 'income' && ['switzerland', 'canada'].includes(market)) {
    adjustmentFactor = 8;
  } else if (userPreference === 'balanced') {
    adjustmentFactor = 5;
  } else if (userPreference === 'conservative' && ['switzerland', 'germany'].includes(market)) {
    adjustmentFactor = 12;
  } else if (userPreference === 'aggressive' && ['usa', 'global'].includes(market)) {
    adjustmentFactor = 15;
  }
  
  return Math.min(100, baseScores[market] + adjustmentFactor);
};

export default {
  availableMarkets,
  getLocalizedMarketName,
  getMarketDisplayName,
  getRentalMarketTrend,
  getFilteredMarketOptions,
  getMarketSimilarity,
  calculateMarketPotentialScore
};
