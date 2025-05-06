
import { useContext } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPreferencesContext, InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { getLocalizedMarketName, availableMarkets } from '@/utils/marketHelpers';
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

export const useMarketFilter = () => {
  const { preferences, updatePreferences } = useContext(UserPreferencesContext);
  const { language } = useLanguage();
  const userMarket = preferences.investmentMarket || 'global';

  // Check if a market is enabled
  const isMarketEnabled = (market: InvestmentMarket): boolean => {
    return market === userMarket || userMarket === 'global';
  };

  // Get the current market
  const getCurrentMarket = (): InvestmentMarket => {
    return userMarket;
  };

  // Determine if a feature should be shown based on market configuration
  const shouldShowFeature = (feature: FeatureMarketConfig): boolean => {
    // If no markets specified, show for all markets
    if (!feature.markets && !feature.excludeMarkets) {
      return true;
    }

    // Check if market is excluded
    if (feature.excludeMarkets && feature.excludeMarkets.includes(userMarket)) {
      return false;
    }

    // Check if market is included or global is enabled
    if (feature.markets) {
      return feature.markets.includes(userMarket) || feature.markets.includes('global');
    }

    return true;
  };

  // Get localized market name
  const getLocalizedMarketName = (): string => {
    return getLocalizedMarketName(userMarket);
  };

  // Get available markets
  const getAvailableMarkets = (): InvestmentMarketOption[] => {
    return availableMarkets;
  };
  
  // Get market display name
  const getMarketDisplayName = (): string => {
    const marketName = getAvailableMarkets().find(m => m.id === userMarket)?.name || 'Global';
    return marketName;
  };
  
  // Get market options for dropdowns and selectors
  const getMarketOptions = (): InvestmentMarketOption[] => {
    return [
      { id: 'germany', name: language === 'de' ? 'Deutschland' : 'Germany' },
      { id: 'austria', name: language === 'de' ? 'Österreich' : 'Austria' },
      { id: 'switzerland', name: language === 'de' ? 'Schweiz' : 'Switzerland' },
      { id: 'usa', name: 'USA' },
      { id: 'canada', name: language === 'de' ? 'Kanada' : 'Canada' },
      { id: 'global', name: 'Global' },
      { id: 'uk', name: language === 'de' ? 'Vereinigtes Königreich' : 'United Kingdom' },
      { id: 'europe', name: language === 'de' ? 'Europa' : 'Europe' }
    ];
  };

  // Set the user's market preference
  const setUserMarket = (market: InvestmentMarket) => {
    updatePreferences({ investmentMarket: market });
  };
  
  // Filter features by market
  const filterFeaturesByMarket = <T extends FeatureMarketConfig>(features: T[]): T[] => {
    return features.filter(shouldShowFeature);
  };

  // Get related markets based on current selection
  const getRelatedMarkets = (): InvestmentMarket[] => {
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
  };

  return {
    userMarket,
    isMarketEnabled,
    getCurrentMarket,
    shouldShowFeature,
    getLocalizedMarketName,
    getAvailableMarkets,
    getMarketDisplayName,
    getMarketOptions,
    setUserMarket,
    filterFeaturesByMarket,
    getRelatedMarkets,
    recentMarkets: preferences.recentMarkets
  };
};

export default useMarketFilter;
