
import { useCallback } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarketOption {
  id: string;
  name: string;
  code?: string;
}

export const useMarketFilter = () => {
  const { preferences } = useUserPreferences();
  const { language } = useLanguage();
  
  const getMarketOptions = useCallback((): MarketOption[] => {
    const options: MarketOption[] = [
      { 
        id: 'global', 
        name: language === 'de' ? 'Global' : 'Global',
        code: 'GLOBAL'
      },
      { 
        id: 'germany', 
        name: language === 'de' ? 'Deutschland' : 'Germany',
        code: 'DE'
      },
      { 
        id: 'usa', 
        name: language === 'de' ? 'USA' : 'USA',
        code: 'US'
      },
      { 
        id: 'austria', 
        name: language === 'de' ? 'Österreich' : 'Austria',
        code: 'AT'
      },
      { 
        id: 'switzerland', 
        name: language === 'de' ? 'Schweiz' : 'Switzerland',
        code: 'CH'
      },
      { 
        id: 'canada', 
        name: language === 'de' ? 'Kanada' : 'Canada',
        code: 'CA'
      }
    ];
    
    return options;
  }, [language]);
  
  const getCurrentMarket = useCallback((): InvestmentMarket => {
    return preferences.marketFilter || 'global';
  }, [preferences.marketFilter]);
  
  const getMarketDisplayName = useCallback((): string => {
    const currentMarket = getCurrentMarket();
    const marketOption = getMarketOptions().find(option => option.id === currentMarket);
    return marketOption?.name || (language === 'de' ? 'Global' : 'Global');
  }, [getCurrentMarket, getMarketOptions, language]);
  
  const isMarketSpecific = useCallback((markets: InvestmentMarket[]): boolean => {
    const currentMarket = getCurrentMarket();
    return markets.includes(currentMarket);
  }, [getCurrentMarket]);
  
  const filterMarketData = useCallback(<T extends { market?: string }>(data: T[]): T[] => {
    const currentMarket = getCurrentMarket();
    
    if (currentMarket === 'global') {
      return data;
    }
    
    return data.filter(item => 
      !item.market || item.market === 'global' || item.market === currentMarket
    );
  }, [getCurrentMarket]);
  
  const getAvailableMarkets = useCallback((): InvestmentMarket[] => {
    return getMarketOptions().map(option => option.id as InvestmentMarket);
  }, [getMarketOptions]);
  
  // Create a userMarket object for backward compatibility
  const userMarket = {
    current: getCurrentMarket(),
    display: getMarketDisplayName(),
    getAvailableMarkets
  };
  
  return {
    getCurrentMarket,
    getMarketOptions,
    getMarketDisplayName,
    isMarketSpecific,
    filterMarketData,
    getAvailableMarkets,
    userMarket // Add the userMarket property for compatibility
  };
};

export default useMarketFilter;
