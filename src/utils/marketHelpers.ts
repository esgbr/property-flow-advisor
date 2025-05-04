
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Centralized market data to avoid duplication
export const availableMarkets: { id: InvestmentMarket, name: string }[] = [
  { id: 'germany', name: 'Germany' },
  { id: 'austria', name: 'Austria' },
  { id: 'switzerland', name: 'Switzerland' },
  { id: 'france', name: 'France' },
  { id: 'usa', name: 'USA' },
  { id: 'canada', name: 'Canada' },
  { id: 'global', name: 'Global' },
  { id: 'other', name: 'Other' }
];

export const getMarketDisplayName = (market: InvestmentMarket): string => {
  switch(market) {
    case 'germany': return 'German';
    case 'austria': return 'Austrian';
    case 'switzerland': return 'Swiss';
    case 'france': return 'French';
    case 'usa': return 'US';
    case 'canada': return 'Canadian';
    case 'global': return 'Global';
    case 'other': return 'International';
    default: return '';
  }
};

// Helper function to group markets by region
export const marketsByRegion = {
  europe: ['germany', 'austria', 'switzerland', 'france'],
  northAmerica: ['usa', 'canada'],
  global: ['global', 'other']
};

// Get markets for a specific region
export const getMarketsByRegion = (region: keyof typeof marketsByRegion): InvestmentMarket[] => {
  return marketsByRegion[region] as InvestmentMarket[];
};
