import { useContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPreferencesContext, InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { toast } from '@/hooks/use-toast';
import { ReactNode } from 'react';

export interface FeatureMarketConfig {
  id: string;
  path?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  markets?: InvestmentMarket[];
  excludeMarkets?: InvestmentMarket[];
  recommended?: boolean;
}

// Create a type alias for market-specific features
export type MarketSpecificFeature = FeatureMarketConfig;

export interface MarketFilterHook {
  userMarket: InvestmentMarket;
  isMarketEnabled: (market: InvestmentMarket) => boolean;
  getCurrentMarket: () => InvestmentMarket;
  shouldShowFeature: (feature: FeatureMarketConfig) => boolean;
  getLocalizedMarketName: () => string;
  getAvailableMarkets: () => InvestmentMarketOption[];
  getMarketDisplayName: () => string;
  getMarketOptions: () => InvestmentMarketOption[];
  setUserMarket: (market: InvestmentMarket) => void;
  filterFeaturesByMarket: <T extends FeatureMarketConfig>(features: T[]) => T[];
  getRelatedMarkets?: () => InvestmentMarket[];
  recentMarkets?: InvestmentMarket[];
}

// Helper function for localized market names
export const getLocalizedMarketName = (
  market: InvestmentMarket, 
  language: string
): string => {
  const marketNames: Record<InvestmentMarket, { en: string; de: string }> = {
    germany: { en: 'Germany', de: 'Deutschland' },
    austria: { en: 'Austria', de: 'Österreich' },
    switzerland: { en: 'Switzerland', de: 'Schweiz' },
    usa: { en: 'USA', de: 'USA' },
    canada: { en: 'Canada', de: 'Kanada' },
    global: { en: 'Global', de: 'Global' },
    uk: { en: 'United Kingdom', de: 'Vereinigtes Königreich' },
    europe: { en: 'Europe', de: 'Europa' },
  };

  return marketNames[market]?.[language as keyof typeof marketNames[typeof market]] || 
         marketNames[market]?.en || 
         market;
};

// Get market display name
export const getMarketDisplayName = (market: InvestmentMarket): string => {
  const displayNames: Record<InvestmentMarket, string> = {
    germany: 'Germany',
    austria: 'Austria',
    switzerland: 'Switzerland',
    usa: 'USA',
    canada: 'Canada',
    global: 'Global',
    uk: 'United Kingdom',
    europe: 'Europe',
  };

  return displayNames[market] || market;
};

// Available markets with their localized names
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

/**
 * Enhanced hook for market filtering with improved UI support and better
 * synchronization between local state and user preferences.
 * 
 * Version 3.0 - Consolidates duplicate functionality and enhances workflow integration
 */
export const useMarketFilter = (): MarketFilterHook => {
  const { preferences, updatePreferences } = useContext(UserPreferencesContext);
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

  // Check if a market is enabled
  const isMarketEnabled = useCallback((market: InvestmentMarket): boolean => {
    return market === userMarket || userMarket === 'global';
  }, [userMarket]);

  // Get the current market
  const getCurrentMarket = useCallback((): InvestmentMarket => {
    return userMarket;
  }, [userMarket]);

  // Function to determine if a feature should be shown
  const shouldShowFeature = useCallback((feature: FeatureMarketConfig): boolean => {
    // If no market restrictions or user has global preference, always show
    if (!feature.markets && !feature.excludeMarkets) {
      return true;
    }
    
    // Check if market is excluded
    if (feature.excludeMarkets && feature.excludeMarkets.includes(userMarket)) {
      return false;
    }

    // Check if market is included or global is enabled
    if (feature.markets) {
      return feature.markets.includes(userMarket) || feature.markets.includes('global') || userMarket === 'global';
    }

    return true;
  }, [userMarket]);
  
  // Function to filter an array of market-specific features
  const filterFeaturesByMarket = useCallback(<T extends FeatureMarketConfig>(features: T[]): T[] => {
    return features.filter(shouldShowFeature);
  }, [shouldShowFeature]);

  // Get localized market name
  const getLocalizedMarketNameFormatted = useCallback((): string => {
    return getLocalizedMarketName(userMarket, language);
  }, [userMarket, language]);
  
  // Get market display name
  const getMarketDisplayNameFormatted = useCallback((): string => {
    return getMarketDisplayName(userMarket);
  }, [userMarket]);
  
  // Get available markets
  const getAvailableMarkets = useCallback((): InvestmentMarketOption[] => {
    return availableMarkets.map(market => ({
      ...market,
      name: language === 'de' && getLocalizedMarketName(market.id, 'de') !== market.name
        ? getLocalizedMarketName(market.id, 'de')
        : market.name
    }));
  }, [language]);
  
  // Get market options for dropdowns and selectors
  const getMarketOptions = useCallback((): InvestmentMarketOption[] => {
    return getAvailableMarkets();
  }, [getAvailableMarkets]);
  
  // Get related markets based on current selection
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
    toast({
      title: language === 'de' 
        ? `Markt auf ${getLocalizedMarketName(market, language)} eingestellt` 
        : `Market set to ${getLocalizedMarketName(market, language)}`,
      duration: 3000,
    });
  }, [updatePreferences, language, recentMarkets]);

  return {
    userMarket,
    isMarketEnabled,
    getCurrentMarket,
    shouldShowFeature,
    filterFeaturesByMarket,
    getMarketDisplayName: getMarketDisplayNameFormatted,
    getLocalizedMarketName: getLocalizedMarketNameFormatted,
    getAvailableMarkets,
    getMarketOptions,
    setUserMarket,
    getRelatedMarkets,
    recentMarkets
  };
};

export default useMarketFilter;
