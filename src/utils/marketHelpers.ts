
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';

/**
 * Available markets for investment
 */
export const availableMarkets = [
  { id: 'germany', name: 'Germany' },
  { id: 'austria', name: 'Austria' },
  { id: 'switzerland', name: 'Switzerland' },
  { id: 'usa', name: 'USA' },
  { id: 'canada', name: 'Canada' },
  { id: 'global', name: 'Global' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'europe', name: 'Europe' }
];

/**
 * Get localized name for a market
 */
export const getLocalizedMarketName = (market: InvestmentMarket, language: string = 'en'): string => {
  const marketNames: Record<InvestmentMarket, Record<string, string>> = {
    germany: { en: 'Germany', de: 'Deutschland' },
    austria: { en: 'Austria', de: 'Österreich' },
    switzerland: { en: 'Switzerland', de: 'Schweiz' },
    usa: { en: 'USA', de: 'USA' },
    canada: { en: 'Canada', de: 'Kanada' },
    global: { en: 'Global', de: 'Global' },
    uk: { en: 'United Kingdom', de: 'Vereinigtes Königreich' },
    europe: { en: 'Europe', de: 'Europa' }
  };
  
  return marketNames[market]?.[language as 'en' | 'de'] || market;
};

/**
 * Get filtered market options based on language
 */
export const getFilteredMarketOptions = (language: string = 'en'): InvestmentMarketOption[] => {
  return [
    { id: 'germany', label: getLocalizedMarketName('germany', language) },
    { id: 'austria', label: getLocalizedMarketName('austria', language) },
    { id: 'switzerland', label: getLocalizedMarketName('switzerland', language) },
    { id: 'usa', label: getLocalizedMarketName('usa', language) },
    { id: 'canada', label: getLocalizedMarketName('canada', language) },
    { id: 'global', label: getLocalizedMarketName('global', language) },
    { id: 'uk', label: getLocalizedMarketName('uk', language) },
    { id: 'europe', label: getLocalizedMarketName('europe', language) }
  ];
};

/**
 * Calculate similarity between two markets (0-100)
 */
export const getMarketSimilarity = (marketA: InvestmentMarket, marketB: InvestmentMarket): number => {
  if (marketA === marketB) return 100;
  
  const similarities: Record<string, number> = {
    'germany-austria': 82,
    'austria-germany': 82,
    'germany-switzerland': 75,
    'switzerland-germany': 75,
    'austria-switzerland': 79,
    'switzerland-austria': 79,
    'usa-canada': 84,
    'canada-usa': 84,
    'uk-europe': 72,
    'europe-uk': 72,
    'germany-europe': 89,
    'europe-germany': 89,
    'austria-europe': 85,
    'europe-austria': 85
  };
  
  const key = `${marketA}-${marketB}`;
  return similarities[key] || 50; // Default similarity if not defined
};

/**
 * Calculate market potential score (0-100)
 */
export const calculateMarketPotentialScore = (market: InvestmentMarket): number => {
  const potentialScores: Record<InvestmentMarket, number> = {
    germany: 78,
    austria: 76,
    switzerland: 74,
    usa: 82,
    canada: 80,
    global: 68,
    uk: 75,
    europe: 72
  };
  
  return potentialScores[market] || 70;
};

/**
 * Get rental market trend data
 */
export const getRentalMarketTrend = (market: InvestmentMarket, period: '1y' | '3y' | '5y' | '10y' = '5y') => {
  const trends: Record<InvestmentMarket, Record<string, { change: number, volatility: number }>> = {
    germany: {
      '1y': { change: 3.2, volatility: 1.1 },
      '3y': { change: 9.8, volatility: 2.4 },
      '5y': { change: 17.5, volatility: 3.2 },
      '10y': { change: 32.8, volatility: 5.7 }
    },
    austria: {
      '1y': { change: 3.5, volatility: 1.2 },
      '3y': { change: 10.2, volatility: 2.5 },
      '5y': { change: 18.1, volatility: 3.4 },
      '10y': { change: 33.5, volatility: 5.9 }
    },
    switzerland: {
      '1y': { change: 2.8, volatility: 1.0 },
      '3y': { change: 8.5, volatility: 2.0 },
      '5y': { change: 15.2, volatility: 2.8 },
      '10y': { change: 28.4, volatility: 4.8 }
    },
    usa: {
      '1y': { change: 4.2, volatility: 1.8 },
      '3y': { change: 13.5, volatility: 3.2 },
      '5y': { change: 22.8, volatility: 4.5 },
      '10y': { change: 42.5, volatility: 7.8 }
    },
    canada: {
      '1y': { change: 3.8, volatility: 1.6 },
      '3y': { change: 12.1, volatility: 3.0 },
      '5y': { change: 21.5, volatility: 4.2 },
      '10y': { change: 39.8, volatility: 7.2 }
    },
    global: {
      '1y': { change: 3.5, volatility: 1.5 },
      '3y': { change: 10.8, volatility: 2.8 },
      '5y': { change: 19.5, volatility: 3.8 },
      '10y': { change: 36.2, volatility: 6.5 }
    },
    uk: {
      '1y': { change: 3.0, volatility: 1.4 },
      '3y': { change: 9.2, volatility: 2.6 },
      '5y': { change: 16.8, volatility: 3.5 },
      '10y': { change: 31.5, volatility: 6.2 }
    },
    europe: {
      '1y': { change: 3.1, volatility: 1.3 },
      '3y': { change: 9.5, volatility: 2.5 },
      '5y': { change: 17.2, volatility: 3.3 },
      '10y': { change: 32.0, volatility: 5.8 }
    }
  };
  
  return trends[market]?.[period] || { change: 3.5, volatility: 1.5 };
};

/**
 * Get market display name (alias for getLocalizedMarketName for backward compatibility)
 */
export const getMarketDisplayName = getLocalizedMarketName;
