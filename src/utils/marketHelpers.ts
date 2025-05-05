
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Central market data for consistent usage across the app
export const availableMarkets = [
  { id: 'germany' as InvestmentMarket, name: 'Germany (Deutschland)' },
  { id: 'austria' as InvestmentMarket, name: 'Austria (Österreich)' },
  { id: 'switzerland' as InvestmentMarket, name: 'Switzerland (Schweiz)' },
  { id: 'france' as InvestmentMarket, name: 'France (France)' },
  { id: 'usa' as InvestmentMarket, name: 'United States' },
  { id: 'canada' as InvestmentMarket, name: 'Canada' },
  { id: 'global' as InvestmentMarket, name: 'Global' },
  { id: 'other' as InvestmentMarket, name: 'Other Markets' }
];

// Helper function to get display name for a market
export const getMarketDisplayName = (market: InvestmentMarket): string => {
  switch (market) {
    case 'germany':
      return 'German';
    case 'austria':
      return 'Austrian';
    case 'switzerland':
      return 'Swiss';
    case 'france':
      return 'French';
    case 'usa':
      return 'US';
    case 'canada':
      return 'Canadian';
    case 'global':
      return 'Global';
    case 'other':
      return 'International';
    default:
      return 'International';
  }
};

// Get market by ID
export const getMarketById = (id: InvestmentMarket) => {
  return availableMarkets.find(market => market.id === id) || 
         { id: 'global' as InvestmentMarket, name: 'Global' };
};
