import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getMarketDisplayName as getDisplayName, 
  getLocalizedMarketName, 
  availableMarkets 
} from '@/utils/marketHelpers';
import { toast } from 'sonner';

// Feature configuration interface
export interface FeatureMarketConfig {
  id: string;
  markets?: InvestmentMarket[];
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  path?: string;
}

// Market-specific feature type
export type MarketSpecificFeature = FeatureMarketConfig;

export interface InvestmentMarketOption {
  id: InvestmentMarket;
  name: string;
}

/**
 * Enhanced hook for market filtering with improved UI support and better
 * synchronization between local state and user preferences.
 * 
 * Version 2.0 - Adds workflow integration, market transitions and intelligent
 * feature suggestions based on user market preferences.
 */
export const useMarketFilter = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  
  // Keep local state that's synchronized with preferences
  const [userMarket, setUserMarketState] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'global'
  );
  
  // Track recent markets for better transitions and recommendations
  const [recentMarkets, setRecentMarkets] = useState<InvestmentMarket[]>(
    preferences.recentMarkets || []
  );

  // Synchronize local state with user preferences
  useEffect(() => {
    if (preferences.investmentMarket && preferences.investmentMarket !== userMarket) {
      setUserMarketState(preferences.investmentMarket);
    }
    
    if (preferences.recentMarkets) {
      setRecentMarkets(preferences.recentMarkets);
    }
  }, [preferences.investmentMarket, preferences.recentMarkets, userMarket]);

  // Function to determine if a feature should be shown
  const shouldShowFeature = useCallback((feature: FeatureMarketConfig): boolean => {
    // If no market restrictions or user has global preference, always show
    if (!feature.markets || feature.markets.includes('global') || userMarket === 'global') {
      return true;
    }
    
    // Check if the feature's markets include the user's selected market
    return feature.markets.includes(userMarket);
  }, [userMarket]);
  
  // Function to filter an array of market-specific features
  const filterFeaturesByMarket = useCallback(<T extends FeatureMarketConfig>(features: T[]): T[] => {
    return features.filter(shouldShowFeature);
  }, [shouldShowFeature]);
  
  // Get related markets based on current selection for better workflow transitions
  const getRelatedMarkets = useCallback((): InvestmentMarket[] => {
    if (userMarket === 'germany') {
      return ['austria', 'switzerland'];
    } else if (userMarket === 'usa') {
      return ['canada'];
    } else if (userMarket === 'austria' || userMarket === 'switzerland') {
      return ['germany'];
    } else if (userMarket === 'canada') {
      return ['usa'];
    }
    return [];
  }, [userMarket]);

  // Set market and update preferences with better UX
  const setUserMarket = useCallback((market: InvestmentMarket) => {
    setUserMarketState(market);
    
    // Track recent markets (up to 3) for better suggestions
    const updatedRecentMarkets = [
      market, 
      ...recentMarkets.filter(m => m !== market)
    ].slice(0, 3);
    
    updatePreferences({ 
      investmentMarket: market,
      recentMarkets: updatedRecentMarkets
    });
    
    // Show feedback toast for better UX
    toast.success(
      language === 'de' 
        ? `Markt auf ${getLocalizedMarketName(market, language)} eingestellt` 
        : `Market set to ${getLocalizedMarketName(market, language)}`,
      { duration: 3000 }
    );
  }, [updatePreferences, language, recentMarkets]);

  // Get display name for current market
  const getMarketDisplayNameFormatted = useCallback((): string => {
    return getDisplayName(userMarket);
  }, [userMarket]);
  
  // Get localized market name
  const getLocalizedMarketNameFormatted = useCallback(() => {
    return getLocalizedMarketName(userMarket, language);
  }, [userMarket, language]);
  
  // Get available markets for filtering
  const getAvailableMarkets = useCallback(() => {
    return availableMarkets;
  }, []);
  
  // Ensure getMarketOptions exists for backward compatibility
  const getMarketOptions = getAvailableMarkets;
  
  return {
    userMarket,
    setUserMarket,
    shouldShowFeature,
    filterFeaturesByMarket,
    getMarketDisplayName: getMarketDisplayNameFormatted,
    getLocalizedMarketName: getLocalizedMarketNameFormatted,
    getAvailableMarkets,
    getMarketOptions,
    recentMarkets,
    getRelatedMarkets
  };
};

export default useMarketFilter;
