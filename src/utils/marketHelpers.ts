
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

/**
 * Get the localized name of a market
 */
export const getLocalizedMarketName = (market: InvestmentMarket, language: string): string => {
  const marketNames: Record<InvestmentMarket, { en: string, de: string }> = {
    'germany': { en: 'Germany', de: 'Deutschland' },
    'austria': { en: 'Austria', de: 'Österreich' },
    'switzerland': { en: 'Switzerland', de: 'Schweiz' },
    'netherlands': { en: 'Netherlands', de: 'Niederlande' }
  };
  
  return marketNames[market][language as 'en' | 'de'] || market;
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
      'germany': ['netherlands', 'austria'],
      'austria': ['germany', 'switzerland'],
      'switzerland': ['germany', 'netherlands'],
      'netherlands': ['germany', 'austria']
    },
    'income': {
      'germany': ['austria', 'netherlands'],
      'austria': ['germany', 'netherlands'],
      'switzerland': ['austria', 'germany'],
      'netherlands': ['germany', 'austria']
    },
    'balanced': {
      'germany': ['austria', 'netherlands', 'switzerland'],
      'austria': ['germany', 'switzerland', 'netherlands'],
      'switzerland': ['austria', 'germany', 'netherlands'],
      'netherlands': ['germany', 'austria', 'switzerland']
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

export default {
  getLocalizedMarketName,
  getRecommendedMarkets,
  calculateMarketPotentialScore,
  formatMarketValue
};
