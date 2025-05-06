import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

/**
 * Get the localized name of a market
 */
export const getLocalizedMarketName = (market: InvestmentMarket, language: string): string => {
  const marketNames: Record<InvestmentMarket, { en: string, de: string }> = {
    'germany': { en: 'Germany', de: 'Deutschland' },
    'austria': { en: 'Austria', de: 'Österreich' },
    'switzerland': { en: 'Switzerland', de: 'Schweiz' },
    'usa': { en: 'United States', de: 'USA' },
    'canada': { en: 'Canada', de: 'Kanada' },
    'global': { en: 'Global', de: 'Global' }
  };
  
  return marketNames[market]?.[language as 'en' | 'de'] || market;
};

/**
 * Available markets with their display names
 */
export const availableMarkets = [
  { id: 'germany' as InvestmentMarket, name: 'Deutschland/Germany' },
  { id: 'austria' as InvestmentMarket, name: 'Österreich/Austria' },
  { id: 'switzerland' as InvestmentMarket, name: 'Schweiz/Switzerland' },
  { id: 'usa' as InvestmentMarket, name: 'USA/United States' },
  { id: 'canada' as InvestmentMarket, name: 'Kanada/Canada' },
  { id: 'global' as InvestmentMarket, name: 'Global' }
];

/**
 * Get display name for a market
 */
export const getMarketDisplayName = (market: InvestmentMarket): string => {
  const foundMarket = availableMarkets.find(m => m.id === market);
  return foundMarket ? foundMarket.name : 'Global';
};

/**
 * Get recommended markets based on user preferences
 */
export const getRecommendedMarkets = (
  preferredMarket: InvestmentMarket,
  investmentPreference: string = 'balanced'
): InvestmentMarket[] => {
  // Mapping of potential related markets based on investment preference
  const recommendationMap: Record<string, Record<InvestmentMarket, InvestmentMarket[]>> = {
    'growth': {
      'germany': ['austria', 'switzerland'],
      'austria': ['germany', 'switzerland'],
      'switzerland': ['austria', 'germany'],
      'usa': ['canada'],
      'canada': ['usa'],
      'global': ['germany', 'usa']
    },
    'income': {
      'germany': ['austria', 'switzerland'],
      'austria': ['germany', 'switzerland'],
      'switzerland': ['austria', 'germany'],
      'usa': ['canada'],
      'canada': ['usa'],
      'global': ['germany', 'usa']
    },
    'balanced': {
      'germany': ['austria', 'switzerland', 'usa'],
      'austria': ['germany', 'switzerland', 'usa'],
      'switzerland': ['austria', 'germany', 'usa'],
      'usa': ['canada', 'germany'],
      'canada': ['usa', 'germany'],
      'global': ['germany', 'usa', 'switzerland']
    }
  };
  
  return recommendationMap[investmentPreference]?.[preferredMarket] || [];
};

/**
 * Calculate investment potential score for a market
 * Higher score means better investment potential
 */
export const calculateMarketPotentialScore = (
  market: InvestmentMarket,
  metrics: {
    priceGrowth: number;
    rentalYield: number;
    economicStability: number;
    regulatoryEnvironment: number;
  }
): number => {
  const weights = {
    priceGrowth: 0.3,
    rentalYield: 0.3,
    economicStability: 0.2,
    regulatoryEnvironment: 0.2
  };
  
  // Normalize metrics to 0-100 scale
  const normalizedMetrics = {
    priceGrowth: Math.min(metrics.priceGrowth * 10, 100),
    rentalYield: Math.min(metrics.rentalYield * 20, 100),
    economicStability: metrics.economicStability,
    regulatoryEnvironment: metrics.regulatoryEnvironment
  };
  
  // Calculate weighted score
  return Object.keys(normalizedMetrics).reduce((score, key) => {
    const metricKey = key as keyof typeof normalizedMetrics;
    return score + normalizedMetrics[metricKey] * weights[metricKey];
  }, 0);
};

/**
 * Format market data value for display
 */
export const formatMarketValue = (
  value: number, 
  type: 'currency' | 'percentage' | 'ratio' | 'number',
  language: string
): string => {
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
      
    case 'percentage':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value / 100);
      
    case 'ratio':
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      }).format(value);
      
    default:
      return new Intl.NumberFormat(locale).format(value);
  }
};

/**
 * Get market similarity score (0-1) between two markets
 */
export const getMarketSimilarity = (
  marketA: InvestmentMarket, 
  marketB: InvestmentMarket
): number => {
  // Base similarity matrix (higher values = more similar)
  const similarityMatrix: Record<InvestmentMarket, Record<InvestmentMarket, number>> = {
    'germany': {
      'germany': 1.0,
      'austria': 0.85,
      'switzerland': 0.75,
      'usa': 0.4,
      'canada': 0.35,
      'global': 0.5
    },
    'austria': {
      'germany': 0.85,
      'austria': 1.0,
      'switzerland': 0.8,
      'usa': 0.3,
      'canada': 0.3,
      'global': 0.5
    },
    'switzerland': {
      'germany': 0.75,
      'austria': 0.8,
      'switzerland': 1.0,
      'usa': 0.4,
      'canada': 0.4,
      'global': 0.5
    },
    'usa': {
      'germany': 0.4,
      'austria': 0.3,
      'switzerland': 0.4,
      'usa': 1.0,
      'canada': 0.85,
      'global': 0.5
    },
    'canada': {
      'germany': 0.35,
      'austria': 0.3,
      'switzerland': 0.4,
      'usa': 0.85,
      'canada': 1.0,
      'global': 0.5
    },
    'global': {
      'germany': 0.5,
      'austria': 0.5,
      'switzerland': 0.5,
      'usa': 0.5,
      'canada': 0.5,
      'global': 1.0
    }
  };
  
  return similarityMatrix[marketA]?.[marketB] || 0;
};

/**
 * Filter markets by region
 */
export const getFilteredMarketOptions = (region: string): InvestmentMarket[] => {
  if (region === 'europe') {
    return ['germany', 'austria', 'switzerland'];
  }
  if (region === 'northamerica') {
    return ['usa', 'canada'];
  }
  return ['germany', 'austria', 'switzerland', 'usa', 'canada', 'global'];
};

export default {
  getLocalizedMarketName,
  getRecommendedMarkets,
  calculateMarketPotentialScore,
  formatMarketValue,
  getMarketDisplayName,
  availableMarkets,
  getMarketSimilarity,
  getFilteredMarketOptions
};
