
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

export default {
  availableMarkets,
  getLocalizedMarketName
};
