
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';

// Update this type to include 'other'
export type ExtendedInvestmentMarket = InvestmentMarket | 'other';

// Central market data for consistent usage across the app
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

// Helper function to get display name for a market
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

// Get market by ID with proper fallback
export const getMarketById = (id: InvestmentMarket) => {
  return availableMarkets.find(market => market.id === id) || 
         { id: 'global' as InvestmentMarket, name: 'Global' };
};

// Get localized market name
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
