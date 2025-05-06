
import { useCallback } from 'react';
import { useUserPreferences, InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarketFilterHook {
  userMarket: InvestmentMarket;
  getMarketDisplayName: () => string;
  getAvailableMarkets: () => InvestmentMarketOption[];
  getCurrentMarket: () => InvestmentMarket;
  setUserMarket: (market: InvestmentMarket) => void;
  isMarketAvailable: (market: InvestmentMarket) => boolean;
}

/**
 * Custom hook for filtering and managing market-specific content
 */
export const useMarketFilter = (): MarketFilterHook => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  
  // Get current user market from preferences
  const userMarket: InvestmentMarket = preferences.market || 'global';
  
  // Set user market preference
  const setUserMarket = useCallback((market: InvestmentMarket) => {
    updatePreferences({ market });
  }, [updatePreferences]);
  
  // Get display name for current market
  const getMarketDisplayName = useCallback(() => {
    // Market name mappings
    const marketNames: Record<InvestmentMarket, Record<string, string>> = {
      'germany': { en: 'Germany', de: 'Deutschland' },
      'austria': { en: 'Austria', de: 'Österreich' },
      'switzerland': { en: 'Switzerland', de: 'Schweiz' },
      'usa': { en: 'United States', de: 'USA' },
      'canada': { en: 'Canada', de: 'Kanada' },
      'france': { en: 'France', de: 'Frankreich' },
      'global': { en: 'Global', de: 'Global' },
    };
    
    const currentLang = language as 'en' | 'de';
    return marketNames[userMarket]?.[currentLang] || marketNames.global[currentLang];
  }, [userMarket, language]);
  
  // Get list of available markets
  const getAvailableMarkets = useCallback((): InvestmentMarketOption[] => {
    const currentLang = language as 'en' | 'de';
    
    return [
      { id: 'germany', name: currentLang === 'de' ? 'Deutschland' : 'Germany' },
      { id: 'austria', name: currentLang === 'de' ? 'Österreich' : 'Austria' },
      { id: 'switzerland', name: currentLang === 'de' ? 'Schweiz' : 'Switzerland' },
      { id: 'usa', name: currentLang === 'de' ? 'USA' : 'United States' },
      { id: 'canada', name: currentLang === 'de' ? 'Kanada' : 'Canada' },
      { id: 'france', name: currentLang === 'de' ? 'Frankreich' : 'France' },
      { id: 'global', name: currentLang === 'de' ? 'Global' : 'Global' }
    ];
  }, [language]);
  
  // Check if a market is available
  const isMarketAvailable = useCallback((market: InvestmentMarket): boolean => {
    return getAvailableMarkets().some(m => m.id === market);
  }, [getAvailableMarkets]);
  
  // Get current market (for API calls, etc.)
  const getCurrentMarket = useCallback((): InvestmentMarket => {
    return userMarket;
  }, [userMarket]);
  
  return {
    userMarket,
    getMarketDisplayName,
    getAvailableMarkets,
    getCurrentMarket,
    setUserMarket,
    isMarketAvailable
  };
};

export default useMarketFilter;
