
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';

/**
 * Extended market type including 'other' option
 */
export type ExtendedInvestmentMarket = InvestmentMarket | 'other';

/**
 * Central market data for consistent usage across the app
 */
export const availableMarkets: InvestmentMarketOption[] = [
  { id: 'germany' as InvestmentMarket, name: 'Germany (Deutschland)' },
  { id: 'austria' as InvestmentMarket, name: 'Austria (Österreich)' },
  { id: 'switzerland' as InvestmentMarket, name: 'Switzerland (Schweiz)' },
  { id: 'france' as InvestmentMarket, name: 'France (France)' },
  { id: 'usa' as InvestmentMarket, name: 'United States' },
  { id: 'canada' as InvestmentMarket, name: 'Canada' },
  { id: 'global' as InvestmentMarket, name: 'Global' },
  { id: 'other' as InvestmentMarket, name: 'Other' }
];

/**
 * Helper function to get display name for a market
 * @param market - The market identifier
 * @returns The display name for the market
 */
export const getMarketDisplayName = (market: InvestmentMarket): string => {
  const marketDisplayNames: Record<string, string> = {
    germany: 'German',
    austria: 'Austrian',
    switzerland: 'Swiss',
    france: 'French',
    usa: 'US',
    canada: 'Canadian',
    global: 'Global',
    other: 'Other',
    '': 'Global'
  };
  
  return marketDisplayNames[market] || 'International';
};

/**
 * Get market by ID with proper fallback
 * @param id - The market identifier
 * @returns The market option object
 */
export const getMarketById = (id: InvestmentMarket) => {
  return availableMarkets.find(market => market.id === id) || 
         { id: 'global' as InvestmentMarket, name: 'Global' };
};

/**
 * Get localized market name based on user's language
 * @param marketId - The market identifier
 * @param language - The user's language code
 * @returns The localized market name
 */
export const getLocalizedMarketName = (marketId: InvestmentMarket, language: string): string => {
  const localizedNames: Record<string, Record<string, string>> = {
    'de': {
      germany: 'Deutschland',
      austria: 'Österreich',
      switzerland: 'die Schweiz',
      france: 'Frankreich',
      usa: 'die USA',
      canada: 'Kanada',
      global: 'Global',
      other: 'Andere',
      '': 'Global'
    },
    'en': {
      germany: 'Germany',
      austria: 'Austria',
      switzerland: 'Switzerland',
      france: 'France',
      usa: 'the USA',
      canada: 'Canada',
      global: 'Global',
      other: 'Other',
      '': 'Global'
    }
  };
  
  const langKey = language in localizedNames ? language : 'en';
  return localizedNames[langKey][marketId] || marketId;
};

/**
 * Get market options filtered by region for improved market selection
 * @param region - Optional region filter
 * @returns Filtered list of market options
 */
export const getFilteredMarketOptions = (region?: string): InvestmentMarketOption[] => {
  if (!region) {
    return availableMarkets;
  }
  
  // Simple region filtering (can be expanded)
  const regionFilters: Record<string, InvestmentMarket[]> = {
    'europe': ['germany', 'austria', 'switzerland', 'france'],
    'north-america': ['usa', 'canada'],
    'global': ['global']
  };
  
  const marketsToShow = regionFilters[region] || [];
  if (marketsToShow.length === 0) {
    return availableMarkets;
  }
  
  return availableMarkets.filter(market => marketsToShow.includes(market.id));
};

/**
 * Compare two markets for similarity
 * @param marketA - First market to compare
 * @param marketB - Second market to compare
 * @returns Similarity score (0-1)
 */
export const getMarketSimilarity = (marketA: InvestmentMarket, marketB: InvestmentMarket): number => {
  if (marketA === marketB) return 1;
  if (marketA === 'global' || marketB === 'global') return 0.5;
  
  // Regional grouping for similarity
  const europeanMarkets = ['germany', 'austria', 'switzerland', 'france'];
  const northAmericanMarkets = ['usa', 'canada'];
  
  if (europeanMarkets.includes(marketA) && europeanMarkets.includes(marketB)) {
    return 0.8;
  }
  
  if (northAmericanMarkets.includes(marketA) && northAmericanMarkets.includes(marketB)) {
    return 0.8;
  }
  
  return 0.3; // Default low similarity for unrelated markets
};
