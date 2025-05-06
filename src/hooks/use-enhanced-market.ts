
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { 
  availableMarkets, 
  getMarketDisplayName, 
  getLocalizedMarketName,
  getFilteredMarketOptions,
  getMarketSimilarity
} from '@/utils/marketHelpers';

/**
 * Enhanced hook to handle market-related functionality
 */
export function useEnhancedMarket() {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  
  // Get the user's current market
  const currentMarket = useMemo(() => 
    preferences.investmentMarket || 'global', 
  [preferences.investmentMarket]);
  
  // Set the user's market preference
  const setMarket = (market: InvestmentMarket) => {
    updatePreferences({ investmentMarket: market });
  };
  
  // Get all available markets
  const getAllMarkets = () => availableMarkets;
  
  // Get the display name for the current market
  const getCurrentMarketDisplayName = () => getMarketDisplayName(currentMarket);
  
  // Get the localized name for the current market
  const getCurrentMarketLocalizedName = () => getLocalizedMarketName(currentMarket, language);
  
  // Get markets filtered by region
  const getMarketsByRegion = (region: string) => getFilteredMarketOptions(region);
  
  // Check if a market is compatible with the user's selected market
  const isMarketCompatible = (market: InvestmentMarket) => {
    if (market === 'global' || currentMarket === 'global') return true;
    return getMarketSimilarity(market, currentMarket) >= 0.5;
  };
  
  // Get recommended markets based on the user's current market
  const getRecommendedMarkets = () => {
    return availableMarkets
      .filter(market => market.id !== currentMarket)
      .sort((a, b) => {
        const simA = getMarketSimilarity(a.id as InvestmentMarket, currentMarket);
        const simB = getMarketSimilarity(b.id as InvestmentMarket, currentMarket);
        return simB - simA;
      })
      .slice(0, 3);
  };
  
  // Track a visit to a specific market page for analytics
  const trackMarketVisit = (market: InvestmentMarket) => {
    // Get current visited markets array or initialize if it doesn't exist
    const recentlyVisitedMarkets = preferences.recentMarkets || [];
    
    // Only add if not already in the list
    if (!recentlyVisitedMarkets.includes(market)) {
      updatePreferences({
        recentMarkets: [...recentlyVisitedMarkets, market]
      });
    }
  };
  
  return {
    currentMarket,
    setMarket,
    getAllMarkets,
    getCurrentMarketDisplayName,
    getCurrentMarketLocalizedName,
    getMarketsByRegion,
    isMarketCompatible,
    getRecommendedMarkets,
    trackMarketVisit
  };
}
