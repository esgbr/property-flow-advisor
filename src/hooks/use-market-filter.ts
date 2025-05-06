
import { useContext } from 'react';
import { InvestmentMarket, UserPreferencesContext, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { getLocalizedMarketName as getLocalizedMarketNameUtil, availableMarkets } from '@/utils/marketHelpers';
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

export interface MarketFilterHook {
  userMarket: InvestmentMarket;
  isMarketEnabled: (market: InvestmentMarket) => boolean;
  getCurrentMarket: () => InvestmentMarket;
  shouldShowFeature: (feature: FeatureMarketConfig) => boolean;
  getLocalizedMarketName: () => string;
  getAvailableMarkets: () => { id: InvestmentMarket; name: string }[];
  getMarketDisplayName: () => string;
  getMarketOptions: () => InvestmentMarketOption[];
}

export const useMarketFilter = (): MarketFilterHook => {
  const { preferences } = useContext(UserPreferencesContext);
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
    return getLocalizedMarketNameUtil(userMarket, 'en');
  };

  // Get available markets
  const getAvailableMarkets = () => {
    return availableMarkets;
  };
  
  // Get market display name
  const getMarketDisplayName = (): string => {
    const marketName = availableMarkets.find(m => m.id === userMarket)?.name || 'Global';
    return marketName;
  };
  
  // Get market options for dropdowns and selectors
  const getMarketOptions = () => {
    return availableMarkets;
  };

  return {
    userMarket,
    isMarketEnabled,
    getCurrentMarket,
    shouldShowFeature,
    getLocalizedMarketName,
    getAvailableMarkets,
    getMarketDisplayName,
    getMarketOptions
  };
};

export default useMarketFilter;
