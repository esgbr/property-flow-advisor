import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getMarketDisplayName as getDisplayName, 
  getLocalizedMarketName, 
  availableMarkets 
} from '@/utils/marketHelpers';

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

/**
 * Enhanced hook for market filtering with improved UI support and better
 * synchronization between local state and user preferences
 */
export const useMarketFilter = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  
  // Keep local state that's synchronized with preferences
  const [userMarket, setUserMarketState] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'global'
  );

  // Synchronize local state with user preferences
  useEffect(() => {
    if (preferences.investmentMarket && preferences.investmentMarket !== userMarket) {
      setUserMarketState(preferences.investmentMarket);
    }
  }, [preferences.investmentMarket, userMarket]);

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

  // Set market and update preferences
  const setUserMarket = useCallback((market: InvestmentMarket) => {
    setUserMarketState(market);
    updatePreferences({ investmentMarket: market });
  }, [updatePreferences]);

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
  
  return {
    userMarket,
    setUserMarket,
    shouldShowFeature,
    filterFeaturesByMarket,
    getMarketDisplayName: getMarketDisplayNameFormatted,
    getLocalizedMarketName: getLocalizedMarketNameFormatted,
    getAvailableMarkets
  };
};

export default useMarketFilter;
