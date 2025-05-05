
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { availableMarkets, getMarketDisplayName as getDisplayName } from '@/utils/marketHelpers';

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

// Hook to check if a feature should be shown based on the user's selected market
export const useMarketFilter = () => {
  const { preferences } = useUserPreferences();
  const userMarket = preferences.investmentMarket || 'global';
  
  // Function to determine if a feature should be shown
  const shouldShowFeature = (feature: FeatureMarketConfig): boolean => {
    // If no market restrictions or user has global preference, always show
    if (!feature.markets || feature.markets.includes('global') || userMarket === 'global') {
      return true;
    }
    
    // Check if the feature's markets include the user's selected market
    return feature.markets.includes(userMarket);
  };
  
  // Function to filter an array of market-specific features
  const filterFeaturesByMarket = <T extends FeatureMarketConfig>(features: T[]): T[] => {
    return features.filter(shouldShowFeature);
  };

  // Get display name for current market
  const getMarketDisplayName = (): string => {
    return getDisplayName(userMarket as InvestmentMarket);
  };
  
  // Get available markets for filtering
  const getAvailableMarkets = () => {
    return availableMarkets;
  };
  
  return {
    userMarket,
    shouldShowFeature,
    filterFeaturesByMarket,
    getMarketDisplayName,
    getAvailableMarkets
  };
};

export default useMarketFilter;
